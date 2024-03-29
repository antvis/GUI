import { Group } from '@antv/g';
import { Text } from '../../../../src/shapes';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign11 = () => {
  const group = new Group({
    style: {
      width: 550,
      height: 100,
    },
  });
  const axis = group.appendChild(
    new Axis({
      style: {
        data: data(12),
        labelFormatter: (_: any, index: number) => new Text({ style: { text: '666' } }),
        type: 'linear',
        lineLineWidth: 5,
        tickLineWidth: 5,
        labelSpacing: 5,
        tickLength: 10,
        startPos: [50, 50],
        endPos: [500, 50],
      },
    })
  );

  return group;
};
