import 'babel-polyfill';
import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Marker, svg2marker } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('marker', () => {
  test('basic', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 200,
      height: 200,
      renderer,
    });

    const marker = new Marker({
      attrs: {
        x: 50,
        y: 50,
        symbol: 'circle',
        fill: '#F04864',
      },
    });

    canvas.appendChild(marker);

    expect(marker.getPathShape().getBounds().center[0]).toEqual(100);
    expect(marker.getPathShape().getBounds().getMax()[0]).toEqual(117);
    expect(marker.getPathShape().getBounds().getMin()[0]).toEqual(83);
  });

  test('customize svg', () => {
    const FALL = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1559121813567" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17295" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M925.9 804l-24-199.2c-0.8-6.6-8.9-9.4-13.6-4.7L829 659.5 557.7 388.3c-6.3-6.2-16.4-6.2-22.6 0L433.3 490 156.6 213.3c-3.1-3.1-8.2-3.1-11.3 0l-45 45.2c-3.1 3.1-3.1 8.2 0 11.3L422 591.7c6.2 6.3 16.4 6.3 22.6 0L546.4 490l226.1 226-59.3 59.3c-4.7 4.7-1.9 12.8 4.7 13.6l199.2 24c5.1 0.7 9.5-3.7 8.8-8.9z" p-id="17296"></path></svg>`;
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 200,
      height: 200,
      renderer,
    });

    const marker = new Marker({
      attrs: {
        x: 50,
        y: 50,
        symbol: svg2marker(FALL),
        fill: '#F04864',
      },
    });

    canvas.appendChild(marker);
    expect(marker.getPathShape().getBounds().center[0]).toBeCloseTo(100);
  });
});
