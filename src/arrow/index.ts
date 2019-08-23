import { Group, Path, PointType } from '@antv/g';
import * as _ from '@antv/util';

const DIR_MAPPER = {
  right: (90 * Math.PI) / 180,
  left: ((360 - 90) * Math.PI) / 180,
  up: 0,
  down: (180 * Math.PI) / 180,
};

interface ArrowCfg {
  position: PointType,
  width?: number;
  height?: number;
  direction?: string;
  shapeAttrs?: any;
}

export default class Arrow extends Group {

  private position: PointType;
  private width: number;
  private height: number;
  private direction: string;
  private shapeAttrs: object;

  constructor(cfg: ArrowCfg) {
    super();

    // 解构，追加默认值
    const {
      position = { x: 0, y: 0 },
      width = 10, height = 10,
      direction = 'right',
      shapeAttrs = {},
    } = cfg;

    this.position = position;
    this.width = width;
    this.height = height;
    this.direction = direction;
    this.shapeAttrs = shapeAttrs;

    this._init();
  }

  private _init() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const points = [
      { x: 0, y: -centerY },
      { x: -centerX, y: centerY },
      { x: centerX, y: centerY },
    ];

    const shape = new Path({
      attrs: {
        path: [
          ['M', points[0].x, points[0].y],
          ['L', points[1].x, points[1].y],
          ['L', points[2].x, points[2].y],
          ['Z'],
        ],
        ...this.shapeAttrs,
      },
    });

    this.add(shape);

    // rotate
    this.rotate(DIR_MAPPER[this.direction]);
    // move to
    this.move(this.position.x, this.position.y);

    shape.on('click', (e: any) => {
      e.stopPropagation();
      this.emit('click', e);
    });
  }
}
