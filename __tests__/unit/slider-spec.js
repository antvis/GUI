import { expect } from 'chai';
import { Slider } from '../../src/';
import { Canvas } from '@antv/g';
import * as Simulate from 'event-simulate';
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
    y: 50,
    width: 200,
    height: 16,

    trendCfg: {
      data: TrendData,
      isArea: true,
    },

    start: 0.1,
    end: 0.9,
  });

  const containerDOM = canvas.get('containerDOM');

  it('initialize', () => {
    canvas.add(slider);
    canvas.draw();

    expect(slider.x).to.eql(50);
    expect(slider.y).to.eql(50);
    expect(slider.width).to.eql(200);
    expect(slider.height).to.eql(16);

    expect(slider.textStyle.textBaseline).to.eql('middle');
  });

  it('setRange', () => {
    slider.setRange(0.3, 1.1);
    expect(slider.start).to.eql(0.3);
    expect(slider.end).to.eql(1);
  });

  it('drag', (done) => {
    slider.on('sliderchange', (range) => {
      expect(range).to.be.eql([0, 0.7]);
      done();
      slider.off('sliderchange');
    });

    slider.foreground.emit('mousedown', {
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

    expect(slider.start).to.eql(0);
    expect(slider.end).to.eql(0.7);
  });
});
