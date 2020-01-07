/**
 * @file 基于 G 的播放轴组件
 * @author blackganglion
 */

import { Event, Group, Shape } from '@antv/g';
import * as _ from '@antv/util';
import Button from './button';

const PLAYLINE_CHANGE = 'playlinechange';

/** 播放轴配置项 */
interface PlayLineCfg {
  /** 播放轴位置数据 */
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  /** 刻度值 */
  readonly ticks: string[];
  /** 播放速度，1s 跑多少 px，默认 10 */
  readonly speed?: number;
  /** 默认当前刻度值 */
  readonly defaultCurrentTick?: string;
  /** 是否循环播放 */
  readonly loop?: boolean;
  /** 组件 padding */
  readonly padding?: number[];
}

/**
 * 参考示例
 * https://www.gapminder.org/tools/#$state$time$value=1870&delay:100;;&chart-type=bubbles
 */
export default class PlayLine extends Group {
  /** 播放轴配置 */
  private config: PlayLineCfg;
  /** 是否处于播放状态 */
  private isPlay: boolean;
  /** 当前处于刻度值 */
  private currentTick: string;
  /** 刻度位置预处理 */
  private tickPosList: number[];

  /** 组件 */
  private playLineButton: Button;
  private playLine: {
    x: number;
    y: number;
    width: number;
    height: number;
    shape: Shape;
    textList: Shape[];
  };
  private playSelect: Shape;
  private playSelectText: Shape;

  /** 偏移量 */
  private prevX: number;

  /** 动画 id */
  private playHandler: number;

  constructor(cfg: PlayLineCfg) {
    super();

    this.config = _.deepMix(
      {},
      {
        speed: 8,
        loop: false,
        /** 右侧要留一些 padding，防止标签溢出 */
        padding: [0, 20, 0, 0],
      },
      cfg
    );

    this.init();
  }

  // 更新配置
  public update(cfg: Partial<PlayLineCfg>) {
    this.config = _.deepMix({}, this.config, cfg);

    const { ticks } = this.config;
    this.currentTick = ticks.includes(this.currentTick) ? this.currentTick : ticks[0];
    this.renderPlayButton();
    this.renderPlayLine();
    this.renderPlaySelect(this.currentTick);
  }

  public destroy() {
    super.destroy();
    this.playLineButton.off();
    this.playSelect.off();
  }

  private init() {
    const { ticks, defaultCurrentTick } = this.config;

    if (ticks && ticks.length) {
      this.currentTick = this.config.ticks.includes(defaultCurrentTick) ? defaultCurrentTick : ticks[0];
      this.renderPlayButton();
      this.renderPlayLine();
      this.renderPlaySelect(this.currentTick);
      this.initEvent();
    }
  }

  private renderPlayButton() {
    const { height, padding } = this.config;
    const r = (height - padding[0] - padding[2]) / 2;
    if (this.playLineButton) {
      this.playLineButton.update({
        x: padding[3] + r,
        y: padding[0] + r,
        r,
      });
    } else {
      this.playLineButton = new Button({
        x: padding[3] + r,
        y: padding[0] + r,
        r,
        isPlay: this.isPlay,
      });
      this.add(this.playLineButton);
    }
  }

  private getPlayLinePath() {
    const { x, y, width, height } = this.playLine;
    const r = height / 2;

    if (width > 0) {
      return (
        `M${x}, ${y}` +
        `A${r},${r} 90 0,0 ${x},${y + height}` +
        `L${x + width}, ${y + height}` +
        `A${r},${r} 90 0,0 ${x + width},${y}` +
        `L${x}, ${y}`
      );
    }

    return [];
  }

  private renderPlayLine() {
    const { width, height, ticks, padding } = this.config;
    const contentHeight = height - padding[0] - padding[2];

    if (!this.playLine) {
      this.playLine = {} as any;
    }

    /** 默认高度是真实高度 20% */
    this.playLine.height = contentHeight * 0.2;
    this.playLine.x = padding[3] + contentHeight + 30;
    this.playLine.y = padding[0] + (contentHeight / 2 - this.playLine.height / 2);
    this.playLine.width = width - this.playLine.x - padding[1];

    if (this.playLine && this.playLine.shape) {
      this.playLine.shape.attr('path', this.getPlayLinePath());
    } else {
      this.playLine.shape = this.addShape('path', {
        attrs: {
          path: this.getPlayLinePath(),
          fill: '#607889',
          opacity: 0.2,
        },
      });
    }

    const interval = this.playLine.width / (ticks.length - 1);
    this.tickPosList = [];
    if (this.playLine.textList && this.playLine.textList.length) {
      this.playLine.textList.forEach((text) => {
        text.destroy();
      });
    }
    this.playLine.textList = ticks.map((tick, index) => {
      this.tickPosList.push(this.playLine.x + index * interval);
      return this.addShape('text', {
        attrs: {
          x: this.playLine.x + index * interval,
          y: this.playLine.y + this.playLine.height + 5,
          text: tick,
          textAlign: 'center',
          textBaseline: 'top',
          fill: '#607889',
          opacity: 0.35,
        },
      });
    });
  }

  private renderPlaySelect(tickValue: string) {
    const { ticks, height, padding } = this.config;
    const contentHeight = height - padding[0] - padding[2];
    const interval = this.playLine.width / (ticks.length - 1);
    const index = _.findIndex(ticks, (tick) => tick === tickValue);
    const x = this.playLine.x + index * interval;
    const y = padding[0] + contentHeight / 2;

    this.playSelect = this.addShape('circle', {
      attrs: {
        x,
        y,
        r: contentHeight * 0.15,
        fill: '#607889',
      },
    });

    this.playSelectText = this.addShape('text', {
      attrs: {
        x,
        y: y - contentHeight * 0.15 - 14,
        text: this.currentTick,
        textAlign: 'center',
        textBaseline: 'top',
        fill: '#607889',
      },
    });
  }

  /** 输入当前圆点位置，输出离哪个 tick 的位置最近 */
  private adjustTickIndex(playSelectX: number) {
    for (let i = 0; i < this.tickPosList.length - 1; i++) {
      if (this.tickPosList[i] <= playSelectX && playSelectX <= this.tickPosList[i + 1]) {
        return Math.abs(this.tickPosList[i] - playSelectX) < Math.abs(playSelectX - this.tickPosList[i + 1])
          ? i
          : i + 1;
      }
    }
  }

  /** 拖动或自动播放过程中，设置 PlaySelect 的位置 */
  private setPlaySelectX(offsetX: number) {
    let playSelectX = this.playSelect.attr('x') + offsetX;
    // 防止左右溢出
    if (playSelectX < this.playLine.x) {
      playSelectX = this.playLine.x;
    }
    if (playSelectX > this.playLine.x + this.playLine.width) {
      playSelectX = this.playLine.x + this.playLine.width;
      // 正在播放场景
      if (this.isPlay) {
        // 如果是循环
        if (this.config.loop) {
          // 当前滑动点已经处于最后一个 tick 上，才能重置回去，继续循环
          if (this.playSelect.attr('x') === this.playLine.x + this.playLine.width) {
            playSelectX = this.playLine.x;
          }
        } else {
          this.isPlay = false;
          this.changePlayStatus();
        }
      }
    }
    this.playSelect.attr('x', playSelectX);
    this.playSelectText.attr('x', playSelectX);

    const index = this.adjustTickIndex(playSelectX);
    if (this.currentTick !== this.config.ticks[index]) {
      this.currentTick = this.config.ticks[index];
      this.playSelectText.attr('text', this.currentTick);

      this.emit(PLAYLINE_CHANGE, this.currentTick);
    }

    this.get('canvas').draw();
  }

  /** 同步圆点到 currnentTick */
  private syncCurrnentTick() {
    const { ticks } = this.config;
    const interval = this.playLine.width / (ticks.length - 1);
    const index = _.findIndex(ticks, (tick) => tick === this.currentTick);
    const x = this.playLine.x + index * interval;
    this.playSelect.attr('x', x);
    this.playSelectText.attr('x', x);
    this.get('canvas').draw();
  }

  private onPlaySelectMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const x = _.get(e, 'touches.0.pageX', e.pageX);
    const offsetX = x - this.prevX;

    this.setPlaySelectX(offsetX);

    this.prevX = x;
  };

  private onPlaySelectMouseUp = (e: Event) => {
    this.syncCurrnentTick();

    // 取消事件
    const containerDOM = this.get('canvas').get('containerDOM');
    if (containerDOM) {
      containerDOM.removeEventListener('mousemove', this.onPlaySelectMouseMove);
      containerDOM.removeEventListener('mouseup', this.onPlaySelectMouseUp);
      // 防止滑动到 canvas 外部之后，状态丢失
      containerDOM.removeEventListener('mouseleave', this.onPlaySelectMouseUp);
      // 移动端事件
      containerDOM.removeEventListener('touchmove', this.onPlaySelectMouseMove);
      containerDOM.removeEventListener('touchend', this.onPlaySelectMouseUp);
      containerDOM.removeEventListener('touchcancel', this.onPlaySelectMouseUp);
    }
  };

  private onPlaySelectMouseDown = (e: Event) => {
    const { event } = e;
    event.stopPropagation();
    event.preventDefault();

    // 取消播放状态
    this.isPlay = false;
    // 拖动过程中的播放暂停不需要调整 tick 位置，防止偏移
    this.changePlayStatus(false);

    this.prevX = _.get(e, 'touches.0.pageX', event.pageX);

    // 开始滑动的时候，绑定 move 和 up 事件
    const containerDOM = this.get('canvas').get('containerDOM');
    containerDOM.addEventListener('mousemove', this.onPlaySelectMouseMove);
    containerDOM.addEventListener('mouseup', this.onPlaySelectMouseUp);
    containerDOM.addEventListener('mouseleave', this.onPlaySelectMouseUp);
    // 移动端事件
    containerDOM.addEventListener('touchmove', this.onPlaySelectMouseMove);
    containerDOM.addEventListener('touchend', this.onPlaySelectMouseUp);
    containerDOM.addEventListener('touchcancel', this.onPlaySelectMouseUp);
  };

  private startPlay() {
    return window.requestAnimationFrame(() => {
      const { speed } = this.config;

      const offsetX = speed / (1000 / 60);
      this.setPlaySelectX(offsetX);

      this.playHandler = this.startPlay();
    });
  }

  private changePlayStatus(isSync = true) {
    this.playLineButton.update({
      isPlay: this.isPlay,
    });
    if (this.isPlay) {
      // 开始播放
      this.playHandler = this.startPlay();
    } else {
      // 结束播放
      if (this.playHandler) {
        window.cancelAnimationFrame(this.playHandler);
        if (isSync) {
          this.syncCurrnentTick();
        }
      }
    }
    this.get('canvas').draw();
  }

  private initEvent() {
    /** 播放/暂停事件 */
    this.playLineButton.on('click', () => {
      this.isPlay = !this.isPlay;
      this.changePlayStatus();
    });

    /** 播放轴上圆点滑动事件 */
    this.playSelect.on('mousedown', this.onPlaySelectMouseDown);
  }
}
