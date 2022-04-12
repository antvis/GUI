import { deepMix, get, min } from '@antv/util';
import { vec2 } from '@antv/matrix-util';
import type { PathCommand } from '@antv/g';
import type { LinearCfg, LinearOptions, Point, Position } from './types';
import { AxisBase } from './base';
import { getVerticalVector } from './utils';
import { LINEAR_DEFAULT_OPTIONS } from './constant';

function minus(sp: Point, ep: Point) {
  return [Math.abs(sp[0] - ep[0]), Math.abs(sp[1] - ep[1])];
}

export class Linear extends AxisBase<LinearCfg> {
  public static tag = 'linear';

  protected static defaultOptions = {
    type: Linear.tag,
    ...LINEAR_DEFAULT_OPTIONS,
  };

  constructor(options: LinearOptions) {
    super(deepMix({}, Linear.defaultOptions, options));
    super.init();
  }

  protected getAxisLinePath() {
    const {
      startPos: [x1, y1],
      endPos: [x2, y2],
    } = this.getTerminals();
    return [['M', x1, y1], ['L', x2, y2], ['Z']] as PathCommand[];
  }

  protected getTangentVector() {
    const {
      startPos: [x1, y1],
      endPos: [x2, y2],
    } = this.getTerminals();
    return vec2.normalize([0, 0], [x2 - x1, y2 - y1]);
  }

  protected getVerticalVector(value: number) {
    const { verticalFactor } = this.attributes;
    const axisVector = this.getTangentVector();
    return vec2.scale([0, 0], getVerticalVector(axisVector), verticalFactor);
  }

  protected getValuePoint(value: number) {
    const {
      startPos: [x1, y1],
      endPos: [x2, y2],
    } = this.getTerminals();
    // const ticks = this.getTicks();
    // const range = ticks[ticks.length - 1].value - ticks[0].value;
    // range 设定为0-1
    const range = 1;
    const ratio = value / range;
    return [ratio * (x2 - x1) + x1, ratio * (y2 - y1) + y1] as Point;
  }

  protected getTerminals() {
    const { startPos, endPos } = this.attributes;
    return { startPos, endPos };
  }

  protected inferLabelPosition(startPoint: Point, endPoint: Point): any {
    const { verticalFactor } = this.attributes;
    const vector = this.getTangentVector();

    let position = 'bottom';
    if (Math.abs(vector[0]) > Math.abs(vector[1])) position = verticalFactor === 1 ? 'bottom' : 'top';
    else position = verticalFactor === -1 ? 'left' : 'right';

    const [dx, dy] = minus(startPoint, endPoint);

    if (position === 'left') {
      return {
        x: startPoint[0] - dx,
        y: startPoint[1],
        textBaseline: 'middle',
        textAlign: 'right',
      };
    }
    if (position === 'top') {
      return {
        x: startPoint[0],
        y: startPoint[1] - dy,
        textBaseline: 'bottom',
        textAlign: 'center',
      };
    }
    if (position === 'right') {
      return {
        x: startPoint[0] + dx,
        y: startPoint[1],
        textBaseline: 'middle',
        textAlign: 'left',
      };
    }
    return {
      x: startPoint[0],
      y: startPoint[1] + dy,
      textBaseline: 'top',
      textAlign: 'center',
    };
  }

  protected getLabelLayout(labelVal: number, tickAngle: number, angle: number) {
    const { label } = this.attributes;
    let rotate = angle;
    if (angle > 90) rotate = (rotate - 180) % 360;
    else if (angle < -90) rotate = (rotate + 180) % 360;
    return {
      rotate,
      textAlign: get(label, ['style', 'default', 'textAlign']),
    };
  }
}
