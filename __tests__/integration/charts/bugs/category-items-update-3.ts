import { Group } from '@antv/g';
import { CategoryItems } from '../../../../src/ui/legend/category/items';
import { flowItemData } from '../legend/data';

export const BugCategoryItemsUpdate3 = () => {
  const group = new Group();

  const items = group.appendChild(
    new CategoryItems({
      className: 'category-items-3',
      data: flowItemData,
      layout: {
        gridRow: 2,
        gridCol: 3,
        layout: 'grid',
        colPadding: 10,
        rowPadding: 5,
      },
      style: {
        width: 400,
        height: 100,
        itemMarkerFill: '#d3d2d3',
        itemLabelFill: 'green',
        itemValueFill: 'green',
      },
    })
  );

  setTimeout(() => {
    items.update({ layout: { gridCol: 7 } });
  }, 1000);

  setTimeout(() => {
    items.update({ layout: { gridCol: 2 } });
  }, 2000);

  setTimeout(() => {
    items.update({ style: { width: 300 } });
  }, 300);

  return group;
};

BugCategoryItemsUpdate3.tags = ['BUG', '分页', '更新', '不分页'];
