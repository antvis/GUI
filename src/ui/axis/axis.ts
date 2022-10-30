import { getStyleFromPrefixed, sampling, select } from '@/util';
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
        lineExtension,
        lineArrow,
        lineArrowOffset,
        tickDirection,
        tickLength,
        tickFiltrate,
        tickFormatter,
        label,
        labelAlign,
        labelDirection,
        labelSpacing,
        labelFiltrate,
        labelFormatter,
        labelTransforms,
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

      const axisGridGroup = select(container).maybeAppend('axis-grid-group', 'g').attr('className', 'axis-grid-group');
      if (gridLength === 0) axisGridGroup.node().removeChildren();
      else renderGrid(axisGridGroup, data, attributes, gridStyle);

      const axisMainGroup = select(container).maybeAppend('axis-main-group', 'g').attr('className', 'axis-main-group');

      const axisLineGroup = axisMainGroup.maybeAppend('axis-line-group', 'g').attr('className', 'axis-line-group');
      renderAxisLine(axisLineGroup, attributes, lineStyle);

      const axisTickGroup = axisMainGroup.maybeAppend('axis-tick-group', 'g').attr('className', 'axis-tick-group');
      renderTicks(axisTickGroup, data, attributes, tickStyle);

      const axisLabelGroup = axisMainGroup.maybeAppend('axis-label-group', 'g').attr('className', 'axis-label-group');
      if (label === false) axisLabelGroup.node().removeChildren();
      else renderLabels(axisLabelGroup, data, attributes, labelStyle);

      renderTitle(select(container), attributes, titleStyle);
    },
  },
  {
    ...AXIS_BASE_DEFAULT_CFG.style,
  }
);
