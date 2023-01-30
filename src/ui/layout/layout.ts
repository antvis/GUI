import {
  ElementEvent,
  Group,
  type DisplayObject,
  type DisplayObjectConfig,
  type FederatedEvent,
  type INode,
} from '@antv/g';
import { BBox } from '../../util';
import { calcLayout } from '../../util/layout';
import { normalSeriesAttr, type NormalSeriesAttr, type SeriesAttr } from '../../util/series';
import type { LayoutOptions, LayoutStyleProps } from './types';

export type { LayoutOptions, LayoutStyleProps };

export class Layout extends Group {
  private layoutEvents: ElementEvent[] = [ElementEvent.BOUNDS_CHANGED, ElementEvent.INSERTED, ElementEvent.REMOVED];

  private $margin: NormalSeriesAttr = normalSeriesAttr(0);

  private $padding: NormalSeriesAttr = normalSeriesAttr(0);

  public set margin(value: SeriesAttr) {
    this.$margin = normalSeriesAttr(value);
  }

  public get margin() {
    return this.$margin;
  }

  public set padding(value: SeriesAttr) {
    this.$padding = normalSeriesAttr(value);
  }

  public get padding() {
    return this.$padding;
  }

  public getBBox() {
    const { x = 0, y = 0, width, height } = this.attributes;
    const [marginTop, marginRight, marginBottom, marginLeft] = this.$margin;
    return new BBox(x - marginLeft, y - marginTop, width + marginLeft + marginRight, height + marginTop + marginBottom);
  }

  public appendChild<T extends INode>(child: T, index?: number): T {
    (child as unknown as DisplayObject).isMutationObserved = true;
    super.appendChild(child, index);
    return child;
  }

  public getAvailableSpace() {
    const { width, height } = this.attributes;
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.$padding;
    const [marginTop, , , marginLeft] = this.$margin;
    return new BBox(
      paddingLeft + marginLeft,
      paddingTop + marginTop,
      width - paddingLeft - paddingRight,
      height - paddingTop - paddingBottom
    );
  }

  constructor(cfg: DisplayObjectConfig<LayoutStyleProps>) {
    super(cfg);
    const { margin = 0, padding = 0 } = cfg.style || {};
    this.margin = margin;
    this.padding = padding;

    this.isMutationObserved = true;
    this.bindEvents();
  }

  layout() {
    if (!this.attributes.display || !this.isConnected) return;
    if (this.children.some((child) => !child.isConnected)) return;
    try {
      const bboxes = calcLayout(
        this.getAvailableSpace(),
        this.children.map((child) => (child as DisplayObject).getBBox()),
        this.attributes
      );

      this.children.forEach((child, index) => {
        const { x, y } = bboxes[index];
        (child as DisplayObject).attr({ x, y });
      });
    } catch (e) {
      // do nothing
    }
  }

  bindEvents() {
    this.layoutEvents.forEach((event) => {
      this.addEventListener(event, (e: FederatedEvent) => {
        (e.target as DisplayObject).isMutationObserved = true;
        this.layout();
      });
    });
  }

  destroy() {
    this.removeAllEventListeners();
  }

  attributeChangedCallback(name: string, value: any, oldValue: any) {
    if (name === 'margin') this.margin = value;
    else if (name === 'padding') this.padding = value;
    this.layout();
  }
}
