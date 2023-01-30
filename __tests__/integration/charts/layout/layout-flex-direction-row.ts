import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexDirectionRow = () => {
  const group = new Group();
  createGrid(group, 100);
  const box = group.appendChild(
    new Layout({
      style: {
        width: 100,
        height: 100,
        display: 'flex',
        flexDirection: 'row',
      },
    })
  );

  const colors = ['red', 'green', 'blue', 'yellow', 'pink', 'orange', 'purple', 'cyan', 'magenta', 'brown'];
  new Array(10).fill(0).forEach((d, i) =>
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

LayoutFlexDirectionRow.tags = ['布局', 'flex-direction', 'row'];