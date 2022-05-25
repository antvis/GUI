import { CustomElement, DisplayObjectConfig, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import { maybeAppend, normalPadding, select } from '../../util';
import { Button } from './button';
import { TimelineStyleProps } from './types';
import { SliderAxis } from './sliderAxis';
import { CellAxis } from './cellAxis';
import { SpeedControl } from './speedcontrol';

type PlayAxis = SliderAxis | CellAxis;

export type TimelineOptions = DisplayObjectConfig<TimelineStyleProps>;

const DEFAULT_BUTTON_STYLE = {
  margin: [2, 4],
  markerStyle: {
    default: {
      stroke: '#bfbfbf',
    },
    active: {
      stroke: '#3471F9',
    },
  },
  backgroundStyle: {
    default: {
      fill: 'transparent',
    },
  },
};

const DEFAULT_STYLE: TimelineStyleProps = {
  x: 0,
  y: 0,
  data: [],
  width: 500,
  height: 40,
  selection: [0, 0],
  orient: 'horizontal',
  singleModeControl: {},
  speedControl: {
    speeds: [1.0, 2.0, 3.0, 4.0, 5.0],
  },
  controlPosition: 'bottom',
  controlButton: {
    spacing: 14,
    prevBtn: {
      ...DEFAULT_BUTTON_STYLE,
      symbol: 'timeline-prev-btn',
      padding: 0,
      size: 8,
    },
    nextBtn: {
      ...DEFAULT_BUTTON_STYLE,
      symbol: 'timeline-next-btn',
      padding: 0,
      size: 8,
    },
    playBtn: {
      margin: 4,
      padding: 0,
      size: 20,
      symbol: '',
      markerStyle: {
        default: {
          stroke: '#bfbfbf',
          fill: '#bfbfbf',
        },
        active: {
          stroke: '#3471F9',
          fill: '#3471F9',
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
        },
      },
    },
  },
  playAxis: {
    label: { position: 1 },
    loop: false,
  },
  playInterval: 2000,
  autoPlay: false,
};

function layoutControl(
  position: string,
  length: number,
  cfg: TimelineStyleProps
): {
  [k: string]: any;
} {
  const axisLabelPosition = cfg.playAxis?.label?.position || -1;
  const axisSize = cfg.playAxis?.size || 8;
  // todo. infer by label fontSize, whether show tickLine.
  const axisLabelHeight = cfg.playAxis?.label === null ? 0 : 20;
  const playButtonSize = cfg.controlButton?.playBtn?.size || 0;
  const prevButtonSize = cfg.controlButton?.prevBtn?.size || 0;
  const nextButtonSize = cfg.controlButton?.nextBtn?.size || 0;
  const buttonSpacing = cfg.controlButton?.spacing || 0;
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
      playBtnY: axisLabelHeight + axisSize + 4 + playButtonSize / 2,
      speedControlX: length - (speedControlWidth + 4),
      speedControlY: axisLabelHeight + axisSize + 4,
    };
  }
  if (position === 'left') {
    return {
      axisY,

      paddingLeft: prevButtonSize + playButtonSize + nextButtonSize + buttonSpacing * 2 + 12,
      paddingRight: speedControlWidth + 12,
      playBtnX: prevButtonSize + buttonSpacing + playButtonSize / 2,
      playBtnY: axisY,
      speedControlX: length - speedControlWidth,
      speedControlY: axisLabelPosition === -1 ? axisY - speedControlSize * 2 + axisSize / 2 : 0,
    };
  }

  return {
    axisY,
    paddingLeft: 20,
    paddingRight: 12 + (prevButtonSize + playButtonSize + nextButtonSize + buttonSpacing * 2) + (speedControlWidth + 8),
    playBtnX: length - (playButtonSize / 2 + buttonSpacing + nextButtonSize) - (speedControlWidth + 8),
    playBtnY: axisY,
    speedControlX: length - speedControlWidth,
    speedControlY: axisLabelPosition === -1 ? axisY - speedControlSize * 2 + axisSize / 2 : 0,
  };
}

export class Timeline extends CustomElement<TimelineStyleProps> {
  private speed = 1;

  private singleMode = false;

  private playing = false;

  constructor(options: DisplayObjectConfig<TimelineStyleProps>) {
    super(deepMix({}, { style: DEFAULT_STYLE }, options));
    this.singleMode = this.style.singleMode || false;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  public update(cfg: Partial<TimelineStyleProps> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    if (cfg.singleMode !== undefined) {
      this.singleMode = cfg.singleMode;
    }

    this.render();
  }

  private get styles(): Required<TimelineStyleProps> {
    return deepMix({}, DEFAULT_STYLE, this.attributes);
  }

  private render() {
    const [pt = 0, pr = 0, , pl = pr] = normalPadding(this.styles.padding);

    const container = maybeAppend(this, '.container', 'g')
      .attr('className', 'container')
      .style('x', pl)
      .style('y', pt)
      .node();

    this.renderAxis(container);

    const { controlPosition, speedControl, width } = this.styles;
    const { speedControlX, speedControlY } = layoutControl(controlPosition, width, this.styles);
    maybeAppend(container, '.timeline-speed-control', () => new SpeedControl({}))
      .attr('className', 'timeline-speed-control')
      .call((selection) => {
        if (speedControl === null) {
          selection.remove();
          return;
        }
        (selection.node() as SpeedControl).update({
          x: speedControlX,
          y: speedControlY,
          ...this.style.speedControl,
          initialSpeed: this.speed,
        });
      });

    this.renderControlButton(container);
  }

  private renderAxis(container: Group) {
    const { data: timeData, type, width, height, controlPosition } = this.styles;
    const length = this.style.orient! === 'vertical' ? height : width;
    const { axisY, paddingLeft, paddingRight } = layoutControl(controlPosition!, length!, this.style);

    let axis = select(container).select('.timeline-axis').node() as PlayAxis | undefined;
    const Ctor = type === 'cell' ? CellAxis : SliderAxis;
    // @ts-ignore
    if (axis && axis.tag !== `${type}-axis`) {
      axis.remove();
      this.removeChild(axis);
    }

    axis = maybeAppend(
      container,
      '.timeline-axis',
      () => new Ctor({ style: { data: timeData, selection: this.style.selection } })
    )
      .attr('className', 'timeline-axis')
      .call((selection) =>
        (selection.node() as PlayAxis).update({
          x: paddingLeft,
          y: axisY,
          data: timeData,
          orient: this.style.orient!,
          length: length! - (paddingLeft + paddingRight),
          playInterval: this.style.playInterval! / this.speed,
          singleMode: this.singleMode,
          ...(this.style.playAxis || {}),
        })
      )
      .node() as PlayAxis;
    if (String(this.style.selection) !== String(axis.style.selection)) {
      axis.update({ selection: this.style.selection });
    }
    console.log('paddingRight:', controlPosition, paddingRight, length!, axis.style.length);
  }

  private renderControlButton(container: Group) {
    const { playBtnX, playBtnY } = layoutControl(this.style.controlPosition!, this.style.width!, this.style);

    const { controlButton } = this.styles;
    const spacing = controlButton?.spacing || 0;
    const buttonSize = controlButton?.playBtn?.size || 0;
    const prevButtonSize = controlButton?.prevBtn?.size || 0;
    const nextButtonSize = controlButton?.nextBtn?.size || 0;

    const showPrevButton = controlButton === null ? false : controlButton.prevBtn !== null;
    const showNextButton = controlButton === null ? false : controlButton.nextBtn !== null;
    const showPlayButton = controlButton === null ? false : controlButton.playBtn !== null;

    const prevBtnOffset = buttonSize / 2 + prevButtonSize / 2 + spacing;
    const nextBtnOffset = buttonSize / 2 + nextButtonSize / 2 + spacing;

    maybeAppend(container, '.timeline-prev-btn', () => new Button({}))
      .attr('className', 'timeline-prev-btn')
      .call((selection) => {
        if (!showPrevButton) {
          selection.remove();
          return;
        }
        (selection.node() as Button).update({
          ...(this.style.controlButton?.prevBtn || {}),
          x: playBtnX - prevBtnOffset,
          y: playBtnY,
          symbol: 'timeline-prev-button',
        });
      });

    maybeAppend(container, '.timeline-play-btn', () => new Button({}))
      .attr('className', 'timeline-play-btn')
      .call((selection) => {
        if (!showPlayButton) {
          selection.remove();
          return;
        }
        (selection.node() as Button).update({
          ...(this.style.controlButton?.playBtn || {}),
          x: playBtnX,
          y: playBtnY,
          symbol: !this.playing ? 'timeline-stop-button' : 'timeline-play-button',
        });
      });

    maybeAppend(container, '.timeline-next-btn', () => new Button({}))
      .attr('className', 'timeline-next-btn')
      .call((selection) => {
        if (!showNextButton) {
          selection.remove();
          return;
        }
        (selection.node() as Button).update({
          ...(this.style.controlButton?.nextBtn || {}),
          x: playBtnX + nextBtnOffset,
          y: playBtnY,
          symbol: 'timeline-next-button',
        });
      });

    if (this.style.autoPlay) {
      if (!this.playing) {
        this.playing = true;

        select(this)
          .select('.timeline-axis')
          .call((selection) => (selection.node() as PlayAxis)?.play());
        select(this)
          .select('.timeline-play-btn')
          .call((selection) => (selection.node() as Button)?.update({ symbol: 'timeline-play-button' }));
      }
    }
  }

  private bindEvents() {
    const axis = select(this).select('.timeline-axis').node() as SliderAxis;
    const playStopBtn = select(this).select('.timeline-play-btn').node() as Button;
    if (playStopBtn) {
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
    }

    select(this).on('timelineStopped', () => {
      this.playing = false;
      playStopBtn?.update({ symbol: 'timeline-stop-button' });
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
