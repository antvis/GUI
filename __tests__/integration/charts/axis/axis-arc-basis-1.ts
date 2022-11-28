import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcBasis1 = () => {
  const group = new Group({
    name: '极坐标系-红色轴线-隐藏箭头',
  });

  group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        angleRange: [-135, 135],
        center: [150, 150],
        lineArrow: '',
        lineStroke: 'red',
        tickStroke: 'red',
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
