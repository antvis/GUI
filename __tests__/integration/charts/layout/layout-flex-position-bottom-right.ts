import { Group, Rect } from '@antv/g';
import { ContentBoxLite } from '../../../../src/ui/layout';
import { createGrid } from '../../utils';

export const LayoutFlexPositionBottomRight = () => {
  const group = new Group();

  createGrid(group, 100);

  const box = group.appendChild(
    new ContentBoxLite({
      style: {
        width: 100,
        height: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },
    })
  );

  box.appendChild(
    new Rect({
      style: {
        width: 10,
        height: 10,
        fill: 'red',
      },
    })
  );

  return group;
};

LayoutFlexPositionBottomRight.tags = ['布局', 'Position', 'BottomRight'];
