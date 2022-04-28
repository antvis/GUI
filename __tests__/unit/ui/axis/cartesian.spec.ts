import { Path, Group, DisplayObject } from '@antv/g';
import { Band as BandScale, Linear as LinearScale } from '@antv/scale';
import { Cartesian } from '../../../../src/ui/axis/linear';
import { ORIGIN } from '../../../../src/ui/axis/constant';
import { AxisTitle } from '../../../../src/ui/axis/types/shape';
import { createCanvas } from '../../../utils/render';
import { delay } from '../../../utils/delay';

const canvas = createCanvas(500, 'svg');

describe('new Cartesian({}) should create a linear axis', () => {
  const axis = new Cartesian({});

  it('Cartesian axis line, ({ axisLine: {} })', () => {
    expect(axis).toBeDefined();
    const axisLines = axis.getElementsByClassName('axis-line');
    expect(axisLines.length).toBe(1);

    axis.update({ startPos: [50, 450], endPos: [50, 50] });
    const [c1, c2] = axisLines[0].getAttribute('path');
    expect(c2[1] - c1[1]).toBe(0);
    expect(c2[2] - c1[2]).toBe(-400);
    expect(c1).toEqual(['M', 50, 450]);
    expect(c2).toEqual(['L', 50, 50]);
  });

  it('Cartesian axis line arrow, ({ axisLine: { arrow: { start, end } } })', () => {
    axis.update({
      axisLine: { arrow: { start: { symbol: 'axis-arrow', size: 8 }, end: { symbol: 'axis-arrow', size: 8 } } },
    });
    expect(axis).toBeDefined();

    let axisArrow = axis.getElementsByName('axis-arrow') as DisplayObject[];
    expect(axisArrow.length).toBe(2);
    expect(axisArrow[0].getEulerAngles()).toBeCloseTo(-90);

    axis.update({ axisLine: { arrow: { end: null } } });
    axisArrow = axis.getElementsByName('axis-arrow') as DisplayObject[];
    expect(axisArrow[1].style.size).toBe(0);
  });

  it.only('Cartesian axis ticks', () => {
    const domain = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    const scale = new BandScale({ domain });
    const bandWidth = scale.getBandWidth();
    const ticks = domain.map((d) => ({
      value: scale.map(d) + bandWidth / 2,
      text: d,
    }));

    // todo Should update normal in `svg` renderer
    axis.update({ ticks, axisLine: { style: { lineWidth: 0.5 } }, tickLine: { len: 6 } });
    const tickLines = axis.getElementsByClassName('axis-tickLine');
    const [[, x1, y1], [, x2, y2]] = tickLines[0].style.path;

    // expect(axis.getElementsByClassName('axis-line')[0].style.lineWidth).toBe(0.5);
    // expect(tickLines.length).toBe(ticks.length);
    // expect(x2 - x1).toBe(6);
  });

  afterAll(() => {
    axis.destroy();
    axis.remove();
  });
});

describe('Cartesian axis', () => {
  it('(subTickLine:{ count: 2 }) and ticks update', () => {
    const common = { subTickLine: { count: 2, style: { stroke: 'red', lineWidth: 1 } } };
    const tAxis = new Cartesian({
      style: { startPos: [100, 100], endPos: [400, 100], verticalFactor: -1, ...common },
    });
    const bAxis = new Cartesian({ style: { startPos: [100, 400], endPos: [400, 400], ...common } });
    const rAxis = new Cartesian({ style: { startPos: [400, 100], endPos: [400, 400], ...common } });
    const lAxis = new Cartesian({
      style: { startPos: [100, 100], endPos: [100, 400], verticalFactor: -1, ...common },
    });

    const domain = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    const scale = new BandScale({ domain });
    const ticks = domain.map((d) => ({
      value: scale.map(d) + scale.getBandWidth() / 2,
      text: d,
    }));

    tAxis.update({ ticks });
    lAxis.update({ ticks });
    bAxis.update({ ticks });
    rAxis.update({ ticks });
    canvas.appendChild(tAxis);
    canvas.appendChild(lAxis);
    canvas.appendChild(bAxis);
    canvas.appendChild(rAxis);

    const subTickLines = tAxis.querySelectorAll('.axis-subTickLine');
    expect(subTickLines.length).toBe(2 * (ticks.length - 1));
    expect(subTickLines[0].style.path[0]).toEqual(['M', 135.71428571428572, 100]);
    expect(subTickLines[0].style.stroke).toBe('red');
    expect(subTickLines[0].style.lineWidth).toBe(1);

    const newTicks = domain
      .map((d) => ({
        value: scale.map(d),
        text: d,
      }))
      .concat({ text: '', value: 1 });
    tAxis.update({ ticks: newTicks, label: { alignTick: false } });
  });

  // [todo]
  it('({ label:{ alignTick: false } })', () => {
    const common = { label: { alignTick: false } };
    const tAxis = new Cartesian({
      style: { startPos: [100, 100], endPos: [400, 100], verticalFactor: -1, ...common },
    });
    const bAxis = new Cartesian({ style: { startPos: [100, 400], endPos: [400, 400], ...common } });
    const rAxis = new Cartesian({ style: { startPos: [400, 100], endPos: [400, 400], ...common } });
    const lAxis = new Cartesian({
      style: { startPos: [100, 100], endPos: [100, 400], verticalFactor: -1, ...common },
    });

    const domain = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    const scale = new BandScale({ domain });
    const bandWidth = scale.getBandWidth();
    const ticks = domain.map((d) => ({
      value: scale.map(d) + bandWidth / 2,
      text: d,
      id: d,
    }));

    tAxis.update({ ticks });
    lAxis.update({ ticks });
    bAxis.update({ ticks });
    rAxis.update({ ticks });
    canvas.appendChild(tAxis);
    canvas.appendChild(lAxis);
    canvas.appendChild(bAxis);
    canvas.appendChild(rAxis);

    tAxis.update({ label: { tickPadding: 10 } });
  });
});

describe('Cartesian axis label layout', () => {
  const domain = [
    '蚂蚁技术研究院',
    '智能资金',
    '蚂蚁消金',
    '合规线',
    '战略线',
    '商业智能线',
    'CFO线',
    'CTO线',
    '投资线',
    'GR线',
    '社会公益及绿色发展事业群',
    '阿里妈妈事业群',
    'CMO线',
    '大安全',
    '天猫事业线',
    '影业',
    'OceanBase',
    '投资基金线',
    '阿里体育',
    '智能科技事业群',
  ];
  const scale = new BandScale({ domain });
  const bandWidth = scale.getBandWidth();
  const ticks = domain.map((d) => ({ value: scale.map(d) + bandWidth / 2, text: d }));

  it('AutoHide', async () => {
    const data = ['2020-12-28', '2020-12-29', '2020-12-30', '2020-12-31', '2021-01-01', '2021-01-02'];
    const scale = new BandScale({ domain: data, paddingOuter: 0.1 });
    const axis = new Cartesian({
      style: {
        startPos: [50, 50],
        endPos: [400, 50],
        ticks: data.map((d) => ({ value: scale.map(d) + scale.getBandWidth() / 2, text: d })),
        label: {
          type: 'text',
          rotation: 0,
          maxLength: 80,
          minLength: 20,
          autoHide: true,
          autoEllipsis: false,
          alignTick: true,
          autoHideTickLine: false,
        },
      },
    });
    axis.addEventListener(
      'axis-label-layout-end',
      () => {
        const labels = axis.querySelectorAll('.axis-label');
        expect(labels[0].style.visibility).toBe('visible');
        expect(labels[2].style.visibility).toBe('visible');
        expect(labels[4].style.visibility).toBe('visible');
        expect(labels[1].style.visibility).toBe('hidden');
        expect(labels[3].style.visibility).toBe('hidden');
        expect(labels[5].style.visibility).toBe('hidden');
      },
      { once: true }
    );
    canvas.appendChild(axis);
  });

  it('AutoEllipsis', () => {
    const data = ['ABC', 'BCED', 'DEFGH', 'GHIJKM', 'KMLNOPQ', 'PQRSTVVW', 'VWXYZABC'];
    const ticks = data.map((d, idx) => {
      const step = 1 / (data.length - 1);
      return {
        value: step * idx,
        text: String(d),
        id: String(idx),
      };
    });

    const axis = new Cartesian({
      style: {
        startPos: [50, 60],
        endPos: [400, 60],
        ticks,
        label: { autoRotate: false, autoEllipsis: false, autoHide: true },
      },
    });
    canvas.appendChild(axis);
    axis.addEventListener(
      'axis-label-layout-end',
      () => {
        expect(
          axis.getElementsByClassName('axis-label').filter((d) => d.style.visibility === 'visible').length
        ).toBeLessThan(ticks.length);
      },
      { once: true }
    );
    const maxLength = (400 - 50) / ticks.length;
    axis.update({ label: { autoHideTickLine: false, autoHide: true, autoEllipsis: true, maxLength, minLength: 40 } });
    // const labels = axis.getElementsByClassName('axis-label');
    // expect(labels.filter((d) => d.style.visibility === 'visible').length).toBe(ticks.length);
    // expect(labels.filter((d) => d.style.text.endsWith('...')).length).toBeGreaterThan(0);

    axis.destroy();
    axis.remove();
  });

  it('AutoHide and AutoEllipsis', async () => {
    const data = [
      'ABC',
      'BCED',
      'DEFGH',
      'GHIJKM',
      'KMLN',
      'OPQ',
      'PQRST',
      'VVW',
      'VWXYZABC',
      'AXS',
      'SFAF',
      'AFAFAGA',
      'FAFA',
      'AFAF',
    ];
    const ticks = data.map((d, idx) => {
      const step = 1 / (data.length - 1);
      return {
        value: step * idx,
        text: String(d),
        id: String(idx),
      };
    });

    const axis = new Cartesian({
      style: {
        startPos: [50, 60],
        endPos: [400, 60],
        ticks,
        label: {
          autoRotate: false,
          autoEllipsis: true,
          autoHide: false,
          autoHideTickLine: false,
          // 不展示 '...'
          minLength: 14,
          style: (d, i) => {
            let textAlign = 'center';
            if (i === 0) textAlign = 'start';
            if (i === ticks.length - 1) textAlign = 'end';
            return {
              fontSize: 12,
              textAlign: textAlign as any,
            };
          },
        },
      },
    });
    axis.addEventListener('axis-label-layout-end', () => {
      expect(axis.getElementsByClassName('axis-label').filter((d) => d.style.visibility === 'visible').length).toBe(
        ticks.length
      );
    });
    canvas.appendChild(axis);

    axis.update({ label: { autoHide: true } });
    axis.addEventListener(
      'axis-label-layout-end',
      () => {
        expect(
          axis.getElementsByClassName('axis-label').filter((d) => d.style.visibility === 'visible').length
        ).toBeLessThan(ticks.length);
      },
      { once: true }
    );

    axis.destroy();
    axis.remove();
  });

  // [todo]
  it('Different directions of axis with label autoRotate', () => {
    const domain = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    const scale = new BandScale({ domain });
    const bandWidth = scale.getBandWidth();
    const ticks = domain.map((d) => ({ value: scale.map(d) + bandWidth / 2, text: d }));
    const ticks2 = domain
      .map((d) => ({
        value: scale.map(d),
        text: d,
      }))
      .concat({ value: 1, text: '' });

    const withoutAlignTick = {
      tickLine: {},
      label: { alignTick: false, autoEllipsis: false, autoRotate: true, autoHide: true },
    };
    const withAlignTick = { tickLine: {}, label: { autoEllipsis: false, autoRotate: true, autoHide: true } };

    const tAxis = new Cartesian({
      style: { startPos: [20, 100], endPos: [200, 100], ticks, verticalFactor: -1, ...withAlignTick },
    });

    const tAxis1 = new Cartesian({
      style: { startPos: [20, 150], endPos: [200, 150], ticks: ticks2, verticalFactor: -1, ...withoutAlignTick },
    });
    const bAxis = new Cartesian({ style: { startPos: [20, 200], endPos: [200, 200], ticks, ...withAlignTick } });
    const bAxis2 = new Cartesian({
      style: { startPos: [20, 300], endPos: [200, 300], ticks: ticks2, ...withoutAlignTick },
    });
    canvas.appendChild(tAxis);
    canvas.appendChild(tAxis1);
    canvas.appendChild(bAxis);
    canvas.appendChild(bAxis2);

    const lAxis = new Cartesian({
      style: { startPos: [280, 100], endPos: [280, 280], ticks, verticalFactor: -1, ...withAlignTick },
    });
    const lAxis1 = new Cartesian({
      style: { startPos: [350, 100], endPos: [350, 280], verticalFactor: -1, ticks: ticks2, ...withoutAlignTick },
    });
    const rAxis = new Cartesian({ style: { startPos: [380, 100], endPos: [380, 280], ticks, ...withAlignTick } });
    const rAxis1 = new Cartesian({
      style: { startPos: [450, 100], endPos: [450, 280], ticks: ticks2, ...withoutAlignTick },
    });
    canvas.appendChild(rAxis);
    canvas.appendChild(rAxis1);
    canvas.appendChild(lAxis);
    canvas.appendChild(lAxis1);
  });

  // [todo]
  it('label rotation', () => {
    const axis = canvas.appendChild(
      new Cartesian({ style: { startPos: [50, 50], endPos: [400, 50], label: { autoRotate: false, rotation: 90 } } })
    );
    const axis1 = canvas.appendChild(
      new Cartesian({
        style: { startPos: [50, 200], endPos: [400, 200], label: { autoRotate: false, rotation: -90 } },
      })
    );
    const axis2 = canvas.appendChild(
      new Cartesian({ style: { startPos: [50, 300], endPos: [400, 300], label: { autoEllipsis: false } } })
    );

    axis.update({ ticks });
    axis1.update({ ticks });
    axis2.update({ ticks });
  });
});

describe('Cartesian axis title', () => {
  const linearScale = new LinearScale({ domain: [0, 479], range: [1, 0], tickCount: 10, nice: true });
  const data: any[] = linearScale.getTicks().map((d) => {
    return { value: linearScale.map(d as number), text: String(d) };
  });

  const quantitativeAxisOptions = {
    label: { alignTick: true },
    title: { content: 'Quantitative axis', titlePadding: 4 },
    ticks: data,
  };
  describe('Cartesian axis orientation is left', () => {
    const LABEL = 'Cartesian axis Title in left orientation.';
    it(`${LABEL} Defaults to:{ textAlign: "center", textBaseline: "bottom" }`, async () => {
      const axis = new Cartesian({
        style: { startPos: [150, 150], endPos: [150, 300], verticalFactor: -1, ...quantitativeAxisOptions },
      });
      canvas.appendChild(axis);
      await delay(30);
      const axisTitle = axis.getElementsByClassName('axis-title')[0] as AxisTitle;
      const axisLabelsGroup = axis.getElementsByClassName('axisLabel-group')[0] as Path;
      const axisLine = axis.getElementsByClassName('axis-line')[0] as Path;

      expect(axisTitle.style.textAlign).toBe('center');
      expect(axisTitle.style.textBaseline).toBe('bottom');

      // it(`${LABEL} TextAlign of title is determined relative to the titleAnchor, but textAlign specified by user could override it`, () => {
      axis.update({ title: { titleAnchor: 'start' } });
      expect(axisTitle.style.textAlign).toBe('end');

      axis.update({ title: { titleAnchor: 'end' } });
      expect(axisTitle.style.textAlign).toBe('start');

      axis.update({ title: { style: { textAlign: 'left' } } });
      expect(axisTitle.style.textAlign).toBe('left');

      // it(`${LABEL} Custom the padding between the axis-labels and axis-title by TitlePadding`, () => {
      axis.update({ title: { titlePadding: 0 } });
      const {
        min: [x10],
        max: [x20],
      } = axisTitle.getBounds();
      const {
        min: [axisLabelsGroupX],
      } = axisLabelsGroup.getBounds();
      expect(x20).toBe(axisLabelsGroupX);

      axis.update({ title: { titlePadding: -8 } });
      const {
        min: [x11],
        max: [x21],
      } = axisTitle.getBounds();
      expect(x11 - x10).toBe(8);
      const {
        min: [axisLabelsGroupX1],
      } = axisLabelsGroup.getBounds();
      expect(x21).toBe(axisLabelsGroupX1 + 8);

      // it(`${LABEL} Offset acts on the direction of axis-line`, () => {
      axis.update({ title: { offset: 0 } });
      const {
        min: [, y10],
      } = axisTitle.getBounds();
      axis.update({ title: { offset: 5 } });
      const {
        min: [, y110],
      } = axisTitle.getBounds();
      expect(y110 - y10).toBe(5);

      // it(`${LABEL} Custom x-position of axis-title by 'positionX', relative to axis-line. TitlePadding will not work`, () => {
      axis.update({ title: { titlePadding: 0, positionX: 0, style: { textBaseline: 'bottom' } } });
      const {
        max: [x23],
      } = axisTitle.getBounds();
      const {
        min: [axisLineX3],
      } = axisLine.getBounds();
      expect(x23).toBe(axisLineX3);

      axis.update({ title: { titlePadding: 2000, style: { textBaseline: 'top' } } });
      const {
        min: [x14],
      } = axisTitle.getBounds();
      expect(x14).toBe(axisLineX3);

      // it(`${LABEL} Custom y-position of axis-title by 'positionY', relative to axis-line. Offset still can work`, () => {
      axis.update({ title: { offset: 0, positionY: 0, style: { textAlign: 'end' } } });
      const { min } = axisTitle.getBounds();
      const [, y15] = min;
      const {
        min: [, axisLineY5],
      } = axisLine.getBounds();
      expect(y15).toBe(axisLineY5);

      axis.update({ title: { offset: 20 } });
      const {
        min: [, y11],
      } = axisTitle.getBounds();
      const {
        min: [, axisLineY1],
      } = axisLine.getBounds();
      expect(y11).toBe(axisLineY1 + 20);

      axis.update({ title: { offset: 0, positionY: 0, style: { textAlign: 'start' } } });
      const {
        max: [, y26],
      } = axisTitle.getBounds();
      expect(y26).toBe(axisLineY5);

      // it(`${LABEL} Rotation`, () => {
      axis.update({
        title: {
          positionX: 0,
          positionY: 0,
          offset: 0,
          rotation: 0,
          style: { textAlign: 'start', textBaseline: 'bottom' },
        },
      });
      const {
        min: [x1],
        max: [, y1],
      } = axisTitle.getBounds();
      const {
        min: [axisLineX, axisLineY],
      } = axisLine.getBounds();
      expect(y1).toBe(axisLineY);
      expect(x1).toBe(axisLineX);

      axis.update({ title: { offset: -8, style: { textAlign: 'end' } } });
      const {
        max: [x2, y2],
      } = axisTitle.getBounds();
      expect(x2).toBe(axisLineX);
      // Offset acts on the direction of axis-line.
      expect(y2).toBe(axisLineY - 8);

      // it(`${LABEL} Limit axisTitle maxLength`, () => {
      expect(axisTitle.style.text).toBe(axisTitle.style[ORIGIN]!.text);

      axis.update({ title: { maxLength: 60 } });
      expect(axisTitle.style.text.endsWith('...')).toBe(true);
      expect(axisTitle.style.text).not.toBe(axisTitle.style[ORIGIN]!.text);
    });
  });

  describe('Cartesian axis orientation is right, same as axis orientation is left', () => {
    const axis = new Cartesian({ style: { startPos: [250, 150], endPos: [250, 300], ...quantitativeAxisOptions } });
    canvas.appendChild(axis);
    const axisTitle = axis.getElementsByClassName('axis-title')[0] as AxisTitle;
    const axisLabelsGroup = axis.getElementsByClassName('axisLabel-group')[0] as Path;
    const axisLine = axis.getElementsByClassName('axis-line')[0] as Path;

    expect(axisTitle.style.textAlign).toBe('center');
    expect(axisTitle.style.textBaseline).toBe('bottom');
    axis.update({ title: { titleAnchor: 'start' } });
    expect(axisTitle.style.textAlign).toBe('start');

    axis.update({ title: { titleAnchor: 'end' } });
    expect(axisTitle.style.textAlign).toBe('end');

    axis.update({ title: { style: { textAlign: 'left' } } });
    expect(axisTitle.style.textAlign).toBe('left');

    axis.update({ title: { titlePadding: 0 } });
    const {
      min: [x1],
    } = axisTitle.getBounds();
    const {
      max: [axisLabelsGroupX],
    } = axisLabelsGroup.getBounds();
    expect(x1).toBe(axisLabelsGroupX);

    // title.titlePadding
    axis.update({ title: { titlePadding: -8 } });
    const {
      min: [x11],
    } = axisTitle.getBounds();
    expect(x11 - x1).toBe(-8);
    const {
      max: [axisLabelsGroupX1],
    } = axisLabelsGroup.getBounds();
    expect(x11).toBe(axisLabelsGroupX1 - 8);

    // title.offset
    axis.update({ title: { offset: 0 } });
    const {
      min: [, y1],
    } = axisTitle.getBounds();
    axis.update({ title: { offset: 5 } });
    const {
      min: [, y11],
    } = axisTitle.getBounds();
    expect(y11 - y1).toBe(5);

    // title.positionX
    axis.update({ title: { titlePadding: 0, positionX: 0, style: { textBaseline: 'bottom' } } });
    const {
      min: [x2],
    } = axisTitle.getBounds();
    const {
      max: [axisLineX],
    } = axisLine.getBounds();
    expect(x2).toBe(axisLineX);

    axis.update({ title: { titlePadding: 2000 } });
    const {
      min: [x3],
    } = axisTitle.getBounds();
    expect(x3).toBe(axisLineX);

    // title.positionY
    axis.update({ title: { offset: 0, positionY: 0, style: { textAlign: 'end' } } });
    const { max } = axisTitle.getBounds();
    const [, y3] = max;
    const {
      min: [, axisLineY],
    } = axisLine.getBounds();
    expect(y3).toBe(axisLineY);

    axis.update({ title: { offset: -20 } });
    const {
      max: [, y4],
    } = axisTitle.getBounds();
    const {
      min: [, axisLineY1],
    } = axisLine.getBounds();
    expect(y4).toBe(axisLineY1 - 20);

    axis.update({ title: { offset: 0, positionY: 0, style: { textAlign: 'start' } } });
    const {
      min: [, y2],
    } = axisTitle.getBounds();
    expect(y2).toBe(axisLineY);

    // title.rotation
    axis.update({
      title: {
        positionX: 0,
        positionY: 0,
        offset: 0,
        rotation: 0,
        style: { textAlign: 'end', textBaseline: 'bottom' },
      },
    });
    const {
      max: [x5],
      max: [, y5],
    } = axisTitle.getBounds();
    const {
      min: [axisLineX5, axisLineY5],
    } = axisLine.getBounds();
    expect(y5).toBe(axisLineY5);
    expect(x5).toBe(axisLineX5);

    axis.update({ title: { offset: -8, style: { textAlign: 'end' } } });
    const {
      max: [x6, y6],
    } = axisTitle.getBounds();
    expect(x6).toBe(axisLineX);
    // Offset acts on the direction of axis-line.
    expect(y6).toBe(axisLineY - 8);

    expect(axisTitle.style.text).toBe(axisTitle.style[ORIGIN]!.text);

    axis.update({ title: { maxLength: 60 } });
    expect(axisTitle.style.text.endsWith('...')).toBe(true);
    expect(axisTitle.style.text).not.toBe(axisTitle.style[ORIGIN]!.text);

    axis.destroy();
  });
});

const domain = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const scale = new BandScale({ domain, paddingOuter: 0.1 });
const bandWidth = scale.getBandWidth();
const ticks = domain.map((d) => ({ value: scale.map(d), text: d }));
ticks.push({ value: ticks[domain.length - 1].value + bandWidth, text: '' });

const common = { title: { content: 'Ordinal axis', titlePadding: 4 }, ticks, label: { alignTick: false } };

describe('Cartesian axis orientation is bottom', () => {
  const axis = new Cartesian({ style: { startPos: [50, 80], endPos: [350, 80], ...common } });
  canvas.appendChild(axis);
  const axisTitle = axis.getElementsByClassName('axis-title')[0] as AxisTitle;
  const axisLabelsGroup = axis.getElementsByClassName('axisLabel-group')[0] as Group;
  const axisLine = axis.getElementsByClassName('axis-line')[0] as Path;

  it('Cartesian axis Title in left orientation. Defaults to: { textAlign: "center", textBaseline: "top" }', () => {
    expect(axisTitle.style.textAlign).toBe('center');
    expect(axisTitle.style.textBaseline).toBe('top');
  });

  it('Text align of title is determined relative to the titleAnchor', async () => {
    axis.update({ title: { titleAnchor: 'start' } });
    await delay(0);
    expect(axisTitle.style.textAlign).toBe('start');

    axis.update({ title: { titleAnchor: 'end' } });
    await delay(0);
    expect(axisTitle.style.textAlign).toBe('end');

    axis.update({ title: { style: { textAlign: 'left' } } });
    await delay(0);
    expect(axisTitle.style.textAlign).toBe('left');
  });

  it('Custom padding between the axis-labels and axis-title', async () => {
    axis.update({ title: { titlePadding: 0 } });
    await delay(0);
    const y1 = axisTitle.getBounds().min[1];
    const axisLabelsGroupY = axisLabelsGroup.getBounds().max[1];

    expect(y1).toBe(axisLabelsGroupY);
    axis.update({ title: { titlePadding: 8 } });
    await delay(0);
    const y2 = axisTitle.getBounds().min[1];
    expect(y2 - y1).toBe(8);
  });

  it(`Offset acts on the direction of axis-line`, async () => {
    axis.update({ title: { titleAnchor: 'start', offset: 10, style: { textAlign: 'start' } } });
    await delay(0);
    expect(axisTitle.getBounds().min[0]).toBe(axisLine.getBounds().min[0] + 10);
  });

  it('Custom x-position', async () => {
    axis.update({ title: { positionX: 0, offset: 0, style: { textBaseline: 'top' } } });
    await delay(0);
    expect(axisTitle.getBounds().min[0]).toBe(axisLine.getBounds().min[0]);
  });

  afterAll(() => {
    axis.destroy();
    axis.remove();
  });
});

describe('Cartesian axis orientation is top', () => {
  const axis = new Cartesian({ style: { startPos: [50, 50], endPos: [350, 50], verticalFactor: -1, ...common } });
  canvas.appendChild(axis);
  const axisTitle = axis.getElementsByClassName('axis-title')[0] as AxisTitle;
  expect(axisTitle.style.text).toBe('Ordinal axis');
  expect(axisTitle.style.textBaseline).toBe('bottom');
  const {
    min: [x1, y1],
  } = axisTitle.getBounds();

  axis.update({ title: { offset: 5, titlePadding: 0 } });
  const {
    min: [x11, y11],
  } = axisTitle.getBounds();
  // [todo] AxisLabelGroup is not stable yet, there will be some errors when `getBounds()`.
  // expect(y11 - y1).toBe(4);
  expect(x11 - x1).toBe(5);

  axis.destroy();
});
