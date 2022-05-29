import { Slider } from '../../../../src/ui/slider';
import { createCanvas } from '../../../utils/render';
import { generateTimeData } from '../timeline/data';

const canvas = createCanvas(750, undefined, true);

const timeData = generateTimeData(40).map((d) => ({ ...d, val1: Math.random() * 100, val2: Math.random() * 80 }));

describe('Slider', () => {
  it('new Slider({...}) returns a slider with sparkline', () => {
    const slider = new Slider({
      style: {
        x: 60,
        y: 30,
        data: timeData,
        length: 524,
        size: 20,
        selection: [4, 16],
        handleStyle: {
          size: 12,
        },
        sparkline: {
          fields: ['val1', 'val2'],
        },
      },
    });

    canvas.appendChild(slider);

    slider.addEventListener('selectionChanged', (evt: any) => {
      const [idx0, idx1] = evt.detail.value;
      console.log('selectionChanged', evt.detail.originValue, [idx0, idx1], timeData[idx0], timeData[idx1]);
    });
  });

  it('new Slider({...}) returns a slider with simple Handle', () => {
    const slider = new Slider({
      style: {
        x: 60,
        y: 120,
        data: timeData,
        length: 524,
        size: 20,
        selection: [4, 16],
        handleStyle: {
          size: 10,
          symbol: 'simple-slider-handle',
          stroke: '#5B8FF9',
          fill: '#5B8FF9',
          lineWidth: 1,
          active: {
            stroke: '#5B8FF9',
            fill: '#5B8FF9',
          },
        },
        sparkline: {
          fields: ['val1', 'val2'],
        },
      },
    });

    canvas.appendChild(slider);
  });

  it('new Slider({...}) returns a slider with custom Handle', () => {
    const slider = new Slider({
      style: {
        x: 60,
        y: 180,
        data: timeData,
        length: 524,
        size: 20,
        selection: [4, 16],
        handleStyle: {
          size: 12,
        },
        startHandleSize: 8,
        startHandleIcon: 'https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ',
        endHandleIcon: 'diamond',
        sparkline: {
          fields: ['val1', 'val2'],
        },
      },
    });

    canvas.appendChild(slider);
  });

  it('new Slider({...}) returns a vertical slider.', () => {
    const slider = new Slider({
      style: {
        x: 90,
        y: 240,
        orient: 'vertical',
        data: timeData,
        length: 270,
        size: 20,
        selection: [4, 16],
        handleStyle: {
          size: 12,
        },
        sparkline: {
          fields: ['val1', 'val2'],
        },
      },
    });

    canvas.appendChild(slider);
  });
});
