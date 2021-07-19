import type { ShapeAttrs } from '@antv/g';
import { STATE_LIST } from '../constant';

export type StyleState = typeof STATE_LIST[number];

export type MixAttrs = ShapeAttrs &
  {
    [state in StyleState]?: ShapeAttrs;
  };
