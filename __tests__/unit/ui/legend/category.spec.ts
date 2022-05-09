import { DisplayObject, Group } from '@antv/g';
import { Category } from '../../../../src/ui/legend';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(800, 'svg');

describe('Category legend', () => {
  const items = [
    { name: 'Chrome', value: '7.08%', color: '#5B8FF9' },
    { name: 'Firefox', value: '4.12%', color: '#61DDAA' },
    { name: 'Safari', value: '25.45%', color: '#65789B' },
    { name: 'Android Long Long', value: '56.3%', color: '#F6BD16' },
    { name: 'iOS', value: '12.56%', color: '#7262fd' },
  ];
  it('new Category({}) returns a displayObject contains background and innerContent', () => {
    const category = new Category({ style: { items: [] } });

    expect(category.childNodes.length).toBe(2);
    category.destroy();
  });

  it('Category background', () => {
    const category = new Category({ style: { items, padding: [2, 4], backgroundStyle: { fill: 'pink' } } });

    const background = category.querySelector('.legend-background')!;
    const container = category.querySelector('.legend-container') as Group;
    expect(background.style.fill).toBe('pink');
    expect(container.style.x).toBe(background.style.x + 4);
    expect(container.style.y).toBe(background.style.y + 2);
    expect(container.getBBox().width).toBe(background.style.width - 8);

    canvas.appendChild(category);
    category.destroy();
  });

  it('Category Title, support html', () => {
    const category = new Category({ style: { items, title: { content: 'Legend title', spacing: 4 } } });
    canvas.appendChild(category);

    let title = category.querySelector('.legend-title') as DisplayObject;
    const itemsGroup = category.querySelector('.legend-items-group') as DisplayObject;
    expect(title.getBBox().bottom + 4).toBe(itemsGroup.getBBox().top);
    expect(title.style.text).toBe('Legend title');

    category.update({ title: { style: { fill: 'red' } } });
    title = category.querySelector('.legend-title') as DisplayObject;
    expect(title.style.fill).toBe('red');

    category.update({
      title: {
        useHTML: true,
        height: 50,
        spacing: 0,
        content: '<div style="width:200px;">Legend Item <span>ICON</span></div>',
      },
    });
    expect(itemsGroup.getBBox().top).toBe(50);

    category.update({ title: { useHTML: false } });
    title = category.querySelector('.legend-title') as DisplayObject;
    expect(title.tagName).toBe('text');
    category.destroy();
  });

  it('Category LegendItem, contains background, marker, name and value.', () => {
    const category = new Category({ style: { items } });
    canvas.appendChild(category);

    const legendItems = category.querySelectorAll('.legend-item');
    expect(legendItems.length).toBe(items.length);
    expect(legendItems[0].childNodes.length).toBe(2);
    expect((legendItems[0].childNodes[0] as any).className).toBe('legend-item-background');
    let [marker, name, value] = legendItems[0].childNodes[1].childNodes as DisplayObject[];
    expect(marker.className).toBe('legend-item-marker');
    expect(name.className).toBe('legend-item-name');
    expect(value.className).toBe('legend-item-value');

    expect(marker.style.fill).toBe(items[0].color);
    expect(name.style.text).toBe(items[0].name);
    expect(value.style.text).toBe(items[0].value);

    category.update({ itemMarker: { size: 8 }, itemName: { spacing: 4 }, itemBackground: { padding: [2, 4] } });
    [marker, name, value] = category.querySelectorAll('.legend-item')[0].childNodes[1].childNodes as DisplayObject[];
    expect(marker.getBBox().x).toBe(4);
    expect(name.getBBox().x).toBe(4 + 8 + 4);
    category.destroy();
  });

  it('Category spacing means: [offsetX, offsetY]', () => {
    const category = canvas.appendChild(new Category({ style: { items, spacing: [4, 4] } }));
    let [item0, item1] = category.querySelectorAll('.legend-item') as any[];
    expect(item0.getBBox().right + 4).toBe(item1.getBBox().left);

    category.update({ orient: 'vertical' });
    [item0, item1] = category.querySelectorAll('.legend-item') as any[];
    expect(item0.getBBox().bottom + 4).toBe(item1.getBBox().top);
    category.destroy();
  });

  it('item support maxItemWidth and itemWidth', () => {
    const category = canvas.appendChild(
      new Category({
        style: { items, maxItemWidth: 150 },
      })
    );
    const legendItem = category.querySelectorAll('.legend-item')[3] as any;
    expect(legendItem.getBBox().width).toBeLessThan(150);
    expect(legendItem.getBBox().width).toBeGreaterThan(148);
    expect(legendItem.querySelector('.legend-item-name').style.text.endsWith('...')).toBeTruthy();

    category.update({ items, itemWidth: 100, spacing: [6, 0] });
    const [, item1, item2] = category.querySelectorAll('.legend-item') as any[];
    expect(item1.getBBox().x).toBe(100 + 6);
    expect(item2.getBBox().x).toBe(200 + 12);
    category.destroy();
  });

  it('Category itemBackground', () => {
    const category = new Category({ style: { items } });
    canvas.appendChild(category);

    category.update({
      itemBackground: { padding: [2, 4], style: { default: { fill: 'pink' }, active: { fill: 'rgba(0,0,0,0.03)' } } },
    });
    const [bg1, bg2] = category.querySelectorAll('.legend-item-background');
    bg1.emit('mousemove', {});
    expect(bg1.style.fill).toBe('rgba(0,0,0,0.03)');
    expect(bg2.style.fill).toBe('pink');

    category.destroy();
  });

  it('Category itemName', () => {
    const category = canvas.appendChild(
      new Category({
        style: {
          items,
          itemWidth: 120,
          itemName: {
            style: {
              default: { fill: 'grey' },
              active: { fill: 'black' },
              selected: { fill: 'red' },
            },
          },
        },
      })
    );
    const [name1, name2, name3] = category.querySelectorAll('.legend-item-name');
    name2.emit('mousemove', {});
    category.setItemState('legend-item-2', 'selected');
    expect(name1.style.fill).toBe('grey');
    expect(name2.style.fill).toBe('black');
    expect(name3.style.fill).toBe('red');
    category.destroy();
  });

  it('Category itemValue, support align', () => {
    const category = canvas.appendChild(
      new Category({
        style: {
          y: 50,
          orient: 'vertical',
          items,
          itemWidth: 120,
          itemValue: {
            align: 'right',
            style: {
              default: { fill: 'grey' },
              active: { fill: 'black' },
              selected: { fill: 'red' },
            },
          },
        },
      })
    );
    const [value1, value2, value3] = category.querySelectorAll('.legend-item-value') as any[];
    value2.emit('mousemove', {});
    category.setItemState('legend-item-2', 'selected');
    expect(value1.style.fill).toBe('grey');
    expect(value2.style.fill).toBe('black');
    expect(value3.style.fill).toBe('red');
    category.destroy();
  });

  it('Category support flipPage and autoWrap', () => {
    const category = canvas.appendChild(
      new Category({
        style: {
          title: { content: 'Legend title' },
          items,
          maxWidth: 280,
          spacing: [8, 4],
          itemBackground: {
            style: {
              active: {
                fill: 'rgba(0,0,0,0.03)',
              },
            },
          },
        },
      })
    );
    let [item0, item1, item2] = category.querySelectorAll('.legend-item') as any[];
    const pagerWidth = (category.querySelector('.legend-navigation') as any).getBBox().width;
    expect(item0.getBBox().right + 8).toBe(item1.getBBox().left);
    expect(item2.getBBox().x).toBe(280 - pagerWidth);

    category.update({ autoWrap: true, maxRows: 3 });
    [item0, item1, item2] = category.querySelectorAll('.legend-item') as any[];
    expect(item2.getBBox().x).toBe(0);
    expect(category.querySelectorAll('.legend-navigation').length).toBe(1);

    category.update({ orient: 'vertical' });
    expect(category.querySelector('.legend-navigation')!.style.visibility).toBe('hidden');

    category.update({ orient: 'vertical', maxHeight: 78 });
    expect(category.querySelector('.legend-navigation')!.style.visibility).toBe('visible');

    category.destroy();
  });
});
