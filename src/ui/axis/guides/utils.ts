import type { CallbackableObject } from '@/types';
import { getCallbackValue } from '@/util';
import { DisplayObject } from '@antv/g';
import { isFunction } from 'lodash';
import type { AxisCfg, AxisDatumCP } from '../types';

export function applyStyle(shape: DisplayObject, idx: number, attrs: any[], style?: any) {
  const datum = attrs[idx].data;
  const data = attrs.map((d) => d.data);
  const labelStyle = typeof style === 'function' ? style.call(null, datum, idx, data) : style;
  shape.attr(labelStyle || {});
}

export function getCallbackStyle<T>(style: CallbackableObject<T, AxisDatumCP>, params: AxisDatumCP) {
  return Object.fromEntries(
    Object.entries(style).map(([key, val]) => {
      return [key, getCallbackValue(val as any, params)];
    })
  );
}

export function baseDependencies(cfg: AxisCfg): any[] {
  if (cfg.type === 'linear') return [...cfg.startPos, ...cfg.endPos];
  return [...cfg.angleRange, ...cfg.center, cfg.radius];
}

export function filterExec<T>(data: T[], filter?: (...args: any) => boolean): T[] {
  return !!filter && isFunction(filter) ? data.filter(filter) : data;
}
