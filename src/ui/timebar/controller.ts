import { GUI } from '../../core';
import { DisplayObject, Group, Rect } from '../../shapes';
import { deepAssign, parseSeriesAttr, subStyleProps } from '../../util';
import { Backward, ChartType, Forward, PlayPause, Reset, SelectionType, SpeedSelect, Split } from './icons';
import type { ControllerOptions, ControllerStyleProps, Functions } from './types';

const componentsMap: Record<Functions | 'split', { new (...args: any): DisplayObject }> = {
  reset: Reset,
  speed: SpeedSelect,
  backward: Backward,
  playPause: PlayPause,
  forward: Forward,
  selectionType: SelectionType,
  chartType: ChartType,
  split: Split,
} as const;

export class Controller extends GUI<ControllerStyleProps> {
  static defaultOptions: ControllerOptions = {
    style: {
      width: 300,
      height: 40,
      padding: 0,
      align: 'center',
      iconSize: 25,
      speed: 1,
      playing: false,
      chartType: 'line',
      selectionType: 'range',
      backgroundFill: '#fbfdff',
      backgroundStroke: '#ebedf0',
      functions: [
        ['reset', 'speed'],
        ['backward', 'playPause', 'forward'],
        ['selectionType', 'chartType'],
      ],
    },
  };

  private background = this.appendChild(new Rect({}));

  private functions = this.appendChild(new Group({}));

  private get padding() {
    return parseSeriesAttr(this.attributes.padding);
  }

  private renderBackground() {
    const { width, height } = this.style;
    const backgroundStyle = subStyleProps(this.attributes, 'background');
    this.background.attr({ width, height, ...backgroundStyle });
  }

  private renderFunctions() {
    const { functions, iconSize, width, height, align } = this.attributes;
    const {
      padding: [, right, , left],
    } = this;

    const components = functions.reduce((prev, curr) => {
      if (prev.length && curr.length) {
        return prev.concat('split', ...curr);
      }
      return prev.concat(...curr);
    }, [] as (keyof typeof componentsMap)[]);

    const componentsWidth = components.length * iconSize;
    const xOffset =
      {
        left: left + iconSize / 2,
        center: (width - componentsWidth) / 2 + iconSize / 2,
        right: width - componentsWidth - left - right + iconSize / 2,
      }[align] || 0;

    this.functions.removeChildren();
    components.forEach((name, index) => {
      const Ctor = componentsMap[name];
      const style: Record<string, any> = {
        x: index * iconSize + xOffset,
        y: height / 2,
        size: iconSize,
      };

      if (Ctor === SpeedSelect) {
        style.speed = this.attributes.speed;
        style.onSelect = (value: any) => this.handleFunctionChange(name, { value });
      } else if (([PlayPause, SelectionType, ChartType] as any).includes(Ctor)) {
        style.onChange = (value: any) => this.handleFunctionChange(name, { value });
        if (Ctor === PlayPause) style.type = this.attributes.playing ? 'pause' : 'play';
        if (Ctor === SelectionType) style.type = this.attributes.selectionType === 'range' ? 'value' : 'range';
        if (Ctor === ChartType) style.type = this.attributes.chartType === 'line' ? 'bar' : 'line';
      } else {
        // IconBase
        style.onClick = () => this.handleFunctionChange(name, { value: name });
      }

      this.functions.appendChild(new Ctor({ style }));
    });
  }

  constructor(options: ControllerOptions) {
    super(deepAssign({}, Controller.defaultOptions, options));
  }

  render() {
    this.renderBackground();
    this.renderFunctions();
  }

  handleFunctionChange(name: string, value: any) {
    const { onChange } = this.attributes;
    onChange?.(name as Functions, value);
  }
}
