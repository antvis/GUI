import { CustomElement, DisplayObject, Text, TextStyleProps } from '@antv/g';
import { ORIGIN } from '../constant';

export type AxisLabel = Text &
  CustomElement<
    TextStyleProps & {
      id: string;
      orient: 'top' | 'bottom' | 'left' | 'right';
      [ORIGIN]: { value: string; text: string };
    }
  >;

export type AxisTitle = Text & DisplayObject<TextStyleProps & { [ORIGIN]?: { text?: string } }>;
