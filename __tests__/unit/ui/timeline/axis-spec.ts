import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-svg';
import { CellAxis } from '../../../../src/ui/timeline/playaxis';
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
// 2022年1月的日期数据
const date = new Array(20).fill(undefined).map((_, id) => ({ date: new Date(2022, 0, id).toLocaleString('zh-CN') }));
describe('play axis', () => {
  test('basic', () => {
    const cellaxis = new CellAxis({
      style: {
        x: 20,
        y: 20,
        length: 300,
        timeData: date,
        tickOptions: {
          style: {
            ticksThreshold: 4,
          },
        },
      },
    });

    canvas.appendChild(cellaxis);
    expect(1).toBe(1);
  });
});
