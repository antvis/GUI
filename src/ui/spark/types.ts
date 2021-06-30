import { ShapeAttrs, ShapeCfg } from '../../types';

export type SparkPlot = 'line' | 'bar';

export type SparkOptions = ShapeCfg & {
  type?: SparkPlot;
  data?: number[] | number[][];
  width?: number;
  height?: number;
  isStack?: boolean;
  color?: string | string[] | ((idx: number) => string);

  smooth?: boolean;
  lineStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
  areaStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);

  isGroup?: boolean;
  columnStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
};
