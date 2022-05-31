import { BaseStyleProps } from '@antv/g';
export type ShapeAttrs = Partial<BaseStyleProps> & {
  cursor?: string;
};

export type {
  DisplayObject,
  DisplayObjectConfig,
  CircleStyleProps as CircleProps,
  EllipseStyleProps as EllipseProps,
  RectStyleProps as RectProps,
  ImageStyleProps as ImageProps,
  LineStyleProps as LineProps,
  PathStyleProps as PathProps,
  PolylineStyleProps as PolylineProps,
  TextStyleProps as TextProps,
  Group,
  PathCommand,
} from '@antv/g';
