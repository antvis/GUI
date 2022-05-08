import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-svg';
import { Category } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 200,
  renderer,
});

const items1 = [
  { name: '事例一', color: '#4982f8' },
  { name: '事例二', color: '#41d59c' },
  { name: '事例三', color: '#516587' },
  { name: '事例四', color: '#f9b41b' },
  { name: '事例五', color: '#624ef7' },
];

const items2 = [
  { name: '1991', color: '#4982f8' },
  { name: '1992', color: '#41d59c' },
  { name: '1993', color: '#516587' },
  { name: '1994', color: '#f9b41b' },
  { name: '1995', color: '#624ef7' },
];

const items3 = [
  { name: 'Tokyo', color: '#4982f8' },
  { name: 'London', color: '#41d59c' },
];

const items4 = [
  { name: 'series1', color: '#4982f8' },
  { name: 'series2', color: '#41d59c' },
];

function createCategory(x, y, items, marker = 'circle', furtherOptions = {}) {
  canvas.appendChild(
    new Category({
      style: {
        x,
        y,
        title: { content: 'Legend title' },
        items,
        itemMarker: ({ color }) => {
          return {
            size: 10,
            marker: marker,
            style: {
              selected: {
                fill: color,
              },
            },
          };
        },
        spacing: [0, 0],
        maxItemWidth: 160,
        ...furtherOptions,
      },
    })
  );
}

createCategory(10, 10, items1, undefined, { maxWidth: 200 });
createCategory(10, 50, items2, 'square');
createCategory(10, 90, items3, undefined, {
  itemMarker: ({ color }) => {
    return {
      size: 12,
      marker: 'smooth',
      style: {
        default: { lineWidth: 2, fill: '#fff', stroke: '#d3d2d3' },
        selected: { lineWidth: 2, fill: '#fff', stroke: color },
      },
    };
  },
});
createCategory(10, 130, items4, undefined, {
  itemMarker: ({ color }) => {
    return {
      size: 12,
      marker: 'hvh',
      style: {
        default: { lineWidth: 2, fill: '#fff', stroke: '#d3d2d3' },
        selected: { lineWidth: 2, fill: '#fff', stroke: color },
      },
    };
  },
});
