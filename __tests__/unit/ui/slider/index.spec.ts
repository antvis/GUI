import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('slider', () => {
  test('basic', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 800,
      height: 300,
      renderer,
    });

    const slider = new Slider({
      attrs: {
        x: 50,
        y: 50,
        width: 600,
        height: 80,
        values: [0.4, 0.7],
        names: ['Abcas', 'Vxczxz'],
        backgroundStyle: {
          lineWidth: 2,
        },
        sparklineCfg: {
          // type: 'column',
          // isStack: true,
          data: [
            [1, 3, 2, -4],
            [5, 1, 5, -8],
          ],
          areaStyle: {
            opacity: 0.5,
          },
        },
      },
    });

    canvas.appendChild(slider);
  });
});
