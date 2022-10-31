import { getStyleFromPrefixed, sampling, select, ifShow } from '@/util';
import { createComponent } from '@/util/create';
import { DisplayObjectConfig } from '@antv/g';
import { AXIS_BASE_DEFAULT_CFG } from './constant';
import { renderGrid } from './guides/axisGrid';
import { renderLabels } from './guides/axisLabels';
import { renderAxisLine } from './guides/axisLine';
import { renderTicks } from './guides/axisTicks';
import { renderTitle } from './guides/axisTitle';
import type {
  ArcAxisStyleProps,
  AxisStyleProps,
  AxisGridStyle,
  AxisLabelStyle,
  AxisLineStyle,
  AxisTickStyle,
  AxisTitleStyle,
  LinearAxisStyleProps,
} from './types';

type AxisOptions = DisplayObjectConfig<AxisStyleProps>;
export { AxisOptions };

export const Axis = createComponent<AxisStyleProps>(
  {
    render(attributes, container) {
      const {
        type,
        data: _data,
        dataThreshold = 100,
        crossSize,
        animation,
        title,
        titleSpacing,
        titleAlign,
        truncRange,
        truncShape,
        showLine,
        lineExtension,
        lineArrow,
        lineArrowOffset,
        showTick,
        tickDirection,
        tickLength,
        tickFiltrate,
        tickFormatter,
        showLabel,
        labelAlign,
        labelDirection,
        labelSpacing,
        labelFiltrate,
        labelFormatter,
        labelTransforms,
        showGrid,
        gridFiltrate,
        gridLength,
        ...restCfg
      } = attributes;

      const restStyle = (() => {
        if (type === 'linear') {
          const { startPos, endPos, ...rest } = restCfg as LinearAxisStyleProps;
          return rest;
        }
        const { angleRange, radius, center, ...rest } = restCfg as ArcAxisStyleProps;
        return rest;
      })();

      const [titleStyle, lineStyle, tickStyle, labelStyle, gridStyle] = [
        getStyleFromPrefixed<AxisTitleStyle>(restStyle, 'title'),
        getStyleFromPrefixed<AxisLineStyle>(restStyle, 'line'),
        getStyleFromPrefixed<AxisTickStyle>(restStyle, 'tick'),
        getStyleFromPrefixed<AxisLabelStyle>(restStyle, 'label'),
        getStyleFromPrefixed<AxisGridStyle>(restStyle, 'grid'),
      ];

      const data = sampling(_data, dataThreshold).filter(({ value }) => {
        if (truncRange && value > truncRange[0] && value < truncRange[1]) return false;
        return true;
      });
      /** grid */
      const axisGridGroup = select(container).maybeAppend('axis-grid-group', 'g').attr('className', 'axis-grid-group');
      ifShow(showGrid!, axisGridGroup, () => renderGrid(axisGridGroup, data, attributes, gridStyle), true);
      /** main group */
      const axisMainGroup = select(container).maybeAppend('axis-main-group', 'g').attr('className', 'axis-main-group');
      /** line */
      const axisLineGroup = axisMainGroup.maybeAppend('axis-line-group', 'g').attr('className', 'axis-line-group');
      ifShow(
        showLine!,
        axisLineGroup,
        () => {
          renderAxisLine(axisLineGroup, attributes, lineStyle);
        },
        true
      );
      /** tick */
      const axisTickGroup = axisMainGroup.maybeAppend('axis-tick-group', 'g').attr('className', 'axis-tick-group');
      ifShow(
        showTick!,
        axisTickGroup,
        () => {
          renderTicks(axisTickGroup, data, attributes, tickStyle);
        },
        true
      );
      /** label */
      const axisLabelGroup = axisMainGroup.maybeAppend('axis-label-group', 'g').attr('className', 'axis-label-group');
      ifShow(
        showLabel!,
        axisLabelGroup,
        () => {
          renderLabels(axisLabelGroup, data, attributes, labelStyle);
        },
        true
      );
      /** title */
      renderTitle(select(container), attributes, titleStyle);
    },
  },
  {
    ...AXIS_BASE_DEFAULT_CFG.style,
  }
);
