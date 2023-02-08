import type { DisplayObjectConfig, LineStyleProps } from '@antv/g';
import type { Point } from '../../types';
import type { StandardAnimationOption } from '../../animation';

export type GridStyle = LineStyleProps;

export type GridStyleProps = GridStyle & {
  animate: StandardAnimationOption;
  items: Array<{ id: string | number; points: Point[] }>;
  /** the connect way of two lines, if arc, center is necessary */
  type?: 'segment' | 'surround';
  connect?: 'line' | 'arc';
  // If type is 'circle', should specify the center.
  center?: Point;
  // If type is 'circle', determine whether to close path.
  closed?: boolean;
  /** FillColors between lines. */
  areaFill?: string | string[] | null;
};

export type GridOptions = DisplayObjectConfig<GridStyleProps>;
