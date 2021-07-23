import { Canvas } from '@antv/g';
import { Marker, svg2marker, Statistic } from '@antv/gui';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';

Marker.registerSymbol(
  'star',
  svg2marker(
    `<svg height="512" width="512" viewport="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M480 207H308.6L256 47.9 203.4 207H32l140.2 97.9L117.6 464 256 365.4 394.4 464l-54.7-159.1L480 207zM362.6 421.2l-106.6-76-106.6 76L192 298.7 84 224h131l41-123.3L297 224h131l-108 74.6 42.6 122.6z"/></svg>`
  )
);
const marker1 = new Marker({
  attrs: {
    symbol: 'star',
    y: -1,
    r: 20,
    fill: 'orange',
  },
});
const marker2 = new Marker({
  attrs: {
    symbol: 'star',
    x: 105,
    y: -1,
    r: 20,
    fill: 'orange',
  },
});
const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 100,
  renderer,
});

const statistic = new Statistic({
  attrs: {
    x: 0,
    y: 0,
    prefix: marker1,
    suffix: marker2,
    title: {
      text: 'marker statistic',
    },
    value: {
      text: '5123415515.151',
    },
  },
});

canvas.appendChild(statistic);