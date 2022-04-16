import { Path } from '@antv/g';
import { Band as BandScale } from '@antv/scale';
import { Arc } from '../../../../src';
import { createCanvas } from '../../../utils/render';
import type { StyleState as State } from '../../../../src/types';
import type { TickDatum } from '../../../../src/ui/axis/types';

const canvas = createCanvas(600);

const arc = new Arc({});
canvas.appendChild(arc);

const domain = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
];
const scale = new BandScale({ domain });
const ticks = domain.map((d, idx) => ({ value: scale.map(d), text: d }));

describe('Arc axis', () => {
  describe('new Arc({}) should create a arc axis', () => {
    const arc = new Arc({ style: { center: [0, 0], radius: 10 } });
    canvas.appendChild(arc);

    const axisLine = arc.getElementsByName('axis-line')[0] as Path;
    let tickLines = arc.getElementsByName('axis-tickLine') as Path[];

    it('Arc axis radius', () => {
      expect(arc).toBeDefined();
      arc.update({ endAngle: 270, radius: 100, center: [150, 100], axisLine: { style: { lineWidth: 1 } } });
      const axisLine = arc.getElementsByName('axis-line')[0] as Path;

      const { min, max } = axisLine.getBounds();

      expect(max[0] - min[0]).toBe(100 * 2);
      expect((max[0] + min[0]) / 2).toBe(150);
      expect((max[1] + min[1]) / 2).toBe(100);
    });

    it('Arc axis, ({ startAngle, endAngle })', () => {
      arc.update({ radius: 50 });
      expect(axisLine.style.path![0]).toEqual(['M', arc.style.center[0], arc.style.center[1]]);
      expect(axisLine.style.path![1]).toEqual(['L', arc.style.center[0] + arc.style.radius, arc.style.center[1]]);
    });

    it('Arc axis line, ({ axisLine: {} })', () => {
      expect(axisLine).toBeDefined();
      arc.update({ startAngle: -90, axisLine: { style: { stroke: 'red', lineWidth: 3 } } });
      expect(axisLine.style.stroke).toBe('red');
      expect(axisLine.style.lineWidth).toBe(3);
    });

    it('Arc axis line arrow', () => {
      // @ts-ignore
      // expect(arc.axisEndArrow.getEulerAngles()).toBeCloseTo(-90);
    });

    it('Arc axis ticks', () => {
      arc.update({ ticks, tickLine: { len: 6, style: { lineWidth: 2, stroke: 'black' } } });
      tickLines = arc.getElementsByName('axis-tickLine') as Path[];

      expect(tickLines.length).toBe(ticks.length);
      // const [[, x1, y1], [, x2, y2]] = tickLines[0].attr('path');
      // expect(+x2 - +x1).toBeCloseTo(0);
      // expect(Math.abs(+y2 - +y1)).toBe(6);
    });
  });

  describe.only('Axis label layout', () => {
    const common = { ticks };

    const arc1 = new Arc({ style: { center: [100, 100], radius: 60, ...common } });
    canvas.appendChild(arc1);

    const arc2 = new Arc({ style: { center: [300, 100], radius: 60, ...common, label: { align: 'radial' } } });
    canvas.appendChild(arc2);

    const arc3 = new Arc({ style: { center: [100, 300], radius: 60, ...common, label: { align: 'tangential' } } });
    canvas.appendChild(arc3);

    it('Axis label, ({ label: { align, position }})', () => {});

    //   it.skip('autoRotate', async () => {
    //     // 默认布局下应该不会有碰撞
    //     arc.update({
    //       label: {
    //         formatter: () => {
    //           return '这是一段很长的文本';
    //         },
    //         rotation: 10,
    //         autoRotate: true,
    //         autoEllipsis: false,
    //         autoHide: false,
    //       },
    //     });
    //   });

    //   it.skip('autoEllipsis', async () => {
    //     arc.update({
    //       label: {
    //         type: 'text',
    //         minLength: 20,
    //         maxLength: 50,
    //         autoRotate: false,
    //         autoEllipsis: true,
    //         autoHide: false,
    //       },
    //     });
    //     // @ts-ignore
    //     expect(arc.labelsGroup.children[0]!.attr('text').endsWith('...')).toBe(true);
    //   });

    //   it.skip('autoHide', async () => {
    //     // 默认布局下应该不会有碰撞
    //     arc.update({
    //       startAngle: 0,
    //       endAngle: 360,
    //       label: {
    //         rotation: 0,
    //         alignTick: true,
    //         autoEllipsis: false,
    //         autoRotate: false,
    //       },
    //     });
    //   });
    // });

    // it('new Arc({ style: { label } }) should create axis with labels', () => {
    //   arc.update({ endAngle: 360, ticks });

    //   const tickData = new Array(30).fill(0).map((tick, idx) => {
    //     const step = 1 / 30;
    //     return {
    //       value: idx * step,
    //       text: `周 ${String(idx)}`,
    //     };
    //   });
    //   const common = { startAngle: -90, endAngle: 270, radius: 100 };

    //   const arc2 = new Arc({ style: { ...common, center: [400, 120], ticks: tickData, label: { align: 'tangential' } } });
    //   canvas.appendChild(arc2);

    //   const arc3 = new Arc({
    //     style: {
    //       ...common,
    //       radius: 70,
    //       center: [150, 280],
    //       ticks: tickData,
    //       verticalFactor: -1,
    //       label: { autoRotate: false },
    //     },
    //   });
    //   canvas.appendChild(arc3);

    //   const arc4 = new Arc({
    //     style: {
    //       ...common,
    //       center: [400, 350],
    //       ticks: tickData,
    //       label: { align: 'radial', autoHideTickLine: false },
    //       verticalFactor: -1,
    //     },
    //   });
    //   canvas.appendChild(arc4);

    //   const arc5 = new Arc({
    //     style: {
    //       ...common,
    //       radius: 70,
    //       center: [150, 470],
    //       ticks: tickData,
    //       label: { align: 'radial', autoHideTickLine: false },
    //     },
    //   });
    //   canvas.appendChild(arc5);
    // });

    // // ----- 以下单测未进行调整 ----- //
    // it('basic', async () => {
    //   arc.update({
    //     title: {
    //       content: '弧形轴',
    //       titleAnchor: 'center',
    //     },
    //     axisLine: {
    //       arrow: {
    //         start: {
    //           symbol: 'diamond',
    //           size: 10,
    //         },
    //         end: {
    //           symbol: 'axis-arrow',
    //           size: 10,
    //         },
    //       },
    //     },
    //     ticks: createData([0, 0.2, 0.4, 0.6, 0.8], ['A', 'B', 'C', 'D', 'E']),
    //     label: {
    //       alignTick: false,
    //       tickPadding: 20,
    //     },
    //     subTickLine: {
    //       count: 0,
    //     },
    //   });
    //   // @ts-ignore
    //   const [CMD1, CMD2, CMD3] = arc.axisLine.attr('path');

    //   // 圆心
    //   expect(CMD1).toStrictEqual(['M', 200, 200]);
    //   // 起点
    //   expect(CMD2).toStrictEqual(['L', 200, 100]);
    //   // 曲线
    //   expect(CMD3).toStrictEqual(['A', 100, 100, 0, 1, 1, 100, 200]);
  });
});
