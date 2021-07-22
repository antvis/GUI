import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Countdown } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 400,
  height: 300,
  renderer,
});

const countdown = new Countdown({
  attrs: {
    x: 0,
    y: 0,
    title: {
      text: 'now countdown',
      style: {
        fontSize: 14, // 字体大小
        fill: '#00000073', // 颜色
      },
    },
    value: {
      text: 1000 * 60 * 60 * 24,
      style: {
        fontSize: 24,
        fill: '#000000d9',
      },
      format: 'D 天 H 小时 m 分钟 s 秒',
      dynamicTime: true,
    },
  },
});

canvas.appendChild(countdown);
