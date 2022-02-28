import { Canvas, Rect, Circle, Text } from '@antv/g';
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

// 移出之前创建的 poptip
Array.from(document.getElementsByClassName('poptip')).forEach((poptip) => poptip.remove());

const rect = new Rect({
  style: {
    x: 0,
    y: 50,
    width: 100,
    height: 50,
    fill: 'red',
  },
});

canvas.appendChild(rect);

const circle = new Circle({
  style: {
    x: 180,
    y: 50,
    r: 30,
    fill: 'red',
  },
});

canvas.appendChild(circle);

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

canvas.appendChild(text);

const targetDom = document.createElement('div');

Object.assign(targetDom.style, {
  width: '100px',
  height: '50px',
  background: 'red',
});

document.getElementById('container').appendChild(targetDom);

// G.Rect
new Poptip({
  style: {
    target: rect,
    style: {
      '.poptip': {
        height: '30px',
      },
    },
    text: 'G.Rect 创建元素',
  },
});

// G.Circle
// 和占用空间对齐
circle.style.anchor = [0, 0];
new Poptip({
  style: {
    position: 'right',
    target: circle,
    style: {
      '.poptip': {
        height: '30px',
      },
    },
    text: 'G.Circle 创建元素',
  },
});

// G.Text
new Poptip({
  style: {
    position: 'top',
    target: text,
    style: {
      '.poptip': {
        height: '30px',
      },
    },
    text: 'G.Text 创建元素',
  },
});

// dom 目标
new Poptip({
  style: {
    target: targetDom,
    position: 'bottom',
    style: {
      '.poptip': {
        height: '30px',
      },
    },
    text: 'Dom 元素',
  },
});
