import { PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import { AxisLabelCfg } from '../axis/types';

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
    // todo. Do not typing definition inference.
    style?: AxisLabelCfg['style'];
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
  // Size of SpeedPath is equal to [size, size * 2], size of marker is equal to size / 2.
  size?: number;
  lineStroke?: string;
  markerFill?: string;
  // Require 5 speeds, like: [1.0, 2.0, 3.0, 4.0, 5.0], [0.5, 1.0, 1.5, 2.0, 2.5]
  speeds?: number[];
  initialSpeed?: number;
  labelStyle?: Omit<TextStyleProps, 'text'>;
  // Spacing distance between label and speedControl button.
  spacing?: number;
};

export type ControlButtonStyleProps = {
  symbol: string;
  // The size of marker is equal to [size - padding[1] - padding[3], size - padding[0] - padding[2]]
  size: number;
  // Used to enlarge the hot area of button.
  margin?: number | number[];
  padding?: number | number[];
  backgroundStyle?: {
    default?: Omit<RectStyleProps, 'x' | 'y' | 'width' | 'height'>;
    active?: Omit<RectStyleProps, 'x' | 'y' | 'width' | 'height'>;
  };
  markerStyle?: {
    default?: Omit<PathStyleProps, 'path'>;
    active?: Omit<PathStyleProps, 'path'>;
  };
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
  singleModeControl?: any | null;
  speedControl?: SpeedControlStyleProps | null;
  controlPosition?: 'bottom' | 'left' | 'right';
  controlButton?: {
    // Spacing distance between control buttons.
    spacing?: number;
    prevBtn?: ControlButtonStyleProps | null;
    playBtn?: ControlButtonStyleProps | null;
    nextBtn?: ControlButtonStyleProps | null;
  } | null;

  playAxis?: PlayAxisStyleProps;
  playInterval?: number;
  autoPlay?: boolean;
  singleMode?: boolean;
};
