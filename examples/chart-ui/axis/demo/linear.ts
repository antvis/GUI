import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Arc } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer,
});

const arc = new Arc({
  style: {
    startAngle: -90,
    endAngle: 270,
    radius: 150,
    center: [200, 200],
    title: {
      content: '圆弧坐标轴',
      position: 'center',
      offset: [0, 50],
    },
    ticks: new Array(60).fill(0).map((tick, idx) => {
      const step = 1 / 60;
      return {
        value: idx * step,
        text: String(idx),
      };
    }),
    label: {
      offset: [0, 20],
    },
    subTickLine: {
      count: 0,
    },
  },
});

canvas.appendChild(arc);
