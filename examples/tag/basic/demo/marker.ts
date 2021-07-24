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
        x: 0,
        y: 30,
        fontSize: 30,
        fill: 'rgba(0, 0, 0, 0.85)',
      },
      active: {
        fill: 'lightgreen',
      },
    },
    marker: {
      symbol: 'circle',
      fill: 'orange',
      size: 12,
    },
  },
});
canvas.appendChild(tag);
