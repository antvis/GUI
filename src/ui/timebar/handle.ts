import { Circle } from '@antv/g';
import { deepAssign } from '../../util/deep-assign';

interface FixedTimeHandleOptions {}

export class FixedTimeHandle extends Circle {
  static defaultOptions = {
    style: {
      r: 5,
      fill: '#3f7cf7',
      lineWidth: 0,
      stroke: '#3f7cf7',
      strokeOpacity: 0.5,
      cursor: 'pointer',
    },
  };

  constructor(options: FixedTimeHandleOptions) {
    super(deepAssign({}, FixedTimeHandle.defaultOptions, options));
    this.bindEvents();
  }

  bindEvents() {
    this.addEventListener('mouseenter', () => {
      this.attr('lineWidth', Math.ceil(+(this.style.r || 0) / 2));
    });

    this.addEventListener('mouseleave', () => {
      this.attr('lineWidth', 0);
    });
  }
}
