import { Canvas } from '@antv/g';
import { Arrow } from '../../src';

describe('gui arrow', () => {
  const div = document.createElement('div');
  div.id = 'canvasContainer';
  document.body.appendChild(div);

  const canvas = new Canvas({
    containerId: 'canvasContainer',
    renderer: 'svg',
    width: 400,
    height: 400,
  });

  it('initialize', () => {
    const arrow1 = new Arrow({
      position: { x: 50, y: 50 },
      width: 20,
      height: 20,
      direction: 'down',
      shapeAttrs: {
        fill: '#CCCCCC',
      },
    });

    const arrow2 = new Arrow({
      position: { x: 100, y: 50 },
      shapeAttrs: {
        fill: 'green',
      },
    });

    const arrow3 = new Arrow({
      position: { x: 150, y: 50 },
      direction: 'up',
      shapeAttrs: {
        fill: 'blue',
      },
    });

    const arrow4 = new Arrow({
      position: { x: 200, y: 50 },
      direction: 'left',
      shapeAttrs: {
        fill: 'red',
        cursor: 'pointer',
      },
    });

    canvas.add(arrow1);
    canvas.add(arrow2);
    canvas.add(arrow3);
    canvas.add(arrow4);

    arrow4.on('click', (e) => {
      console.log(e);
    });

    canvas.draw();
  });
});
