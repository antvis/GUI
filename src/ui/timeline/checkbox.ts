import { CustomElement, DisplayObjectConfig } from '@antv/g';
import { deepMix } from '@antv/util';
import { applyStyle, maybeAppend } from '../../util';
import { CheckboxStyleProps } from './types';

type StyleProps = CheckboxStyleProps & {
  x?: number;
  y?: number;
};

export class Checkbox extends CustomElement<StyleProps> {
  public static defaultOptions = {
    style: {
      size: 12,
      labelStyle: {
        text: '',
        textAlign: 'left',
        textBaseline: 'middle',
        fill: '#000',
        fillOpacity: 0.65,
      },
    },
  };

  constructor(options: DisplayObjectConfig<StyleProps>) {
    super(deepMix({}, Checkbox.defaultOptions, options));
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private get styles(): Required<StyleProps> {
    return deepMix({}, Checkbox.defaultOptions.style, this.attributes);
  }

  public update(cfg: Partial<StyleProps> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  private render() {
    maybeAppend(this, '.button', 'rect')
      .attr('className', 'button')
      .style('x', 0)
      .style('y', 0)
      .style('width', this.styles.size)
      .style('height', this.styles.size)
      .style('fill', 'transparent')
      .style('stroke', '#000')
      .style('strokeOpacity', 0.15)
      .style('lineWidth', 1)
      .style('radius', 2)
      .style('cursor', 'pointer');

    maybeAppend(this, '.label', 'text')
      .attr('className', 'label')
      .style('x', this.styles.size)
      .style('y', this.styles.size / 2)
      .call(applyStyle, this.styles.labelStyle);
  }

  private bindEvents() {}
}
