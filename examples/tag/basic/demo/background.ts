import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tag } from '@antv/gui';

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

const tag = new Tag({
  attrs: {
    text: '测试',
    padding: [4, 7],
    textStyle: {
      default: {
        fontSize: 18,
        fill: 'rgba(0, 0, 0, 0.85)',
      },
      active: {
        fontSize: 24,
        fill: 'lightgreen',
      },
    },
    background: {
      style: {
        default: {
          fill: 'rgb(250, 250, 250)',
          stroke: 'rgb(217, 217, 217)',
          lineWidth: 1,
        },
        active: {
          fill: 'rgba(0, 0, 0, 0.85)',
        },
      },
    },
  },
});
canvas.appendChild(tag);
