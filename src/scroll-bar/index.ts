import * as domUtil from '@antv/dom-util';
import { Event, Group, Shape } from '@antv/g';
import * as _ from '@antv/util';
import { PointObject, ScrollBarCfg, ScrollBarTheme } from './interface';
import { DEFAULT_THEME } from './style';

export default class ScrollBar extends Group {
  // 滚动条的布局，横向 | 纵向, 非必传，默认为 false(纵向)
  public isHorizontal: boolean;
  // 滑道长度，必传
  public trackLen: number;
  // 滑块长度，必传
  public thumbLen: number;
  // scrollBar 的位置，必传
  public position: PointObject;
  // 滑块的最小长度，非必传，默认值为 20
  public minThumbLen: number;
  // 滑块相对滑道的偏移, 非必传，默认值为 0
  public thumbOffset: number;
  // 滚动条样式，非必传
  public theme: ScrollBarTheme;

  public scrollBarGroup: Group;
  public trackShape: Shape;
  public thumbShape: Shape;

  // 鼠标 drag 过程中的开始位置
  private _startPos: number;

  // 通过拖拽开始的事件是 mousedown 还是 touchstart 来决定是移动端还是 pc 端
  private _isMobile: boolean = false;

  // 清除事件
  private _clearEvents: () => void;

  constructor(scrollBarCfg: ScrollBarCfg) {
    super();

    const {
      isHorizontal = false,
      trackLen,
      thumbLen,
      position,
      minThumbLen = 20,
      thumbOffset = 0,
      theme,
    } = scrollBarCfg;

    this.isHorizontal = isHorizontal;
    this.thumbOffset = thumbOffset;
    this.trackLen = trackLen;
    this.thumbLen = thumbLen;
    this.position = position;
    this.minThumbLen = minThumbLen;
    this.theme = _.deepMix({}, DEFAULT_THEME, theme);

    this._initScrollBar();
  }

  /**
   * 当前滑块滑动的位置 0 ~ 1
   */
  public current(): number {
    const thumbRate = this.thumbLen / this.trackLen;
    const offsetRate = this.thumbOffset / this.trackLen;

    return offsetRate / (1 - thumbRate);
  }

  /**
   * 更新滑道长度
   * @param newTrackLen 新的滑块长度
   */
  public updateTrackLen(newTrackLen: number) {
    // 如果更新后的 trackLen 没改变，无需执行后续逻辑
    if (this.trackLen === newTrackLen) {
      return;
    }
    // 更新滑道长度的时候，同时按比例更新滑块长度和 offset(增大视窗或者减小视窗的场景))
    const thumbRate = this.thumbLen / this.trackLen;
    const offsetRate = this.thumbOffset / this.trackLen;
    const newThumbLen = newTrackLen * thumbRate;
    const newOffset = newTrackLen * offsetRate;
    this.trackLen = newTrackLen;

    if (this.isHorizontal) {
      this.trackShape.attr('x2', newTrackLen);
    } else {
      this.trackShape.attr('y2', newTrackLen);
    }
    this.updateThumbLen(newThumbLen);
    this.updateThumbOffset(newOffset);
    this._renderNewScrollBar();
  }

  /**
   * 更新滑块长度
   * @param newThumbLen 新的滑道长度
   */
  public updateThumbLen(newThumbLen: number) {
    // 如果更新后的 thumbLen 没改变，无需执行后续逻辑
    if (this.thumbLen === newThumbLen) {
      return;
    }
    this.thumbLen = newThumbLen;
    if (this.isHorizontal) {
      this.thumbShape.attr('x2', this.thumbOffset + newThumbLen);
    } else {
      this.thumbShape.attr('y2', this.thumbOffset + newThumbLen);
    }
    this._renderNewScrollBar();
  }

  /**
   * 更新滑块的 offset 值
   * @param offset
   */
  public updateThumbOffset(offset: number) {
    const newOffset = this._validateRange(offset);
    // 如果更新后的 offset 与原值相同，则不改变
    if (this.thumbOffset === newOffset) {
      return;
    }
    this.thumbOffset = newOffset;
    if (this.isHorizontal) {
      this.thumbShape.attr({
        x1: newOffset,
        x2: newOffset + this.thumbLen,
      });
    } else {
      this.thumbShape.attr({
        y1: newOffset,
        y2: newOffset + this.thumbLen,
      });
    }
    this._renderNewScrollBar();
  }

  /**
   * 更新滑道位置
   * @param newPos 新的滑块位置
   */
  public updateScrollBarPos(newPos: PointObject) {
    if (newPos.x === this.position.x && newPos.y === this.position.y) {
      return;
    }
    this.position = newPos;
    this.scrollBarGroup.move(newPos.x, newPos.y);
    this._renderNewScrollBar();
  }

  // 绘制新的 scrollBar
  public _renderNewScrollBar() {
    // 发送事件
    this.emit('scrollchange', {
      thumbOffset: this.thumbOffset,
    });

    // 渲染
    this.get('canvas').draw();
  }

  public updateTheme(theme: ScrollBarTheme) {
    this.theme = _.deepMix({}, DEFAULT_THEME, theme);
    this.thumbShape.attr('stroke', this.theme.default.thumbColor);
    this.thumbShape.attr('lineWidth', this.theme.default.size);
    this.thumbShape.attr('lineCap', this.theme.default.lineCap);
    this.get('canvas').draw();
  }

  // 初始化 scrollBar
  private _initScrollBar() {
    this.scrollBarGroup = this._createScrollBarGroup();
    this.scrollBarGroup.move(this.position.x, this.position.y);

    // 绑定事件
    this._bindEvents();
  }

  // 创建 scrollBar 的 group
  private _createScrollBarGroup(): Group {
    const group = this.addGroup({ className: this.isHorizontal ? 'horizontalBar' : 'verticalBar' });

    this.trackShape = this._createTrackShape(group);
    this.thumbShape = this._createThumbShape(group);

    return group;
  }

  // 创建滑道的 shape
  private _createTrackShape(group: Group): Shape {
    const { lineCap, trackColor, size } = this.theme.default;
    if (this.isHorizontal) {
      return group.addShape('line', {
        attrs: {
          x1: 0,
          y1: size / 2,
          x2: this.trackLen,
          y2: size / 2,
          lineWidth: size,
          stroke: trackColor,
          lineCap,
        },
      });
    }
    return group.addShape('line', {
      attrs: {
        x1: size / 2,
        y1: 0,
        x2: size / 2,
        y2: this.trackLen,
        lineWidth: size,
        stroke: trackColor,
        lineCap,
      },
    });
  }

  // 创建滑块的 shape
  private _createThumbShape(group: Group): Shape {
    const { size, lineCap, thumbColor } = this.theme.default;
    if (this.isHorizontal) {
      return group.addShape('line', {
        attrs: {
          x1: this.thumbOffset,
          y1: size / 2,
          x2: this.thumbOffset + this.thumbLen,
          y2: size / 2,
          lineWidth: size,
          stroke: thumbColor,
          lineCap,
          cursor: 'default',
        },
      });
    }
    return group.addShape('line', {
      attrs: {
        x1: size / 2,
        y1: this.thumbOffset,
        x2: size / 2,
        y2: this.thumbOffset + this.thumbLen,
        lineWidth: size,
        stroke: thumbColor,
        lineCap,
        cursor: 'default',
      },
    });
  }

  // 事件绑定
  private _bindEvents() {
    this.on('mousedown', this._onStartEvent(false));
    this.on('mouseup', this._onMouseUp);

    this.on('touchstart', this._onStartEvent(true));
    this.on('touchend', this._onMouseUp);
    this.trackShape.on('click', this._onTrackClick);

    this.thumbShape.on('mouseover', this._onTrackMouseOver);
    this.thumbShape.on('mouseout', this._onTrackMouseOut);
  }

  private _onStartEvent = (isMobile: boolean) => (e: Event) => {
    this._isMobile = isMobile;
    // 阻止冒泡
    e.event.preventDefault();

    const event = this._isMobile ? _.get(e.event, 'touches.0', e) : e;

    const { clientX, clientY } = event;

    // 将开始的点记录下来
    this._startPos = this.isHorizontal ? clientX : clientY;

    this._bindLaterEvent();
  };

  private _bindLaterEvent() {
    const containerDOM = this.get('canvas').get('containerDOM');

    let events = [];
    if (this._isMobile) {
      events = [
        domUtil.addEventListener(containerDOM, 'touchmove', this._onMouseMove),
        domUtil.addEventListener(containerDOM, 'touchend', this._onMouseUp),
        domUtil.addEventListener(containerDOM, 'touchcancel', this._onMouseUp),
      ];
    } else {
      events = [
        domUtil.addEventListener(containerDOM, 'mousemove', this._onMouseMove),
        domUtil.addEventListener(containerDOM, 'mouseup', this._onMouseUp),
        // 为了保证划出 canvas containerDom 时还没触发 mouseup
        domUtil.addEventListener(containerDOM, 'mouseleave', this._onMouseUp),
      ];
    }

    this._clearEvents = () => {
      events.forEach(e => { e.remove(); })
    };
  }

  // 点击滑道的事件回调,移动滑块位置
  private _onTrackClick = (e) => {
    const containerDOM = this.get('canvas').get('containerDOM');
    const rect = containerDOM.getBoundingClientRect();
    const { clientX, clientY } = e;
    const offset = this.isHorizontal
      ? clientX - rect.left - this.position.x - this.thumbLen / 2
      : clientY - rect.top - this.position.y - this.thumbLen / 2;

    const newOffset = this._validateRange(offset);
    this.updateThumbOffset(newOffset);
  };

  // 拖拽滑块的事件回调
  // 这里是 dom 原生事件，绑定在 dom 元素上的
  private _onMouseMove = (e) => {
    e.preventDefault();

    const event = this._isMobile ? _.get(e, 'touches.0', e) : e;

    const clientX = event.clientX;
    const clientY = event.clientY;

    // 鼠标松开的位置
    const endPos = this.isHorizontal ? clientX : clientY;
    // 滑块需要移动的距离, 由于这里是对滑块监听，所以移动的距离就是 diffDis, 如果监听对象是 container dom，则需要算比例
    const diff = endPos - this._startPos;
    // 更新 _startPos
    this._startPos = endPos;

    this.updateThumbOffset(this.thumbOffset + diff);
  };

  // 滑块鼠标松开事件回调
  private _onMouseUp = (e) => {
    // 松开鼠标时，清除所有事件
    e.preventDefault();
    this._clearEvents();
  };

  private _onTrackMouseOver = (e) => {
    const { thumbColor } = this.theme.hover;
    this.thumbShape.attr('stroke', thumbColor);
    this.get('canvas').draw();
  };

  private _onTrackMouseOut = (e) => {
    const { thumbColor } = this.theme.default;
    this.thumbShape.attr('stroke', thumbColor);
    this.get('canvas').draw();
  };

  // 判断滑块位置是否超出滑道区域
  private _validateRange(offset: number): number {
    let newOffset = offset;
    if (offset + this.thumbLen > this.trackLen) {
      newOffset = this.trackLen - this.thumbLen;
    } else if (offset + this.thumbLen < this.thumbLen) {
      newOffset = 0;
    }
    return newOffset;
  }
}
