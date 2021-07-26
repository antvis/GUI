import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Marker, svg2marker, Tag } from '@antv/gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

// @ts-ignore
const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

Marker.registerSymbol(
  'star',
  svg2marker(
    `<svg height="512" width="512" viewport="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M480 207H308.6L256 47.9 203.4 207H32l140.2 97.9L117.6 464 256 365.4 394.4 464l-54.7-159.1L480 207zM362.6 421.2l-106.6-76-106.6 76L192 298.7 84 224h131l41-123.3L297 224h131l-108 74.6 42.6 122.6z"/></svg>`
  )
);

Marker.registerSymbol(
  'clock',
  svg2marker(
    `<svg height="512" width="512" viewport="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path></svg>`
  )
);

canvas.appendChild(
  new Tag({
    attrs: {
      x: 0,
      y: 10,
      text: 'Hello',
      textStyle: {
        default: {
          x: 0,
          y: 30,
          fontSize: 12,
          fill: '#fa8c16',
        },
      },
      marker: {
        symbol: 'star',
        x: 8,
        y: 7,
        fill: '#fa8c16',
        size: 14,
      },
      backgroundStyle: {
        default: {
          stroke: '#ffd591',
          fill: '#fff7e6',
        },
      },
    },
  })
);
canvas.appendChild(
  new Tag({
    attrs: {
      x: 0,
      y: 40,
      text: 'Hello',
      textStyle: {
        default: {
          x: 0,
          y: 30,
          fontSize: 12,
          fill: '#000',
          fillOpacity: 0.85,
        },
      },
      marker: {
        symbol: 'triangle',
        x: 0,
        y: 0,
        fill: '#000',
        fillOpacity: 0.85,
        size: 6,
      },
      backgroundStyle: {
        default: {
          stroke: '#d9d9d9',
          fill: '#fafafa',
        },
      },
    },
  })
);
