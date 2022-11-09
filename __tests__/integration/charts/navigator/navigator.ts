import { Group, Text, Rect } from '@antv/g';
import { Navigator } from '../../../../src/ui/navigator';

export const NavigatorDemo = () => {
  const group = new Group();

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
        pageWidth: 100,
        pageHeight: 100,
        loop: true,
        pageViews: createPageViews(size, [100, 100]),
        ...args,
      },
    });
    group.appendChild(nav);
    return nav;
  };

  const nav1 = createNav({ x: 100, y: 100 });
  // setInterval(() => {
  //   // @ts-ignore
  //   nav1.next();
  // }, 1000);

  const nav2 = createNav({ x: 300, y: 100, orient: 'vertical', duration: 1000 });
  // setInterval(() => {
  //   // @ts-ignore
  //   nav2.prev();
  // }, 1000);

  const nav3 = createNav({ x: 450, y: 100, duration: 1000, effect: 'in-quart' });
  // setInterval(() => {
  //   // @ts-ignore
  //   nav3.next();
  // }, 1000);

  const nav4 = createNav({ x: 650, y: 100, initPage: 3, orient: 'vertical' });

  // setTimeout(() => {
  //   // @ts-ignore
  //   nav4.next().finished.then(() => {
  //     setTimeout(() => {
  //       nav4.update({ initPage: 2 });
  //     }, 1000);
  //   });
  // }, 1000);

  const nav5 = createNav({ x: 100, y: 250, initPage: 3 });

  // setTimeout(() => {
  //   nav5.update({
  //     pageViews: createPageViews(10, [100, 100], (str) => `update-${str}`),
  //   });
  //   setInterval(() => {
  //     // @ts-ignore
  //     nav5.next();
  //   }, 1000);
  // }, 1000);

  createNav({ x: 300, y: 250, initPage: 3, buttonTransform: 'scale(0.8)', pageNumFontSize: 14 }, 20);
  createNav({ x: 500, y: 250 }, 1);

  return group;
};
