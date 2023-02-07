import { Group } from '@antv/g';
import { data } from '../../utils';
import { Axis } from '../../../../src/ui/axis';

export const AxisArcLabelRotate3 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        radius: 80,
        data: data(10),
        lineLineWidth: 5,
        tickLength: 10,
        labelSpacing: 15,
        angleRange: [-90, 270],
        center: [150, 150],
        labelTransform: 'rotate(0)',
      },
    })
  );

  return group;
};

AxisArcLabelRotate3.tags = ['极坐标系', '标签在内', '0度'];
