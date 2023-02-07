import { CustomElement, DisplayObjectConfig } from '@antv/g';
import { deepMix } from '@antv/util';
import { deepAssign } from './deep-assign';
import type { GenericAnimation } from '../animation';

type Descriptor<T> = {
  render?: (attributes: Required<T>, container: CustomElement<T>, animation?: GenericAnimation) => void;
  bindEvents?: (attributes: T, container: CustomElement<T>) => void;
};

export abstract class GUI<T> extends CustomElement<T> {
  abstract update(cfg?: Partial<T>, animation?: GenericAnimation): void;
}

export function createComponent<T>(
  descriptor: Descriptor<T>,
  defaultStyle?: Partial<T>
): new (c: DisplayObjectConfig<T>) => GUI<T> {
  return class extends CustomElement<T> {
    public descriptor: Descriptor<T>;

    constructor(config: DisplayObjectConfig<T>) {
      super(deepAssign({}, { style: defaultStyle }, config));
      this.descriptor = descriptor;
    }

    connectedCallback() {
      this.descriptor.render?.(this.attributes as Required<T>, this);
      this.descriptor.bindEvents?.(this.attributes, this);
    }

    public update(cfg: Partial<T> = {}, animation?: GenericAnimation) {
      this.attr(deepMix({}, this.attributes, cfg));
      this.descriptor.render?.(this.attributes as Required<T>, this, animation);
    }
  };
}
