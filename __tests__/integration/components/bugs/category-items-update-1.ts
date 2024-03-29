import { Group } from '@antv/g';
import { CategoryItems } from '../../../../src/ui/legend/category/items';
import { timeout } from '../../utils';
import { colors, flowItemData } from '../legend/data';

export const BugCategoryItemsUpdate1 = () => {
  const group = new Group();

  const items = group.appendChild(
    new CategoryItems({
      style: {
        data: flowItemData,
        width: 400,
        height: 100,
        gridRow: 2,
        layout: 'grid',
        itemLabelFill: 'green',
        itemValueFill: 'green',
        colPadding: 10,
        rowPadding: 5,
        itemMarkerFill: (_: any, index: number) => colors[index % colors.length],
      },
    })
  );

  timeout(() => {
    // 期望变成红色
    items.update({
      itemLabelFill: 'red',
      itemMarkerFill: 'red',
    });
  }, 1000);

  return group;
};

BugCategoryItemsUpdate1.tags = ['BUG', '图例项', '更新样式'];
