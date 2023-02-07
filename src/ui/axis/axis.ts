import type { Group } from '@antv/g';
import { parseAnimationOption, type GenericAnimation } from '../../animation';
import { GUI } from '../../core/gui';
import { deepAssign, filterTransform, ifShow, sampling, select, subObjects } from '../../util';
import { AXIS_BASE_DEFAULT_CFG, CLASS_NAMES } from './constant';
import { renderGrid } from './guides/axisGrid';
import { renderLabels } from './guides/axisLabels';
import { renderAxisLine } from './guides/axisLine';
import { renderTicks } from './guides/axisTicks';
import { renderTitle, adjustTitleLayout } from './guides/axisTitle';
import type { ArcAxisStyleProps, AxisOptions, AxisStyleProps, LinearAxisStyleProps } from './types';

export type {
  ArcAxisOptions,
  ArcAxisStyleProps,
  AxisOptions,
  AxisStyleProps,
  LinearAxisOptions,
  LinearAxisStyleProps,
} from './types';

type RA = Required<AxisStyleProps>;

export class Axis extends GUI<AxisStyleProps> {
  constructor(options: AxisOptions) {
    super(deepAssign({}, AXIS_BASE_DEFAULT_CFG, options));
  }

  render(attributes: AxisStyleProps, container: Group, specificAnimation?: GenericAnimation) {
    const {
      type,
      data,
      class: className,
      dataThreshold = 100,
      crossSize,
      animation,
      title,
      showTitle,
      titleSpacing,
      truncRange,
      truncShape,
      showLine,
      lineExtension,
      lineArrow,
      lineArrowOffset,
      lineArrowSize,
      showTick,
      tickDirection,
      tickLength,
      tickFilter,
      tickFormatter,
      showLabel,
      labelAlign,
      labelDirection,
      labelSpacing,
      labelFilter,
      labelFormatter,
      labelTransforms,
      showGrid,
      gridFilter,
      gridLength,
      ...restCfg
    } = filterTransform(attributes) as RA;

    const restStyle = (() => {
      if (type === 'linear') {
        const { startPos, endPos, ...rest } = restCfg as LinearAxisStyleProps;
        return rest;
      }
      const { angleRange, radius, center, ...rest } = restCfg as ArcAxisStyleProps;
      return rest;
    })();

    const [titleStyle, lineStyle, tickStyle, labelStyle, gridStyle] = subObjects(restStyle, [
      'title',
      'line',
      'tick',
      'label',
      'grid',
    ]);

    const sampledData = sampling(data, dataThreshold).filter(({ value }) => {
      if (truncRange && value > truncRange[0] && value < truncRange[1]) return false;
      return true;
    });

    const finalAnimation = parseAnimationOption(specificAnimation === undefined ? animation : specificAnimation);

    /** grid */
    const axisGridGroup = select(container).maybeAppendByClassName(CLASS_NAMES.gridGroup, 'g');
    ifShow(showGrid!, axisGridGroup, (group) => renderGrid(group, sampledData, attributes, gridStyle, finalAnimation));

    /** main group */
    const axisMainGroup = select(container).maybeAppendByClassName(CLASS_NAMES.mainGroup, 'g');

    /** line */
    const axisLineGroup = axisMainGroup.maybeAppendByClassName(CLASS_NAMES.lineGroup, 'g');
    ifShow(showLine!, axisLineGroup, (group) => {
      renderAxisLine(group, attributes, lineStyle, finalAnimation);
    });

    /** tick */
    const axisTickGroup = axisMainGroup.maybeAppendByClassName(CLASS_NAMES.tickGroup, 'g');
    ifShow(showTick!, axisTickGroup, (group) => {
      renderTicks(group, sampledData, attributes, tickStyle, finalAnimation);
    });

    /** label */
    const axisLabelGroup = axisMainGroup.maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g');

    ifShow(showLabel!, axisLabelGroup, (group) => {
      renderLabels(group, sampledData, attributes, labelStyle, finalAnimation, () => {
        adjustTitleLayout(select(container), attributes, titleStyle);
      });
    });

    /** title */
    const axisTitleGroup = select(container).maybeAppendByClassName(CLASS_NAMES.titleGroup, 'g');
    ifShow(showTitle, axisTitleGroup, (group) => {
      renderTitle(group, select(container), attributes, titleStyle);
    });
  }
}
