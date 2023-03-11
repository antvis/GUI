import { Group } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem8 = () => {
  const group = new Group({
    name: '分类图例-图例项-比例划分-span 1:2',
    style: {
      width: 100,
      height: 20,
    },
  });

  group.appendChild(
    new CategoryItem({
      style: {
        labelText: 'this is a long label text',
        valueText: 'this is a long value text',
        width: 100,
        spacing: [5, 5],
        span: [1, 2],
        markerFill: 'orange',
        labelFill: 'red',
        valueFill: 'green',
        backgroundFill: '#f7f7f7',
      },
    })
  );

  return group;
};