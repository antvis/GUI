import { Canvas, Rect, Circle, Text } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Poptip } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// 移出之前创建的 poptip
Array.from(document.getElementsByClassName('poptip')).forEach((poptip) => poptip.remove());

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 270,
  renderer,
});

const rect = new Rect({
  style: {
    x: 0,
    y: 20,
    width: 100,
    height: 50,
    fill: 'red',
  },
});

const circle = new Circle({
  style: {
    x: 60,
    y: 120,
    r: 25,
    fill: 'red',
  },
});

const text = new Text({
  style: {
    x: 20,
    y: 200,
    fontFamily: 'PingFang SC',
    text: 'G.Text...',
    fontSize: 20,
    textBaseline: 'top',
    stroke: '#F04864',
    lineWidth: 5,
  },
});

canvas.appendChild(rect);
canvas.appendChild(circle);
canvas.appendChild(text);

function createDom(text = 'DOM 元素') {
  const targetDom = document.createElement('div');
  targetDom.innerHTML = text;

  Object.assign(targetDom.style, {
    width: '100px',
    height: '50px',
    border: '1px solid red',
    margin: '8px 10px',
  });

  document.getElementById('container').appendChild(targetDom);

  return targetDom;
}

// G.Rect
const poptip = new Poptip({
  style: {
    style: {
      '.poptip': {
        height: '30px',
      },
    },
    text: 'Tooltip 信息',
  },
});

// G.Rect
poptip.bind(rect);

// G.Circle
poptip.bind(circle, { follow: true });

// G.Text
poptip.bind(text, {
  html: () => '超长省略信息，超长省略信息',
  arrowPointAtCenter: true,
});

// dom 目标
poptip.bind(createDom('top-left'), { position: 'top-left' });
