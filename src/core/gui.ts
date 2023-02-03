import { CustomElement, Group } from '@antv/g';
import type { GenericAnimation } from '../animation';
import { deepAssign } from '../util';
import type { ComponentConfig } from './types';

export abstract class GUI<T extends Record<string, any>> extends CustomElement<T> {
  protected __data?: ComponentConfig<T>['data'];

  protected __layout?: ComponentConfig<T>['layout'];

  protected __events?: ComponentConfig<T>['events'];

  protected __animation?: ComponentConfig<T>['animation'];

  protected __interactions__?: ComponentConfig<T>['interactions'];

  public defaultOptions() {
    return {};
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
    this.__data = data;
    this.__layout = layout;
    this.__events = events;
    this.__animation = animation;
    this.__interactions__ = interactions;
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
