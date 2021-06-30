import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Spark } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('spark', () => {
  test('basic', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 0,
        y: 0,
        width: 300,
        height: 40,
        // smooth: false,
        // isStack: false,
        data: [
          // [1, 2, 3, 4, 15, -10, 5, 4, 3, 1],
          [0, 0, 10, 3, 10, 6, 10, 1, 5, 1],
          // [-1, 2, 3, 2, 15, -13, 3, 3, 2, 10],
        ],
      },
    });

    canvas.appendChild(spark);
  });
});
