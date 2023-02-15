import { Group } from '@antv/g';
import { data } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisAnimationUpdate5 = () => {
  const group = new Group({
    style: {
      width: 250,
      height: 250,
    },
  });

  const axis = group.appendChild(
    new Axis({
      style: {
        animate: { duration: process.env.NODE_ENV === 'test' ? 100 : 1000 },
        data: data(12),
        labelFormatter: (d: any, i: number) => `${i}`,
        style: {
          center: [150, 150],
          endAngle: 360,
          labelSpacing: 10,
          radius: 80,
          startAngle: 0,
          tickLength: 10,
          type: 'arc',
        },
      },
    })
  );

  function update() {
    axis.update({ style: { startAngle: 0, endAngle: 180 } });
  }

  function reset() {
    axis.update({ style: { startAngle: 0, endAngle: 360 } });
  }

  group.appendChild(
    new Button({
      style: {
        style: {
          text: 'update',
          onClick: update,
        },
      },
    })
  );

  group.appendChild(
    new Button({
      style: {
        style: {
          x: 80,
          y: 0,
          text: 'reset',
          onClick: reset,
        },
      },
    })
  );

  if (process.env.NODE_ENV === 'test') {
    update();
  }

  return group;
};

AxisAnimationUpdate5.tags = ['坐标轴', '动画', '更新'];
