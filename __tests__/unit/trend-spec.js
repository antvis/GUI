import { expect } from 'chai';
import { Canvas } from '@antv/g';
import { Trend } from '../../src';
import { TrendData } from '../constant';

describe('gui trend', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const canvas = new Canvas({
    containerDOM: div,
    width: 600,
    height: 400,
  });

  it('line', () => {
    const trend = new Trend({
      x: 100,
      y: 50,
      data: TrendData,
    });
    canvas.add(trend);
    canvas.draw();

    expect(trend.areaShape).to.be.undefined;
  });

  it('area', () => {
    const trend = new Trend({
      x: 100,
      y: 150,
      isArea: true,
      data: TrendData,
    });

    canvas.add(trend);
    canvas.draw();

    expect(trend.areaShape).not.to.be.undefined;
  });

  it('style', () => {
    const trend = new Trend({
      x: 100,
      y: 250,
      isArea: true,
      data: TrendData,
      smooth: false,
      backgroundStyle: {
        fill: 'grey',
        opacity: 0.1,
      },
      lineStyle: {
        stroke: 'blue',
      },
      areaStyle: {
        fill: 'green',
      },
    });

    canvas.add(trend);
    canvas.draw();

    expect(trend.areaShape.attr('fill')).to.eql('green');
  });
});
