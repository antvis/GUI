import { CustomElement, DisplayObjectConfig } from '@antv/g';
import { deepMix } from '@antv/util';
import { maybeAppend, select } from '../../util';
import { Button, ButtonStyleProps } from './button';
import { TimeData } from './types';
import { SliderAxis, SliderAxisStyleProps } from './sliderAxis';
import { CellAxis } from './cellAxis';
import { SpeedControl } from './speedcontrol';
import { AxisStyleProps } from './axisBase';

type TimelineStyleProps = {
  x?: number;
  y?: number;
  data: TimeData[];
  width?: number;
  height?: number;
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

function layoutControl(position: string, width: number, cfg: TimelineStyleProps) {
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
      paddingLeft: 20,
      paddingRight: 20,
      playBtnX: width / 2,
      playBtnY: axisLabelHeight + axisSize + 10 + playBtnSize / 2,
      speedControlX: width - (speedControlWidth + 4),
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
      speedControlX: width - speedControlWidth,
      speedControlY: axisLabelPosition === -1 ? axisY - speedControlSize * 2 + axisSize / 2 : 0,
    };
  }

  return {
    axisY,
    paddingLeft: 20,
    paddingRight: 102,
    playBtnX: width - 28 - (speedControlWidth + 8),
    playBtnY: axisY,
    speedControlX: width - (speedControlWidth + 8),
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
    const { data: timeData, speeds = [] } = this.style;
    const { axisY, playBtnX, playBtnY, paddingLeft, paddingRight, speedControlX, speedControlY } = layoutControl(
      this.style.controlPosition!,
      this.style.width!,
      this.style
    );

    this.renderAxis();

    maybeAppend(this, '.speed-control', () => new SpeedControl({}))
      .attr('className', 'speed-control')
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
    maybeAppend(this, '.btn-prev', () => new Button({}))
      .attr('className', 'btn-prev')
      .call((selection) => {
        (selection.node() as Button).update({
          ...DEFAULT_MARKER_STYLE,
          x: playBtnX - offset,
          y: playBtnY,
          symbol: 'timeline-prev-button',
        });
      });

    maybeAppend(this, '.btn-play', () => new Button({}))
      .attr('className', 'btn-play')
      .call((selection) => {
        (selection.node() as Button).update({
          ...(this.style.controlButton?.playBtn || {}),
          size: stopButtonSize,
          x: playBtnX,
          y: playBtnY,
          symbol: !this.playing ? 'timeline-stop-button' : 'timeline-play-button',
        });
      });

    maybeAppend(this, '.btn-next', () => new Button({}))
      .attr('className', 'btn-next')
      .call((selection) => {
        (selection.node() as Button).update({
          ...DEFAULT_MARKER_STYLE,
          x: playBtnX + offset,
          y: playBtnY,
          symbol: 'timeline-next-button',
        });
      });
  }

  private renderAxis() {
    const { data: timeData, type } = this.style;
    const { axisY, paddingLeft, paddingRight } = layoutControl(
      this.style.controlPosition!,
      this.style.width!,
      this.style
    );

    type Axis = SliderAxis | CellAxis;
    let axis = select(this).select('.timeline-axis').node() as Axis | undefined;
    const Ctor = type === 'cell' ? CellAxis : SliderAxis;
    // @ts-ignore
    if (axis && axis.tag !== `${type}-axis`) {
      axis.remove();
      this.removeChild(axis);
      axis = undefined;
    }

    axis = maybeAppend(this, '.timeline-axis', () => new Ctor({ style: { timeData, selection: this.style.selection } }))
      .attr('className', 'timeline-axis')
      .call((selection) =>
        (selection.node() as Axis).update({
          x: paddingLeft,
          y: axisY,
          timeData,
          length: this.style.width! - (paddingLeft + paddingRight),
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
    const playStopBtn = select(this).select('.btn-play').node() as Button;
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
      .select('.btn-prev')
      .on('mousedown', () => axis.prev());
    select(this)
      .select('.btn-next')
      .on('mousedown', () => axis.next());
  }
}
