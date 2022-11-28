import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisGrid11 = () => {
  const group = new Group();

  group.appendChild(
    new Axis({
      style: {
        type: 'linear',
        startPos: [150, 50],
        endPos: [150, 200],
        data: data(6),
        showLine: false,
        showTick: false,
        showLabel: false,
        gridType: 'surround',
        gridClosed: true,
        gridLineWidth: 1,
        gridStroke: 'rgba(0,0,0,0.5)',
        gridCenter: [150, 200],
        gridControlAngles: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360],

        tickLength: 10,
        labelSpacing: 10,
      },
    })
  );

  return group;
};

AxisGrid11.tags = ['笛卡尔坐标系', '网格线', '无填充', '多边形', '环绕式'];