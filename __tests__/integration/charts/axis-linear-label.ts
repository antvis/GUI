import { Group, Text, Image } from '@antv/g';
import { axisWarper, data } from '../utils';

export const AxisLinearLabel = () => {
  const group = new Group({});

  const createAxis = axisWarper(group, {
    type: 'linear',
    data: data(10, 1),
    lineLineWidth: 5,
  });

  const createLabel = (icon, text) => {
    const labelGroup = new Group({});
    const labelIcon = new Image({
      style: {
        src: icon,
        width: 30,
        height: 30,
        anchor: '0.5 0.5',
      },
    });
    const labelText = new Text({
      style: {
        text,
        textAlign: 'center',
        transform: 'translate(0, 30)',
      },
    });
    labelGroup.appendChild(labelIcon);
    labelGroup.appendChild(labelText);
    return labelGroup;
  };

  createAxis({
    startPos: [50, 20],
    endPos: [600, 20],
    tickLength: 0,
    lineExtension: [30, 30],
    // lineStroke: 'transparent',
    // lineFill: 'transparent',
    labelSpacing: 20,
    labelFormatter: (datum, index) => {
      if (index > 2) return `第${index + 1}名`;
      return createLabel(
        'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*1NiMRKb2sfMAAAAAAAAAAAAADmJ7AQ/original',
        ['冠军🏆', '亚军🥈', '季军🥉'][index]
      );
    },
  });

  return group;
};
