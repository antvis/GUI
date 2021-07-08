import { Linear, Band } from '@antv/scale';
import { ShapeAttrs, ShapeCfg } from '../../types';

export type Point = [number, number];
export type Line = Point[];
export type Data = number[][];
export type Scales = {
  y: Linear;
} & (
  | {
      type: 'line';
      x: Linear;
    }
  | {
      type: 'column';
      x: Band;
    }
);

export type SparklineOptions = ShapeCfg & {
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
