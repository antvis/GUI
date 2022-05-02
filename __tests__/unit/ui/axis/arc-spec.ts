import { Path, Group } from '@antv/g';
import { Band as BandScale } from '@antv/scale';
import { Arc, ArcAxisStyleProps, deepAssign } from '../../../../src';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(600, 'svg');
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
const ticks = domain.map((d) => ({ value: scale.map(d), text: d }));

const createAxis = (options: Omit<ArcAxisStyleProps, 'container'> = { radius: 10, center: [50, 50] }) => {
  const axis = new Arc({
    style: deepAssign(
      {
        container: canvas.appendChild(new Group()),
      },
      options
    ),
  });
  return axis;
};

describe('Arc axis', () => {
  describe('new Arc({}) should create a arc axis', () => {
    const arc = createAxis({ center: [400, 400], radius: 60 });
    canvas.appendChild(arc);

    const axisLine = arc.querySelectorAll('.axis-line')[0] as Path;
    let tickLines = arc.getElementsByClassName('axis-tick') as Path[];

    it('Arc axis radius', () => {
      expect(arc).toBeDefined();
      arc.update({
        startAngle: 0,
        endAngle: 270,
        radius: 100,
        center: [150, 100],
        axisLine: { style: { lineWidth: 1, stroke: 'red' }, animate: false },
      });
      const axisLine = arc.querySelectorAll('.axis-line')[0] as Path;
      const { min, max } = axisLine.getBounds();
      expect(max[0] - min[0]).toBe(100 * 2);
      expect((max[0] + min[0]) / 2).toBe(150);
      expect((max[1] + min[1]) / 2).toBe(100);
    });

    it('Arc axis, ({ startAngle, endAngle })', () => {
      arc.update({ center: [400, 400], radius: 50 });
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

    it('Arc axis label, support ({ label: { formatter, style: { ... } }})', () => {
      const formatter = (d: any) => `hello_${d.text}`;
      arc.update({ ticks, label: { formatter, style: { fill: 'red', textAlign: 'center' } } });

      const axisLabels = arc.getElementsByClassName('axis-label');
      expect(axisLabels.length).toBe(ticks.length);
      expect(axisLabels.map((d) => d.style.text)).toEqual(ticks.map((d) => formatter(d)));

      const label0 = axisLabels[0];
      expect(label0.style.fill).toBe('red');

      arc.update({
        label: {
          style: (d: any, idx: number) => {
            return idx === 0 ? { textAlign: 'start' } : { textAlign: 'end' };
          },
        },
      });
      // Keep previous settings
      expect(label0.style.fill).toBe('red');
      expect(label0.style.textAlign).toBe('start');
      // set undefined, so that could use inferStyle
      arc.update({ label: { style: { textAlign: undefined } } });
    });

    it('Arc axis tickLine, support ({ tickLine: { len, style: { ... } }})', () => {
      arc.update({ ticks, tickLine: { len: 6, style: { lineWidth: 2, stroke: 'black' } } });

      tickLines = arc.getElementsByClassName('axis-tick') as Path[];
      expect(tickLines.length).toBe(ticks.length);
      const tickLine0 = tickLines[0];

      const { x1, y1, x2, y2 } = tickLine0.attr() as any;
      expect(+x2 - +x1).toBeCloseTo(0);
      expect(Math.abs(+y2 - +y1)).toBe(6);
      expect(tickLine0.style.stroke).toBe('black');
      expect(tickLine0.style.lineWidth).toBe(2);
    });

    it('Arc axis subTickLine, support ({ subTickLine: { len, count, style: { ... } }})', () => {
      arc.update({ ticks, subTickLine: { len: 4, count: 2, style: { stroke: 'blue', lineWidth: 3 } } });
      const subTickLines = arc.getElementsByClassName('axis-subtick') as Path[];

      expect(subTickLines.length).toBe(ticks.length * 2);
      const subTickLine0 = subTickLines[0];
      const { x1, y1, x2, y2 } = subTickLine0.attr() as any;
      expect(Math.abs(+y2 - +y1)).toBeCloseTo(4, 1);
      expect(subTickLine0.style.stroke).toBe('blue');
      expect(subTickLine0.style.lineWidth).toBe(3);
    });

    afterAll(() => {
      arc.destroy();
      canvas.removeChild(arc);
    });
  });

  describe('Axis label layout', () => {
    const common = { ticks, radius: 60, label: { formatter: (d: any) => `hello_${d.text}` } };

    const arc1 = createAxis(deepAssign({}, common, { center: [200, 140] }));
    canvas.appendChild(arc1);

    const arc3 = createAxis(
      deepAssign({}, common, { center: [200, 400], label: { align: 'tangential', autoHide: true } })
    );
    canvas.appendChild(arc3);

    it('AutoHide in `normal` align label', () => {
      const arc2 = createAxis(
        deepAssign({}, common, {
          center: [460, 140],
          label: {
            autoHideTickLine: true,
            autoHide: true,
            autoEllipsis: false,
            autoRotate: false,
          },
        })
      );
      canvas.appendChild(arc2);

      const labels = arc2.getElementsByClassName('axis-label');
      let visibleLabels = labels.filter((d) => d.style.visibility === 'visible');
      let visibleTickLines = arc2.getElementsByClassName('axis-tick').filter((d) => d.style.visibility === 'visible');
      expect(visibleLabels.length).toBeLessThan(arc1.getElementsByClassName('axis-label').length);
      expect(visibleTickLines.length).toBe(visibleLabels.length);

      expect(labels[0].style.visibility).toBe('visible');
      expect(labels[1].style.visibility).toBe('hidden');
      expect(labels[2].style.visibility).toBe('visible');

      arc2.update({ label: { autoHideTickLine: false } });

      visibleLabels = arc2.getElementsByClassName('axis-label').filter((d) => d.style.visibility === 'visible');
      visibleTickLines = arc2.getElementsByClassName('axis-tick').filter((d) => d.style.visibility === 'visible');
      expect(visibleTickLines.length).toBe(arc2.style!.ticks!.length);
      expect(visibleTickLines.length).toBeGreaterThan(visibleLabels.length);
    });

    it('AutoHide in radial align', () => {
      const arc4 = createAxis(
        deepAssign({}, common, {
          center: [460, 400],
          label: {
            align: 'radial',
            autoHide: { type: 'greedy' },
          },
        })
      );
      canvas.appendChild(arc4);
      expect(arc4.querySelectorAll('.axis-label').filter((d) => d.style.visibility === 'visible').length).toBe(
        common.ticks.length
      );
    });
  });
});
