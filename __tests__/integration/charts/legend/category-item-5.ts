import { Group, Rect } from '@antv/g';
import { CategoryItem } from './utils';

export const CategoryItem5 = () => {
  const group = new Group();

  group.appendChild(
    new CategoryItem({
      style: {
        label: 'label',
        spacing: [5, 5],
        markerFill: 'orange',
        labelFill: 'red',
        valueFill: 'green',
        backgroundFill: '#f7f7f7',
        marker: () =>
          new Rect({
            style: {
              width: 10,
              height: 10,
              transformOrigin: 'center',
              transform: 'rotate(45)',
            },
          }),
      },
    })
  );

  return group;
};

CategoryItem5.tags = ['分类图例', '图例项', '自适应宽度', '自定义图标'];