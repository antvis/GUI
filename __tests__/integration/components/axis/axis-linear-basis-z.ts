import { Group } from '@antv/g';
import { mockData } from '../../utils/mock-data';
import { Axis } from '../../../../src/ui/axis';

export const AxisLinearBasisZ = () => {
  const group = new Group({
    style: {
      width: 650,
      height: 80,
    },
  });

  const zAxis = new Axis({
    style: {
      gridLength: 200,
      gridDirection: 'positive',
      gridLineWidth: 2,
      gridLineDash: [0],
      data: mockData,
      labelFormatter: () => '123',
      startPos: [50, 50],
      endPos: [350, 50],
      lineStroke: 'red',
      lineExtension: [10, 10],
      tickLength: 10,
      type: 'linear',
      lineLineWidth: 5,
      tickLineWidth: 5,
      tickStroke: 'green',
      labelSpacing: 10,
      /**
       * enable billboard effect
       */
      tickIsBillboard: true,
      lineIsBillboard: true,
      labelIsBillboard: true,
      titleIsBillboard: true,
      gridIsBillboard: true,
      // titleText: 'zAxis',
      // titleBillboardRotation: Math.PI / 8,
    },
  });
  zAxis.setOrigin(50, 50, 0);
  zAxis.rotate(0, 90, 0);
  group.appendChild(zAxis);

  const yAxis = new Axis({
    style: {
      gridLength: 200,
      gridDirection: 'negative',
      gridLineWidth: 2,
      gridLineDash: [0],
      data: mockData,
      labelFormatter: () => '123',
      startPos: [50, 50],
      endPos: [50, 350],
      lineStroke: 'red',
      lineExtension: [10, 10],
      tickLength: 10,
      type: 'linear',
      lineLineWidth: 5,
      tickLineWidth: 5,
      tickStroke: 'green',
      labelSpacing: 10,
      /**
       * enable billboard effect
       */
      tickIsBillboard: true,
      lineIsBillboard: true,
      labelIsBillboard: true,
      titleIsBillboard: true,
      gridIsBillboard: true,
    },
  });
  yAxis.setOrigin(50, 50, 0);
  yAxis.rotate(0, 90, 0);
  group.appendChild(yAxis);

  group.appendChild(
    new Axis({
      style: {
        gridLength: 200,
        gridDirection: 'negative',
        gridLineWidth: 2,
        gridLineDash: [0],
        data: mockData,
        labelFormatter: () => '123',
        startPos: [50, 50],
        endPos: [50, 350],
        lineStroke: 'red',
        lineExtension: [10, 10],
        tickLength: 10,
        type: 'linear',
        lineLineWidth: 5,
        tickLineWidth: 5,
        tickStroke: 'green',
        labelSpacing: 10,
        /**
         * enable billboard effect
         */
        tickIsBillboard: true,
        lineIsBillboard: true,
        labelIsBillboard: true,
        titleIsBillboard: true,
        gridIsBillboard: true,
      },
    })
  );

  group.appendChild(
    new Axis({
      style: {
        gridLength: 200,
        gridDirection: 'positive',
        gridLineWidth: 2,
        gridLineDash: [0],
        data: mockData,
        labelFormatter: () => '123',
        startPos: [50, 50],
        endPos: [350, 50],
        lineStroke: 'red',
        tickLength: 10,
        type: 'linear',
        lineLineWidth: 5,
        tickLineWidth: 5,
        tickStroke: 'green',
        labelSpacing: 10,
        /**
         * enable billboard effect
         */
        tickIsBillboard: true,
        lineIsBillboard: true,
        labelIsBillboard: true,
        // labelBillboardRotation: Math.PI / 8,
        titleIsBillboard: true,
        gridIsBillboard: true,
      },
    })
  );

  return group;
};

AxisLinearBasisZ.tags = ['笛卡尔坐标系', '截断', '水平', '正向'];
