import { ExtendDisplayObject, PrefixedStyle } from '@/types';
import type { Padding, Selection } from '@/util';
import { applyStyle, createComponent, renderExtDo, getStylesFromPrefixed, ifShow, normalPadding, select } from '@/util';
import type { DisplayObject, DisplayObjectConfig, PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import { isNumber, isString } from 'lodash';
import { circle } from '../../marker/symbol';

type ItemTextStyle = Omit<TextStyleProps, 'text'>;
type ItemBackgrounStyle = Omit<RectStyleProps, 'width' | 'height'>;

export interface CategoryItemData {
  label?: ExtendDisplayObject;
  value?: ExtendDisplayObject;
}
export type CategoryItemStyle = { marker?: string | (() => DisplayObject) } & PrefixedStyle<
  { [key: string]: any },
  'marker'
> &
  PrefixedStyle<ItemTextStyle, 'label'> &
  PrefixedStyle<ItemTextStyle, 'value'> &
  PrefixedStyle<ItemBackgrounStyle, 'background'>;
export interface CategoryItemCfg {
  width: number;
  height: number;
  span?: number[];
  spacing?: Padding;
  maxWidth?: number;
}

export type CategoryItemStyleProps = CategoryItemStyle & CategoryItemCfg & CategoryItemData;

export type CategoryItemOptions = DisplayObjectConfig<CategoryItemStyleProps>;

const PREFIX = (name: string) => `legend-category-item-${name}`;
const GROUP_NAME = {
  marker: PREFIX('marker-group'),
  label: PREFIX('label-group'),
  value: PREFIX('value-group'),
  background: PREFIX('background-group'),
};

const DEFAULT_CFG: Partial<CategoryItemStyleProps> = {
  marker: 'path',
  markerD: circle(6, 6, 6),
  markerFill: '#d3d2d3',
  labelFill: '#646464',
  valueFill: '#646464',
  labelFontSize: 12,
  valueFontSize: 12,
  labelFontFamily: 'sans-serif',
  valueFontFamily: 'sans-serif',
  labelTextAlign: 'start',
  valueTextAlign: 'start',
  labelTextBaseline: 'middle',
  valueTextBaseline: 'middle',
};

function isShowValue(value: CategoryItemStyleProps['value']) {
  if (!value) return false;
  if (isString(value) || isNumber(value)) return value !== '';
  return value.attr('text') !== '';
}

function getItemLayout(cfg: CategoryItemStyleProps) {
  const { value, width, span = [0.5, 1, 1], spacing = 0 } = cfg;
  const showValue = isShowValue(value);
  const [span1, span2, _span3] = normalPadding(span);
  const span3 = showValue ? _span3 : 0;
  const [spacing1, spacing2] = normalPadding(spacing);
  const basis = span1 + span2 + span3;
  const aWidth = width - spacing1 - spacing2;
  const w1 = (aWidth * span1) / basis;
  const w2 = (aWidth * span2) / basis;
  const w3 = (aWidth * span3) / basis;
  return {
    pos: [w1 / 2, w1 + spacing1, w1 + w2 + spacing1 + spacing2],
    width: [w1, w2, w3],
  };
}

function renderMarker(container: Selection, cfg: CategoryItemStyleProps, style: PathStyleProps) {
  container.maybeAppend(PREFIX('marker'), cfg.marker!).call(applyStyle, { anchor: '0.5 0.5', ...style });
}

function renderLabel(container: Selection, cfg: CategoryItemStyleProps, style: ItemTextStyle) {
  const { label, height } = cfg;
  container.maybeAppend(PREFIX('label'), () => renderExtDo(label!)).call(applyStyle, style);
}

function renderValue(container: Selection, cfg: CategoryItemStyleProps, style: ItemTextStyle) {
  const { value } = cfg;
  container.maybeAppend(PREFIX('value'), () => renderExtDo(value!)).call(applyStyle, style);
}

function renderBackground(container: Selection, cfg: CategoryItemStyleProps, style: ItemBackgrounStyle) {
  const { width, height } = cfg;
  container.style('zIndex', -1);
  container.maybeAppend(PREFIX('background'), 'rect').call(applyStyle, { width, height, ...style });
}

function adjustLayout(container: Selection, cfg: CategoryItemStyleProps) {
  const { width, height, value } = cfg;
  const h = height / 2;
  const showValue = isShowValue(value);
  const {
    pos: [x1, x2, x3],
    width: [, w2, w3],
  } = getItemLayout(cfg);
  const setTextEllipsisCfg = (el: Selection, w: number) => {
    const node = el.node();
    if (node.nodeName === 'text') {
      el.call(applyStyle, {
        wordWrap: true,
        wordWrapWidth: w,
        maxLines: 1,
        textOverflow: '...',
      });
    }
  };
  container.select(`#${GROUP_NAME.marker}`).call(applyStyle, { x: x1, y: h });
  const labelGroup = container.select(`#${GROUP_NAME.label}`).call(applyStyle, { x: x2, y: h });
  setTextEllipsisCfg(labelGroup.select(`#${PREFIX('label')}`), w2);
  if (showValue) {
    const valueGroup = container.select(`#${GROUP_NAME.value}`).call(applyStyle, { x: x3, y: h });
    setTextEllipsisCfg(valueGroup.select(`#${PREFIX('value')}`), w3);
  }
}

export const CategoryItem = createComponent<CategoryItemStyleProps>(
  {
    render(attributes, container) {
      const { width, height, span, spacing, maxWidth, marker, label, value, ...restStyle } = attributes;
      const [markerStyle, labelStyle, valueStyle, itemBackgroundStyle] = getStylesFromPrefixed(restStyle, [
        'marker',
        'label',
        'value',
        'background',
      ]);

      const group = select(container);

      /** marker */
      const markerGroup = group.maybeAppend(GROUP_NAME.marker, 'g').attr('className', GROUP_NAME.marker);
      ifShow(
        !!marker,
        markerGroup,
        () => {
          renderMarker(markerGroup, attributes, markerStyle);
        },
        true
      );

      /** label */
      const labelGroup = group.maybeAppend(GROUP_NAME.label, 'g').attr('className', GROUP_NAME.label);
      ifShow(
        !!label,
        labelGroup,
        () => {
          renderLabel(labelGroup, attributes, labelStyle);
        },
        true
      );

      /** value */
      const valueGroup = group.maybeAppend(GROUP_NAME.value, 'g').attr('calssName', GROUP_NAME.value);
      ifShow(
        isShowValue(value),
        valueGroup,
        () => {
          renderValue(valueGroup, attributes, valueStyle);
        },
        true
      );

      /** background */
      const backgroundGroup = group.maybeAppend(GROUP_NAME.background, 'g').attr('className', GROUP_NAME.background);
      renderBackground(backgroundGroup, attributes, itemBackgroundStyle);

      adjustLayout(select(container), attributes);
    },
  },
  {
    ...DEFAULT_CFG,
  }
);
