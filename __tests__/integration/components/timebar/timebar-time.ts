import { it } from '../../utils';
import { Timebar } from '../../../../src/ui/timebar';

export const TimebarTime = it((group) => {
  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 20,
        type: 'time',
        height: 50,
        width: 500,
        values: [0.25, 0.75],
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 90,
        type: 'time',
        height: 50,
        width: 500,
        values: [0, 0.5],
        selectionType: 'value',
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 10,
        y: 160,
        type: 'time',
        height: 50,
        width: 500,
        values: [0, 0.5],
        selectionType: 'value',
        speed: 1.5,
        playing: true,
      },
    })
  );
});
