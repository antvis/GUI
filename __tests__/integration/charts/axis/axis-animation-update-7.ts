import { Group } from '@antv/g';
import { data } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';
import { Button } from '../../../../src/ui/button';

export const AxisAnimationEnter7 = () => {
  const group = new Group({
    style: {
      width: 260,
      height: 260,
    },
  });

  const axis = group.appendChild(
    new Axis({
      style: {
        type: 'arc',
        angleRange: [0, 360],
        center: [150, 150],
        radius: 80,
        tickLength: 10,
        labelSpacing: 10,
        labelFormatter: (d, i) => `${i}`,
        data: data(12),
      },
    })
  );

  function update() {
    axis.update({ data: data(6) });
  }

  function reset() {
    axis.update({ data: data(12) });
  }

  group.appendChild(
    new Button({
      style: {
        text: 'update',
        onClick: update,
      },
    })
  );

  group.appendChild(
    new Button({
      style: {
        x: 80,
        y: 0,
        text: 'reset',
        onClick: reset,
      },
    })
  );

  if (process.env.NODE_ENV === 'test') {
    update();
  }

  return group;
};

AxisAnimationEnter7.tags = ['坐标轴', '动画', '入场'];
