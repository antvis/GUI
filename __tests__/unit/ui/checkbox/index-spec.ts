import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Checkbox } from '../../../../src/ui/checkbox';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});
const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 500,
  height: 500,
  renderer,
});
describe('checkbox', () => {
  test('basic', async () => {
    const checkbox = new Checkbox({
      style: {
        x: 50,
        y: 10,
        label: { text: 'label text' },
      },
    });
    canvas.appendChild(checkbox);
    const {
      x,
      y,
      label: { text, spacing },
      checked,
    } = checkbox.attributes;
    expect(checkbox.getPosition()[0]).toBe(50);
    expect(checkbox.getPosition()[1]).toBe(10);
    expect(x).toBe(50);
    expect(y).toBe(10);
    expect(text).toBe('label text');
    expect(spacing).toBe(4);
    expect(checked).toBe(false);
    const { label } = checkbox;
    const labelX = label.getAttribute('x');
    expect(labelX).toBe(16);
  });

  test('check', async () => {
    const checkbox = new Checkbox({
      style: {
        x: 10,
        y: 20,
        label: { text: 'label text' },
        style: {
          default: {
            fill: '#ffefff',
            stroke: '#eeeeee',
            radius: 3,
          },
          selected: {
            fill: '#00dd00',
            stroke: '#dddddd',
          },
        },
      },
    });

    canvas.appendChild(checkbox);
    const { style } = checkbox.attributes;
    expect(style!.default!.fill).toBe('#ffefff');
    expect(style!.default!.stroke).toBe('#eeeeee');
    expect(style!.default!.radius).toBe(3);
    let { checked } = checkbox.attributes;
    expect(checked).toBe(false);
    checkbox.update({ checked: true });
    checked = checkbox.attributes.checked;
    expect(checked).toBe(true);
  });
});
