import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection12 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(6),
        type: 'arc',
        radius: 80,
        lineLineWidth: 5,
        tickLength: 10,
        labelSpacing: 10,
        startAngle: -90,
        endAngle: 270,
        center: [150, 150],
        tickDirection: 'negative',
        labelDirection: 'negative',
        labelAlign: 'horizontal',
      },
    })
  );

  return group;
};

AxisArcDirection12.tags = ['极坐标系', '刻度朝外', '标签在外', '标签水平'];
