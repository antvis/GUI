import { vec2 } from '@antv/matrix-util';
import { renderExtDo, styleSeparator, percentTransform, type Selection } from '../../../util';
import { parsePosition } from '../../title';
import type { TitleCfg } from '../../title/types';
import { CLASS_NAMES } from '../constant';
import type { AxisStyleProps } from '../types';

function getTitlePosition(
  mainGroup: Selection,
  titleGroup: Selection,
  cfg: AxisStyleProps
): {
  x: number;
  y: number;
} {
  const { titlePosition: position = 'lb', titleSpacing: spacing = 0 } = cfg;
  const pos = parsePosition(position as Required<TitleCfg>['position']);
  const { x: ax, y: ay } = mainGroup.node().getBBox();
  const [aHw, aHh] = mainGroup.node().getBounds().halfExtents;
  const [tHw, tHh] = titleGroup.node().getBounds().halfExtents;
  const [lcx, lcy] = [ax + aHw, ay + aHh];
  let [x, y] = [lcx, lcy];

  if (['start', 'end'].includes(position) && cfg.type === 'linear') {
    const { startPos, endPos } = cfg;
    // todo did not consider the truncate case
    const [from, to] = position === 'start' ? [startPos, endPos] : [endPos, startPos];
    const direction = vec2.normalize([0, 0], [-to[0] + from[0], -to[1] + from[1]]);
    const [dx, dy] = vec2.scale([0, 0], direction, spacing);
    return { x: from[0] + dx, y: from[1] + dy };
  }

  if (pos.includes('l')) x -= aHw + tHw + spacing;
  if (pos.includes('r')) x += aHw + tHw + spacing;
  if (pos.includes('t')) y -= aHh + tHh + spacing;
  if (pos.includes('b')) y += aHh + tHh + spacing;
  return { x, y };
}

function getTitleLayout(axis: Selection, titleGroup: Selection, cfg: AxisStyleProps) {
  const mainGroup = axis.select(CLASS_NAMES.mainGroup.class);
  return getTitlePosition(mainGroup, titleGroup, cfg);
}

function createTitleEl(container: Selection, cfg: AxisStyleProps) {
  const { title } = cfg;
  const titleEl = container.maybeAppendByClassName(CLASS_NAMES.title, () => renderExtDo(title!));
  return [container, titleEl];
}

export function adjustTitleLayout(axis: Selection, cfg: AxisStyleProps, style: any) {
  const title = axis.select(CLASS_NAMES.title.class);
  const group = axis.select(CLASS_NAMES.titleGroup.class);
  const { transform = '' } = style;
  const { x, y } = getTitleLayout(axis, group, cfg);
  group.node().setPosition(x, y);
  percentTransform(title, transform);
}

function applyTitleStyle(title: Selection, titleGroup: Selection, axis: Selection, cfg: AxisStyleProps, style: any) {
  const [titleStyle, { transform = '', ...groupStyle }] = styleSeparator(style);
  title.styles(titleStyle);
  titleGroup.styles(groupStyle);
  adjustTitleLayout(axis, cfg, style);
}

export function renderTitle(container: Selection, axis: Selection, cfg: AxisStyleProps, style: any) {
  if (!cfg.title) return;
  const [titleGroup, titleEl] = createTitleEl(container, cfg);
  applyTitleStyle(titleEl, titleGroup, axis, cfg, style);
}
