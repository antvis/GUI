import { Canvas } from '@antv/g';
import * as Simulate from 'event-simulate';
import { Slider } from '../../src/';
import { TrendData } from '../constant';

describe('slider', () => {
  const div = document.createElement('div');
  div.id = 'canvas';
  document.body.appendChild(div);

  const canvas = new Canvas({
    containerId: 'canvas',
    renderer: 'canvas',
    width: 400,
    height: 400,
  });

  const slider = new Slider({
    x: 50,
    y: 300,
    width: 200,
    height: 16,

    trendCfg: {
      data: TrendData,
      isArea: true,
    },

    start: 0.1,
    end: 0.9,
    minText: 'min',
    maxText: 'max',
  });

  const containerDOM = canvas.get('containerDOM');

  it('initialize', () => {
    canvas.add(slider);
    canvas.draw();

    expect(slider.x).toEqual(50);
    expect(slider.y).toEqual(300);
    expect(slider.width).toEqual(200);
    expect(slider.height).toEqual(16);

    // @ts-ignore
    expect(slider.textStyle.textBaseline).toEqual('middle');
  });

  it('update', () => {
    slider.update({
      minText: 'new min',
      maxText: 'new max',
      start: 0.3,
      end: 1.1,
    });
    // @ts-ignore
    expect(slider.start).toEqual(0.3);
    // @ts-ignore
    expect(slider.end).toEqual(1);
    // @ts-ignore
    expect(slider.minText).toEqual('new min');
    // @ts-ignore
    expect(slider.maxText).toEqual('new max');
  });

  it('drag', (done) => {
    slider.on('sliderchange', (range) => {
      expect(range).toEqual([0, 0.7]);
      done();
      slider.off('sliderchange');
    });

    // @ts-ignore
    slider.foregroundShape.emit('mousedown', {
      event: {
        pageX: 70,
        pageY: 70,
        stopPropagation: () => {},
        preventDefault: () => {},
      },
    });

    Simulate.simulate(containerDOM, 'mousemove', {
      pageX: 50,
      pageY: 50,
      stopPropagation: () => {},
      preventDefault: () => {},
    });

    Simulate.simulate(containerDOM, 'mouseup');

    // @ts-ignore
    expect(slider.start).toEqual(0);
    // @ts-ignore
    expect(slider.end).toEqual(0.7);
  });
});
