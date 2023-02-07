import type { DisplayObject } from '@antv/g';
import { transition } from '../util';
import type { GenericAnimation } from '.';

export default function (element: DisplayObject, options: GenericAnimation) {
  if (!options) {
    element.attr('opacity', 1);
    return { finished: Promise.resolve() };
  }
  return transition(element, { opacity: 0 }, options);
}
