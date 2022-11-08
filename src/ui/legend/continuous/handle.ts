import type { PrefixedStyle } from '@/types';
import { Marker, MarkerStyleProps } from '@/ui/marker';
import { applyStyle, createComponent, getStylesFromPrefixed, select, maybeAppend } from '@/util';
import type { GroupStyleProps } from '@antv/g';
import { Group, TextStyleProps } from '@antv/g';
import { ifHorizontal } from '../utils';

export type HandleStyleProps<T = any> = GroupStyleProps &
  PrefixedStyle<Omit<Partial<MarkerStyleProps>, 'x' | 'y'>, 'marker'> &
  PrefixedStyle<TextStyleProps, 'label'> & {
    orient: 'vertical' | 'horizontal';
    /** spacing between marker and label */
    spacing?: number;
    showLabel?: boolean;
    formatter?: (val: T) => string;
  };

const DEFAULT_HANDLE_CFG: HandleStyleProps = {
  markerSize: 25,
  markerStroke: '#c5c5c5',
  markerFill: '#fff',
  markerLineWidth: 1,
  labelFontSize: 12,
  labelFill: '#c5c5c5',
  labelText: '',
  orient: 'vertical',
  spacing: 0,
  showLabel: true,
  formatter: (val) => val.toString(),
};

export const Handle = createComponent<HandleStyleProps>(
  {
    render(attribute: HandleStyleProps, container: Group) {
      const {
        orient,
        visibility,
        spacing = 0,
        showLabel,
        formatter,
        markerSymbol = ifHorizontal(orient, 'horizontalHandle', 'verticalHandle'),
      } = attribute as Required<HandleStyleProps>;
      const [{ text, ...labelStyle }, handleStyle] = getStylesFromPrefixed(attribute, ['label', 'marker']);
      if (!markerSymbol || visibility === 'hidden') {
        container.querySelector('#handle')?.remove();
        container.querySelector('.handle-text')?.remove();
        return;
      }

      const handle = select(container)
        .maybeAppend('handle', () => new Marker({}))
        // todo: here exists some bugs, if className is assigned, it will render serveral paths
        // .attr('className', 'handle')
        .call(applyStyle, { symbol: markerSymbol, ...handleStyle });

      if (showLabel) {
        const label = select(container)
          .maybeAppend('handle-label', 'text')
          .attr('className', 'handle-label')
          .call(applyStyle, { text: formatter(text).toString(), ...labelStyle });

        // adujust layout
        const { width, height } = handle.node().getBBox();
        const [x, y, textAlign, textBaseline] = ifHorizontal(
          orient,
          [0, height + spacing, 'center', 'top'],
          [width + spacing, 0, 'start', 'middle']
        );
        label.node().setLocalPosition(x, y);
        label.style('textAlign', textAlign).style('textBaseline', textBaseline);
      } else select(container).select('#handle-label').remove();
    },
  },
  {
    ...DEFAULT_HANDLE_CFG,
  }
);
