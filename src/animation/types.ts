/* global KeyframeAnimationOptions */
export type GenericAnimation = false | KeyframeAnimationOptions;

export type StandardAnimationOption = {
  enter: GenericAnimation;
  update: GenericAnimation;
  exit: GenericAnimation;
};

export type AnimationOption = GenericAnimation | StandardAnimationOption;
