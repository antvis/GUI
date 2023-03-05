import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { Category } from '../../../../src/ui/legend';
import { ageData } from '../legend/data';

export const LayoutLegendMultiple = () => {
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
  const alignItems = 'center';

  const layout = group.appendChild(
    new Layout({
      style: {
        width: 500,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent,
        alignItems,
      },
    })
  );
  layout.appendChild(
    new Category({
      style: {
        data: ageData,
        layout: 'flex',
        titleText: `legend 1`,
        gridCol: 2,
        colPadding: 5,
        width: 400,
        height: 300,
        itemMarkerFill: (d: any, i: number) => ageData[i].color,
      },
    })
  );
  layout.appendChild(
    new Category({
      style: {
        data: ageData,
        layout: 'flex',
        titleText: `legend 2`,
        gridCol: 2,
        colPadding: 5,
        width: 400,
        height: 300,
        itemMarkerFill: (d: any, i: number) => ageData[i].color,
      },
    })
  );

  return group;
};

LayoutLegendMultiple.tags = ['布局', '图例', '多图例'];
