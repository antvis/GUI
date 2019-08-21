import Arrow from '../../src/arrow/index';
import { Canvas } from '@antv/g';

describe('gui arrow', () => {
  const scrollBarDiv = document.createElement('div');
  scrollBarDiv.id = 'canvasContainer';
  document.body.appendChild(scrollBarDiv);

  const canvas = new Canvas({
    containerId: 'canvasContainer',
    renderer: 'svg',
    width: 400,
    height: 400,
  });

  it('initialize', () => {
    const arrow = new Arrow({
      x: 50,
      y: 50,
      width: 20,
      height: 20,
      direction: 'down',
      attrs: {
        fill: '#CCCCCC',
      },
    });
    canvas.add(arrow.shape);
    canvas.draw();
  });
});
