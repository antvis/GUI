import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { Category } from '../../../../src/ui/legend';
import { ageData } from '../legend/data';

export const LayoutLegend7 = () => {
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

  const justifyContent = 'flex-end';
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
        data: ageData,
        style: {
          layout: 'flex',
          titleText: `${justifyContent}\n${alignItems}`,
          gridCol: 2,
          colPadding: 5,
          width: 400,
          height: 300,
          itemMarkerFill: (d: any, i: number) => ageData[i].color,
        },
      },
    })
  );

  return group;
};

LayoutLegend7.tags = ['布局', '图例', '位置'];
