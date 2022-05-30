import type { TextStyleProps } from '@antv/g';
import type { DisplayObjectConfig } from '../../types';
import type { AxisStyleProps } from '../timeline/playAxis';
import type { SparklineCfg } from '../sparkline/types';

export type Pair<T> = [T, T];

type HandleStyle = {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeOpacity?: number;
  lineWidth?: number;
};

export type SliderStyleProps = Omit<AxisStyleProps, 'singleMode' | 'handleStyle'> & {
  x?: number;
  y?: number;
  type?: 'date' | 'category' | 'linear';
  padding?: number | number[];
  sparkline?: Partial<Omit<SparklineCfg, 'data' | 'width' | 'height' | 'x' | 'y'>> & {
    padding?: number | number[];
    fields?: string[];
  };
  startHandleSize?: number;
  endHandleSize?: number;
  startHandleIcon?: string | ((x: number, y: number, r: number) => string);
  endHandleIcon?: string | ((x: number, y: number, r: number) => string);
  handleStyle?: HandleStyle & {
    size?: number;
    symbol?: string | ((x: number, y: number, r: number) => string);
    active?: HandleStyle;
  };
  textStyle?: Omit<TextStyleProps, 'x' | 'y' | 'text'>;
  formatter?: (v: any, index: number) => string;
};

export type SliderOptions = DisplayObjectConfig<SliderStyleProps>;
