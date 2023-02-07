/* global KeyframeAnimationOptions */
import type { DisplayObjectConfig, IAnimation } from '@antv/g';

export type Animation = KeyframeAnimationOptions & Pick<IAnimation, 'onfinish' | 'oncancel' | 'onframe'>;

export interface ComponentConfig<
  S extends { style?: any; data?: any; layout?: any; events?: any; animation?: any; interactions?: any }
> extends DisplayObjectConfig<S> {
  data?: S['data'];
  layout?: S['layout'];
  events?: S['events'];
  style?: S['style'];
  animation?:
    | false
    | Animation
    | {
        appear?: Animation;
        enter?: Animation;
        update?: Animation;
        leave?: Animation;
      };
  interactions?: S['interactions'];
}
