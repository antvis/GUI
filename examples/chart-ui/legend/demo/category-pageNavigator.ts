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

function createCategory(x, y, pageNavigator, title) {
  const category = new Category({
    style: {
      x,
      y,
      title: {
        content: title,
      },
      items: [
        { name: 'Chrome', value: '7.08%' },
        { name: 'IE', value: '5.41%' },
        { name: 'QQ', value: '5.35%' },
        { name: 'Firefox', value: '1.23%' },
        { name: 'Microsoft Edge', value: '3.51%' },
        { name: '360', value: '2.59%' },
        { name: 'Opera', value: '0.87%' },
        { name: 'Sogou', value: '1.06%' },
        { name: 'Others', value: '0.59%' },
      ].map(({ name, value }) => {
        return { name, value, id: name, state: 'selected' };
      }),
      spacing: [10, 10],
      maxItemWidth: 160,
      orient: 'horizontal',
      maxWidth: 300,
      autoWrap: false,
      pageNavigator,
    },
  });

  canvas.appendChild(category);
}

// 替换 分页器 marker
createCategory(
  10,
  10,
  {
    button: {
      position: 'bottom',
      prev: {
        marker: 'diamond',
        markerStyle: {
          default: {
            fill: 'red',
            size: 15,
          },
        },
      },
      next: {
        marker: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
        markerStyle: {
          default: {
            fill: 'green',
            size: 10,
          },
        },
      },
    },
  },
  '替换 分页器 marker'
);

const cfg = {
  width: 105,
  height: 20,
  buttonStyle: {
    default: {
      lineWidth: 1,
      fill: '#fff',
      stroke: '#000',
    },
    disabled: {
      fill: '#fff',
      lineWidth: 1,
      stroke: '#8c8c8c',
    },
  },
  textStyle: {
    default: {
      fill: '#000',
    },
  },
};

// 替换 分页器 button
createCategory(
  120,
  120,
  {
    button: {
      position: 'left-right',
      prev: {
        text: 'Left Button',
        ...cfg,
      },
      next: {
        markerAlign: 'right',
        text: 'Right Button',
        ...cfg,
      },
    },
  },
  '替换 分页器 button'
);
