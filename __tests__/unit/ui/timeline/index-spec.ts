import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Timeline } from '../../../../src/ui/timeline';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});
const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 600,
  height: 600,
  renderer,
});

const canvas2 = new Canvas({
  container: div,
  width: 600,
  height: 600,
  renderer,
});

// 2022年1月的日期数据
const date = new Array(20).fill(undefined).map((_, id) => ({ date: new Date(2022, 0, id).toLocaleString('zh-CN') }));

describe('timeline layout cell', () => {
  test('left', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 60,
        height: 20,
        width: 500,
        data: date,
        orient: {
          layout: 'row',
          controlButtonAlign: 'left',
        },
        onSelectionChange: console.log,
      },
    });
    canvas.appendChild(timeline);
  });
  test('normal', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 150,
        height: 20,
        width: 500,
        data: date,
        orient: {
          layout: 'row',
          controlButtonAlign: 'normal',
        },
      },
    });
    canvas.appendChild(timeline);
  });
  test('right', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 250,
        height: 20,
        width: 500,
        data: date,
        orient: {
          layout: 'row',
          controlButtonAlign: 'right',
        },
      },
    });
    canvas.appendChild(timeline);
  });
  test('normal column', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 350,
        height: 20,
        width: 500,
        data: date,
        orient: {
          layout: 'col',
          controlButtonAlign: 'normal',
        },
      },
    });
    canvas.appendChild(timeline);
  });
});

describe('timeline slider', () => {
  test('left', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 60,
        height: 20,
        width: 500,
        data: date,
        type: 'slider',
        orient: {
          layout: 'row',
          controlButtonAlign: 'left',
        },
      },
    });
    canvas2.appendChild(timeline);
  });
  test('normal', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 150,
        height: 20,
        width: 500,
        data: date,
        type: 'slider',
        sliderAxisCfg: {
          selection: [date[0].date, date[7].date],
        },
        orient: {
          layout: 'row',
          controlButtonAlign: 'normal',
        },
        onSelectionChange: console.log,
      },
    });
    canvas2.appendChild(timeline);
  });
  test('right', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 250,
        height: 20,
        width: 500,
        data: date,
        type: 'slider',
        orient: {
          layout: 'row',
          controlButtonAlign: 'right',
        },
      },
    });
    canvas2.appendChild(timeline);
  });
  test('normal column', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 350,
        height: 20,
        width: 500,
        data: date,
        type: 'slider',
        orient: {
          layout: 'col',
          controlButtonAlign: 'normal',
        },
      },
    });
    canvas2.appendChild(timeline);
  });
});
