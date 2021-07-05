import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('marker', () => {
  test('basic', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const slider = new Slider({
      attrs: {
        x: 50,
        y: 50,
        width: 200,
        height: 40,
        values: [0.4, 0.7],
        names: ['A', 'V'],
      },
    });

    canvas.appendChild(slider);
  });
});
