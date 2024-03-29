import { Group, Rect } from '@antv/g';
import { Text } from '../../../../src/shapes';
import { Navigator } from '../../../../src/ui/navigator';

export const NavigatorWithoutShape = () => {
  const group = new Group({
    style: {
      width: 160,
      height: 330,
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
          },
        })
      );
      g.appendChild(rect);
      return g;
    });
  };

  const createNav = (args = {}, size = 5) => {
    const nav = new Navigator({
      style: {
        loop: true,
        ...args,
      },
    });
    createPageViews(size, [100, 100]).forEach((page) => {
      nav.getContainer().appendChild(page);
    });
    group.appendChild(nav);
    return nav;
  };

  createNav({
    x: 10,
    y: 10,
    pageWidth: 100,
    pageHeight: 100,
  });

  createNav({
    x: 10,
    y: 120,
  });

  const nav3 = createNav({
    x: 10,
    y: 230,
  });

  nav3.update({
    pageWidth: 100,
    pageHeight: 100,
  });

  return group;
};
