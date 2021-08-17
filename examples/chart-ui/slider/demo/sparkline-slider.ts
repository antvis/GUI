import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 300,
  renderer,
});

const slider = new Slider({
  style: {
    x: 50,
    y: 50,
    width: 400,
    height: 40,
    values: [0.3, 0.7],
    names: ['leftVal', 'rightVal'],
    sparkline: {
      // type: 'column',
      data: [
        [1, 3, 2, -4, 1, 3, 2, -4],
        [5, 1, 5, -8, 5, 1, 5, -8],
      ],
    },
  },
});

canvas.appendChild(slider);
