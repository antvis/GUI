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

const rect = new Rect({
  style: {
    x: 0,
    y: 50,
    width: 100,
    height: 50,
    fill: 'red',
  },
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
    margin: '8px 100px',
  });

  document.getElementById('container').appendChild(targetDom);

  return targetDom;
}

// G.Rect
const poptip = new Poptip({
  style: {
    text: '隐藏信息',
  },
});
poptip.bind(rect);
// G.Circle
poptip.bind(circle, { follow: true });
// circle.style.anchor = [0, 0];
// G.Text
poptip.bind(text, {
  html: () => '超长省略信息，超长省略信息',
  arrowPointAtCenter: true,
});
// dom 目标
poptip.bind(createDom('top-left'), { position: 'top-left' });
poptip.bind(createDom('left-top'), { position: 'left-top' });
poptip.bind(createDom('right-bottom'), { position: 'right-bottom' });
poptip.bind(createDom('right-center'), { position: 'right', arrowPointAtCenter: true });
poptip.bind(createDom('bottom-right'), { position: 'bottom-right' });
