import { Group } from '@antv/g';
import { flowItemData, colors } from './data';
import { Category } from './utils';

export const CategoryFlexLayout5 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        layout: 'flex',
        width: 200,
        height: 300,
        gridRow: 5,
        gridCol: 1,
        data: flowItemData,
        titleText: 'Legend Title',
        itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
      },
    })
  );

  return group;
};

CategoryFlexLayout5.tags = ['分类图例', '流式布局', '单列布局', '分页', '行数不足'];
