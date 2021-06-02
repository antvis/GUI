import 'babel-polyfill';
import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Icon } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('icon', () => {
  test('basic', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const icon = new Icon({
      attrs: {
        type: 'submit',
        x: 50,
        y: 50,
        size: 16,
        fill: 'green',
        text: 'submit',
      },
    });

    canvas.appendChild(icon);

    // expect(icon.getBounds()).toEqual({});
  });
  3;
});
