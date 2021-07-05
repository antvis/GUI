import { ShapeAttrs, ShapeCfg } from '../../types';
import { MarkerOptions } from '../marker';

export type Pair<T> = [T, T];

export type HandleCfg = {
  /**
   * 是否显示Handle
   */
  show?: boolean;
  /**
   * 大小
   */
  size?: number;
  /**
   * 文本格式化
   */
  formatter?: (text: string) => string;
  /**
   * 文字样式
   */
  textStyle: ShapeAttrs;
  /**
   * 文字与手柄的间隔
   */
  spacing: number;
  /**
   * 手柄图标
   */
  handleIcon?: MarkerOptions['symbol'];
  /**
   * 手柄图标样式
   */
  handleStyle: ShapeAttrs;
};

export type MiniMap = {
  /**
   * number[] 单线
   * number[][] 多线
   */
  data: number[] | number[][];
  /**
   * 平滑曲线
   */
  smooth: boolean;
  lineStyle: ShapeAttrs;
  areaStyle: ShapeAttrs;
};

export type MixAttrs =
  | ShapeAttrs
  | {
      default: ShapeAttrs;
      active: ShapeAttrs;
    };

export type SliderOptions = ShapeCfg & {
  orient?: 'vertical' | 'horizontal';
  values?: Pair<number>;
  names?: Pair<string>;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  padding?: {
    left: number;
    right: number;
    top: number;
    buttons: number;
  };
  backgroundStyle?: MixAttrs;
  selectionStyle?: MixAttrs;
  foregroundStyle?: MixAttrs;
  handle?:
    | HandleCfg
    | {
        start: HandleCfg;
        end: HandleCfg;
      };

  /**
   * 缩略图数据及其配置
   */
  miniMap?: MiniMap;
};
