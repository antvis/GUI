import { Canvas } from '@antv/g';
import { Countdown } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

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
      text: 'timer countdown',
      style: {
        fontSize: 14, // 字体大小
        fill: '#00000073', // 颜色
      },
    },
    value: {
      text: 1000 * 60 * 60 * 24 + 1000 * 60 * 40 + 1000 * 40 + 1500,
      style: {
        fontSize: 24,
        fill: '#000000d9',
      },
      format: 'D 天 HH 小时 mm 分钟 ss 秒 SSS 毫秒',
      dynamicTime: true,
    },
  },
});

canvas.appendChild(countdown);
