import { Rect, Text, Image } from '@antv/g';
import { deepMix, get, isFunction, isString, isObject } from '@antv/util';
import { SliderOptions, HandleCfg, Pair } from './types';
import { Handle } from './handle';
import { MarkerOptions } from '../marker';
import { Sparkline } from '../sparkline';
import { DisplayObject } from '../../types';
import { toPrecision } from '../../util';
import { Component } from '../../abstract/component';

export { SliderOptions };

type HandleType = 'start' | 'end';

export class Slider extends Component<SliderOptions> {
  public static tag = 'slider';

  /**
   * 层级关系
   * backgroundShape
   *  |- sparklineShape
   *  |- foregroundShape
   *       |- startHandle
   *       |- endHandle
   */

  /**
   * 选区开始的位置
   */
  private selectionStartPos: number;

  /**
   * 选区宽度
   */
  private selectionWidth: number;

  /**
   * 记录上一次鼠标事件所在坐标
   */
  private prevPos: number;

  /**
   * drag事件当前选中的对象
   */
  private target: string;

  constructor(options: SliderOptions) {
    super(deepMix({}, Slider.defaultOptions, options));
    this.init();
  }

  protected static defaultOptions = {
    type: Slider.tag,
    attrs: {
      orient: 'horizontal',
      values: [0, 1],
      names: ['', ''],
      min: 0,
      max: 1,
      width: 200,
      height: 20,
      sparklineCfg: {
        padding: [1, 1, 1, 1],
      },
      padding: [0, 0, 0, 0],
      backgroundStyle: {
        fill: '#fff',
        stroke: '#e4eaf5',
        lineWidth: 1,
      },
      foregroundStyle: {
        fill: '#afc9fb',
        opacity: 0.5,
        stroke: '#afc9fb',
        lineWidth: 1,
        active: {
          fill: '#ccdaf5',
        },
      },
      handle: {
        show: true,
        formatter: (val: string) => val,
        spacing: 10,
        textStyle: {
          fill: '#63656e',
          textAlign: 'center',
          textBaseline: 'middle',
        },
        handleStyle: {
          stroke: '#c5c5c5',
          fill: '#fff',
          lineWidth: 1,
        },
      },
    },
  };

  attributeChangedCallback(name: string, value: any) {
    if (name === 'values') {
      this.emit('valuechange', value);
    }
    if (name in ['names', 'values']) {
      this.setHandle();
    }
  }

  public getValues() {
    return this.getAttribute('values');
  }

  public setValues(values: SliderOptions['values']) {
    this.setAttribute('values', this.getSafetyValues(values));
  }

  public getNames() {
    return this.getAttribute('names');
  }

  public setNames(names: SliderOptions['names']) {
    this.setAttribute('names', names);
  }

  protected init() {
    this.createBackground();
    this.createSparkline();
    this.createForeground();
    this.createHandles();
    this.bindEvents();
  }

  /**
   * 获得安全的Values
   */
  private getSafetyValues(values = this.getValues(), precision = 4): Pair<number> {
    const { min, max } = this.attributes;
    const [prevStart, prevEnd] = this.getValues();
    let [startVal, endVal] = values || [prevStart, prevEnd];
    const range = endVal - startVal;
    // 交换startVal endVal
    if (startVal > endVal) {
      [startVal, endVal] = [endVal, startVal];
    }
    // 超出范围就全选
    if (range > max - min) {
      return [min, max];
    }

    if (startVal < min) {
      if (prevStart === min && prevEnd === endVal) {
        return [min, endVal];
      }
      return [min, range + min];
    }
    if (endVal > max) {
      if (prevEnd === max && prevStart === startVal) {
        return [startVal, max];
      }
      return [max - range, max];
    }

    // 保留小数
    return [toPrecision(startVal, precision), toPrecision(endVal, precision)];
  }

  private getAvailableSpace() {
    const { padding, width, height } = this.attributes;
    const [top, right, bottom, left] = padding;
    return {
      x: left,
      y: top,
      width: width - (left + right),
      height: height - (top + bottom),
    };
  }

  /**
   * 获取style
   * @param name style名
   * @param isActive 是否是active style
   * @returns ShapeAttrs
   */
  protected getStyle(name: string | string[], isActive?: boolean, handleType?: HandleType) {
    const { active, ...args } = get(handleType ? this.getHandleCfg(handleType) : this.attributes, name);
    if (isActive) {
      return active || {};
    }
    return args?.default || args;
  }

  private createBackground() {
    const attrsCallback = () => {
      return {
        cursor: 'crosshair',
        ...this.getAvailableSpace(),
        ...this.getStyle('backgroundStyle'),
      };
    };
    this.appendSubComponent('backgroundShape', Rect, attrsCallback, { name: 'background' });
  }

  /**
   * 生成sparkline
   */
  private createSparkline() {
    const attrsCallback = () => {
      const { orient, sparklineCfg } = this.attributes;
      // 暂时只在水平模式下绘制
      if (orient !== 'horizontal') {
        return {};
      }
      const { padding, ...args } = sparklineCfg;
      const [top, right, bottom, left] = padding;
      const { width, height } = this.getAvailableSpace();
      const { lineWidth: bkgLW } = this.getStyle('backgroundStyle');
      return {
        x: bkgLW / 2 + left,
        y: bkgLW / 2 + top,
        width: width - bkgLW - left - right,
        height: height - bkgLW - top - bottom,
        ...args,
      };
    };
    this.appendSubComponent('sparklineShape', Sparkline, attrsCallback, this.getSubComponent('backgroundShape'));
  }

  /**
   * 计算蒙板坐标和宽高
   * 默认用来计算前景位置大小
   */
  private calcMask(values?: Pair<number>) {
    const [start, end] = this.getSafetyValues(values);
    const { width, height } = this.getAvailableSpace();

    return this.getOrientVal([
      {
        y: 0,
        height,
        x: start * width,
        width: (end - start) * width,
      },
      {
        x: 0,
        width,
        y: start * height,
        height: (end - start) * height,
      },
    ]);
  }

  private createForeground() {
    const attrsCallback = () => {
      return { cursor: 'move', ...this.calcMask(), ...this.getStyle('foregroundStyle') };
    };

    this.appendSubComponent('foregroundShape', Rect, attrsCallback, { name: 'foreground' });
  }

  /**
   * 计算手柄的x y
   */
  private calcHandlePosition(handleType: HandleType) {
    const { width, height } = this.getAvailableSpace();
    const values = this.getSafetyValues();
    const L = handleType === 'start' ? 0 : (values[1] - values[0]) * this.getOrientVal([width, height]);
    return {
      x: this.getOrientVal([L, width / 2]),
      y: this.getOrientVal([height / 2, L]),
    };
  }

  /**
   * 设置选区
   * 1. 设置前景大小及位置
   * 2. 设置手柄位置
   * 3. 更新文本位置
   */
  private setHandle() {
    this.getSubComponent('foregroundShape').attr(this.calcMask());
    (['start', 'end'] as HandleType[]).forEach((handleType) => {
      const handle = `${handleType}Handle`;
      this.getSubComponent(handle).attr(this.calcHandlePosition(handleType));
      const handleText = `${handleType}HandleText`;
      this.getSubComponent(handleText).attr(this.calcHandleText(handleType));
    });
  }

  /**
   * 计算手柄应当处于的位置
   * @param name 手柄文字
   * @param handleType start手柄还是end手柄
   * @returns
   */
  private calcHandleText(handleType: HandleType) {
    const { orient, names } = this.attributes;
    const { spacing, formatter, textStyle } = this.getHandleCfg(handleType);

    const size = this.getHandleSize(handleType);
    const values = this.getSafetyValues();

    // 相对于获取两端可用空间
    const { width: iW, height: iH } = this.getAvailableSpace();
    const { x: fX, y: fY, width: fW, height: fH } = this.calcMask();

    const formattedText = formatter(...(handleType === 'start' ? [names[0], values[0]] : [names[1], values[1]]));

    const _ = new Text({
      attrs: {
        text: formattedText,
        ...textStyle,
      },
    });
    // 文字的包围盒
    const tBox = _.getBounds();
    _.destroy();

    let x = 0;
    let y = 0;
    const R = size / 2;
    if (orient === 'horizontal') {
      const textWidth = tBox.getMax()[0] - tBox.getMin()[0];
      const sh = spacing + R;
      const _ = sh + textWidth / 2;
      if (handleType === 'start') {
        const left = fX - sh - textWidth;
        x = left > 0 ? -_ : _;
      } else {
        x = iW - fX - fW - sh > textWidth ? _ : -_;
      }
    } else {
      const _ = spacing + R;
      const textHeight = tBox.getMax()[1] - tBox.getMin()[1];
      if (handleType === 'start') {
        y = fY - R > textHeight ? -_ : _;
      } else {
        y = iH - fY - fH - R > textHeight ? _ : -_;
      }
    }

    return { x, y, text: formattedText };
  }

  /**
   * 解析icon类型
   */
  private parseIcon(icon: MarkerOptions['symbol'] | string) {
    let type = 'default';
    if (isObject(icon) && icon instanceof Image) type = 'image';
    else if (isFunction(icon)) type = 'symbol';
    else if (isString(icon)) {
      const dataURLsPattern = new RegExp('data:(image|text)');
      if (icon.match(dataURLsPattern)) {
        type = 'base64';
      } else if (/^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(icon)) {
        type = 'url';
      } else {
        // 不然就当作symbol string 处理
        type = 'symbol';
      }
    }
    return type;
  }

  /**
   * 创建手柄
   */
  private createHandle(options: HandleCfg, handleType: HandleType) {
    // 手柄容器
    const handleEl = `${handleType}Handle`;
    const handleAttrsCallback = () => {
      return this.calcHandlePosition(handleType);
    };
    // 将手柄容器挂载到foregroundShape下
    const handle = this.appendSubComponent(
      handleEl,
      DisplayObject,
      handleAttrsCallback,
      { name: 'handle' },
      this.getSubComponent('foregroundShape')
    );
    /* ---------------------------------------------------------------- */
    // 手柄文本
    const handleTextAttrsCallback = () => {
      const { textStyle } = options;
      return {
        ...textStyle,
        ...this.calcHandleText(handleType),
      };
    };
    // 手柄文本挂载到handle容器下
    this.appendSubComponent(`${handleType}HandleText`, Text, handleTextAttrsCallback, { name: 'handleText' }, handle);
    /* ---------------------------------------------------------------- */
    // 手柄icon
    const handleIconAttrsCallback = () => {
      const { height: H, orient } = this.attributes;
      const { show, handleIcon, handleStyle } = options;
      const cursor = this.getOrientVal(['ew-resize', 'ns-resize']);
      const size = this.getHandleSize(handleType);
      const iconType = this.parseIcon(handleIcon);
      let attrs = {};
      if (!show)
        attrs = {
          cursor,
          x: -size / 2,
          y: -H / 2,
          height: H,
          width: size,
          opacity: 0,
          fill: 'red',
        };
      else if (['base64', 'url', 'image'].includes(iconType))
        attrs = { cursor, x: -size / 2, y: -size / 2, width: size, height: size, img: handleIcon };
      else if (iconType === 'symbol') attrs = { cursor, r: size / 2, symbol: handleIcon, ...handleStyle };
      else attrs = { cursor, size, ...handleStyle };
      return {
        handleCfg: {
          show,
          orient,
          type: iconType,
          handleAttrs: attrs,
        },
      };
    };
    // 手柄icon也挂载到handle容器
    this.appendSubComponent(`${handleType}HandleIcon`, Handle, handleIconAttrsCallback, { name: 'handleIcon' }, handle);
  }

  private getHandleCfg(handleType: HandleType) {
    const { start, end, ...args } = this.getAttribute('handle');
    let handleCfg = {};
    if (handleType === 'start') {
      handleCfg = start;
    } else if (handleType === 'end') {
      handleCfg = end;
    }
    return deepMix({}, args, handleCfg);
  }

  private getHandleSize(handleType: HandleType) {
    const handleCfg = this.getHandleCfg(handleType);
    const { size } = handleCfg;
    if (size) return size;

    // 没设置size的话，高度就取height的80%高度，手柄宽度是高度的1/2.4
    const { width, height } = this.attributes;
    return (this.getOrientVal([height, width]) * 0.8) / 2.4;
  }

  private createHandles() {
    this.createHandle(this.getHandleCfg('start'), 'start');
    this.createHandle(this.getHandleCfg('end'), 'end');
  }

  private bindEvents() {
    // Drag and brush
    const background = this.getSubComponent('backgroundShape');
    background.addEventListener('mousedown', this.onDragStart('background'));
    background.addEventListener('touchstart', this.onDragStart('background'));

    const foreground = this.getSubComponent('foregroundShape');
    foreground.addEventListener('mousedown', this.onDragStart('foreground'));
    foreground.addEventListener('touchstart', this.onDragStart('foreground'));

    ['start', 'end'].forEach((handleType) => {
      const HandleIcon = `${handleType}HandleIcon`;
      this.getSubComponent(HandleIcon).addEventListener('mousedown', this.onDragStart(handleType));
      this.getSubComponent(HandleIcon).addEventListener('touchstart', this.onDragStart(handleType));
    });

    this.bindHoverEvents();
  }

  private getOrientVal<T>([x, y]: Pair<T>) {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? x : y;
  }

  private setValuesOffset(stOffset: number, endOffset: number = 0) {
    const [oldStartVal, oldEndVal] = this.getValues();
    this.setValues([oldStartVal + stOffset, oldEndVal + endOffset].sort() as Pair<number>);
  }

  private getRatio(val: number) {
    const { width, height } = this.getAvailableSpace();
    return val / this.getOrientVal([width, height]);
  }

  private onDragStart = (target: string) => (e) => {
    e.stopPropagation();
    this.target = target;
    this.prevPos = this.getOrientVal([e.x, e.y]);
    const { x, y } = this.getAvailableSpace();
    const { x: X, y: Y } = this.attributes;
    this.selectionStartPos = this.getRatio(this.prevPos - this.getOrientVal([x, y]) - this.getOrientVal([X, Y]));
    this.selectionWidth = 0;
    this.addEventListener('mousemove', this.onDragging);
    this.addEventListener('touchmove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
  };

  private onDragging = (e) => {
    e.stopPropagation();
    const currPos = this.getOrientVal([e.x, e.y]);
    const _ = currPos - this.prevPos;
    if (!_) return;
    const dVal = this.getRatio(_);

    switch (this.target) {
      case 'start':
        this.setValuesOffset(dVal);
        break;
      case 'end':
        this.setValuesOffset(0, dVal);
        break;
      case 'foreground':
        this.setValuesOffset(dVal, dVal);
        break;
      case 'background':
        // 绘制蒙板
        this.selectionWidth += dVal;
        this.setValues([this.selectionStartPos, this.selectionStartPos + this.selectionWidth].sort() as Pair<number>);
        break;
      default:
        break;
    }

    this.prevPos = currPos;
  };

  private onDragEnd = () => {
    this.removeEventListener('mousemove', this.onDragging);
    this.removeEventListener('mousemove', this.onDragging);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);
  };

  private bindHoverEvents = () => {
    const foreground = this.getSubComponent('foregroundShape');
    foreground.addEventListener('mouseenter', () => {
      foreground.attr(this.getStyle('foregroundStyle'));
    });
    foreground.addEventListener('mouseleave', () => {
      foreground.attr(this.getStyle('foregroundStyle'));
    });

    (['start', 'end'] as HandleType[]).forEach((handleType) => {
      const _ = `${handleType}HandleIcon`;
      const target = this.getSubComponent(_);
      target.addEventListener('mouseenter', () => {
        target.attr(this.getStyle('handleStyle', true, handleType));
      });
      target.addEventListener('mouseleave', () => {
        target.attr(this.getStyle('handleStyle', false, handleType));
      });
    });
  };
}
