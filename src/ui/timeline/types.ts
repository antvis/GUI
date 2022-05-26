import { PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import { AxisTickLineCfg } from '../axis/types';

export type TimeData = {
  date: string;
  [k: string]: any;
};

export type PlayAxisStyleProps = {
  size?: number;
  selection?: [number, number] | number;
  selectionStyle?: {
    fill?: string;
    fillOpacity?: number;
    cursor?: string;
  };
  backgroundStyle?: {
    fill?: string;
    fillOpacity?: number;
  };

  label?: {
    position?: -1 | 1;
    tickLine?: AxisTickLineCfg;
    tickPadding?: number;
    style?: Omit<TextStyleProps, 'text'>;
  } | null;

  // Only for SliderAxis
  handleStyle?: {
    r?: number;
    fill?: string;
    fillOpacity?: number;
    lineWidth?: number;
    stroke?: string;
    strokeOpacity?: number;
    cursor?: string;
  };

  // Only for CellAxis.
  spacing?: number;
  // Only for CellAxis
  cellGap?: number;
  // Only for CellAxis
  cellStyle?: {
    fill?: string;
    fillOpacity?: number;
    radius?: number;
  };

  loop?: boolean;
  playMode?: 'increase' | 'fixed';
};

export type SpeedControlStyleProps = {
  width?: number;
  lineStroke?: string;
  // Size of marker is equal to size, and size of SpeedPath is equal to [size*2, size * 4],
  markerSize?: number;
  markerFill?: string;
  // Require 5 speeds, like: [1.0, 2.0, 3.0, 4.0, 5.0], [0.5, 1.0, 1.5, 2.0, 2.5]
  speeds?: number[];
  initialSpeed?: number;
  labelStyle?: Omit<TextStyleProps, 'text'>;
  // Spacing distance between label and speedControl button.
  spacing?: number;
};

type ButtonBackgroundStyle = Omit<RectStyleProps, 'x' | 'y' | 'width' | 'height'>;
type ButtonMarkerStyle = Omit<PathStyleProps, 'path'>;

export type ControlButtonStyleProps = {
  symbol: string;
  // The size of marker is equal to [size - padding[1] - padding[3], size - padding[0] - padding[2]]
  size: number;
  // Used to enlarge the hot area of button.
  margin?: number | number[];
  padding?: number | number[];
  backgroundStyle?: ButtonBackgroundStyle & {
    active?: Omit<RectStyleProps, 'x' | 'y' | 'width' | 'height'>;
  };
  markerStyle?: ButtonMarkerStyle & {
    active?: Omit<PathStyleProps, 'path'>;
  };
};

export type CheckboxStyleProps = {
  size?: number;
  labelStyle?: Omit<TextStyleProps, 'x' | 'y'>;
};

export type TimelineStyleProps = {
  x?: number;
  y?: number;
  data: TimeData[];
  width?: number;
  height?: number;
  padding?: number | number[];
  orient?: 'horizontal' | 'vertical';
  selection?: number | [number, number];
  type?: 'slider' | 'cell';
  singleModeControl?: (CheckboxStyleProps & { width?: number }) | null;
  speedControl?: SpeedControlStyleProps | null;
  controlPosition?: 'bottom' | 'left' | 'right';
  controlButton?: {
    // Spacing distance between control buttons.
    spacing?: number;
    prevBtn?: ControlButtonStyleProps | null;
    playBtn?: ControlButtonStyleProps | null;
    nextBtn?: ControlButtonStyleProps | null;
  } | null;

  playAxis?: PlayAxisStyleProps & {
    appendPadding?: number | number[];
  };
  playInterval?: number;
  autoPlay?: boolean;
  singleMode?: boolean;
};
