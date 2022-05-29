import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Time } from '@antv/scale';
import { Slider } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 400,
  height: 500,
  renderer,
});

const generateTimeData = (count = 20) => {
  const scale = new Time({
    tickCount: count,
    range: [0, count],
    utc: true,
    domain: [new Date(2000, 0, 1), new Date(2000, 3, 1)],
  });
  const formatter = scale.getFormatter();

  return scale.getTicks().map((d) => ({ value: formatter(d), val1: Math.random() * 100, val2: Math.random() * 100 }));
};
const data = generateTimeData(40);
const horizontalSlider = new Slider({
  style: {
    x: 20,
    y: 30,
    data,
    length: 324,
    size: 20,
    selection: [4, 16],
    handleStyle: {
      size: 10,
    },
    sparkline: {
      fields: ['val1', 'val2'],
    },
  },
});

canvas.appendChild(horizontalSlider);

const verticalSlider = new Slider({
  style: {
    x: 50,
    y: 120,
    data,
    orient: 'vertical',
    length: 224,
    size: 20,
    selection: [4, 16],
    handleStyle: {
      size: 10,
    },
    sparkline: {
      fields: ['val1', 'val2'],
    },
  },
});

canvas.appendChild(verticalSlider);
