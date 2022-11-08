import { Group } from '@antv/g';
import { Category as C, smooth } from './utils';

export const Category = () => {
  const group = new Group();

  const createItemData = (num: number) => {
    return new Array(num).fill(0).map((d, i) => ({
      id: `${i + 1}`,
      label: `${i + 1}-label`,
      value: `${i + 1}-value`,
      extInfo: 'further text',
    }));
  };

  const createCategory = (args: any) => {
    const { width = 300, height = 90, gridRow = 3, gridCol = 3, rowPadding = 0, colPadding = 0 } = args;
    group.appendChild(
      new C({
        style: {
          width,
          height,
          gridRow,
          gridCol,
          data: createItemData(20),
          ...args,
        },
      })
    );
  };

  const colors = ['#5781f0', '#70d2a0', '#556484', '#efb745', '#5f4fee'];
  createCategory({
    title: 'Legend Title',
    width: 400,
    height: 50,
    gridCol: 6,
    gridRow: 1,
    itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
    itemValue: '',
  });

  createCategory({
    y: 100,
    title: 'Legend Title',
    width: 400,
    height: 50,
    gridCol: 6,
    gridRow: 2,
    itemMarkerFill: (_: any, i: number) => colors[i % colors.length],
    itemValue: '',
  });

  createCategory({
    y: 200,
    title: 'Legend Title',
    orient: 'vertical',
    width: 400,
    height: 50,
    gridCol: 6,
    gridRow: 2,
    itemMarkerStroke: (_: any, i: number) => colors[i % colors.length],
    itemMarkerLineWidth: 3,
    itemMarkerFill: 'transparent',
    itemValue: '',
    itemMarkerD: smooth(6, 3, 6),
  });

  return group;
};
