import { CategoryItems, CategoryItemsStyleProps } from '../../../../src/ui/legend/categoryItems';
import { createCanvas } from '../../../utils/render';
import { LEGEND_ITEMS } from './data';

const canvas = createCanvas(800);

const ITEMS: CategoryItemsStyleProps['items'] = LEGEND_ITEMS.map((d) => {
  return {
    ...d,
    itemMarker: { symbol: 'circle', style: { fill: d.color }, size: 8 },
    itemName: { content: d.name },
  };
});

describe('CategoryItems', () => {
  it('new CategoryItems({..}) should draw a category items group.', () => {
    const group = new CategoryItems({
      style: {
        orient: 'horizontal',
        items: ITEMS,
        maxWidth: 220,
      },
    });

    canvas.appendChild(group);
    expect(group.querySelector('.page-button')!.style.visibility).toBe('visible');

    group.style.pageButtonSize = 10;
    group.style.pageInfoWidth = 40;
    group.style.pageSpacing = 8;
    // @ts-ignore
    expect(group.clipView.getLocalBounds().halfExtents[0] * 2).toBe(220 - 40 - 10 * 2 - 8);
  });

  it('new CategoryItems({..}) should draw a vertical category items group.', () => {
    const group = new CategoryItems({
      style: {
        y: 50,
        orient: 'vertical',
        items: ITEMS,
        maxHeight: 116,
        pageTextStyle: { fill: 'red' },
        pageButtonStyle: { default: { fill: 'red' }, disabled: { fill: 'pink' } },
      },
    });

    canvas.appendChild(group);

    group.style.pageButtonSize = 10;
    group.style.pageInfoWidth = 40;
    group.style.pageSpacing = 8;
    // @ts-ignore
    expect(group.clipView.getLocalBounds().halfExtents[1] * 2).toBe(116 - 10 - 8);

    group.style.pageFormatter = (c: number, t: number) => `${c} // ${t}`;
    group.style.pageTextStyle = { fill: 'black' };

    expect(group.querySelector('.page-info')!.style.text).toBe('1 // 2');

    group.style.orient = 'horizontal';
    expect(group.querySelector('.page-button')!.style.visibility).not.toBe('visible');
    // group.destroy();
  });

  it.only('new CategoryItems({..}) support autoWrap in horizontal orient.', () => {
    const group = new CategoryItems({
      style: {
        y: 50,
        orient: 'horizontal',
        items: ITEMS,
        maxHeight: 20,
        maxWidth: 320,
        autoWrap: true,
        // maxRows: 3,
      },
    });

    canvas.appendChild(group);

    expect(group.querySelectorAll('.page-button')![0].style.symbol).toBe('up');
    expect(group.querySelectorAll('.page-button')![1].style.symbol).toBe('down');
    // group.destroy();
  });

  it('new CategoryItems({..}) do not support autoWrap in vertical orient.', () => {
    const group = new CategoryItems({
      style: {
        y: 140,
        orient: 'vertical',
        items: ITEMS,
        maxHeight: 116,
        maxWidth: 320,
        autoWrap: true,
      },
    });

    canvas.appendChild(group);

    expect(group.querySelectorAll('.page-button')![0].style.symbol).toBe('up');
    expect(group.querySelectorAll('.page-button')![1].style.symbol).toBe('down');
    // group.destroy();
  });
});
