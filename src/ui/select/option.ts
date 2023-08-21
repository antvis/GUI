import { Group, Rect, Text } from '@antv/g';
import { GUI } from '../../core';
import { deepAssign } from '../../util/deep-assign';
import { subStyleProps, renderExtDo, select, parseSeriesAttr } from '../../util';
import type { OptionStyleProps, OptionOptions } from './types';

export class Option extends GUI<OptionStyleProps> {
  static defaultOptions: OptionOptions = {
    style: {
      value: '',
      label: '',
    },
  };

  private hoverColor = '#f5f5f5';

  private selectedColor = '#e6f7ff';

  private background = this.appendChild(new Rect({}));

  private label = this.background.appendChild(new Group({}));

  private get padding() {
    return parseSeriesAttr(this.style.padding);
  }

  private renderLabel() {
    const { label, value } = this.style;
    const labelStyle = subStyleProps(this.attributes, 'label');
    select(this.label)
      .maybeAppend('.label', () => renderExtDo(label))
      .attr('className', 'label')
      .styles(labelStyle);
    // bind data to label
    this.label.attr('__data__', value);
  }

  private renderBackground() {
    const labelBBox = this.label.getBBox();
    const [top, right, bottom, left] = this.padding;
    const { width: labelWidth, height: labelHeight } = labelBBox;
    const backgroundWidth = labelWidth + left + right;
    const backgroundHeight = labelHeight + top + bottom;
    const backgroundStyle = subStyleProps(this.attributes, 'background');
    const { width = backgroundWidth, height = backgroundHeight, selected } = this.style;
    this.background.attr({ ...backgroundStyle, width, height, fill: selected ? this.selectedColor : '#fff' });
    // place label
    this.label.attr({ x: left, y: (backgroundHeight - labelHeight) / 2 });
  }

  constructor(options: OptionOptions) {
    super(deepAssign({}, Option.defaultOptions, options));
  }

  render() {
    this.renderLabel();
    this.renderBackground();
  }

  public bindEvents() {
    this.addEventListener('mouseenter', () => {
      if (this.style.selected) return;
      this.background.attr('fill', this.hoverColor);
    });
    this.addEventListener('mouseleave', () => {
      if (this.style.selected) return;
      this.background.attr('fill', this.style.backgroundFill);
    });

    const item = this as unknown as typeof Option;
    this.addEventListener('click', () => {
      const { label, value, onClick } = this.style;
      onClick?.(value, { label, value }, item);
    });
  }
}
