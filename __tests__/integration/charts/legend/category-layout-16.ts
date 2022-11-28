import { Group } from '@antv/g';
import { colors, flowItemData } from './data';
import { Category } from './utils';

export const CategoryLayout16 = () => {
  const group = new Group();

  group.appendChild(
    new Category({
      style: {
        y: 30,
        data: flowItemData,
        layout: 'flex',
        width: 200,
        height: 300,
        gridRow: 5,
        gridCol: 1,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  return group;
};

CategoryLayout16.tags = ['分类图例', '图例组', '流式布局', '纵向布局', '横向分页', '行数限制'];