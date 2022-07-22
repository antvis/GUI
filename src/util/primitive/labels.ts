import { Group, DisplayObject, Text } from '@antv/g';
import { getFont, parseLength, getEllipsisText } from '../text';
import { select } from '../selection';
import { defined } from '../defined';

export type LabelAttrs = {
  id: string;
  x: number;
  y: number;
  text: string;
  data: any;
  textAlign?: string;
  textBaseline?: string;
  transform?: string;
};

type LabelCfg = {
  maxLength?: number;
  style?: object | ((datum: any, idx: number, data: any[]) => any);
};

export function applyStyle(shape: DisplayObject, idx: number, attrs: any[], style?: any) {
  const datum = attrs[idx].data;
  const data = attrs.map((d) => d.data);
  const labelStyle = typeof style === 'function' ? style.call(null, datum, idx, data) : style;
  shape.attr(labelStyle || {});
}

export function limitText(textShape: Text, maxLength: string | number) {
  const font = getFont(textShape);
  const limitLength = parseLength(maxLength!, font);
  // @ts-ignore
  textShape.attr('tip', null);
  if (defined(limitLength) && limitLength < textShape.getBounds().halfExtents[0] * 2) {
    const ellipsis = getEllipsisText(textShape.style.text || '', limitLength!, font, '...');
    // @ts-ignore
    textShape.attr('tip', textShape.style.text);
    textShape.attr('text', ellipsis);
  }
}

/**
 * Display labels by default.
 */
export function renderLabels(
  container: Group,
  className: string,
  labels: LabelAttrs[],
  style: LabelCfg['style'] = {},
  maxLength?: number | string
) {
  select(container)
    .selectAll(`.${className}`)
    .data(labels, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append('text')
          .attr('className', className)
          .style('fontFamily', 'sans-serif')
          .style('fontSize', 12)
          .style('fontWeight', 'normal')
          .each(function (datum, idx) {
            this.attr(datum);
            limitText(this, maxLength || Number.MAX_SAFE_INTEGER);
            applyStyle(this, idx, labels, style);
          }),
      (update) =>
        update.each(function (datum, idx) {
          this.attr(datum);
          limitText(this, maxLength || Number.MAX_SAFE_INTEGER);
          applyStyle(this, idx, labels, style);
        }),
      (exit) => exit.remove()
    );
}
