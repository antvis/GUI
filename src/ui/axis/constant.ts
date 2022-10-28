import type { DisplayObjectConfig } from '@antv/g';
import { Path } from '@antv/g';
import { deepMix } from '@antv/util';
import type { AxisBaseCfg } from './types';

export const AXIS_BASE_DEFAULT_CFG: DisplayObjectConfig<Partial<AxisBaseCfg>> = {
  style: {
    data: [],
    dataThreshold: 100,
    tickDirection: 'positive',
    titleAlign: 'start',
    titlePosition: 'bottom',
    titleSpacing: 10,
    titleFill: 'black',
    titleFontSize: 12,
    titleTextBaseline: 'middle',
    lineLineWidth: 1,
    lineStroke: 'black',
    lineArrow: new Path({
      style: {
        path: 'M 10,10 L -10,0 L 10,-10 L0,0 L10,10Z',
        anchor: '0.5 0.5',
        fill: 'black',
        transformOrigin: 'center',
      },
    }),
    lineArrowOffset: 15,
    lineArrowSize: 0.6,
    tickStroke: 'black',
    tickLength: 5,
    tickLineWidth: 1,
    tickStrokeOpacity: 0.65,
    labelSpacing: 0,
    labelDirection: 'positive',
    labelAlign: 'parallel',
    labelTransforms: [
      // { type: 'rotate', optionalAngles: [0, 45, 90] },
      // { type: 'ellipsis', suffix: '...', minLength: 14, maxLength: 160 },
      // { type: 'hide' },
    ],
    gridType: 'segment',
    gridConnect: 'line',
    gridDirection: 'positive',
    gridLength: 0,
    gridControlAngles: [],
  },
};

export const ARC_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_CFG, {
  style: {
    type: 'arc',
  },
});

export const HELIX_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_CFG, {
  style: {},
});
