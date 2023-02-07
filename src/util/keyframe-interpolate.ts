import type { DisplayObject, IAnimation } from '@antv/g';
import { interpolate, type Interpolatable } from './interpolate';
import type { GenericAnimation } from '../animation';

export function keyframeInterpolate<T extends Interpolatable>(
  element: DisplayObject,
  from: T,
  to: T,
  options: GenericAnimation,
  onframe?: (this: IAnimation, ev: AnimationPlaybackEvent, data: T) => any,
  onfinish?: (this: IAnimation, ev: AnimationPlaybackEvent, data: T) => any
) {
  if (!options) {
    element.attr('__keyframe_data__', from);
    // @ts-ignore
    onframe?.call(null, null, to);
    return { finished: Promise.resolve() };
  }

  const { duration = 0 } = options;
  const int = interpolate(from, to);
  const count = Math.ceil(+duration / 16);
  const keyframes = new Array(count)
    .fill(0)
    .map((datum, index, array) => ({ __keyframe_data__: int(index / (array.length - 1)) }));

  // @ts-ignore
  const animation = element.animate(keyframes, options);
  if (animation) {
    animation.onframe = function (ev) {
      return onframe?.call(this, ev, element.style.__keyframe_data__);
    };
    animation.onfinish = function (ev) {
      return onfinish?.call(this, ev, element.style.__keyframe_data__);
    };
  }
  return animation;
}
