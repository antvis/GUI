/**
 * @file 基于 G 的缩略轴组件（Slider 组件）
 * @author hustcc
 */

import { Event, Group, Rect, Text } from '@antv/g';
import * as _ from '@antv/util';
import { BACKGROUND_STYLE, FOREGROUND_STYLE, HANDLER_STYLE, SLIDER_CHANGE, TEXT_STYLE } from './constant';
import Handler from './handler';

export interface SliderCfg {
  // position size
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  // style
  readonly backgroundStyle?: CSSStyleDeclaration;
  readonly foregroundStyle?: CSSStyleDeclaration;
  readonly handlerStyle?: CSSStyleDeclaration;
  readonly textStyle?: CSSStyleDeclaration;
  // 初始位置
  readonly start?: number;
  readonly end?: number;
}

/**
 * 缩略轴组件
 * 设计稿：https://yuque.antfin-inc.com/antv/cfksca/432935?artboard_type=artboard&view=&from=#comment-518267
 */
export default class Slider extends Group {
  // 位置大小配置
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  // 样式配置
  private backgroundStyle: any;
  private foregroundStyle: any;
  private handlerStyle: any;
  private textStyle: any;


  // 组件内部子组件实例
  /* 背景框 */
  private background: Rect;
  /* 前景框，选中的区域 */
  private foreground: Rect;
  /* 左侧(上侧)的按钮 */
  private minHandler: Handler;
  /* 左侧文本 */
  private minText: Text;
  /* 由侧(下侧)的按钮 */
  private maxHandler: Handler;
  /* 右侧文本 */
  private maxText: Text;

  // 交互相关的数据信息
  private start: number;
  private end: number;

  private currentHandler: Handler | Rect;
  private prevX: number = 0;
  private prevY: number = 0;

  constructor(cfg: SliderCfg) {
    super();

    const {
      x = 0, y = 0, width = 100, height = 16,
      backgroundStyle = {}, foregroundStyle = {}, handlerStyle = {}, textStyle = {},
      // 缩略轴的初始位置
      start = 0, end = 1,
    } = cfg;

    // position size
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // style
    this.backgroundStyle = { ...BACKGROUND_STYLE, ...backgroundStyle };
    this.foregroundStyle = { ...FOREGROUND_STYLE, ...foregroundStyle };
    this.handlerStyle = { ...HANDLER_STYLE, ...handlerStyle };
    this.textStyle = { ...TEXT_STYLE, ...textStyle };

    // 初始信息
    this.start = start;
    this.end = end;

    this._initial();
  }

  /**
   * 更新 range 范围
   * @param start
   * @param end
   */
  public setRange(start, end) {
    // start、end 只能是 0~1 范围
    this.start = Math.min(1, Math.max(start, 0));
    this.end = Math.min(1, Math.max(end, 0));

    // 更新 ui，不自动绘制
    this._updateUI();
  }

  /**
   * 初始化组件结构
   * @private
   */
  private _initial() {
    const width = this.width;
    const height = this.height;

    // 1. 背景
    this.background = this.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        ...this.backgroundStyle,
      },
    });

    // 2. 前景 选中背景框
    this.foreground = this.addShape('rect', {
      attrs: {
        // x: 0,
        y: 0,
        // width: 0,
        height,
        ...this.foregroundStyle,
      },
    });

    // 滑块相关的大小信息
    const handlerWidth = _.get(this.handlerStyle, 'width', 10);
    const handlerHeight = _.get(this.handlerStyle, 'height', 24);

    // 3. 左右文字
    this.minText = this.addShape('text', {
      attrs: {
        // x: 0,
        y: height / 2,
        textAlign: 'right',
        text: 'min',
        ...this.textStyle,
      },
    });

    this.maxText = this.addShape('text', {
      attrs: {
        // x: 0,
        y: height / 2,
        textAlign: 'left',
        text: 'max',
        ...this.textStyle,
      },
    });

    // 4. 左右滑块
    this.minHandler = new Handler({
      x: 0,
      y: (height - handlerHeight) / 2,
      width,
      height: handlerHeight,
      cursor: 'ew-resize',
      ...this.handlerStyle,
    });

    this.add(this.minHandler);

    this.maxHandler = new Handler({
      x: 0,
      y: (height - handlerHeight) / 2,
      width,
      height: handlerHeight,
      cursor: 'ew-resize',
      ...this.handlerStyle,
    });
    this.add(this.maxHandler);

    // 根据 start end 更新 ui 的位置信息
    this._updateUI();

    // 移动到对应的位置
    this.move(this.x, this.y);

    // 绑定事件鼠标事件
    this._bindEvents();
  }

  /**
   * 绑定事件：
   *  - 点击
   *  - 滑动
   *  - 拖拽
   *  - 滚动
   * @private
   */
  private _bindEvents() {
    // 1. 左滑块的滑动
    this.minHandler.on('mousedown', this.onMouseDown(this.minHandler));

    // 2. 右滑块的滑动
    this.maxHandler.on('mousedown', this.onMouseDown(this.maxHandler));

    // 3. 前景选中区域
    this.foreground.on('mousedown', this.onMouseDown(this.foreground))
  }

  private onMouseDown = (handler: Handler | Rect) => (e: Event) => {
    // 1. 记录点击的滑块
    this.currentHandler = handler;

    // 2. 存储当前点击位置
    const { event } = e;
    event.stopPropagation();
    event.preventDefault();
    this.prevX = event.pageX;
    this.prevY = event.pageY;

    // 3. 开始滑动的时候，绑定 move 和 up 事件
    const containerDOM = this.get('canvas').get('containerDOM');
    containerDOM.addEventListener('mousemove', this.onMouseMove);
    containerDOM.addEventListener('mouseup', this.onMouseUp);
    containerDOM.addEventListener('mouseleave', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    // 滑动过程中，计算偏移，更新滑块，然后 emit 数据出去
    e.stopPropagation();
    e.preventDefault();

    const x = e.pageX;
    const y = e.pageY;

    // 横向的 slider 只处理 x
    const offsetX = x - this.prevX;

    const offsetXRange = this.adjustOffsetRange(offsetX / this.width);

    // 更新 start end range 范围
    this.updateStartEnd(offsetXRange);
    // 更新 ui
    this._updateUI();

    this.prevX = x;
    this.prevY = y;

    this.get('canvas').draw();

    // 因为存储的 start、end 可能不一定是按大小存储的，所以排序一下，对外是 end >= start
    this.emit(SLIDER_CHANGE, [ this.start, this.end ].sort());
  };

  private onMouseUp = () => {
    // 结束之后，取消绑定的事件
    if (this.currentHandler) {
      this.currentHandler = undefined;
    }

    const containerDOM = this.get('canvas').get('containerDOM');
    if (containerDOM) {
      containerDOM.removeEventListener('mousemove', this.onMouseMove);
      containerDOM.removeEventListener('mouseup', this.onMouseUp);
      // 防止滑动到 canvas 外部之后，状态丢失
      containerDOM.removeEventListener('mouseleave', this.onMouseUp);
    }
  };

  /**
   * 调整 offsetRange，因为一些范围的限制
   * @param offsetRange
   */
  private adjustOffsetRange(offsetRange: number): number {
    // 针对不同的滑动组件，处理的方式不同
    switch (this.currentHandler) {
      case this.minHandler: {
        const min = 0 - this.start;
        const max = 1 - this.start;

        return Math.min(max, Math.max(min, offsetRange));
      }
      case this.maxHandler: {
        const min = 0 - this.end;
        const max = 1 - this.end;

        return Math.min(max, Math.max(min, offsetRange));
      }
      case this.foreground: {
        const min = 0 - this.start;
        const max = 1 - this.end;

        return Math.min(max, Math.max(min, offsetRange));
      }
      default:
        return 0;
    }
  }

  private updateStartEnd(offsetRange: number) {
    // 操作不同的组件，反馈不一样
    switch (this.currentHandler) {
      case this.minHandler:
        this.start += offsetRange;
        break;
      case this.maxHandler:
        this.end += offsetRange;
        break;
      case this.foreground:
        this.start += offsetRange;
        this.end += offsetRange;
        break;
    }
  }

  /**
   * 根据移动的比例来更新 ui
   * @private
   */
  private _updateUI() {
    const min = this.start * this.width;
    const max = this.end * this.width;

    // 1. foreground
    this.foreground.attr('x', min);
    this.foreground.attr('width', max - min);

    // 滑块相关的大小信息
    const handlerWidth = _.get(this.handlerStyle, 'width', 10);

    const [ minAttrs, maxAttrs ] = this._dodgeText([min, max]);
    // 2. 左侧滑块和文字
    this.minHandler.setX(min - handlerWidth / 2);
    // this.minText.attr('x', min);
    _.each(minAttrs, (v, k) => this.minText.attr(k, v));

    // 3. 右侧滑块和文字
    this.maxHandler.setX(max - handlerWidth / 2);
    // this.maxText.attr('x', max);
    _.each(maxAttrs, (v, k) => this.maxText.attr(k, v));
  }

  /**
   * 调整 text 的位置，自动躲避
   * 根据位置，调整返回新的位置
   * @param range
   */
  private _dodgeText(range: [number, number]): [object, object] {
    const PADDING = 4;
    let minText = this.minText;
    let maxText = this.maxText;

    let [min, max] = range;
    let sorted = false;

    // 如果交换了位置，则对应的 min max 也交互
    if (min > max) {
      [min, max] = [max, min];
      [minText, maxText] = [maxText, minText];
      sorted = true;
    }

    // 避让规则，优先显示在两侧，只有显示不下的时候，才显示在中间
    const minBBox = minText.getBBox();
    const maxBBox = maxText.getBBox();

    const minAttrs = minBBox.width > min - PADDING ?
      { x: min + PADDING, textAlign: 'left' } :
      { x: min - PADDING, textAlign: 'right' };

    const maxAttrs = maxBBox.width > this.width - max - PADDING ?
      { x: max - PADDING, textAlign: 'right' } :
      { x: max + PADDING, textAlign: 'left' };

    return !sorted ? [minAttrs , maxAttrs] : [maxAttrs , minAttrs];
  }
}
