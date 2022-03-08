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
        x: 20,
        y: 40,
        length: 300,
        timeData: date2,
        tickCfg: {},
        selection: [date2[1].date, date2[6].date],
        selectionStyle: {
          fill: '#ff00ee',
        },
        backgroundStyle: {
          fill: '#eeeeee',
        },
        onSelectionChange: console.log,
      },
    });
    slideraxis.update({ timeData: date, selection: [date[1].date, date[6].date] });
    canvas.appendChild(slideraxis);
    const { sliderBackground, sliderSelection, sliderTicks } = slideraxis;
    const { startPos, endPos } = sliderTicks.attributes;
    expect(sliderSelection.style.fill).toBe('#ff00ee');
    expect(sliderBackground.style.fill).toBe('#eeeeee');
    expect(sliderSelection.style.x).toBeCloseTo(
      ((endPos[0] - startPos[0]) * (1 - 0)) / (date.length - 1) + sliderBackground.style.radius,
      4
    );
    expect(sliderSelection.style.width).toBeCloseTo(((endPos[0] - startPos[0]) * (6 - 1)) / (date.length - 1), 4);
  });
  test('slider single', () => {
    const slideraxis = new SliderAxis({
      style: {
        single: true,
        x: 20,
        y: 90,
        length: 300,
        timeData: date2,
        tickCfg: {},
        selection: [date2[0].date],
        onSelectionChange: console.log,
      },
    });
    canvas.appendChild(slideraxis);
  });
  test('cell', () => {
    const cellaxis = new CellAxis({
      style: {
        x: 20,
        y: 150,
        length: 300,
        timeData: date2,
        tickCfg: {},
        selection: [date2[2].date, date2[7].date],
        onSelectionChange: console.log,
      },
    });
    cellaxis.update({ timeData: date, selection: [date[1].date, date[6].date] });
    canvas.appendChild(cellaxis);
    expect(1).toBe(1);
  });
  test('cell single', () => {
    const cellaxis = new CellAxis({
      style: {
        x: 20,
        y: 210,
        length: 300,
        timeData: date2,
        tickCfg: {},
        selection: [date2[2].date],
        onSelectionChange: console.log,
        single: true,
      },
    });
    canvas.appendChild(cellaxis);
    expect(1).toBe(1);
  });
});
