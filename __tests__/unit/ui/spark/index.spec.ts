import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Spark } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('spark', () => {
  test('basic line', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        width: 300,
        height: 50,
        smooth: false,
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [-10, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    const path0 = spark.getElementById('line-path-0').getAttribute('path');
    const y = (val) => {
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

    canvas.appendChild(spark);
    spark.destroy();
  });

  test('stack line', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        width: 300,
        height: 50,
        smooth: false,
        isStack: true,
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });

  test('stack curve', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        width: 300,
        height: 50,
        smooth: true,
        isStack: true,
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });

  test('area line', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        width: 300,
        height: 50,
        smooth: false,
        areaStyle: {
          lineWidth: 0,
          opacity: 0.5,
        },
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });

  test('area curve', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        width: 300,
        height: 50,
        smooth: true,
        areaStyle: {
          lineWidth: 0,
          opacity: 0.5,
        },
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });

  test('area stack line', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        width: 300,
        height: 50,
        smooth: false,
        isStack: true,
        areaStyle: {
          lineWidth: 0,
          opacity: 0.5,
        },
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });
  test('area stack curve', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        width: 300,
        height: 50,
        smooth: true,
        isStack: true,
        areaStyle: {
          lineWidth: 0,
          opacity: 0.5,
        },
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });

  test('basic bar', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        type: 'bar',
        width: 300,
        height: 50,
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });

  test('stack bar', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        type: 'bar',
        width: 300,
        height: 50,
        isStack: true,
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });
  test('group bar', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        type: 'bar',
        width: 300,
        height: 50,
        isGroup: true,
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });
  test('stack group bar', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        type: 'bar',
        width: 300,
        height: 50,
        isStack: true,
        isGroup: true,
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
  });

  test('color', () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const spark = new Spark({
      attrs: {
        x: 10,
        y: 10,
        type: 'bar',
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
        data: [
          [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
          [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
          [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
        ],
      },
    });

    canvas.appendChild(spark);
    spark.destroy();
    canvas.destroy();
  });
});
