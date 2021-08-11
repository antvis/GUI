import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Scrollbar } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

const scrollbar = new Scrollbar({
  style: {
    x: 5,
    y: 50,
    orient: 'horizontal',
    value: 0.5,
    width: 200,
    height: 10,
    thumbLen: 30,
    trackStyle: {
      default: {
        lineWidth: 3,
        stroke: 'pink',
        opacity: 1,
        radius: 5,
      },
      active: {
        stroke: 'pink',
        opacity: '0.5',
      },
    },
    thumbStyle: {
      default: {
        fill: 'pink',
        opacity: 1,
      },
      active: {
        fill: 'pink',
        opacity: 0.5,
      },
    },
  },
});

canvas.appendChild(scrollbar);
