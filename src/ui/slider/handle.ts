import { CustomElement, TextStyleProps, DisplayObjectConfig, ElementEvent, Text } from '@antv/g';
import { deepMix, get, omit } from '@antv/util';
import { Marker, MarkerStyleProps } from '../marker';
import { applyStyle, maybeAppend, select } from '../../util';

export type HandleStyleProps = {
  x?: number;
  y?: number;
  align: 'start' | 'end';
  orient?: 'horizontal' | 'vertical';
  max?: number;
  markerStyle?: Partial<MarkerStyleProps> & {
    active?: {
      fill?: string;
      fillOpacity?: number;
      stroke?: string;
      strokeOpacity?: number;
    };
  };
  textStyle?: Partial<Omit<TextStyleProps, 'x' | 'y'>>;
};

Marker.registerSymbol('slider-handle', (x: number, y: number, r: number) => {
  const width = r * 2;
  const height = width * 2.4;

  return [
    ['M', x - width / 2, y - height / 2],
    ['L', x + width / 2, y - height / 2],
    ['L', x + width / 2, y + height / 2],
    ['L', x - width / 2, y + height / 2],
    ['Z'],
    ['M', x - width / 6, y - height / 5],
    ['L', x - width / 6, y + height / 5],
    ['M', x + width / 6, y - height / 5],
    ['L', x + width / 6, y + height / 5],
  ];
});

Marker.registerSymbol('simple-slider-handle', (x: number, y: number, r: number) => {
  const width = r * 2;
  const height = width * 2;

  const circleR = 1.5;
  return [
    ['M', x, y - height / 2 + circleR],
    ['L', x, y + height / 2 - circleR],
    ['M', x, y - height / 2 - circleR],
    ['A', circleR, circleR, 0, 1, 1, x, y - height / 2 + circleR],
    ['A', circleR, circleR, 0, 1, 1, x, y - height / 2 - circleR],
    ['Z'],
    ['M', x, y + height / 2 - circleR],
    ['A', circleR, circleR, 0, 1, 1, x, y + height / 2 + circleR],
    ['A', circleR, circleR, 0, 1, 1, x, y + height / 2 - circleR],
    ['Z'],
  ];
});

export class Handle extends CustomElement<HandleStyleProps> {
  public static defaultOptions = {
    style: {
      markerStyle: {
        size: 12,
        symbol: 'slider-handle',
        fill: '#F7F7F7',
        stroke: '#BFBFBF',
        strokeOpacity: 0.75,
        lineWidth: 1,
        fillOpacity: 1,
        active: {
          fill: '#FFF',
        },
      },
      textStyle: {
        text: '',
        fontSize: 10,
        textBaseline: 'middle',
        fill: '#000',
        fillOpacity: 0.65,
      },
    },
  };

  constructor(options: DisplayObjectConfig<HandleStyleProps>) {
    super(deepMix({}, Handle.defaultOptions, options));
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  public getType() {
    return get(this.attributes, 'handleType');
  }

  public update(cfg: Partial<HandleStyleProps>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  private get styles(): Required<HandleStyleProps> {
    return deepMix({}, Handle.defaultOptions.style, this.attributes);
  }

  private render() {
    const { markerStyle, textStyle, align, orient } = this.styles;
    const width = Number(markerStyle.size) || 10;

    maybeAppend(this, '.handle-marker', () => new Marker({}))
      .attr('className', 'handle-marker')
      .call((selection) => {
        (selection.node() as Marker).update({
          size: width,
          transformOrigin: 'center',
          transform: orient === 'vertical' ? 'rotate(45deg)' : '',
          lineCap: 'round',
          ...omit(markerStyle, ['active']),
        });
      });

    let textAlign = 'center';
    let textBaseline = align === 'start' ? 'bottom' : 'top';
    if (orient !== 'vertical') {
      textAlign = align === 'start' ? 'right' : 'left';
      textBaseline = 'middle';
    }
    const offset = width / 2 + 4;
    maybeAppend(this, '.handle-label', 'text')
      .attr('className', 'handle-label')
      .call(applyStyle, textStyle)
      .style('dx', orient === 'vertical' ? 0 : (align === 'start' ? -1 : 1) * offset)
      .style('dy', orient === 'vertical' ? (align === 'start' ? -1 : 1) * offset : 0)
      .style('textAlign', textAlign)
      .style('textBaseline', textBaseline);
  }

  private bindEvents() {
    const marker = select(this).select('.handle-marker').node() as Marker;
    const label = select(this).select('.handle-label').node() as Text;
    select(marker).on('mouseenter', () => {
      const { active: activeStyle } = this.styles.markerStyle;
      marker.attr(activeStyle || {});
    });
    select(marker).on('mouseleave', () => {
      const { size, active: activeStyle, ...markerStyle } = this.styles.markerStyle;
      marker.attr(markerStyle);
    });

    select(label)
      .on(ElementEvent.ATTR_MODIFIED, () => this.dodgeText())
      .on(ElementEvent.BOUNDS_CHANGED, () => this.dodgeText());
  }

  private dodgeText() {
    const label = select(this).select('.handle-label').node() as Text;
    const size = (this.styles.markerStyle?.size || 10) as number;
    const offset = size / 2 + 4;
    const { halfExtents } = label.getLocalBounds();
    if (this.styles.orient === 'vertical') {
      const length = halfExtents[1] * 2;
      if (this.style.align === 'start') {
        if (length + offset >= this.getLocalPosition()[1]) {
          label.attr({ dy: offset, textBaseline: 'top' });
        } else {
          label.attr({ dy: -offset, textBaseline: 'bottom' });
        }
      } else if (this.styles.max) {
        if (this.getLocalPosition()[1] + length + offset > this.styles.max) {
          label.attr({ dy: -offset, textBaseline: 'bottom' });
        } else {
          label.attr({ dy: offset, textBaseline: 'top' });
        }
      }
    } else {
      const length = halfExtents[0] * 2;
      if (this.style.align === 'start') {
        if (length + offset >= this.getLocalPosition()[0]) {
          label.attr({ dx: offset, textAlign: 'left' });
        } else {
          label.attr({ dx: -offset, textAlign: 'right' });
        }
      } else if (this.styles.max) {
        if (this.getLocalPosition()[0] + length + offset > this.styles.max) {
          label.attr({ dx: -offset, textAlign: 'right' });
        } else {
          label.attr({ dx: offset, textAlign: 'left' });
        }
      }
    }
  }
}
