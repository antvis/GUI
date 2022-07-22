import { Group } from '@antv/g';
import { deepAssign } from '../../../util';
import { renderLabels, LabelAttrs } from '../../../util/primitive/labels';
import { AxisLabelCfg } from '../types';

/**
 * Display labels by default.
 */
export function renderAxisLabels(container: Group, labels: LabelAttrs[], cfg: AxisLabelCfg | null = {}) {
  const style = deepAssign({ fill: '#000', fontWeight: 'lighter' }, cfg?.style || {});
  renderLabels(container, 'axis-label', cfg ? labels : [], style, cfg?.maxLength);
}
