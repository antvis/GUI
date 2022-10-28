import { Group, Text } from '@antv/g';
import { Axis } from '../../../src/ui/axis';
import { axisWarper } from '../utils';

export const AxisLinearLabel = () => {
  const data = [
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

  const tickData = data.map((d, idx) => {
    const step = 1 / data.length;
    return {
      value: step * idx,
      label: d,
      id: String(idx),
    };
  });

  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: tickData,
    lineLineWidth: 5,
  });

  createAxis({
    startPos: [20, 20],
    endPos: [600, 20],
    lineStroke: 'red',
    truncRange: [0.4, 0.6],
    lineExtension: [10, 10],
  });

  createAxis({
    startPos: [20, 50],
    endPos: [20, 500],
    labelSpacing: 10,
    lineStroke: 'green',
    labelFormatter: ({ label }) =>
      new Text({
        style: {
          text: label,
          fill: 'red',
          fontSize: 10,
          textBaseline: 'middle',
        },
      }),
  });

  createAxis({
    startPos: [50, 100],
    endPos: [450, 500],
    lineStroke: 'orange',
    labelDirection: 'positive',
    labelFormatter: (_, index) => index.toString(),
  });

  createAxis({
    startPos: [550, 500],
    endPos: [100, 50],
    labelSpacing: 10,
    tickDirection: 'positive',
    labelDirection: 'negative',
    tickLength: 21,
    lineStroke: 'blue',
    labelAlign: 'perpendicular',
    labelFormatter: (_, index) => index.toString(),
  });

  createAxis({
    startPos: [600, 500],
    endPos: [600, 50],
    lineStroke: 'purple',
    labelAlign: 'horizontal',
    labelSpacing: 30,
    labelFormatter: ({ label }) =>
      new Text({
        style: {
          text: label,
          fill: 'red',
          fontSize: 10,
          textBaseline: 'middle',
        },
      }),
  });

  return group;
};
