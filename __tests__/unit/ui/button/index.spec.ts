import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Button } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('button', () => {
  test('basic', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const icon = new Button({
      attrs: {
        x: 50,
        y: 50,
        text: 'button',
        type: 'primary',
        size: 'large',
        ellipsis: true,
        disabled: true,
      },
    });

    canvas.appendChild(icon);
  });
});
