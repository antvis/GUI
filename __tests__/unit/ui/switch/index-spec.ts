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
    expect(get(switchShape, 'backgroundShape.attributes.fill')).toBe('#00000040');
    expect(get(switchShape, 'rectStrokeShape.attributes.stroke')).toBe('#00000040');

    switchShape.addClick();
    expect(defaultChecked).toBe(false);
    expect(switchShape.getChecked()).toBe(true);
    expect(get(switchShape, 'backgroundShape.attributes.fill')).toBe('#1890FF');
    expect(get(switchShape, 'rectStrokeShape.attributes.stroke')).toBe('#1890FF');

    expect(get(switchShape, 'backgroundShape.attributes.lineWidth')).toBe(undefined);
    switchShape.addBackgroundLine();
    expect(get(switchShape, 'backgroundShape.attributes.lineWidth')).toBe(5);
    switchShape.clearBackgroundLine();
    expect(get(switchShape, 'backgroundShape.attributes.lineWidth')).toBe(0);
  });

  test('size switch', () => {
    expect(get(switchShape, 'backgroundShape.attributes.width')).toBe(44);
    expect(get(switchShape, 'backgroundShape.attributes.height')).toBe(22);
    expect(get(switchShape, 'backgroundShape.attributes.radius')).toBe(11);
    expect(get(switchShape, 'handleShape.attributes.width')).toBe(18);
    switchShape.update({
      defaultChecked: false,
      size: 'small',
    });
    expect(get(switchShape, 'backgroundShape.attributes.width')).toBe(28);
    expect(get(switchShape, 'backgroundShape.attributes.height')).toBe(16);
    expect(get(switchShape, 'backgroundShape.attributes.radius')).toBe(8);
    expect(get(switchShape, 'handleShape.attributes.width')).toBe(12);
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
        text: '关闭 ×',
        marker: {
          symbol: 'stop',
          x: 0,
          y: 0,
          stroke: '#fff',
          size: 10,
        },
      },
    });

    const width = switchShape.getShapeWidth();
    expect(get(switchShape, ['backgroundShape', 'children', '1', 'config', 'name'])).toBe('checkedChildren');
    switchShape.update({
      checked: false,
    });
    expect(switchShape.getShapeWidth()).toBeCloseTo(width, -1);
    expect(get(switchShape, ['backgroundShape', 'children', '1', 'config', 'name'])).toBe('unCheckedChildren');
  });
});
