import { Rect, Text } from '@antv/g';
import { deepMix, get } from '@antv/util';
// import { SliderOptions, HandleCfg, MiniMap, Pair } from './types';
import { SliderOptions, HandleCfg, Pair } from './types';
import { Marker } from '../marker';
import { Sparkline } from '../sparkline';
import { CustomElement, DisplayObject, ShapeAttrs } from '../../types';
// import { /* applyAttrs */ measureTextWidth } from '../../util';
const applyAttrs = (target: DisplayObject, attrs: ShapeAttrs) => {
  Object.entries(attrs).forEach(([attrName, attrValue]) => {
    target.setAttribute(attrName, attrValue);
  });
};

export { SliderOptions };

type HandleType = 'start' | 'end';

export class Slider extends CustomElement {
  public static tag = 'slider';

  private backgroundShape: DisplayObject;

  private sparklineShape: DisplayObject;

  private foregroundShape: DisplayObject;

  private startHandle: DisplayObject;

  private endHandle: DisplayObject;

  /**
   * 选区开始的位置
   */
  private selectionStartPos: number;

  private selectionWidth: number;

  private prevPos: number;

  /**
   * drag事件当前选中的对象
   */
  private target: string;

  constructor(options: SliderOptions) {
    super(deepMix({}, Slider.defaultOptions, options));
    this.init();
  }

  private static defaultOptions = {
    type: Slider.tag,
    attrs: {
      orient: 'horizontal',
      values: [0, 1],
      names: ['', ''],
      min: 0,
      max: 1,
      width: 200,
      height: 20,
      padding: {
        left: 20,
        right: 10,
        top: 10,
        bottom: 10,
      },
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
        size: 10,
        formatter: (val: string) => val,
        spacing: 10,
        handleIcon: 'circle',
        textStyle: {
          fill: '#63656e',
          textAlign: 'center',
          textBaseline: 'middle',
        },
        handleStyle: {
          stroke: '#c5c5c5',
          fill: '#9bc2ff',
          lineWidth: 1,
        },
      },
      miniMap: {},
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

  private init() {
    this.createBackground();
    this.createSparkline();
    this.createForeground();
    this.createHandles();
    this.bindEvents();
  }

  /**
   * 获得安全的Values
   */
  private getSafetyValues(values?: Pair<number>): Pair<number> {
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
    return [startVal, endVal];
  }

  private getAvailableSpace() {
    const { padding, width, height } = this.attributes;
    return {
      x: padding.left,
      y: padding.top,
      width: width - (padding.left + padding.right),
      height: height - (padding.top + padding.bottom),
    };
  }

  /**
   * 获取style
   * @param name style名
   * @param isActive 是否是active style
   * @returns ShapeAttrs
   */
  private getStyle(name: string | string[], isActive?: boolean, handleType?: HandleType) {
    const { active, ...args } = get(handleType ? this.getHandleCfg(handleType) : this.attributes, name);
    if (isActive) {
      return active || {};
    }
    return args?.default || args;
  }

  private createBackground() {
    this.backgroundShape = new Rect({
      name: 'background',
      attrs: {
        cursor: 'crosshair',
        ...this.getAvailableSpace(),
        ...this.getStyle('backgroundStyle'),
      },
    });
    this.appendChild(this.backgroundShape);
  }

  /**
   * 生成sparkline
   */
  private createSparkline() {
    const { orient, sparklineCfg } = this.attributes;
    // 暂时只在水平模式下绘制
    if (orient !== 'horizontal') {
      return;
    }
    const { width, height } = this.getAvailableSpace();
    const { lineWidth: bkgLW } = this.getStyle('backgroundStyle');
    this.sparklineShape = new Sparkline({
      attrs: {
        x: bkgLW / 2,
        y: bkgLW / 2,
        width: width - bkgLW,
        height: height - bkgLW,
        ...sparklineCfg,
      },
    });
    this.backgroundShape.appendChild(this.sparklineShape);
    this.sparklineShape.toBack();
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
    this.foregroundShape = new Rect({
      name: 'foreground',
      attrs: {
        cursor: 'move',
        ...this.calcMask(),
        ...this.getStyle('foregroundStyle'),
      },
    });
    this.backgroundShape.appendChild(this.foregroundShape);
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
    applyAttrs(this.foregroundShape, this.calcMask());
    applyAttrs(this.startHandle, this.calcHandlePosition('start'));
    applyAttrs(this.endHandle, this.calcHandlePosition('end'));
    this.getElementsByName('handleText').forEach((handleText) => {
      applyAttrs(handleText, this.calcHandleText(handleText.getConfig().identity));
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
    const { size, spacing, formatter, textStyle } = this.getHandleCfg(handleType);
    // 相对于获取两端可用空间
    const { width: iW, height: iH } = this.getAvailableSpace();
    const { x: fX, y: fY, width: fW, height: fH } = this.calcMask();

    const formattedText = formatter(handleType === 'start' ? names[0] : names[1]);
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

  private createHandle(options: HandleCfg, handleType: HandleType) {
    const { show, size, textStyle, handleIcon: icon, handleStyle } = options;
    const handleIcon = new Marker({
      name: 'handleIcon',
      identity: handleType,
      attrs: {
        r: size / 2,
        ...(show
          ? {
              symbol: icon,
              ...handleStyle,
            }
          : {
              // 如果不显示的话，就创建透明的rect
              symbol: 'square',
              markerStyle: {
                opacity: 0,
              },
            }),
        cursor: this.getOrientVal(['ew-resize', 'ns-resize']),
      },
    });

    const handleText = new Text({
      name: 'handleText',
      identity: handleType,
      attrs: {
        // TODO 之后考虑添加文字超长省略，可以在calcHandleTextPosition中实现
        ...textStyle,
        ...this.calcHandleText(handleType),
      },
    });

    // 用 Group 创建对象会提示没有attrs属性
    const handle = new DisplayObject({
      // name: `${handleType}Handle`,
      name: 'handle',
      identity: handleType,
      attrs: this.calcHandlePosition(handleType),
    });
    handle.appendChild(handleIcon);
    handle.appendChild(handleText);
    return handle;
  }

  private getHandleCfg(handleType: HandleType) {
    const { start, end, ...args } = this.getAttribute('handle');
    let _ = {};
    if (handleType === 'start') {
      _ = start;
    } else if (handleType === 'end') {
      _ = end;
    }
    return deepMix({}, args, _);
  }

  private createHandles() {
    this.startHandle = this.createHandle(this.getHandleCfg('start'), 'start');
    this.foregroundShape.appendChild(this.startHandle);
    this.endHandle = this.createHandle(this.getHandleCfg('end'), 'end');
    this.foregroundShape.appendChild(this.endHandle);
  }

  private bindEvents() {
    // Drag and brush
    this.backgroundShape.addEventListener('mousedown', this.onDragStart('background'));
    this.backgroundShape.addEventListener('touchstart', this.onDragStart('background'));

    this.foregroundShape.addEventListener('mousedown', this.onDragStart('foreground'));
    this.foregroundShape.addEventListener('touchstart', this.onDragStart('foreground'));

    this.getElementsByName('handleIcon').forEach((handleIcon) => {
      handleIcon.addEventListener('mousedown', this.onDragStart(`${handleIcon.getConfig().identity}Handle`));
      handleIcon.addEventListener('touchstart', this.onDragStart(`${handleIcon.getConfig().identity}Handle`));
    });
    // Hover
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
    const dVal = this.getRatio(_); // _ / this.getOrientVal([width, height]);

    switch (this.target) {
      case 'startHandle':
        this.setValuesOffset(dVal);
        break;
      case 'endHandle':
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
    this.foregroundShape.addEventListener('mouseenter', () => {
      applyAttrs(this.foregroundShape, this.getStyle('foregroundStyle', true));
    });
    this.foregroundShape.addEventListener('mouseleave', () => {
      applyAttrs(this.foregroundShape, this.getStyle('foregroundStyle'));
    });

    this.getElementsByName('handle').forEach((handle) => {
      const icon = handle.getElementsByName('handleIcon')[0];
      const text = handle.getElementsByName('handleText')[0];
      handle.addEventListener('mouseenter', () => {
        applyAttrs(icon, this.getStyle('handleStyle', true, icon.getConfig().identity));
        applyAttrs(text, this.getStyle('textStyle', true, text.getConfig().identity));
      });
      handle.addEventListener('mouseleave', () => {
        applyAttrs(icon, this.getStyle('handleStyle', false, icon.getConfig().identity));
        applyAttrs(text, this.getStyle('textStyle', false, text.getConfig().identity));
      });
    });
  };
}
