import { Canvas } from '@antv/g';
import { Statistic } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 100,
  renderer,
});

const statistic = new Statistic({
  attrs: {
    x: 0,
    y: 0,
    title: {
      text: 'statistic',
      formatter: (text) => {
        return `formatter ${text}`;
      },
    },
    value: {
      text: '5123415515.151',
      formatter: (text) => {
        return text * 10;
      },
    },
  },
});

canvas.appendChild(statistic);
