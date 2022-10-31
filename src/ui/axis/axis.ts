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

export type AxisOptions = DisplayObjectConfig<AxisStyleProps>;

const PREFIX = (name: string) => `axis-${name}`;
const GROUP_NAME = {
  main: PREFIX('main-group'),
  line: PREFIX('line-group'),
  tick: PREFIX('tick-group'),
  label: PREFIX('label-group'),
  grid: PREFIX('grid-group'),
};

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
      const axisGridGroup = select(container).maybeAppend(GROUP_NAME.grid, 'g').attr('className', GROUP_NAME.grid);
      ifShow(showGrid!, axisGridGroup, () => renderGrid(axisGridGroup, data, attributes, gridStyle), true);
      /** main group */
      const axisMainGroup = select(container).maybeAppend(GROUP_NAME.main, 'g').attr('className', GROUP_NAME.main);
      /** line */
      const axisLineGroup = axisMainGroup.maybeAppend(GROUP_NAME.line, 'g').attr('className', GROUP_NAME.line);
      ifShow(
        showLine!,
        axisLineGroup,
        () => {
          renderAxisLine(axisLineGroup, attributes, lineStyle);
        },
        true
      );
      /** tick */
      const axisTickGroup = axisMainGroup.maybeAppend(GROUP_NAME.grid, 'g').attr('className', GROUP_NAME.grid);
      ifShow(
        showTick!,
        axisTickGroup,
        () => {
          renderTicks(axisTickGroup, data, attributes, tickStyle);
        },
        true
      );
      /** label */
      const axisLabelGroup = axisMainGroup.maybeAppend(GROUP_NAME.label, 'g').attr('className', GROUP_NAME.label);
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
