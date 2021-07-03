import { ShapeAttrs, ShapeCfg } from '../../types';

export type SparkOptions = ShapeCfg & {
  data?: number[] | number[][];
  width?: number;
  height?: number;
  isStack?: boolean;
  color?: string | string[] | ((idx: number) => string);
} & (
    | {
        type?: 'line';
        smooth?: boolean;
        lineStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
        areaStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
      }
    | {
        type: 'column';
        isGroup?: boolean;
        columnStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
      }
  );
