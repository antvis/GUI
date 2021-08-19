import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { get } from '@antv/util';
import { Switch } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('switch', () => {
  const div = createDiv();

  const canvas = new Canvas({
    container: div,
    width: 300,
    height: 300,
    renderer,
  });

  const switchShape = new Switch({
    style: {
      x: 40,
      y: 50,
      defaultChecked: false,
    },
  });

  canvas.appendChild(switchShape);

  test('basic', () => {
    const { x, y, defaultChecked } = switchShape.attributes;

    expect(x).toBe(40);
    expect(y).toBe(50);
    expect(defaultChecked).toBe(false);
    expect(switchShape.getChecked()).toBe(false);
    expect(get(switchShape.children[1], 'attributes.fill')).toBe('#00000040');

    switchShape.addClick();
    expect(defaultChecked).toBe(false);
    expect(switchShape.getChecked()).toBe(true);
    expect(get(switchShape.children[1], 'attributes.fill')).toBe('#1890FF');
  });

  test('checked switch', () => {
    switchShape.update({
      defaultChecked: false,
      checked: true,
    });

    expect(switchShape.getChecked()).toBe(true);

    switchShape.addClick();
    expect(switchShape.getChecked()).toBe(true);
  });

  test('children switch', () => {
    switchShape.update({
      checked: true,
      checkedChildren: {
        text: '开启 √',
        marker: {
          symbol: 'check',
          x: 0,
          y: 0,
          stroke: '#fff',
          size: 10,
        },
      },
      unCheckedChildren: {
        text: '关闭 ×~~',
        marker: {
          symbol: 'stop',
          x: 0,
          y: 0,
          stroke: '#fff',
          size: 10,
        },
      },
    });

    expect(switchShape.getShapeWidth()).toBeCloseTo(86, -1);
    expect(get(switchShape.children[1].children[1], 'config.name')).toBe('checkedChildren');
    switchShape.update({
      checked: false,
    });
    expect(switchShape.getShapeWidth()).toBeCloseTo(104, -1);
    expect(get(switchShape.children[1].children[1], 'config.name')).toBe('unCheckedChildren');
  });
});
