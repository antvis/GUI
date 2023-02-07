import { DisplayObject } from '@antv/g';
import { isFunction } from '@antv/util';
import type { CallbackableObject } from '../../../types';
import { getCallbackValue } from '../../../util';
import type { AxisStyleProps, AxisDatumCP } from '../types';

export function getCallbackStyle<T extends { [keys: string]: any }>(
  style: CallbackableObject<T, AxisDatumCP>,
  params: AxisDatumCP
) {
  return Object.fromEntries(
    Object.entries(style).map(([key, val]) => {
      return [key, getCallbackValue(val as any, params)];
    })
  );
}

export function baseDependencies(cfg: AxisStyleProps): any[] {
  if (cfg.type === 'linear') return [...cfg.startPos, ...cfg.endPos];
  return [...cfg.angleRange, ...cfg.center, cfg.radius];
}

export function filterExec<T>(data: T[], filter?: (...args: any) => boolean): T[] {
  return !!filter && isFunction(filter) ? data.filter(filter) : data;
}
