import type { AnimationOption, StandardAnimationOption } from './types';

export function parseAnimationOption(option: AnimationOption): StandardAnimationOption {
  if (!option)
    return {
      enter: false,
      update: false,
      leave: false,
    };

  if ('enter' in option || 'update' in option || 'leave' in option) {
    return option as StandardAnimationOption;
  }

  return {
    enter: option,
    update: option,
    leave: option,
  };
}
