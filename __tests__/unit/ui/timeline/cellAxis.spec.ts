import { CellAxis } from '../../../../src/ui/timeline/cellAxis';
import { createCanvas } from '../../../utils/render';
import { TIME_DATA } from './data';

const canvas = createCanvas(750, undefined, true);
describe('Cell Axis', () => {
  it('new CellAxis({...}) should create a cell-axis', () => {
    const axis = new CellAxis({
      style: {
        x: 30,
        timeData: TIME_DATA,
        loop: true,
      },
    });
    canvas.appendChild(axis);

    axis.play();
  });

  it('new CellAxis({...}) should create a vertical cell-axis', () => {
    const axis = new CellAxis({
      style: {
        x: 30,
        y: 60,
        orient: 'vertical',
        timeData: TIME_DATA,
        selection: [0, 2],
        loop: true,
      },
    });
    canvas.appendChild(axis);

    axis.play();
  });
});
