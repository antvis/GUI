/* global Keyframe */
import type { DisplayObject } from '@antv/g';
import { isNil } from '@antv/util';
import type { GUI } from '../core';
import { visibility } from '../util';
import type { AnimationOption, AnimationResult, GenericAnimation, StandardAnimationOption } from './types';

export function parseAnimationOption(option: AnimationOption): StandardAnimationOption {
  if (!option)
    return {
      enter: false,
      update: false,
      exit: false,
    };

  if ('enter' in option || 'update' in option || 'exit' in option) {
    if (Object.keys(option).length > 3) {
      const inferOption = Object.fromEntries(
        Object.entries(option).filter(([k, v]) => !['enter', 'update', 'exit'].includes(k))
      );
      return { enter: false, update: inferOption, exit: false };
    }
    return option as StandardAnimationOption;
  }

  return {
    enter: option,
    update: option,
    exit: option,
  };
}

export function onAnimateFinished(animation: AnimationResult, callback: () => void) {
  if (!animation) callback();
  else animation.finished.then(callback);
}

function attr(target: DisplayObject | GUI<any>, value: Record<string, any>) {
  if ('update' in target) target.update(value);
  else target.attr(value);
}

export function animate(target: DisplayObject | GUI<any>, keyframes: Keyframe[], options: GenericAnimation) {
  if (keyframes.length === 0) return null;
  if (!options) {
    const state = keyframes.slice(-1)[0];
    attr(target, { style: state });
    return null;
  }
  return target.animate(keyframes, options);
}

/**
 * transition source shape to target shape
 * @param source
 * @param target
 * @param options
 * @param after destroy or hide source shape after transition
 */
export function transitionShape(
  source: DisplayObject,
  target: DisplayObject,
  options: GenericAnimation,
  after: 'destroy' | 'hide' = 'destroy'
) {
  const afterTransition = () => {
    if (after === 'destroy') source.destroy();
    else if (after === 'hide') visibility(source, false);
    visibility(target, true);
  };
  if (!options) {
    afterTransition();
    return [null];
  }
  const { duration = 0, delay = 0 } = options;
  const middle = Math.ceil(+duration / 2);
  const offset = +duration / 4;

  const getPosition = (shape: DisplayObject) => {
    if (shape.nodeName === 'circle') {
      const [cx, cy] = shape.getLocalPosition();
      const r = shape.attr('r');
      return [cx - r, cy - r];
    }
    return shape.getLocalPosition();
  };

  const [sx, sy] = getPosition(source);
  const [ex, ey] = getPosition(target);
  const [mx, my] = [(sx + ex) / 2 - sx, (sy + ey) / 2 - sy];

  const sourceAnimation = source.animate(
    [
      { opacity: 1, transform: 'translate(0, 0)' },
      { opacity: 0, transform: `translate(${mx}, ${my})` },
    ],
    {
      fill: 'both',
      ...options,
      duration: delay + middle + offset,
    }
  );
  const targetAnimation = target.animate(
    [
      { opacity: 0, transform: `translate(${-mx}, ${-my})`, offset: 0.01 },
      { opacity: 1, transform: 'translate(0, 0)' },
    ],
    {
      fill: 'both',
      ...options,
      duration: middle + offset,
      delay: delay + middle - offset,
    }
  );

  onAnimateFinished(targetAnimation, afterTransition);
  return [sourceAnimation, targetAnimation];
}

/**
 * execute transition animation on element
 * @description in the current stage, only support the following properties:
 * x, y, width, height, opacity, fill, stroke, lineWidth, radius
 * @param target element to be animated
 * @param state target properties or element
 * @param options transition options
 * @param animate whether to animate
 * @returns transition instance
 */
export function transition(
  target: DisplayObject | GUI<any>,
  state: Record<string, any> | (DisplayObject | GUI<any>),
  options: GenericAnimation
) {
  const from: typeof state = {};
  const to: typeof state = {};
  Object.entries(state).forEach(([key, tarStyle]) => {
    const currStyle = target.attr(key);
    if (!isNil(tarStyle) && !isNil(currStyle) && currStyle !== tarStyle) {
      from[key] = currStyle;
      to[key] = tarStyle;
    }
  });

  if (!options) {
    attr(target, to);
    return null;
  }

  return animate(target, [from, to], { fill: 'both', ...options });
}
