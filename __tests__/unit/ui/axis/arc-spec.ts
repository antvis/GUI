import { Arc } from '../../../../src';
import { createCanvas } from '../../../utils/render';
import type { StyleState as State } from '../../../../src/types';
import type { TickDatum } from '../../../../src/ui/axis/types';

const canvas = createCanvas(600, 'svg');

const arc = new Arc({
  style: { radius: 60, center: [150, 100] },
});

canvas.appendChild(arc);

function createData(values: number[], texts?: string[], states?: State[], ids?: string[]): TickDatum[] {
  return values.map((value, idx) => {
    const datum: TickDatum = { value };
    if (texts && texts.length > idx) datum.text = texts[idx];
    if (states && states.length > idx) datum.state = states[idx];
    if (ids && ids.length > idx) datum.id = ids[idx];
    return datum;
  });
}

const ticks = createData([0, 0.2, 0.4, 0.6, 0.8], ['A', 'B', 'C', 'D', 'E']);

describe('Arc axis', () => {
  it('new Arc({}) should create a arc axis', () => {
    const arc = new Arc({});
    canvas.appendChild(arc);

    expect(arc).toBeDefined();
    expect(arc.getElementsByName('axis-line').length).toBe(1);

    canvas.removeChild(arc);
    arc.destroy();
  });

  it('new Arc({}) update `startAngle` and `endAngle`', () => {
    arc.update({ endAngle: 270, radius: 50 });
    const axisLine = arc.getElementsByName('axis-line')[0];
    expect(axisLine.getAttribute('path')[0]).toEqual(['M', arc.style.center[0], arc.style.center[1]]);
    expect(axisLine.getAttribute('path')[1]).toEqual([
      'L',
      arc.style.center[0] + arc.style.radius,
      arc.style.center[1],
    ]);
  });

  it('new Arc({ style: { label } }) should create axis with labels', () => {
    arc.update({ endAngle: 360, ticks });

    const tickData = new Array(30).fill(0).map((tick, idx) => {
      const step = 1 / 30;
      return {
        value: idx * step,
        text: `周 ${String(idx)}`,
      };
    });
    const common = { startAngle: -90, endAngle: 270, radius: 100 };

    const arc2 = new Arc({ style: { ...common, center: [400, 120], ticks: tickData, label: { align: 'tangential' } } });
    canvas.appendChild(arc2);

    const arc3 = new Arc({
      style: {
        ...common,
        radius: 70,
        center: [150, 280],
        ticks: tickData,
        verticalFactor: -1,
        label: { autoRotate: false },
      },
    });
    canvas.appendChild(arc3);

    const arc4 = new Arc({
      style: {
        ...common,
        center: [400, 350],
        ticks: tickData,
        label: { align: 'radial', autoHideTickLine: false },
        verticalFactor: -1,
      },
    });
    canvas.appendChild(arc4);

    const arc5 = new Arc({
      style: {
        ...common,
        radius: 70,
        center: [150, 470],
        ticks: tickData,
        label: { align: 'radial', autoHideTickLine: false },
      },
    });
    canvas.appendChild(arc5);
  });

  // ----- 以下单测未进行调整 ----- //
  it('basic', async () => {
    arc.update({
      title: {
        content: '弧形轴',
        position: 'center',
        offset: [0, 50],
      },
      axisLine: {
        arrow: {
          start: {
            symbol: 'diamond',
            size: 10,
          },
          end: {
            symbol: 'axis-arrow',
            size: 10,
          },
        },
      },
      ticks: createData([0, 0.2, 0.4, 0.6, 0.8], ['A', 'B', 'C', 'D', 'E']),
      label: {
        alignTick: false,
        tickPadding: 20,
      },
      subTickLine: {
        count: 0,
      },
    });
    // @ts-ignore
    const [CMD1, CMD2, CMD3] = arc.axisLine.attr('path');

    // 圆心
    expect(CMD1).toStrictEqual(['M', 200, 200]);
    // 起点
    expect(CMD2).toStrictEqual(['L', 200, 100]);
    // 曲线
    expect(CMD3).toStrictEqual(['A', 100, 100, 0, 1, 1, 100, 200]);
  });

  it('arrow', async () => {
    // @ts-ignore
    expect(arc.axisEndArrow.getEulerAngles()).toBeCloseTo(-90);
  });

  it('ticks', async () => {
    // @ts-ignore
    const [[, x1, y1], [, x2, y2]] = arc.tickLinesGroup.children[0]!.attr('path');
    expect(x2 - x1).toBeCloseTo(0);
    expect(Math.abs(y2 - y1)).toBe(6);
  });

  it('autoRotate', async () => {
    // 默认布局下应该不会有碰撞
    arc.update({
      label: {
        formatter: () => {
          return '这是一段很长的文本';
        },
        rotate: 10,
        autoRotate: true,
        autoEllipsis: false,
        autoHide: false,
      },
    });
  });

  it('autoEllipsis', async () => {
    arc.update({
      label: {
        type: 'text',
        minLength: 20,
        maxLength: 50,
        autoRotate: false,
        autoEllipsis: true,
        autoHide: false,
      },
    });
    // @ts-ignore
    expect(arc.labelsGroup.children[0]!.attr('text').endsWith('...')).toBe(true);
  });

  it('autoHide', async () => {
    // 默认布局下应该不会有碰撞
    arc.update({
      startAngle: 0,
      endAngle: 360,
      label: {
        rotate: 0,
        alignTick: true,
        autoEllipsis: false,
        autoRotate: false,
      },
    });
  });
});
