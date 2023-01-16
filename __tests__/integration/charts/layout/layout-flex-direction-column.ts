import { Group, Rect } from '@antv/g';
import { ContentBoxLite } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexDirectionColumn = () => {
  const group = new Group();
  createGrid(group, 100);
  const box = group.appendChild(
    new ContentBoxLite({
      style: {
        width: 100,
        height: 100,
        display: 'flex',
        flexDirection: 'column',
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

LayoutFlexDirectionColumn.tags = ['布局', 'flex-direction', 'column'];
