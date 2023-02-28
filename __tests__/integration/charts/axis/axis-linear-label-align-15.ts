import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { Text } from '../../../../src/ui/text';
import { data } from '../../utils';

export const AxisLinearLabelAlign15 = () => {
  const group = new Group({});
  group.appendChild(
    new Axis({
      style: {
        data: data(12),
        labelFormatter: (_: any, index: number) => new Text({ style: { text: '666' } }),
        style: {
          type: 'linear',
          lineLineWidth: 5,
          tickLineWidth: 5,
          labelSpacing: 5,
          tickLength: 10,
          startPos: [50, 100],
          endPos: [450, 500],
        },
      },
    })
  );

  return group;
};
