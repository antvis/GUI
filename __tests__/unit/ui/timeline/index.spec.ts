import { Canvas, DisplayObject } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Timeline } from '../../../../src/ui/timeline';
import { createCanvas } from '../../../utils/render';
import { TIME_DATA } from './data';

const canvas = createCanvas(800);
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
});
