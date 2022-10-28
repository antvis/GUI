import { Group } from '@antv/g';
import { axisWarper, data } from '../utils';

export const AxisArcLabelParallel = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'arc',
    radius: 80,
    data: data(6),
    lineLineWidth: 5,
    tickLength: 10,
    labelSpacing: 10,
  });

  createAxis({ angleRange: [-90, 270], center: [150, 150] });
  createAxis({ angleRange: [-90, 270], center: [400, 150], tickDirection: 'positive', labelDirection: 'negative' });
  createAxis({ angleRange: [-90, 270], center: [150, 400], tickDirection: 'negative', labelDirection: 'positive' });
  createAxis({ angleRange: [-90, 270], center: [400, 400], tickDirection: 'negative', labelDirection: 'negative' });

  return group;
};
