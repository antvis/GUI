import { it } from '../../utils';
import { Timebar } from '../../../../src/ui/timebar';

export const TimebarChart = it((group) => {
  const start = new Date('2023-08-01');
  const interval = 'day';
  const diff = 3600 * 24 * 1000;
  const data = [10, 2, 3, 4, 15, 10, 5, 0, 3, 1].map((value, index) => ({
    time: new Date(start.getTime() + index * diff),
    value,
  }));
  group.appendChild(
    new Timebar({
      style: {
        x: 0,
        y: 0,
        type: 'chart',
        height: 100,
        width: 500,
        interval,
        data,
        values: [0.25, 0.75],
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 0,
        y: 110,
        height: 100,
        width: 500,
        data,
        interval,
        values: [0, 0.4],
        type: 'chart',
        selectionType: 'value',
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 0,
        y: 220,
        height: 100,
        width: 500,
        data,
        interval,
        values: [0.1, 0.9],
        type: 'chart',
        chartType: 'column',
      },
    })
  );

  group.appendChild(
    new Timebar({
      style: {
        x: 0,
        y: 330,
        height: 100,
        width: 500,
        data,
        interval,
        values: [0, 0.6],
        type: 'chart',
        chartType: 'column',
        selectionType: 'value',
      },
    })
  );
});
