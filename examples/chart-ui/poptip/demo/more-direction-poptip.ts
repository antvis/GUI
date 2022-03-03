import { Canvas, Rect, Circle } from '@antv/g';
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
  height: 500,
  renderer,
});

// 移出之前创建的 poptip
Array.from(document.getElementsByClassName('poptip')).forEach((poptip) => poptip.remove());

const rect = new Rect({
  style: {
    x: 100,
    y: 40,
    width: 280,
    height: 110,
    fill: 'red',
  },
});

const rect2 = new Rect({
  style: {
    x: 100,
    y: 180,
    width: 280,
    height: 110,
    fill: 'red',
  },
});

const circle = new Circle({
  style: {
    x: 200,
    y: 340,
    r: 25,
    fill: 'red',
  },
});

canvas.appendChild(rect);
canvas.appendChild(rect2);
canvas.appendChild(circle);

const createPoptip = (target, position, arrowPointAtCenter, follow) => {
  const poptip = new Poptip({
    style: {
      position,
      style: {
        '.poptip': {
          width: '90px',
          height: '30px',
        },
      },
      text: position,
      // top left right bottom 方向定点
      arrowPointAtCenter,
      // 是否跟随鼠标
      follow,
    },
  });

  poptip.bind(target);
};

const positions = [
  'top',
  'top-left',
  'top-right',
  'right',
  'right-top',
  'right-bottom',
  'bottom',
  'bottom-left',
  'bottom-right',
  'left',
  'left-top',
  'left-bottom',
];
// 固定 12 个方向展示
positions.forEach((position) => {
  createPoptip(rect, position, true, false);
});

const positions2 = ['top', 'right', 'bottom', 'left'];

// 跟随平移展示
positions2.forEach((position) => {
  createPoptip(rect2, position, false, false);
});

// 跟随平移展示
positions2.forEach((position) => {
  createPoptip(rect2, position, false, false);
});

createPoptip(circle, 'top', false, true);
