import { Group } from '@antv/g';
import { FixedTimeHandle } from '../../../../src/ui/timebar/handle';

export const TimebarHandle = () => {
  const group = new Group({});
  const handle = new FixedTimeHandle({ style: { cx: 10, cy: 10 } });
  group.appendChild(handle);
  return group;
};
