import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { Category } from '../../../../src/ui/legend';
import { ageData } from '../legend/data';

export const LayoutLegend4 = () => {
  const group = new Group({
    style: {
      width: 500,
      height: 500,
    },
  });

  group.appendChild(
    new Rect({
      style: {
        width: 500,
        height: 500,
        stroke: 'red',
      },
    })
  );

  const justifyContent = 'center';
  const alignItems = 'flex-start';

  const layout = group.appendChild(
    new Layout({
      style: {
        width: 500,
        height: 500,
        display: 'flex',
        justifyContent,
        alignItems,
      },
    })
  );
  layout.appendChild(
    new Category({
      style: {
        layout: 'flex',
        titleText: `${justifyContent}\n${alignItems}`,
        data: ageData,
        gridCol: 2,
        colPadding: 5,
        width: 400,
        height: 300,
        itemMarkerFill: (d, i) => ageData[i].color,
      },
    })
  );

  return group;
};

LayoutLegend4.tags = ['布局', '图例', '位置'];
