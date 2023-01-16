import { Group, Rect } from '@antv/g';
import { ContentBoxLite } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexAlignItemsFlexEnd = () => {
  const group = new Group();
  createGrid(group, 100);
  const box = group.appendChild(
    new ContentBoxLite({
      style: {
        width: 100,
        height: 100,
        display: 'flex',
        alignItems: 'flex-end',
      },
    })
  );

  const colors = ['red', 'green', 'blue', 'yellow', 'pink', 'orange', 'purple', 'cyan', 'magenta', 'brown'];
  new Array(5).fill(0).forEach((d, i) =>
    box.appendChild(
      new Rect({
        style: {
          width: 10,
          height: 10,
          fill: colors[i],
        },
      })
    )
  );

  return group;
};

LayoutFlexAlignItemsFlexEnd.tags = ['布局', 'align-items', 'flex-end'];
