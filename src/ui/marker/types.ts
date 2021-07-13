import { ShapeCfg } from '../../types';

export type FunctionalSymbol = (x: number, y: number, r: number) => any;

export type MarkerAttrs = {
  /**
   * 标记的位置 x，默认为 0
   */
  x?: number;
  /**
   * 标记的位置 x，默认为 0
   */
  y?: number;
  /**
   * 标记的大小，默认为 16
   */
  size?: number;
  /**
   * 标记的类型，或者 path callback
   */
  symbol: string | FunctionalSymbol;

  [key: string]: any;
};

export type MarkerOptions = ShapeCfg & {
  attrs: MarkerAttrs;
};
