import { Group, Circle } from '@antv/g';
import { Slider } from '../../../../src/ui/slider';

export const Slider11 = () => {
  const group = new Group();

  group.appendChild(
    new Slider({
      style: {
        showLabel: false,
        showHandle: false,
        style: {
          x: 10,
          y: 10,
          orientation: 'vertical',
          trackLength: 300,
          trackSize: 10,
          values: [0.25, 0.75],
          brushable: false,
          padding: 2,
          selectionRadius: 5,
          trackRadius: 5,
          trackFill: '#d8e8fb',
          trackOpacity: 0.5,
        },
      },
    })
  );

  return group;
};

Slider11.tags = ['缩略条', '迷你图', '滚动条', '垂直'];
