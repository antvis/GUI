import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { Text } from '../../../../src/shapes';
import { data } from '../../utils';

export const AxisLinearLabelAlign14 = () => {
  const group = new Group({});
  group.appendChild(
    new Axis({
      style: {
        data: data(12),
        labelFormatter: (_: any, index: number) => new Text({ style: { text: '666' } }),
        type: 'linear',
        lineLineWidth: 5,
        tickLineWidth: 5,
        labelSpacing: 5,
        tickLength: 10,
        startPos: [100, 500],
        endPos: [100, 200],
      },
    })
  );

  return group;
};
