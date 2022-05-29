import { CustomElement, TextStyleProps, DisplayObjectConfig } from '@antv/g';
import { deepMix, get, omit } from '@antv/util';
import { Marker, MarkerStyleProps } from '../marker';
import { applyStyle, maybeAppend, select } from '../../util';

export type HandleStyleProps = {
  x?: number;
  y?: number;
  align: 'start' | 'end';
  orient?: 'horizontal' | 'vertical';
  markerStyle?: Partial<MarkerStyleProps> & {
    active?: {
      fill?: string;
      fillOpacity?: number;
      stroke?: string;
      strokeOpacity?: number;
    };
  };
  textStyle?: Omit<TextStyleProps, 'x' | 'y'>;
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
    let width = Number(markerStyle.size) || 10;
    let height = 2.4 * width;
    [width, height] = orient === 'vertical' ? [height, width] : [width, height];

    maybeAppend(this, '.handle-marker', () => new Marker({}))
      .attr('className', 'handle-marker')
      .call((selection) => {
        (selection.node() as Marker).update({
          size: width,
          transformOrigin: 'center',
          transform: orient === 'vertical' ? 'rotate(90deg)' : '',
          lineCap: 'round',
          ...omit(markerStyle, ['active']),
        });
      });

    let textAlign = 'center';
    let textBaseline = align === 'start' ? 'bottom' : 'top';
    if (orient !== 'vertical') {
      textAlign = align === 'start' ? 'end' : 'start';
      textBaseline = 'middle';
    }

    maybeAppend(this, '.handle-label', 'text')
      .attr('className', 'handle-label')
      .call(applyStyle, textStyle)
      .style('x', orient === 'vertical' ? 0 : (align === 'start' ? -1 : 1) * (width / 2 + 4))
      .style('y', orient === 'vertical' ? (align === 'start' ? -1 : 1) * (height / 2 + 4) : 0)
      .style('textAlign', textAlign)
      .style('textBaseline', textBaseline);
  }

  private bindEvents() {
    const marker = select(this).select('.handle-marker').node() as Marker;
    select(marker).on('mouseenter', () => {
      const { active: activeStyle } = this.styles.markerStyle;
      marker.attr(activeStyle || {});
    });
    select(marker).on('mouseleave', () => {
      const { size, active: activeStyle, ...markerStyle } = this.styles.markerStyle;
      marker.attr(markerStyle);
    });
  }
}
