import type { PathCommand } from '@antv/g';
import { DisplayObject, Path } from '@antv/g';
import { isArray, isString } from '@antv/util';
import { deepAssign } from '../../util';
import { decorationType, decorationShape } from './types';
import type { DecorationCfg, DecorationOptions, DecorationType, DecorationShape } from './types';
import type { PathProps } from '../../types';

type StandDecorationCfgType = [DecorationType, DecorationShape];

export class Decoration extends DisplayObject<Required<DecorationCfg>> {
  public static tag = 'decoration';

  private static defaultOptions = {
    style: {
      width: 0,
      height: 0,
      type: 'none',
      // 线条默认颜色使用文字颜色
      style: {
        lineWidth: 1,
        stroke: '#000',
      },
    },
  };

  /**
   * 得到规范的修饰线类型
   */
  private get decorationType(): 'none' | StandDecorationCfgType[] {
    const { type } = this.attributes;
    if (type === 'none' || !type) return 'none';
    // DecorationType
    if (typeof type === 'string' && decorationType.includes(type)) return [[type, 'solid']];
    // [DecorationType, DecorationShape][]
    if (isArray(type[0])) return type as StandDecorationCfgType[];
    // [DecorationType, DecorationShape]
    if (type.length === 2 && decorationShape.includes(type[1] as DecorationShape))
      return [type as StandDecorationCfgType];
    return (type as DecorationType[]).map((t) => {
      return [t, 'solid'];
    });
  }

  /**
   * 双线间隔
   */
  private get doubleSpacing() {
    const {
      style: { lineWidth },
    } = this.attributes;
    return (lineWidth as number) * 2;
  }

  /** 悬挂比例  */
  private get hangingRate() {
    return 0.1;
  }

  private get dashedCfg() {
    const {
      style: { lineWidth },
    } = this.attributes;
    return { lineDash: [lineWidth! * 2, lineWidth] } as { lineDash: [number, number] };
  }

  private get dottedCfg() {
    const {
      style: { lineWidth },
    } = this.attributes;
    return { lineDash: [lineWidth, lineWidth] } as { lineDash: [number, number] };
  }

  private get solidCfg() {
    return { lineDash: [0, 0] } as { lineDash: [number, number] };
  }

  private get decorationCfg() {
    const { style } = this.attributes;
    const standCfg = this.decorationType;
    if (standCfg === 'none') return [];
    return standCfg.map(([type, shape]) => {
      // 不绘制
      if (type === 'none') return { path: [] };
      if (shape === 'wavy') return { path: this.getWavyPath(type), ...style };
      // 剩下的只可能是线了
      if (shape === 'double') return { path: this.getDoubleLinePath(type), ...style };
      const lineStyleMap = {
        solid: this.solidCfg,
        dashed: this.dashedCfg,
        dotted: this.dottedCfg,
      };
      return {
        path: this.getLinePath(type),
        ...style,
        ...lineStyleMap[shape],
      };
    }) as PathProps[];
  }

  constructor(options: DecorationOptions) {
    super(deepAssign({}, Decoration.defaultOptions, options));
    this.update({});
  }

  public update(cfg: Partial<DecorationCfg>) {
    this.attr(deepAssign({}, this.attr(), cfg));
    this.decorationCfg.forEach((cfg) => {
      this.appendChild(new Path({ style: cfg }));
    });
  }

  public clear() {
    this.removeChildren(true);
  }

  /**
   * 根据位置计算线条起始坐标
   */
  private getLinePos(type: Omit<DecorationType, 'none'>) {
    const { hangingRate: rate } = this;
    const { height } = this.attributes;
    let [x, y]: [number, number] = [0, 0];
    if (type === 'overline') [x, y] = [0, rate * height];
    else if (type === 'line-through') [x, y] = [0, height / 2];
    else [x, y] = [0, height * (1 - rate)];
    return [x, y];
  }

  /**
   * 根据位置创建直线路径
   */
  private getLinePath(type: Omit<DecorationType, 'none'>): PathCommand[] {
    const { width } = this.attributes;
    const [x, y] = this.getLinePos(type);
    return [
      ['M', x, y],
      ['L', x + width, y],
    ];
  }

  /**
   * 根据位置创建双直线路径
   */
  private getDoubleLinePath(type: Omit<DecorationType, 'none'>): PathCommand[] {
    const { doubleSpacing: spacing } = this;
    const { width } = this.attributes;
    const [x, y] = this.getLinePos(type);
    let [s1, s2] = [0, 0];
    if (type === 'line-through') [s1, s2] = [-0.5, 0.5];
    if (type === 'underline') [s1, s2] = [0, 1];
    else if (type === 'overline') [s1, s2] = [1, 0];
    console.log(s1, s2);

    return [
      ['M', x, y + spacing * s1],
      ['L', x + width, y + spacing * s1],
      ['M', x, y + spacing * s2],
      ['L', x + width, y + spacing * s2],
    ];
  }

  /**
   * 根据位置创建波浪线路径
   */
  private getWavyPath(type: Omit<DecorationType, 'none'>): PathCommand[] {
    return [];
  }
}
