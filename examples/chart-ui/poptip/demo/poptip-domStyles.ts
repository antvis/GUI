import { Canvas, Circle, Text } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Poptip } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 140,
  renderer,
});

const circle = new Circle({
  style: {
    x: 180,
    y: 50,
    r: 25,
    fill: 'red',
  },
});

const text = new Text({
  style: {
    x: 300,
    y: 50,
    fontFamily: 'PingFang SC',
    text: 'G.Text...',
    fontSize: 20,
    textBaseline: 'top',
    stroke: '#F04864',
    lineWidth: 5,
  },
});

canvas.appendChild(circle);
canvas.appendChild(text);

// G.Rect
const poptip = new Poptip({
  style: {
    domStyles: {
      '.gui-poptip.custom-poptip': {
        'border-radius': '4px',
      },
    },
    template: {
      container: `<div class="gui-poptip custom-poptip" ></div>`,
    },
    text: '隐藏信息',
  },
});

poptip.bind(circle, { follow: true });
poptip.bind(text, {
  arrowPointAtCenter: true,
});
