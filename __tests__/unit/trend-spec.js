import { expect } from 'chai';
import { Canvas } from '@antv/g';
import { Trend } from '../../src';

describe('gui trend', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const data = [
    21,
    13,
    19,
    25,
    18,
    4,
    21,
    19,
    22,
    26,
    3,
    13,
    5,
    23,
    24,
    9,
    29,
    2,
    27,
    26,
    29,
    7,
    19,
    29,
    15,
    3,
    9,
    11,
    29,
    30,
    4,
    24,
    23,
    16,
    21,
    7,
    24,
    19,
    18,
    16,
    1,
    15,
    27,
    13,
    23,
    16,
    4,
    1,
    1,
    20,
  ];

  const canvas = new Canvas({
    containerDOM: div,
    width: 600,
    height: 400,
  });

  it('line', () => {
    const trend = new Trend({
      x: 100,
      y: 50,
      data,
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
      data,
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
      data,
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
