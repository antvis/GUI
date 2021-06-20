import { Rect } from '@antv/g';
import { Event } from '@antv/g-base';
import { deepMix, get } from '@antv/util';
import { CustomElement, DisplayObject } from '../../types';
import { ScrollbarOptions, ScrollStyle, Range } from './types';
import { SIZE_STYLE } from './constant';
import { applyAttrs } from '../../util';

export { ScrollbarOptions };

export class Scrollbar extends CustomElement {
  /**
   * tag
   */
  public static tag = 'scrollbar';

  /**
   * 滑块容器
   */
  // private containerShape: DisplayObject;

  /**
   * 轨道
   */
  private trackShape: DisplayObject;

  /**
   * 滑块
   */
  private thumbShape: DisplayObject;

  /**
   * 拖动开始位置
   */
  private prevPos: number;

  private static defaultOptions = {
    type: Scrollbar.tag,
    attrs: {
      // 滑条朝向
      orient: 'vertical',
      // 滑块范围
      range: [0, 0.25],
      // 滑块范围控制
      limit: [0, 1],
      // 滚动条尺寸
      size: 'medium',
      // 滑块形状
      shape: 'rect',
      offset: [0, 0],
      // 滑块两侧内边距
      // 这里的padding是相对于滑块的上下左右，而不是屏幕
      padding: {
        top: 3,
        right: 1,
        bottom: 3,
        left: 1,
      },
      // 滚动条样式
      scrollStyle: {
        track: {
          fill: '#fafafa',
          lineWidth: 1,
          stroke: '#e8e8e8',
        },
        thumb: {
          fill: '#c1c1c1',
        },
      },
      // hover样式
      hoverStyle: {
        track: {},
        thumb: {
          fill: '#7d7d7d',
        },
      },
    },
  };

  constructor(options: ScrollbarOptions) {
    super(deepMix({}, Scrollbar.defaultOptions, options));
    // 修正滑块位置
    this.setRange(this.attributes.range);
    this.init();
  }

  attributeChangedCallback(name: string, value: any): void {
    // 变更属性时需要重新计算value
    console.log('attributeChangedCallback', name, value);
  }

  public getTrackShape() {
    return this.trackShape;
  }

  public getThumbShape() {
    return this.thumbShape;
  }

  /**
   * 计算滑块的两端及中点在轨道的比例位置
   * @param offset 额外的偏移量
   */
  public getValue(offset = 0) {
    const { orient } = this.attributes;
    const { x, y, width, height } = this.thumbShape.attributes;
    const { x: X, y: Y, width: W, height: H } = this.getTrackInner();

    let stVal: number;
    let midVal: number;
    let endVal: number;
    if (orient === 'vertical') {
      const _ = height / H;
      stVal = (y - Y + offset) / H;
      midVal = _ / 2 + stVal;
      endVal = _ + stVal;
    } else if (orient === 'horizontal') {
      const _ = width / W;
      stVal = (x - X + offset) / W;
      midVal = _ / 2 + stVal;
      endVal = _ + stVal;
    } else {
      return this.throwInvalidOrient();
    }
    return { range: [stVal, endVal] as Range, value: midVal };
  }

  /**
   * 值改变事件
   */
  public onValueChanged() {
    this.emit('scroll', {});
  }

  /**
   * 获得合法的range值
   */
  private getLegalRange(range: Range, limit: Range = this.getAttribute('limit')) {
    const length = range[1] - range[0];
    // 低于下限
    if (range[0] <= limit[0]) {
      return [limit[0], limit[0] + length];
    }
    // 高于上限
    if (range[1] >= limit[1]) {
      return [limit[1] - length, limit[1]];
    }
    return range;
  }

  /**
   * 获得轨道可用空间
   */
  private getTrackInner() {
    const { orient, size, length, padding } = this.attributes;
    const trackWidth = get(SIZE_STYLE, [size, 'track', 'width']);
    const VP = padding.top + padding.bottom;
    const HP = padding.left + padding.right;

    const base = {
      x: this.getOrientPos([padding.top, padding.left]),
      y: this.getOrientPos([padding.right, padding.top]),
    };

    if (orient === 'vertical') {
      return {
        ...base,
        width: trackWidth - HP,
        height: length - VP,
      };
    }

    if (orient === 'horizontal') {
      return {
        ...base,
        width: length - VP,
        height: trackWidth - HP,
      };
    }

    return this.throwInvalidOrient();
  }

  /**
   * 设置滑块范围
   */
  private setRange(range: Range) {
    const legalRange = this.getLegalRange(range);
    console.log('legalRange', legalRange);

    this.setAttribute('range', legalRange);

    const { x, y, width, height } = this.getTrackInner();
    const { orient } = this.attributes;
    // 设置滑块坐标
    this.thumbShape &&
      this.thumbShape.setAttribute(
        orient === 'vertical' ? 'y' : 'x',
        legalRange[0] * this.getOrientPos([width, height]) + this.getOrientPos([x, y])
      );
  }

  private getRange() {
    return this.getAttribute('range');
  }

  /**
   * 设置相对偏移，鼠标拖动、滚轮滑动时使用
   */
  private setRelatedOffset(offset: number) {
    const range = this.getRange();
    const { width, height } = this.getTrackInner();

    const length = this.getOrientPos([width, height]);

    // 偏移后的起始偏移
    const st = Number((range[0] + offset / length).toFixed(4));
    const end = Number((range[1] + offset / length).toFixed(4));

    this.setRange([st, end]);
  }

  private throwInvalidOrient = () => {
    throw new Error(`Invalid Orientation: ${this.attributes.orient}`);
  };

  private getMixinStyle(name: 'scrollStyle' | 'hoverStyle'): ScrollStyle {
    const { size } = this.attributes;
    const mixedStyle = deepMix({}, SIZE_STYLE[size], this.attributes[name]);
    return mixedStyle;
  }

  /**
   * 生成轨道属性
   */
  private getTrackAttrs() {
    const { orient, length } = this.attributes;
    const { track: trackStyle } = this.getMixinStyle('scrollStyle');
    const baseAttrs = {
      x: 0,
      y: 0,
      ...trackStyle,
    };
    if (orient === 'vertical') {
      return {
        ...baseAttrs,
        width: trackStyle.width,
        height: length,
      };
    }
    if (orient === 'horizontal') {
      return {
        ...baseAttrs,
        width: length,
        height: trackStyle.width,
      };
    }
    return this.throwInvalidOrient();
  }

  /**
   * 生成滑块属性
   */
  private getThumbAttrs() {
    const { thumb: thumbStyle } = this.getMixinStyle('scrollStyle');
    const { orient, shape } = this.attributes;
    const range = this.getRange();
    console.log('thumbRange: ', range);

    const trackInner = this.getTrackInner();
    const { x, y, width, height } = trackInner;

    if (orient === 'vertical') {
      const halfWidth = width / 2;
      return {
        ...trackInner,
        ...thumbStyle,
        y: y + range[0] * height,
        height: height * (range[1] - range[0]),
        radius: shape === 'rect' ? 0 : halfWidth,
      };
    }
    if (orient === 'horizontal') {
      const halfHeight = height / 2;
      return {
        ...trackInner,
        ...thumbStyle,
        x: x + range[0] * width,
        width: width * (range[1] - range[0]),
        radius: shape === 'rect' ? 0 : halfHeight,
      };
    }
    return this.throwInvalidOrient();
  }

  private init() {
    const { x, y } = this.attributes;

    this.trackShape = new Rect({
      attrs: this.getTrackAttrs(),
    });
    this.appendChild(this.trackShape);

    // 获得滑块范围
    // 滑块最大长度
    console.log(this.getThumbAttrs());

    this.thumbShape = new Rect({
      attrs: this.getThumbAttrs(),
    });
    console.log(this.thumbShape);

    this.appendChild(this.thumbShape);
    this.translate(x, y);
    this.bindEvents();
  }

  private bindEvents() {
    this.trackShape.addEventListener('click', this.onTrackClick);
    this.onThumbHover();
    this.thumbShape.addEventListener('mousedown', this.onThumbDragStart);
  }

  /**
   * 根据orient取出对应轴向上的值
   * 主要用于取鼠标坐标在orient方向上的位置
   */
  private getOrientPos(pos: [number, number]) {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? pos[0] : pos[1];
  }

  /**
   * 点击轨道事件
   */
  private onTrackClick(e: Event) {
    console.log('onTrackClick: ', e);
  }

  /**
   * 滑块悬浮事件
   */
  private onThumbHover() {
    // 滑块hover
    this.thumbShape.addEventListener('mouseenter', () => {
      const hoverStyle = this.getMixinStyle('hoverStyle');
      applyAttrs(this, 'thumbShape', hoverStyle.thumb);
    });
    this.thumbShape.addEventListener('mouseleave', () => {
      const hoverStyle = this.getMixinStyle('scrollStyle');
      applyAttrs(this, 'thumbShape', hoverStyle.thumb);
    });
  }

  private onThumbDragStart = (e: Event) => {
    e.stopPropagation();
    this.prevPos = this.getOrientPos([e.x, e.y]);
    document.addEventListener('mousemove', this.onThumbDragging);
    document.addEventListener('mouseup', this.onThumbDragEnd);
  };

  private onThumbDragging = (e: MouseEvent) => {
    e.stopPropagation();
    const currPos = this.getOrientPos([e.offsetX, e.offsetY]);
    const diff = currPos - this.prevPos;

    // TODO: 如果指针坐标超出轨道，则不触发
    this.setRelatedOffset(diff);
    this.prevPos = currPos;
  };

  private onThumbDragEnd = (e: Event) => {
    e.preventDefault();
    document.removeEventListener('mousemove', this.onThumbDragging);
    document.removeEventListener('mouseup', this.onThumbDragEnd);
  };

  /**
   * 滚动开始时触发
   */
  // private onScrollStart(e: Event) {}

  /**
   * 滚动结束时触发
   */
  // private onScrollEnd() {}
}
