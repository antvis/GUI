import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Spark } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const spark = new Spark({
  attrs: {
    x: 10,
    y: 10,
    type: 'bar',
    width: 300,
    height: 40,
    data: [
      [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
      [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
      [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
    ],
  },
});

canvas.appendChild(spark);
