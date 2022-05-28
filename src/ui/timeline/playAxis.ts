import { CustomElement, CustomEvent } from '@antv/g';
import { deepMix, isNil } from '@antv/util';
import { select } from '../../util';
import { DEFAULT_TIMELINE_STYLE } from './constants';
import { PlayAxisStyleProps, TimeData } from './types';

export type AxisStyleProps = PlayAxisStyleProps & {
  x?: number;
  y?: number;
  data: TimeData[];
  length?: number;
  orient?: string;
  singleMode?: boolean;
  playInterval?: number; // ms
  tag?: string;
};

export const DEFAULT_STYLE: AxisStyleProps = deepMix(
  {},
  {
    x: 0,
    y: 0,
    data: [],
    length: 120,
    orient: 'horizontal',
    selection: 0,
    selectionStyle: {
      fill: '#5B8FF9',
      fillOpacity: 0.15,
    },
    loop: false,
    playInterval: 1000,
  },
  DEFAULT_TIMELINE_STYLE.playAxis
);

export const DEFAULT_AXIS_CFG = {
  axisLine: null,
  label: {
    autoRotate: false,
    rotate: 0,
    autoHide: true,
    autoHideTickLine: false,
    autoEllipsis: true,
    minLength: 60,
    alignTick: true,
  },
};

export function normalSelection(selection: number | number[] = [], singleMode?: boolean) {
  const [s1 = 0, s2 = s1] = Array.of(selection).flat() as number[];
  return singleMode ? [s1, s1] : [s1, s2];
}

export abstract class AxisBase<T extends AxisStyleProps = AxisStyleProps> extends CustomElement<T> {
  protected playTimer?: any;

  protected selection: number[] = [0, 0];

  public update(cfg: Partial<AxisStyleProps> = {}) {
    const newAttrs = deepMix({}, this.attributes, cfg);
    if (cfg.selection) {
      this.selection = normalSelection(cfg.selection, newAttrs.singleMode);
    }
    const playing = this.playTimer;
    playing && this.stop();
    this.attr(newAttrs);
    this.render();
    playing && this.play();
  }

  public play() {
    const { data: timeData, loop, singleMode, playMode } = this.style;
    const maxLength = timeData.length;
    let { playInterval } = this.style;
    if (isNil(playInterval)) {
      playInterval = DEFAULT_STYLE.playInterval;
    }

    if (this.playTimer) clearInterval(this.playTimer);
    this.playTimer = setInterval(() => {
      if (!loop && this.selection[1] >= maxLength - 1) {
        this.stop(true);
        return;
      }

      if (singleMode) {
        // do something
        const currentIndex = (this.selection[0] + 1) % maxLength;
        this.setSelection({ start: currentIndex, end: currentIndex });
        return;
      }

      let startIndex = this.selection[0];
      let endIndex = this.selection[1];
      const offset = this.selection[1] - this.selection[0];

      if (endIndex >= maxLength - 1) {
        if (playMode === 'increase') {
          endIndex = startIndex;
        } else {
          startIndex = 0;
          endIndex = offset;
        }
      } else {
        if (playMode !== 'increase') {
          startIndex = (startIndex + 1) % maxLength;
        }
        endIndex = (endIndex + 1) % maxLength;
      }
      this.setSelection({ start: startIndex, end: endIndex });
    }, playInterval);
  }

  public stop(dispatchEvent?: boolean): void {
    clearInterval(this.playTimer);
    this.playTimer = undefined;
    if (dispatchEvent) {
      this.dispatchEvent(new CustomEvent('timelineStopped', {}));
    }
  }

  public prev() {
    const [s1, s2] = this.selection;
    const max = this.style.data.length;
    if (max && this.style.singleMode) {
      this.setSelection({ start: (s1 - 1 + max) % max, end: (s1 - 1 + max) % max });
      return;
    }
    if (s1 === 0) {
      this.setSelection({ start: max - (s2 - s1) - 1, end: max - 1 });
    } else {
      this.setSelection({ start: s1 - 1, end: s2 - 1 });
    }
  }

  public next() {
    const [s1, s2] = this.selection;
    const max = this.style.data.length;
    if (max && this.style.singleMode) {
      this.setSelection({ start: (s1 + 1) % max, end: (s1 + 1) % max });
      return;
    }
    if (s2 === max - 1) {
      this.setSelection({ start: 0, end: s2 - s1 });
    } else {
      this.setSelection({ start: s1 + 1, end: s2 + 1 });
    }
  }

  protected abstract render(): void;

  protected abstract setSelection(newSelection: { start?: number; end?: number }): void;

  protected get orient() {
    return this.style.orient || 'horizontal';
  }

  protected ifH<T>(a: T, b: T) {
    if (this.orient === 'horizontal') {
      return typeof a === 'function' ? a() : a;
    }
    return typeof b === 'function' ? b() : b;
  }

  public destroy() {
    super.destroy();
    if (this.playTimer) clearInterval(this.playTimer);
  }
}
