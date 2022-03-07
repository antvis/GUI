import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { SliderAxis } from '../../../../src/ui/timeline/slideraxis';
import { CellAxis } from '../../../../src/ui/timeline/cellaxis';
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
// 2021年1月的日期数据
const date2 = new Array(15).fill(undefined).map((_, id) => ({ date: new Date(2021, 0, id).toLocaleString('zh-CN') }));
describe('play axis', () => {
  test('slider', () => {
    const slideraxis = new SliderAxis({
      style: {
        x: 5,
        y: 60,
        length: 300,
        timeData: date,
        tickCfg: {},
        selection: [date[0], date[5]],
      },
    });
    slideraxis.update({ timeData: date2, selection: [date2[1], date2[6]] });
    canvas.appendChild(slideraxis);
    expect(2).toBe(2);
  });
  test('cell', () => {
    const cellaxis = new CellAxis({
      style: {
        x: 20,
        y: 20,
        length: 300,
        timeData: date,
        tickCfg: {},
      },
    });
    cellaxis.update({ timeData: date2 });
    // console.log(cellaxis.background);
    canvas.appendChild(cellaxis);
    expect(1).toBe(1);
  });
});
