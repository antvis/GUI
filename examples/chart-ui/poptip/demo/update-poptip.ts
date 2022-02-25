import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category, Poptip, getContainerOption, getPositionXY } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 200,
  renderer,
});

const items = [
  { id: '事例一', color: '#4982f8' },
  { id: '事例二', color: '#41d59c' },
  { id: '事例三', color: '#516587' },
  { id: '事例四', color: '#f9b41b' },
  { id: '事例五', color: '#624ef7' },
].map(({ id, color }) => {
  return { name: id, id, state: 'selected', color };
});

const category1 = new Category({
  style: {
    x: 10,
    y: 10,
    items,
    itemMarker: ({ color }) => {
      return {
        size: 10,
        marker: 'circle',
        style: {
          selected: {
            fill: color,
          },
        },
      };
    },
    spacing: [0, 0],
    maxItemWidth: 160,
  },
});

canvas.appendChild(category1);

const poptip1 = new Poptip({
  style: {
    position: 'top',
    style: {
      '.poptip': {
        height: '20px',
      },
      '.poptip-text': {
        padding: 0,
        margin: 0,
      },
    },
  },
});

// 可以通过 更新 target 方式
category1.itemsGroup.childNodes.forEach((item) => {
  item.addEventListener('mouseenter', () => {
    poptip1.update({
      target: item,
      template: {
        text: `<div class="poptip-text">${item.attributes.identify}</div>`,
      },
    });
  });
});

const category2 = new Category({
  style: {
    x: 10,
    y: 50,
    items,
    itemMarker: ({ color }) => {
      return {
        size: 10,
        marker: 'circle',
        style: {
          selected: {
            fill: color,
          },
        },
      };
    },
    spacing: [0, 0],
    maxItemWidth: 160,
  },
});

canvas.appendChild(category2);

const poptip2 = new Poptip({
  style: {
    position: 'bottom',
    style: {
      '.poptip': {
        height: '20px',
      },
      '.poptip-text': {
        padding: 0,
        margin: 0,
      },
    },
  },
});

// 可以通过 更新 x,y 的方式
category2.itemsGroup.childNodes.forEach((item) => {
  // poptip 内部获取 元素位置相对body方法。
  const { x, y, width, height } = getContainerOption(item);
  // 通过 方向确定 位置
  const { x: poptipX, y: poptipY } = getPositionXY({ x, y, width, height }, poptip2.position);

  item.addEventListener('mouseenter', () => {
    poptip2.update({
      container: {
        x: poptipX,
        y: poptipY,
      },
      template: {
        text: `<div class="poptip-text">${item.attributes.identify}</div>`,
      },
    });
    poptip2.show();
  });

  item.addEventListener('mouseleave', () => {
    poptip2.hide();
  });
});
