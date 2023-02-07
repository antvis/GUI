import { DisplayObject, type Group } from '@antv/g';
import { isFunction, memoize } from '@antv/util';
import type { Vector2 } from '../../../types';
import { getCallbackValue, select, Selection, styleSeparator, transition } from '../../../util';
import { CLASS_NAMES } from '../constant';
import type { AxisDatum, AxisStyleProps } from '../types';
import { getDirectionVector, getValuePos } from './axisLine';
import { filterExec, getCallbackStyle } from './utils';
import { fadeOut, type StandardAnimationOption, type GenericAnimation } from '../../../animation';

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
  const [[x1, y1], [x2, y2]] = getTickPoints(tickVector, getCallbackValue(tickLength, [datum, index, data]));
  return { x1, x2, y1, y2 };
}

function createTickEl(container: Selection, datum: AxisDatum, index: number, data: AxisDatum[], cfg: AxisStyleProps) {
  const { tickFormatter: formatter } = cfg;
  const tickVector = getTickVector(datum.value, cfg);
  let el: any = 'line';
  if (formatter instanceof DisplayObject) el = () => formatter;
  else if (isFunction(formatter)) el = () => getCallbackValue(formatter, [datum, index, data, tickVector]);
  return container.append(el).attr('className', CLASS_NAMES.tickItem.name);
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
  const { x1, x2, y1, y2 } = getTickLineLayout(datum, index, data, tickVector, cfg);
  const [tickStyle, groupStyle] = styleSeparator(getCallbackStyle(style, [datum, index, data]));
  tick.node().nodeName === 'line' && tick.styles({ x1, x2, y1, y2, ...tickStyle });
  group.attr(groupStyle);
  tick.styles(tickStyle);
}

function createTick(
  datum: AxisDatum,
  index: number,
  data: AxisDatum[],
  cfg: AxisStyleProps,
  style: any,
  animation: GenericAnimation
) {
  const tick = createTickEl(select(this), datum, index, data, cfg);
  applyTickStyle(datum, index, data, tick, this, cfg, style);
  const [x, y] = getValuePos(datum.value, cfg);
  transition(this, { x, y }, animation);
}

export function renderTicks(
  container: Selection,
  axisData: AxisDatum[],
  cfg: AxisStyleProps,
  callbackableStyle: any,
  animation: StandardAnimationOption
) {
  const finalData = filterExec(axisData, cfg.tickFilter);

  container
    .selectAll(CLASS_NAMES.tick.class)
    .data(finalData)
    .join(
      (enter) =>
        enter
          .append('g')
          .attr('className', CLASS_NAMES.tick.name)
          .each(function (datum, index) {
            createTick.call(this, datum, index, finalData, cfg, callbackableStyle, false);
          }),
      (update) =>
        update.each(function (datum, index) {
          this.removeChildren();
          createTick.call(this, datum, index, finalData, cfg, callbackableStyle, animation.update);
        }),
      (exit) =>
        exit.each(async function () {
          await fadeOut(this, animation.leave);
          this.remove();
        })
    );
}
