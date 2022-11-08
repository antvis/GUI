import { applyStyle, createComponent, getStyleFromPrefixed, select } from '@/util';
import { Title } from '../title';
import { CategoryItems } from './category/items';
import type { CategoryOptions, CategoryStyleProps } from './types';

export type { CategoryOptions };

export const Category = createComponent<CategoryStyleProps>(
  {
    render(attributes, container) {
      const { width, height, title, ...itemsStyle } = attributes;
      const titleStyle = getStyleFromPrefixed(attributes, 'title');

      // render title first
      const titleEl = select(container as any)
        .maybeAppend(
          'title',
          () =>
            new Title({
              style: {
                text: title,
                width,
                height,
              },
            })
        )
        .call(applyStyle, titleStyle);

      // @ts-ignore
      const { x, y, width: w, height: h } = titleEl.select('#title').node().getAvailableSpace();
      const style = { width: w, height: h, ...itemsStyle };
      const itemsGroup = select(container as any)
        .maybeAppend('items-group', () => new CategoryItems({ style }))
        .call(applyStyle, { x, y });

      // cuz itemsStyle has callbackable parameters, so it can not passed by call applyStyle
      Object.entries(itemsStyle).forEach(([k, v]) => {
        itemsGroup.attr(k, v);
      });
    },
  },
  {}
);
