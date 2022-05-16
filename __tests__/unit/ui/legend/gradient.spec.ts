import { createCanvas } from '../../../utils/render';
import { Continuous } from '../../../../src/ui/legend';

const canvas = createCanvas(800);

describe('Continuous legend', () => {
  it('new Continuous({}) should init legend-container, title and background', () => {
    const legend = canvas.appendChild(new Continuous({}));
    expect(legend.childNodes.length).toBe(3);
    expect(legend.querySelector('.legend-background')).toBeTruthy();
    expect(legend.querySelector('.legend-container')).toBeTruthy();
    expect(legend.querySelector('.legend-indicator')).toBeTruthy();
    legend.destroy();
  });

  it('new Continuous({}) should draw a basic continuous legend.', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          min: 0,
          max: 100,
          title: { content: 'Title' },
          padding: [8],
          inset: [0, 0, 0, 12],
          backgroundStyle: { fill: 'pink' },
        },
      })
    );
    const title = legend.querySelector('.legend-title');
    expect(title!.style.text).toBe('Title');
    const background = legend.querySelector('.legend-background') as any;
    expect(background!.style.fill).toBe('pink');
    legend.destroy();
  });

  it('new Continuous({}) should draw a legend with rail', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          min: 0,
          max: 100,
          padding: [0, 0, 0, 12],
          title: { content: 'Title' },
          backgroundStyle: { fill: 'pink' },
          rail: {
            ticks: [110, 120, 130, 140, 150, 160, 170, 180, 190],
            backgroundColor: '#eee8d5',
          },
        },
      })
    );
  });

  it('new Continuous({}) should draw a legend with chunked rail', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          y: 60,
          min: 0,
          max: 100,
          padding: [0, 0, 0, 12],
          title: { content: 'Title' },
          rail: {
            chunked: true,
          },
        },
      })
    );
  });

  it('new Continuous({}) should draw a legend with size chunked rail', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          y: 120,
          min: 0,
          max: 100,
          padding: [0, 0, 0, 12],
          title: { content: 'Title' },
          rail: {
            chunked: true,
            type: 'size',
          },
        },
      })
    );
  });

  it('new Continuous({}) should draw a legend with label align start', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          y: 200,
          min: 0,
          max: 100,
          padding: [0, 12],
          inset: [16, 0, 0, 0],
          title: { content: 'Title' },
          label: { align: 'start', spacing: 2 },
          rail: {},
        },
      })
    );
  });

  it('new Continuous({}) should draw a legend with label align end', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          y: 280,
          min: 0,
          max: 100,
          padding: [0, 12],
          title: { content: 'Title' },
          label: { align: 'end' },
          rail: {},
          handle: {},
        },
      })
    );
  });

  it('new Continuous({}) should draw a legend with handle', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          y: 360,
          min: 0,
          max: 100,
          start: 20,
          end: 90,
          padding: [0, 12],
          title: { content: 'Title' },
          label: { align: 'end' },
          rail: { type: 'size', chunked: true },
          handle: {},
        },
      })
    );
  });

  it('new Continuous({}) should draw a legend with ticks label', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          y: 440,
          min: 0,
          max: 100,
          start: 20,
          end: 90,
          padding: [0, 12],
          title: { content: 'Title' },
          label: { align: 'end', spacing: 4 },
          rail: { type: 'color', ticks: [35, 60, 85] },
        },
      })
    );
  });

  it('new Continuous({}) should draw a legend with ticks label', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          y: 520,
          min: 0,
          max: 100,
          start: 20,
          end: 90,
          padding: [0, 12],
          inset: [16, 0, 0, 0],
          title: { content: 'Title' },
          label: { align: 'start', spacing: 2 },
          rail: { type: 'color', ticks: [35, 60, 85] },
        },
      })
    );
  });

  it('new Continuous({}) should draw a legend support trigger `showIndicator`', () => {
    const legend = canvas.appendChild(
      new Continuous({
        style: {
          min: 0,
          max: 100,
          padding: [0, 0, 0, 12],
          title: { content: 'Title' },
          rail: {
            ticks: [110, 120, 130, 140, 150, 160, 170, 180, 190],
            backgroundColor: '#eee8d5',
          },
        },
      })
    );

    legend!.showIndicator(40);
    // @ts-ignore
    expect(legend.indicator.style.textStyle.text).toBe('40');
    legend.destroy();
  });
});
