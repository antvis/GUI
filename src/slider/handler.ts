import { Event, Group, Rect } from '@antv/g';
import * as _  from '@antv/util';

interface IStyle {
  fill?: string;
  stroke?: string;
  radius?: number;
  opacity?: number;
  cursor?: string;
  highLightFill?: string;
}

export interface HandlerCfg {
  // position size
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  // style
  readonly style?: IStyle;
}

const DEFAULT_STYLE = {
  fill: '#F7F7F7',
  stroke: '#BFBFBF',
  radius: 2,
  opacity: 1,
  cursor: 'ew-resize',
  // 高亮的颜色
  highLightFill: '#FFF',
};

export default class Handler extends Group {

  // 横向还是纵向 TODO
  private layout: string;

  private x: number;
  private y: number;
  private width: number;
  private height: number;

  private style: IStyle;

  // 组件
  private background: Rect;

  constructor(cfg: HandlerCfg) {
    super();

    const { x = 0, y = 0, width = 10, height = 24, style = {} } = cfg;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.style = { ...DEFAULT_STYLE, ...style };

    this._initial();
  }

  /**
   * 设置位置 x
   * @param x
   */
  public setX(x: number) {
    this.setXY(x, undefined);
  }

  /**
   * 设置位置 y
   * @param y
   */
  public setY(y: number) {
    this.setXY(undefined, y);
  }

  public setXY(x: number, y: number) {
    if (_.isNumber(x)) { this.x = x; }
    if (_.isNumber(y)) { this.y = y; }

    this._updateXY();
  }

  /**
   * 初始化组件
   * @private
   */
  private _initial() {

    const { width, height, style } = this;
    const { fill, stroke, radius, opacity, cursor } = style;

    // 按钮框框
    this.background = this.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        fill,
        stroke,
        radius,
        opacity,
        cursor,
      },
    });

    // 两根竖线
    const x1 = 1 / 3 * width;
    const x2 = 2 / 3 * width;

    const y1 = 1 / 4 * height;
    const y2 = 3 / 4 * height;

    this.addShape('line', {
      attrs: {
        x1,
        y1,
        x2: x1,
        y2,
        stroke,
        cursor,
      },
    });

    this.addShape('line', {
      attrs: {
        x1: x2,
        y1,
        x2,
        y2,
        stroke,
        cursor,
      },
    });

    // 移动到对应的位置
    this._updateXY();

    this._bindEvents();
  }

  private _bindEvents() {
    this.on('mouseenter', () => {
      const { highLightFill } = this.style;
      this.background.attr('fill', highLightFill);

      this._getCanvas().draw();
    });

    this.on('mouseleave', () => {
      const { fill } = this.style;
      this.background.attr('fill', fill);

      this._getCanvas().draw();
    });
  }

  private _updateXY() {
    this.move(this.x, this.y);
  }

  /**
   * 因为 get('canvas') 因为构建顺序问题，导致不存在，所以采用这种方式拿到 canvas
   * @private
   */
  private _getCanvas(): Group {
    let t: Group = this;

    while (t.get('parent')) {
      t = t.get('parent');
    }

    return t;
  }
}
