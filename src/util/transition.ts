import type { DisplayObject } from '@antv/g';
import { isNil } from '@antv/util';
import type { GUI } from '../core/gui';

export function transition(
  el: DisplayObject | GUI<any>,
  target: { [key: string]: any },
  options: any = {},
  animate: boolean = true,
  lowerLimit: number = 50
): Promise<any> {
  const from: typeof target = {};
  const to: typeof target = {};
  Object.keys(target).forEach((key) => {
    const style = el.attr(key);
    if (!isNil(style) && style !== target[key] && Math.abs(style - target[key]) > lowerLimit) {
      from[key] = style;
      to[key] = target[key];
    }
  });

  const applyStyle = () => {
    if ('update' in el) el.update(target);
    else
      Object.keys(target).forEach((key) => {
        el.attr(key, target[key]);
      });

    return Promise.resolve();
  };

  if (!animate) return applyStyle();
  if (Object.keys(from).length > 0) {
    return el.animate([from, to], { fill: 'both', ...options })?.finished.then(applyStyle) || Promise.resolve();
  }

  return Promise.resolve();
}
