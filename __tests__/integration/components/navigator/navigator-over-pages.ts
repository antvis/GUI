import { Group, Rect } from '@antv/g';
import { Navigator } from '../../../../src/ui/navigator';
import { Text } from '../../../../src/shapes';
import { timeout } from '../../utils';

export const NavigatorOverPages = () => {
  const group = new Group({
    style: {
      width: 260,
      height: 200,
    },
  });

  const createPageViews = (count: number, [w, h]: [number, number], formatter = (str: any) => `page - ${str}`) => {
    return new Array(count).fill(0).map((_, index) => {
      const g = new Group();
      const rect = new Rect({
        style: {
          width: w,
          height: h,
          stroke: 'red',
          fill: '#f7f7f7',
        },
      });
      rect.appendChild(
        new Text({
          style: {
            text: formatter(index + 1),
            x: w / 2,
            y: h / 2,
            textAlign: 'center',
            textBaseline: 'middle',
          },
        })
      );
      g.appendChild(rect);
      return g;
    });
  };

  const nav = group.appendChild(
    new Navigator({
      style: {
        x: 100,
        y: 100,
        defaultPage: 3,
        pageWidth: 100,
        pageHeight: 100,
        loop: true,
      },
    })
  );

  createPageViews(2, [100, 100]).forEach((page) => {
    nav.getContainer().appendChild(page);
  });

  timeout(() => {
    nav.update({
      defaultPage: 0,
    });
  }, 1000);

  timeout(() => {
    nav.update({
      defaultPage: 4,
    });
  }, 2000);

  return group;
};

NavigatorOverPages.tags = ['分页器', '空页'];

NavigatorOverPages.wait = 500;
