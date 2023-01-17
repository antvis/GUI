import { Group, ElementEvent, type GroupStyleProps, type DisplayObjectConfig, type DisplayObject } from '@antv/g';
import { SeriesAttr, NormalSeriesAttr, normalSeriesAttr } from '../../util/series';
import { throttle } from '../../util';
import { type LayoutElementConfig, calcLayout } from '../../util/layout';

export type BoxStyleProps = GroupStyleProps &
  LayoutElementConfig & {
    width: number;
    height: number;
    margin?: SeriesAttr;
    border?: SeriesAttr;
    padding?: SeriesAttr;
  };

export class Layout extends Group {
  private layoutEvents: ElementEvent[] = [ElementEvent.INSERTED, ElementEvent.REMOVED, ElementEvent.BOUNDS_CHANGED];

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
    return new DOMRect(
      x - marginLeft,
      y - marginTop,
      width + marginLeft + marginRight,
      height + marginTop + marginBottom
    );
  }

  public getAvailableSpace() {
    const { x = 0, y = 0, width, height } = this.attributes;
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.$padding;
    return new DOMRect(
      x + paddingLeft,
      y + paddingTop,
      width - paddingLeft - paddingRight,
      height - paddingTop - paddingBottom
    );
  }

  constructor(cfg: DisplayObjectConfig<BoxStyleProps>) {
    super(cfg);
    const { margin = 0, padding = 0 } = cfg.style || {};
    this.margin = margin;
    this.padding = padding;
  }

  @throttle(16, true)
  layout() {
    if (!this.attributes.display) return;
    this.children.forEach((child) => {
      (child as Layout).layout?.();
    });
    const bboxes = calcLayout(
      this.getAvailableSpace(),
      this.children.map((child) => (child as DisplayObject).getBBox()),
      this.attributes
    );
    this.children.forEach((child, index) => {
      const { x, y } = bboxes[index];
      (child as DisplayObject).attr({ x, y });
    });
  }

  bindEvents() {
    this.layoutEvents.forEach((event) => {
      this.addEventListener(event, this.layout);
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
