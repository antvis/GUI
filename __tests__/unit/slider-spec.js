import { Slider } from '../../src/';
import { Canvas } from '@antv/g';

describe('slider', () => {
  const div = document.createElement('div');
  div.id = 'canvas';
  document.body.appendChild(div);

  const canvas = new Canvas({
    containerId: 'canvas',
    renderer: 'svg',
    width: 400,
    height: 400,
  });

  it('initialize', () => {
    const slider = new Slider({
      x: 50,
      y: 50,
      width: 200,
      height: 16,

      start: 0.1,
      end: 0.9,
    });

    canvas.add(slider);

    canvas.draw();
  });
});
