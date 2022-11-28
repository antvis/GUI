import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcBasis3 = () => {
  const group = new Group({
    name: '极坐标系-刻度朝外-标签在外',
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        angleRange: [-135, 135],
        center: [150, 150],
        tickDirection: 'negative',
        labelDirection: 'negative',
        lineStroke: 'green',
        radius: 80,
        lineLineWidth: 5,
        tickLength: 10,
        labelSpacing: 10,
        data: data(12),
      },
    })
  );

  return group;
};
