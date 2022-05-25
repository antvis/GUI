import { CustomElement, DisplayObjectConfig, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import { maybeAppend, normalPadding, select } from '../../util';
import { Button, ButtonStyleProps } from './button';
import { TimeData } from './types';
import { SliderAxis, SliderAxisStyleProps } from './sliderAxis';
import { CellAxis } from './cellAxis';
import { SpeedControl } from './speedcontrol';
import { AxisStyleProps } from './axisBase';

type Axis = SliderAxis | CellAxis;

type TimelineStyleProps = {
  x?: number;
  y?: number;
  data: TimeData[];
  width?: number;
  height?: number;
  padding?: number | number[];
  orient?: 'horizontal' | 'vertical';
  selection?: number | [number, number];
  type?: 'slider' | 'cell';
  singleModeControl?: any | null;
  speedControl?: any | null;
  speeds?: [number, number, number, number, number];
  controlPosition?: 'bottom' | 'left' | 'right';
  controlButton?: {
    prevBtn?: any | null;
    playBtn?: Omit<ButtonStyleProps, 'x' | 'y'> | null;
    nextBtn?: any | null;
  } | null;
  axisSize?: number;
  selectionStyle?: AxisStyleProps['selectionStyle'];
  lineStyle?: SliderAxisStyleProps['lineStyle'];
  handleStyle?: SliderAxisStyleProps['handleStyle'];
  label?: SliderAxisStyleProps['label'];
  loop?: boolean;
  playInterval?: number;
  autoPlay?: boolean;
  singleMode?: boolean;
  playMode?: 'increase' | 'fixed';
};

export type TimelineOptions = DisplayObjectConfig<TimelineStyleProps>;

const DEFAULT_STYLE: TimelineStyleProps = {
  x: 0,
  y: 0,
  data: [],
  width: 500,
  height: 40,
  selection: [0, 0],
  orient: 'horizontal',
  singleModeControl: {},
  speedControl: {},
  speeds: [1.0, 2.0, 3.0, 4.0, 5.0],
  controlPosition: 'bottom',
  controlButton: {
    playBtn: {
      padding: 4,
      size: 12,
      symbol: '',
      markerStyle: {
        default: {
          stroke: '#bfbfbf',
          fill: '#bfbfbf',
        },
        active: {
          stroke: '#3471F9',
          fill: '#3471F9',
          cursor: 'pointer',
        },
      },
      backgroundStyle: {
        default: {
          stroke: '#bfbfbf',
          lineWidth: 1,
          radius: 10,
          fill: '#F7F7F7',
        },
        active: {
          fill: 'rgba(52, 113, 249, 0.1)',
          stroke: '#3471F9',
          cursor: 'pointer',
        },
      },
    },
  },
  loop: false,
  autoPlay: false,
  playInterval: 2000,
  axisSize: 8,
  label: {
    position: 1,
  },
};

const DEFAULT_MARKER_STYLE = {
  symbol: '',
  size: 8,
  padding: [2, 4],
  markerStyle: {
    default: {
      stroke: '#bfbfbf',
      cursor: 'pointer' as any,
    },
    active: {
      stroke: '#3471F9',
    },
  },
  backgroundStyle: {
    default: {
      fill: 'transparent',
      cursor: 'pointer' as any,
    },
  },
};

function layoutControl(
  position: string,
  length: number,
  cfg: TimelineStyleProps
): {
  [k: string]: any;
} {
  const axisLabelPosition = cfg.label?.position || -1;
  const axisSize = cfg.axisSize!;
  // todo. infer by label fontSize, whether show tickLine.
  const axisLabelHeight = cfg.label === null ? 0 : 20;
  const playBtnSize = cfg.controlButton?.playBtn?.size!;
  const speedControlSize = 8;
  // Default 32px.
  const speedControlWidth = 32;
  const axisY = (axisLabelPosition === -1 ? axisLabelHeight : 0) + axisSize / 2;

  if (position === 'bottom') {
    return {
      axisY,
      // axisX:
      paddingLeft: 20,
      paddingRight: 20,
      playBtnX: length / 2,
      playBtnY: axisLabelHeight + axisSize + 10 + playBtnSize / 2,
      speedControlX: length - (speedControlWidth + 4),
      speedControlY: axisLabelHeight + axisSize + 6,
    };
  }
  if (position === 'left') {
    return {
      axisY,

      paddingLeft: 62,
      paddingRight: 56,
      playBtnX: 16 + playBtnSize,
      playBtnY: axisY,
      speedControlX: length - speedControlWidth,
      speedControlY: axisLabelPosition === -1 ? axisY - speedControlSize * 2 + axisSize / 2 : 0,
    };
  }

  return {
    axisY,
    paddingLeft: 20,
    paddingRight: 102,
    playBtnX: length - 28 - (speedControlWidth + 8),
    playBtnY: axisY,
    speedControlX: length - (speedControlWidth + 8),
    speedControlY: axisLabelPosition === -1 ? axisY - speedControlSize * 2 + axisSize / 2 : 0,
  };
}

export class Timeline extends CustomElement<TimelineStyleProps> {
  private speed = 1;

  private playing = false;

  constructor(options: DisplayObjectConfig<TimelineStyleProps>) {
    super(deepMix({}, { style: DEFAULT_STYLE }, options));
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  public update(cfg: Partial<TimelineStyleProps> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render();
  }

  private render() {
    const [pt = 0, pr = 0, , pl = pr] = normalPadding(this.style.padding);

    const container = maybeAppend(this, '.container', 'g')
      .attr('className', 'container')
      .style('x', pl)
      .style('y', pt)
      .node();

    const { data: timeData, speeds = [] } = this.style;
    const { axisY, playBtnX, playBtnY, paddingLeft, paddingRight, speedControlX, speedControlY } = layoutControl(
      this.style.controlPosition!,
      this.style.width!,
      this.style
    );

    this.renderAxis(container);

    maybeAppend(container, '.timeline-speed-control', () => new SpeedControl({}))
      .attr('className', 'timeline-speed-control')
      .call((selection) => {
        (selection.node() as SpeedControl).update({
          x: speedControlX,
          y: speedControlY,
          speeds,
          initialSpeedIdx: (speeds as any)!.indexOf(this.speed),
        });
      });

    const stopButtonSize = this.style.controlButton?.playBtn?.size || 10;
    const offset = stopButtonSize / 2 + DEFAULT_MARKER_STYLE.size / 2 + 8;
    maybeAppend(container, '.timeline-prev-btn', () => new Button({}))
      .attr('className', 'timeline-prev-btn')
      .call((selection) => {
        (selection.node() as Button).update({
          ...DEFAULT_MARKER_STYLE,
          x: playBtnX - offset,
          y: playBtnY,
          symbol: 'timeline-prev-button',
        });
      });

    maybeAppend(container, '.timeline-play-btn', () => new Button({}))
      .attr('className', 'timeline-play-btn')
      .call((selection) => {
        (selection.node() as Button).update({
          ...(this.style.controlButton?.playBtn || {}),
          size: stopButtonSize,
          x: playBtnX,
          y: playBtnY,
          symbol: !this.playing ? 'timeline-stop-button' : 'timeline-play-button',
        });
      });

    maybeAppend(container, '.timeline-next-btn', () => new Button({}))
      .attr('className', 'timeline-next-btn')
      .call((selection) => {
        (selection.node() as Button).update({
          ...DEFAULT_MARKER_STYLE,
          x: playBtnX + offset,
          y: playBtnY,
          symbol: 'timeline-next-button',
        });
      });

    if (this.style.autoPlay) {
      if (!this.playing) {
        this.playing = true;

        (select(this).select('.timeline-axis').node() as Axis).play();
        const playStopBtn = select(this).select('.timeline-play-btn').node() as Button;
        playStopBtn.update({ symbol: 'timeline-play-button' });
      }
    }
  }

  private renderAxis(container: Group) {
    const { data: timeData, type, width, height } = this.style;
    const length = this.style.orient! === 'vertical' ? height : width;
    const { axisY, paddingLeft, paddingRight } = layoutControl(this.style.controlPosition!, length!, this.style);

    let axis = select(container).select('.timeline-axis').node() as Axis | undefined;
    const Ctor = type === 'cell' ? CellAxis : SliderAxis;
    // @ts-ignore
    if (axis && axis.tag !== `${type}-axis`) {
      axis.remove();
      this.removeChild(axis);
      axis = undefined;
    }

    axis = maybeAppend(
      container,
      '.timeline-axis',
      () => new Ctor({ style: { timeData, selection: this.style.selection } })
    )
      .attr('className', 'timeline-axis')
      .call((selection) =>
        (selection.node() as Axis).update({
          x: paddingLeft,
          y: axisY,
          timeData,
          orient: this.style.orient!,
          length: length! - (paddingLeft + paddingRight),
          // @ts-ignore
          size: this.style.axisSize!,
          // @ts-ignore
          lineStyle: this.style.lineStyle,
          selectionStyle: this.style.selectionStyle || undefined,
          label: this.style.label,
          handleStyle: this.style.handleStyle,
          loop: this.style.loop,
          singleMode: this.style.singleMode,
          playMode: this.style.playMode,
          playInterval: this.style.playInterval! / this.speed,
        })
      )
      .node() as Axis;
    if (String(this.style.selection) !== String(axis.style.selection)) {
      axis.update({ selection: this.style.selection });
    }
  }

  private bindEvents() {
    const axis = select(this).select('.timeline-axis').node() as SliderAxis;
    const playStopBtn = select(this).select('.timeline-play-btn').node() as Button;
    select(playStopBtn).on('mousedown', (evt: any) => {
      if (this.playing) {
        this.playing = false;
        axis.stop();
        playStopBtn.update({ symbol: 'timeline-stop-button' });
      } else {
        this.playing = true;
        axis.play();
        playStopBtn.update({ symbol: 'timeline-play-button' });
      }
    });

    select(this).on('timelineStopped', () => {
      this.playing = false;
      playStopBtn.update({ symbol: 'timeline-stop-button' });
    });

    select(this).on('speedChanged', (evt: any) => {
      this.speed = evt.detail.speed;
      axis.update({ playInterval: this.style.playInterval! / this.speed });
    });

    select(this)
      .select('.timeline-prev-btn')
      .on('mousedown', () => axis.prev());
    select(this)
      .select('.timeline-next-btn')
      .on('mousedown', () => axis.next());
  }
}
