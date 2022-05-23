import { Timeline } from '../../../../src/ui/timeline';
import { SliderAxis } from '../../../../src/ui/timeline/sliderAxis';
import { createCanvas } from '../../../utils/render';
import { TIME_DATA } from './data';

const canvas = createCanvas(750, undefined, true);
describe('Timeline', () => {
  it('new Timeline({...})', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 20,
        height: 20,
        width: 500,
        data: TIME_DATA,
        type: 'slider',
        single: true,
      },
    });
    canvas.appendChild(timeline);
  });

  it('new SliderAxis({...})', () => {
    const sliderAxis = new SliderAxis({
      style: {
        x: 90,
        y: 120,
        length: 200,
        timeData: TIME_DATA,
        selection: 0,
      },
    });
    canvas.appendChild(sliderAxis);
  });
});
