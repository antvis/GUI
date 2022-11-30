import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection3 = () => {
  const group = new Group({
    name: '极坐标系-刻度朝内-标签在外-标签水平',
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        radius: 80,
        data: data(8),
        lineLineWidth: 5,
        tickLength: 10,
        labelSpacing: 15,
        angleRange: [-90, 270],
        center: [150, 150],
        tickDirection: 'positive',
        labelDirection: 'negative',
        labelAlign: 'horizontal',
      },
    })
  );

  return group;
};
