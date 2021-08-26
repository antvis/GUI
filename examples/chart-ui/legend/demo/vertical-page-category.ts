import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 400,
  renderer,
});

const category = new Category({
  style: {
    x: 50,
    y: 50,
    orient: 'vertical',
    itemWidth: 160,
    maxHeight: 200,
    spacing: [10, 10],
    title: {
      content: '纵向',
    },
    items: [
      { name: 'Chrome', value: '7.08%', id: 'chrome', state: 'selected' },
      { name: 'IE', value: '5.41%', id: 'IE' },
      { name: 'QQ', value: '5.35%', id: 'QQ' },
      { name: 'Firefox', value: '1.23%', id: 'Firefox' },
      { name: 'Microsoft Edge', value: '3.51%' },
      { name: '360', value: '2.59%' },
      { name: 'Opera', value: '0.87%' },
      { name: 'Sogou', value: '1.06%' },
      { name: 'Others', value: '0.59%' },
    ],
    itemMarker: (item, idx) => {
      return {
        marker: ['diamond', 'circle', 'triangle'][idx % 3],
        size: 14,
        style: {
          default: {
            fill: idx % 2 === 0 ? '#ecbf41' : '#d94948',
          },
        },
      };
    },
    itemName: {
      style: {
        default: {
          fontSize: 14,
        },
      },
    },
    itemValue: {
      style: {
        default: {
          fontSize: 14,
        },
      },
    },
  },
});

canvas.appendChild(category);
