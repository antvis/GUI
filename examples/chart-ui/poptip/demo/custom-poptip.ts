import { Canvas, Rect } from '@antv/g';
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
  height: 600,
  renderer,
});

function getOffset(dom) {
  let parent = dom;
  let left = 0;
  let top = 0;
  while (parent) {
    left += parent.offsetLeft;
    top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return {
    left,
    top,
  };
}

// 移出之前创建的 poptip
Array.from(document.getElementsByClassName('poptip')).forEach((poptip) => poptip.remove());

const createPoptip = (position) => {
  return new Poptip({
    style: {
      position,
      style: {
        '.poptip': {
          width: '90px',
          height: '30px',
        },
      },
      text: position,
    },
  });
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

const poptips = {};

positions.forEach((position) => {
  poptips[position] = createPoptip(position);
});

const rect = new Rect({
  style: {
    x: 100,
    y: 50,
    width: 280,
    height: 120,
    fill: 'red',
  },
});
canvas.appendChild(rect);

// canvas 在屏幕中的位置
const canvasPosition = getOffset(document.getElementById('container'));
// rect 相对 canvas 的 xy
const rectPosition = rect.getPosition();

const positionX = canvasPosition.left + rectPosition[0];
const positionY = canvasPosition.top + rectPosition[1];
const { width, height } = rect.attributes;

positions.forEach((position) => {
  if (position === 'top') {
    poptips[position].update({
      container: {
        x: positionX + width / 2,
        y: positionY,
      },
    });
  } else if (position === 'left') {
    poptips[position].update({
      container: {
        x: positionX,
        y: positionY + height / 2,
      },
    });
  } else if (position === 'right') {
    poptips[position].update({
      container: {
        x: positionX + width,
        y: positionY + height / 2,
      },
    });
  } else if (position === 'bottom') {
    poptips[position].update({
      container: {
        x: positionX + width / 2,
        y: positionY + height,
      },
    });
  } else if (position === 'top-left') {
    poptips[position].update({
      container: {
        x: positionX,
        y: positionY,
      },
    });
  } else if (position === 'top-right') {
    poptips[position].update({
      container: {
        x: positionX + width,
        y: positionY,
      },
    });
  } else if (position === 'left-top') {
    poptips[position].update({
      container: {
        x: positionX,
        y: positionY,
      },
    });
  } else if (position === 'left-bottom') {
    poptips[position].update({
      container: {
        x: positionX,
        y: positionY + height,
      },
    });
  } else if (position === 'right-top') {
    poptips[position].update({
      container: {
        x: positionX + width,
        y: positionY,
      },
    });
  } else if (position === 'right-bottom') {
    poptips[position].update({
      container: {
        x: positionX + width,
        y: positionY + height,
      },
    });
  } else if (position === 'bottom-left') {
    poptips[position].update({
      container: {
        x: positionX,
        y: positionY + height,
      },
    });
  } else if (position === 'bottom-right') {
    poptips[position].update({
      container: {
        x: positionX + width,
        y: positionY + height,
      },
    });
  }
});

rect.addEventListener('mousemove', () => {
  positions.forEach((position) => {
    poptips[position].show();
  });
});

rect.addEventListener('mouseleave', () => {
  positions.forEach((position) => {
    poptips[position].hide();
  });
});
