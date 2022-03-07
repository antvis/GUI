import { Path, PathCommand } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUIOption } from 'types';
import { Text } from '../text';
import { GUI } from '../../core/gui';
import { SpeedControlCfg, SpeedControlOptions } from './types';

export class SpeedControl extends GUI<Required<SpeedControlCfg>> {
  public static tag = 'speedcontrol';

  public init(): void {
    this.createShapes();
  }

  public clear(): void {}

  public update(cfg: Partial<Required<SpeedControlCfg>>): void {}

  private trianglePath = (x: number, y: number) => {
    return [['M', x - 2.5, y - 2], ['L', x - 2.5, y + 2], ['L', x + 2.5, y], ['Z']];
  };

  private linePath = (x: number, y: number) => {
    return [
      ['M', x - 3.5, y],
      ['L', x + 3.5, y],
    ];
  };

  private triangleShape: Path | undefined;

  private lineShapes: Path[] | undefined;

  private labelShape: Text | undefined;

  private selectedSpeed: number = 0;

  private static defaultOptions: GUIOption<SpeedControlCfg> = {
    type: SpeedControl.tag,
    style: {
      x: 0,
      y: 0,
      width: 30,
      height: 18,
      speeds: ['1.0', '2.0', '3.0', '4.0', '5.0'],
      spacing: 2,
      label: {
        width: 21,
        fontColor: 'rgba(0,0,0,0.45)',
        height: 14,
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: 10,
        verticalAlign: 'bottom',
      },
    },
  };

  constructor(options: SpeedControlOptions) {
    super(deepMix({}, SpeedControl.defaultOptions, options));
    this.init();
  }

  private createShapes() {
    this.createLines();
    this.createTriangle();
    this.createLabel();
  }

  private createTriangle() {
    const { x, y } = this.attributes;
    this.triangleShape = new Path({
      style: {
        fill: '#8c8c8c',
        path: this.trianglePath(x, y) as PathCommand[],
      },
    });
    this.triangleShape.translateLocal(0);
    this.appendChild(this.triangleShape);
  }

  private createLines() {
    const { x, y } = this.attributes;
    const mapLines = () =>
      new Path({
        style: {
          stroke: '#bfbfbf',
          path: this.linePath(x + 3.5, y) as PathCommand[],
        },
      });
    this.lineShapes = new Array(5).fill(undefined).map(mapLines);
    this.lineShapes[1].translateLocal(0, 2);
    this.lineShapes[2].translateLocal(0, 5);
    this.lineShapes[3].translateLocal(0, 9);
    this.lineShapes[4].translateLocal(0, 14);
    this.lineShapes.forEach((line) => {
      this.appendChild(line);
    });
  }

  private createLabel() {
    const { x, y, width, height, speeds, label, spacing } = this.attributes;
    const restSpacing = width - 7 - spacing;

    this.labelShape = new Text({
      style: {
        x: x + 7 + spacing,
        width: restSpacing > (label.width as number) ? label.width : restSpacing,
        y: y + height - (label.height as number),
        ...(label as any),
        text: speeds[this.selectedSpeed],
      },
    });
    this.appendChild(this.labelShape);
  }

  private updateLabel() {}
}
