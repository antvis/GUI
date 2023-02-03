/* global KeyframeAnimationOptions */
import type { DisplayObjectConfig, IAnimation } from '@antv/g';

export type Animation = KeyframeAnimationOptions & Pick<IAnimation, 'onfinish' | 'oncancel' | 'onframe'>;

export interface ComponentConfig<T> extends DisplayObjectConfig<T> {
  data?: any;
  layout?: Record<string, any>;
  events?: Record<string, any>;
  animation?:
    | false
    | Animation
    | {
        appear?: Animation;
        enter?: Animation;
        update?: Animation;
        leave?: Animation;
      };
  interactions?: Record<string, any>;
}
