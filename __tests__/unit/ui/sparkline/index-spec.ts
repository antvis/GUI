import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Sparkline } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer();

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 300,
  height: 300,
  renderer,
});

const sparkline = new Sparkline({
  data: [
    [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
    [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
    [-10, 3, 4, 10, 15, 13, 3, 3, 10, 12],
  ],
  style: {
    x: 10,
    y: 10,
    type: 'line',
    width: 300,
    height: 50,
    smooth: false,
  },
});
canvas.appendChild(sparkline);

describe('sparkline', () => {
  test('basic line', async () => {
    // @ts-ignore
    const path0 = sparkline.sparkShape.linesGroup.children[0].attr('path');
    const y = (val: number) => {
      return (1 - (val + 10) / 25) * 50;
    };
    expect(path0[0][1]).toBe(0);
    expect(path0.slice(-1)[0][1]).toBe(300);
    expect(path0[4][2]).toBe(0);
    expect(path0[1][2]).toBe(y(2));
    expect(path0[2][2]).toBe(y(3));
    expect(path0[3][2]).toBe(y(4));
    expect(path0[4][2]).toBe(y(15));
    expect(path0[5][2]).toBe(y(10));
  });

  test('stack line', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
      style: { x: 10, y: 10, type: 'line', width: 300, height: 50, smooth: false, isStack: true },
    });
  });

  test('stack curve', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
      style: { x: 10, y: 10, type: 'line', width: 300, height: 50, smooth: true, isStack: true },
    });
  });

  test('area line', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
      style: { x: 10, y: 10, type: 'line', width: 300, height: 50, smooth: false, areaLineWidth: 0, areaOpacity: 0.5 },
    });
  });

  test('area curve', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
      style: { x: 10, y: 10, type: 'line', width: 300, height: 50, smooth: true, areaLineWidth: 0, areaOpacity: 0.5 },
    });
  });

  test('area stack line', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
      style: {
        x: 10,
        y: 10,
        type: 'line',
        width: 300,
        height: 50,
        smooth: false,
        isStack: true,
        areaLineWidth: 0,
        areaOpacity: 0.5,
      },
    });
  });

  test('area stack curve', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
      style: {
        x: 10,
        y: 10,
        type: 'line',
        width: 300,
        height: 50,
        smooth: true,
        isStack: true,
        areaLineWidth: 0,
        areaOpacity: 0.5,
      },
    });
  });

  test('basic bar', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
      style: { x: 10, y: 10, type: 'column', width: 300, height: 50 },
    });
  });

  test('stack bar', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, -10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, -15, 13, 3, 3, -10, 12],
      ],
      style: { x: 10, y: 10, type: 'column', width: 300, height: 50, isStack: true },
    });
  });

  test('group bar', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
      style: { x: 10, y: 10, type: 'column', width: 300, height: 50, isStack: false, isGroup: true },
    });
  });

  test('stack group bar', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
      style: { x: 10, y: 10, type: 'column', width: 300, height: 50, isStack: true, isGroup: true },
    });
  });

  test('color', () => {
    sparkline.update({
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, -13, 3, 3, 10, 12],
      ],
      style: {
        x: 10,
        y: 10,
        type: 'column',
        width: 300,
        height: 50,
        isStack: true,
        isGroup: true,
        color: [
          '#678ef2',
          '#7dd5a9',
          '#616f8f',
          '#edbf45',
          '#6c5ff0',
          '#83c6e8',
          '#8c61b4',
          '#f19d56',
          '#479292',
          '#f19ec2',
        ],
      },
    });
  });

  test('destroy', () => {
    sparkline.destroy();
    canvas.destroy();
  });
});
