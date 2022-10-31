import type { InferStyle, Vector2 } from '@/types';
import { applyStyle, getCallbackValue, select, Selection, styleSeparator } from '@/util';
import type { Group } from '@antv/g';
import { DisplayObject } from '@antv/g';
import { isFunction, memoize } from 'lodash';
import type { AxisStyleProps, AxisDatum } from '../types';
import { getDirectionVector, getValuePos } from './axisLine';
import { filterExec, getCallbackStyle } from './utils';

export function getTickVector(value: number, cfg: AxisStyleProps): Vector2 {
  return getDirectionVector(value, cfg.tickDirection!, cfg);
}

export const getTickPoints = memoize(
  (unitVector: Vector2, tickLength: number) => {
    const [dx, dy] = unitVector;
    return [
      [0, 0],
      [dx * tickLength, dy * tickLength],
    ];
  },
  (unitVector, tickLength) => [...unitVector, tickLength].join()
);

function getTickLineLayout(
  datum: AxisDatum,
  index: number,
  data: AxisDatum[],
  tickVector: Vector2,
  cfg: AxisStyleProps
) {
  const { tickLength } = cfg;
  const [ox, oy] = getValuePos(datum.value, cfg);
  const [[x1, y1], [x2, y2]] = getTickPoints(tickVector, getCallbackValue(tickLength, [datum, index, data]));
  return { x: ox, y: oy, x1, x2, y1, y2 };
}

function createTickEl(container: Selection, datum: AxisDatum, index: number, data: AxisDatum[], cfg: AxisStyleProps) {
  const { tickFormatter: formatter } = cfg;
  const tickVector = getTickVector(datum.value, cfg);
  let el: any = 'line';
  if (formatter instanceof DisplayObject) el = () => formatter;
  else if (isFunction(formatter)) el = () => getCallbackValue(formatter, [datum, index, data, tickVector]);
  return container.append(el).attr('className', 'axis-tick-item');
}

function applyTickStyle(
  datum: AxisDatum,
  index: number,
  data: AxisDatum[],
  tick: Selection,
  group: Group,
  cfg: AxisStyleProps,
  style: any
) {
  const tickVector = getTickVector(datum.value, cfg);
  const { x1, x2, y1, y2, x, y } = getTickLineLayout(datum, index, data, tickVector, cfg);
  const [tickStyle, groupStyle] = styleSeparator(getCallbackStyle(style, [datum, index, data]));
  tick.node().nodeName === 'line' && tick.call(applyStyle, { x1, x2, y1, y2, ...tickStyle });
  group.attr({ x, y, ...groupStyle });
  applyStyle(tick, tickStyle);
}

export function renderTicks<T = any>(
  container: Selection,
  _data: AxisDatum[],
  cfg: AxisStyleProps,
  callbackableStyle: InferStyle<T>
) {
  const data = filterExec(_data, cfg.tickFiltrate);
  container
    .selectAll('.axis-tick')
    .data(data)
    .join(
      (enter) =>
        enter
          .append('g')
          .attr('className', 'axis-tick')
          .each(function (...args) {
            const tick = createTickEl(select(this), ...args, data, cfg);
            applyTickStyle(...args, data, tick, this, cfg, callbackableStyle);
          }),
      (update) =>
        update.each(function (...args) {
          this.removeChildren();
          const tick = createTickEl(select(this), ...args, data, cfg);
          applyTickStyle(...args, data, tick, this, cfg, callbackableStyle);
        }),
      (exit) => exit.remove()
    );
}
