import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Time } from '@antv/scale';
import { Slider } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 500,
  renderer,
});
// 创建一个包围盒
const rect = new Rect({ style: { x: 20, y: 20, width: 460, height: 500, stroke: '#dfdfdf', lineWidth: 1 } });
canvas.appendChild(rect);

const generateTimeData = (count = 20) => {
  const scale = new Time({
    tickCount: count,
    range: [0, count],
    utc: true,
    domain: [new Date(2000, 0, 1), new Date(2000, 3, 1)],
  });
  const formatter = scale.getFormatter();

  return scale.getTicks().map((d) => ({ date: formatter(d), val1: Math.random() * 100, val2: Math.random() * 100 }));
};
const horizontalSlider = new Slider({
  style: {
    x: 60,
    y: 120,
    data: generateTimeData(40),
    length: 324,
    size: 20,
    selection: [4, 16],
    handleStyle: {
      size: 10,
      symbol: 'simple-slider-handle',
      stroke: '#5B8FF9',
      fill: '#5B8FF9',
      lineWidth: 1,
      active: {
        fill: '#5B8FF9',
      },
    },
    sparkline: {
      fields: ['val1', 'val2'],
    },
  },
});

rect.appendChild(horizontalSlider);
