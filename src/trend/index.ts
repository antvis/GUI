import { Group, Path, Rect } from '@antv/g';
import * as _ from '@antv/util';
import { AREA_STYLE, BACKGROUND_STYLE, LINE_STYLE } from './constant';
import { dataToPath } from './path';

export interface TrendCfg {
  // 位置大小
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  // 数据
  readonly data?: number[];
  // 样式
  readonly smooth?: boolean;
  readonly isArea?: boolean;
  readonly backgroundStyle?: object;
  readonly lineStyle?: object;
  readonly areaStyle?: object;
}

/**
 * 缩略趋势图
 */
export default class Trend extends Group {
  // 生成的 shape
  public backgroundShape: Rect;
  public lineShape: Path;
  public areaShape: Path;
  // 位置大小配置
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  private data: number[];

  private smooth: boolean;
  private isArea: boolean;
  private backgroundStyle: object;
  private lineStyle: object;
  private areaStyle: object;

  constructor(cfg: TrendCfg) {
    super();

    const {
      x = 0,
      y = 0,
      width = 200,
      height = 16,
      smooth = true,
      isArea = false,
      data = [],
      backgroundStyle,
      lineStyle,
      areaStyle,
    } = cfg;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.data = data;

    this.smooth = smooth;
    this.isArea = isArea;
    this.backgroundStyle = _.assign({} as any, BACKGROUND_STYLE, backgroundStyle);
    this.lineStyle = _.assign({} as any, LINE_STYLE, lineStyle);
    this.areaStyle = _.assign({} as any, AREA_STYLE, areaStyle);

    this._initial();
  }

  /**
   * 构造
   * @private
   */
  private _initial() {
    const { x, y, width, height, data, smooth, isArea, backgroundStyle, lineStyle, areaStyle } = this;

    // 背景
    this.backgroundShape = this.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        ...backgroundStyle,
      },
    });

    const path = dataToPath(data, width, height, smooth);
    // 线
    this.lineShape = this.addShape('path', {
      attrs: {
        path,
        ...lineStyle,
      },
    });

    // area
    // 在 path 的基础上，增加两个坐标点
    if (isArea) {
      this.areaShape = this.addShape('path', {
        attrs: {
          path,
          ...areaStyle,
        },
      });
    }

    // 统一移动到对应的位置
    this.move(x, y);
  }
}
