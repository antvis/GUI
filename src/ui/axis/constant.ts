import { deepMix } from '@antv/util';

export const AXIS_BASE_DEFAULT_OPTIONS = {
  attrs: {
    title: {
      content: '',
      style: {
        fill: 'black',
        fontSize: 20,
        fontWeight: 'bold',
      },
      position: 'start',
      offset: [0, 0],
      rotate: undefined,
    },
    line: {
      style: {
        fill: 'black',
        stroke: 'black',
        lineWidth: 2,
      },
      arrow: {
        start: {
          symbol: 'axis-arrow',
          size: 0,
        },
        end: {
          symbol: 'axis-arrow',
          size: 0,
        },
      },
    },
    ticks: [],
    ticksThreshold: 400,
    tickLine: {
      length: 10,
      style: {
        default: {
          stroke: 'black',
          lineWidth: 2,
        },
      },
      offset: 0,
      appendTick: false,
    },
    label: {
      type: 'text',
      style: {
        default: {
          fill: 'black',
          textAlign: 'center',
          textBaseline: 'middle',
        },
      },
      alignTick: true,
      formatter: (tick) => tick?.text || String(tick?.value || ''),
      offset: [0, 0],
      overlapOrder: ['autoRotate', 'autoEllipsis', 'autoHide'],
      margin: [1, 1, 1, 1],
      autoRotate: true,
      rotateRange: [0, 90],
      rotateStep: 5,
      autoHide: true,
      autoHideTickLine: true,
      minLabel: 0,
      autoEllipsis: true,
      ellipsisStep: ' ',
      minLength: 10,
      maxLength: Infinity,
    },
    subTickLine: {
      length: 6,
      count: 9,
      style: {
        default: {
          stroke: 'red',
          lineWidth: 2,
        },
      },
      offset: 0,
    },
    verticalFactor: 1,
  },
};

export const LINEAR_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_OPTIONS, {
  attrs: {
    type: 'linear',
  },
});

export const ARC_DEFAULT_OPTIONS = deepMix({}, AXIS_BASE_DEFAULT_OPTIONS, {
  attrs: {
    type: 'arc',
    startAngle: 0,
    endAngle: Math.PI * 2,
    center: [0, 0],
    label: {
      ...LINEAR_DEFAULT_OPTIONS.attrs.label,
      align: 'normal',
    },
  },
});
