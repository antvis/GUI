import { Rect, Text } from '@antv/g';
import { deepMix } from '@antv/util';
// import { SliderOptions, HandleCfg, MiniMap, Pair } from './types';
import { SliderOptions, HandleCfg, Pair } from './types';
import { Marker } from '../marker';
import { CustomElement, DisplayObject, ShapeAttrs } from '../../types';
// import { /* applyAttrs */ measureTextWidth } from '../../util';
const applyAttrs = (target: DisplayObject, attrs: ShapeAttrs) => {
  Object.entries(attrs).forEach(([attrName, attrValue]) => {
    target.attr(attrName, attrValue);
  });
};

export { SliderOptions };

type HandleType = 'start' | 'end';

export class Slider extends CustomElement {
  public static tag = 'slider';

  /**
   * 容器
   */
  private containerShape: DisplayObject;

  private backgroundShape: DisplayObject;

  private miniMapShape: DisplayObject;

  private foregroundShape: DisplayObject;

  private startHandle: DisplayObject;

  private endHandle: DisplayObject;

  private prevPos: number;

  /**
   * drag事件当前选中的对象
   */
  private currTarget: DisplayObject;

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
        right: 0,
        top: 0,
        bottom: 0,
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
      },
      brushStyle: {
        fill: '#eef3ff',
      },
      handle: {
        show: true,
        size: 20,
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
    value;
    if (name in ['names', 'values']) {
      this.setHandle();
    }
  }

  public getValues() {
    return this.getAttribute('values');
  }

  public setValues(values: SliderOptions['values']) {
    this.setAttribute('values', values);
  }

  public getNames() {
    return this.getAttribute('names');
  }

  public setNames(names: SliderOptions['names']) {
    this.setAttribute('names', names);
  }

  private init() {
    this.createBackground();
    this.createForeground();
    // this.createContainer();
    this.createHandles();
    this.bindEvents();
    console.log(this.getElementsByName('handleIcon'));
  }

  /**
   * 获得安全的Values
   * @param adjust  true: 超出范围时移动至合法区间； false: 超出范围时取min、max；
   */
  private getSafetyValues(values?: Pair<number>, adjust: boolean = false): Pair<number> {
    const { min, max } = this.attributes;
    const [sV, eV] = values || this.getValues();
    let startVal = sV;
    let endVal = eV;
    // 交换startVal endVal
    if (startVal > endVal) {
      [startVal, endVal] = [endVal, startVal];
    }
    // 超出范围就全选
    if (endVal - startVal > max - min) {
      return [min, max];
    }
    const lOffset = min - startVal;
    // 无论是否调整都整体右移
    if (endVal < min) {
      return [min, endVal + lOffset];
    }
    if (startVal < min) {
      return adjust ? [min, endVal + lOffset] : [min, endVal];
    }
    const rOffset = endVal - max;
    if (startVal > max) {
      return [startVal - rOffset, max];
    }
    if (endVal > max) {
      return adjust ? [startVal - rOffset, max] : [startVal, max];
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

  private getStyle(name: string, isActive?: boolean) {
    const style = this.getAttribute(name);
    if (isActive) {
      return style.active || {};
    }
    return style.default || style;
  }

  private createContainer() {
    // 待子组件创建完成后，计算包围盒并设置padding
    const { padding } = this.attributes;
    const innerWidth = 0;
    const innerHeight = 0;
    this.containerShape = new Rect({
      name: 'container',
      attrs: {
        x: 0,
        y: 0,
        width: padding.left + padding.right + innerWidth,
        height: padding.top + padding.bottom + innerHeight,
        opacity: 0,
      },
    });
    this.appendChild(this.containerShape);
    this.containerShape.toBack();
  }

  private createBackground() {
    this.backgroundShape = new Rect({
      name: 'background',
      attrs: {
        ...this.getAvailableSpace(),
        ...this.getStyle('backgroundStyle'),
      },
    });
    this.appendChild(this.backgroundShape);
  }

  private createMiniMap() {}

  /**
   * 根据orient和padding计算前景的x y width height
   */
  private calcForegroundPosition() {
    const [start, end] = this.getSafetyValues();
    const { x, y, width, height } = this.getAvailableSpace();
    return this.getOrientVal([
      {
        y,
        height,
        x: start * width + x,
        width: (end - start) * width,
      },
      {
        x,
        width,
        y: start * height + y,
        height: (end - start) * height,
      },
    ]);
  }

  private createForeground() {
    this.foregroundShape = new Rect({
      name: 'foreground',
      attrs: {
        ...this.calcForegroundPosition(),
        ...this.getStyle('foregroundStyle'),
      },
    });
    this.appendChild(this.foregroundShape);
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
    applyAttrs(this.foregroundShape, {
      ...this.calcForegroundPosition(),
    });
    applyAttrs(this.startHandle, {
      ...this.calcHandlePosition('start'),
    });
    applyAttrs(this.endHandle, {
      ...this.calcHandlePosition('end'),
    });
    this.setHandleText();
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
    const { x: fX, y: fY, width: fW, height: fH } = this.calcForegroundPosition();
    let x = 0;
    let y = 0;

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
    if (orient === 'horizontal') {
      // 文本宽度
      const textWidth = tBox.getMax()[0] - tBox.getMin()[0];
      const ss = spacing + size / 2;
      const _ = ss + textWidth / 2;
      if (handleType === 'start') {
        // 左边可用空间
        const aLeft = fX - ss;
        x = aLeft > textWidth ? -_ : _;
      } else {
        // 右边可用空间
        const aRight = iW - fX - fW - ss;
        x = aRight > textWidth ? _ : -_;
      }
    } else {
      const _ = spacing + size / 2;
      // 文本高度
      const textHeight = tBox.getMax()[1] - tBox.getMin()[1];
      if (handleType === 'start') {
        // 上方可用空间
        const aAbove = fY - size / 2;
        y = aAbove > textHeight ? -_ : _;
      } else {
        // 下方可用空间
        const aBelow = iH - fY - fH - size / 2;
        y = aBelow > textHeight ? _ : -_;
      }
    }
    return { x, y, text: formattedText };
  }

  private setHandleText() {
    applyAttrs(this.startHandle.getElementsByName('handleText')[0], {
      ...this.calcHandleText('start'),
    });
    applyAttrs(this.endHandle.getElementsByName('handleText')[0], {
      ...this.calcHandleText('end'),
    });
  }

  private createHandle(options: HandleCfg, handleType: HandleType) {
    const { show, size, textStyle, handleIcon: icon, handleStyle } = options;
    const handleIcon = new Marker({
      name: 'handleIcon',
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
        cursor: 'ew-resize',
      },
    });

    const handleText = new Text({
      name: 'handleText',
      attrs: {
        // TODO 之后考虑添加文字超长省略，可以在calcHandleTextPosition中实现
        ...textStyle,
        ...this.calcHandleText(handleType),
      },
    });

    // 用 Group 创建对象会提示没有attrs属性
    const handle = new DisplayObject({
      name: `${handleType}Handle`,
      attrs: {
        ...this.calcHandlePosition(handleType),
      },
    });
    handle.appendChild(handleIcon);
    handle.appendChild(handleText);
    return handle;
  }

  private getHandleCfg(handleType: HandleType) {
    const { handle } = this.attributes;
    if (handleType in handle) {
      return handle[handleType];
    }
    return handle;
  }

  private createHandles() {
    this.startHandle = this.createHandle(this.getHandleCfg('start'), 'start');
    this.foregroundShape.appendChild(this.startHandle);
    this.endHandle = this.createHandle(this.getHandleCfg('end'), 'end');
    this.foregroundShape.appendChild(this.endHandle);
  }

  private bindEvents() {
    this.foregroundShape.addEventListener('mousedown', this.onForeDragStart);
    this.startHandle
      .getElementsByName('handleIcon')[0]
      .addEventListener('mousedown', this.onHandleDragStart(this.startHandle));
    this.endHandle.getElementsByName('handleIcon')[0].on('mousedown', this.onHandleDragStart(this.endHandle));
  }

  private getOrientVal<T>([x, y]: Pair<T>) {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? x : y;
  }

  private setForeOffset(offset: number) {
    const { width, height } = this.getAvailableSpace();
    const dVal = offset / this.getOrientVal([width, height]);
    const [startVal, endVal] = this.getValues();
    this.setValues(this.getSafetyValues([startVal + dVal, endVal + dVal], true));
  }

  private onHandleDragStart = (target: DisplayObject) => (e) => {
    e.stopPropagation();
    this.currTarget = target;
    this.prevPos = this.getOrientVal([e.x, e.y]);
    this.addEventListener('mousemove', this.onHandleDragging);
    document.addEventListener('mouseup', this.onHandleDragEnd);
  };

  private onHandleDragging = (e) => {
    e.stopPropagation();
    const currPos = this.getOrientVal([e.x, e.y]);
    const _ = currPos - this.prevPos;

    if (!_) {
      return;
    }
    const { width, height } = this.getAvailableSpace();
    const dVal = _ / this.getOrientVal([width, height]);

    const [startVal, endVal] = this.getValues();
    let newValues = [startVal + dVal, endVal];
    if (this.currTarget.getConfig().name === 'endHandle') {
      newValues = [startVal, endVal + dVal];
    }
    this.prevPos = currPos;
    this.setValues(this.getSafetyValues(newValues as Pair<number>));
  };

  private onHandleDragEnd = () => {
    this.removeEventListener('mousemove', this.onHandleDragging);
    document.removeEventListener('mouseup', this.onHandleDragEnd);
  };

  private onForeDragStart = (e) => {
    e.stopPropagation();
    this.prevPos = this.getOrientVal([e.x, e.y]);
    this.addEventListener('mousemove', this.onForeDragging);
    document.addEventListener('mouseup', this.onForeDragEnd);
  };

  private onForeDragging = (e) => {
    e.stopPropagation();
    const currPos = this.getOrientVal([e.x, e.y]);
    const _ = currPos - this.prevPos;
    this.setForeOffset(_);
    this.prevPos = currPos;
  };

  private onForeDragEnd = () => {
    this.removeEventListener('mousemove', this.onForeDragging);
    document.removeEventListener('mouseup', this.onForeDragEnd);
  };

  private onBrushStart = () => {
    // 记录当前坐标
  };

  private onBrushing = () => {
    // 更新rect大小
    // 如果鼠标右移、下移，更新宽、高即可
    // 否则同时更新x、y和宽、高
  };

  private onBrushEnd = () => {
    // 使用this.setValues()方法重新绘制
  };
}
