import { CustomElement, Group } from '@antv/g';
import type { GenericAnimation } from '../animation';
import { deepAssign } from '../util';
import type { ComponentConfig } from './types';

// type ReqiuredComponentConfig<T> = Required<ComponentConfig<T>>;

export abstract class GUI<
  T extends { style?: any; data?: any; layout?: any; events?: any; animation?: any; interactions?: any }
> extends CustomElement<T extends { style: infer S } ? S : any> {
  protected data: Required<T extends { data: infer D } ? D : any>;

  protected layout: Required<T extends { layout: infer L } ? L : any>;

  protected events: Required<T extends { events: infer E } ? E : any>;

  protected animation:
    | false
    | Animation
    | {
        appear?: Animation;
        enter?: Animation;
        update?: Animation;
        leave?: Animation;
      };

  protected interactions: Required<T extends { interactions: infer I } ? I : any>;

  public defaultOptions(): T extends { style: infer S } ? S : any {
    return {} as any;
  }

  constructor(options: ComponentConfig<T>) {
    super();
    const {
      style = {},
      data,
      layout,
      events,
      animation,
      interactions,
    } = deepAssign({}, this.defaultOptions(), options);

    this.attr(style);
    this.data = data;
    this.layout = layout;
    this.events = events;
    this.animation = animation;
    this.interactions = interactions;
  }

  connectedCallback() {
    this.render(this.attributes as Required<T>, this);
    this.bindEvents(this.attributes, this);
  }

  public update(cfg: Partial<T> = {}, animate?: GenericAnimation) {
    this.attr(deepAssign({}, this.attributes, cfg));
    return this.render?.(this.attributes as Required<T>, this, animate);
  }

  public clear() {
    this.removeChildren();
  }

  public destroy() {
    this.removeAllEventListeners();
    this.removeChildren();
    this.remove();
  }

  attributeChangedCallback() {}

  public abstract render(attributes: T, container: Group, animate?: GenericAnimation): any;

  public bindEvents(attributes: T, container: Group): void {}
}
