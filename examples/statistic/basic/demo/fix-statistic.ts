import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Statistic } from '@antv/gui';

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

const statistic = new Statistic({
  attrs: {
    x: 0,
    y: 0,
    prefix: '前缀 ',
    suffix: ' 后缀',
    title: {
      text: 'fix statistic',
    },
    value: {
      text: '5550015.151',
    },
  },
});

canvas.appendChild(statistic);
