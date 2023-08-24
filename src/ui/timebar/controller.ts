import { GUI } from '../../core';
import { DisplayObject, Group, Rect } from '../../shapes';
import { deepAssign, parseSeriesAttr, subStyleProps } from '../../util';
import {
  Backward,
  ChartType,
  Forward,
  IconBase,
  PlayPause,
  Reset,
  SelectionType,
  SpeedSelect,
  Split,
  ToggleIcon,
} from './icons';
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
      const component = new Ctor({
        style: {
          x: index * iconSize + xOffset,
          y: height / 2,
          size: iconSize,
        },
      });
      if (component instanceof SpeedSelect) {
        component.attr('onSelect', (value: any) => this.handleFunctionChange(name, { value }, component));
      } else if (component instanceof ToggleIcon) {
        component.attr('onChange', (value: any) => this.handleFunctionChange(name, { value }, component));
      } else if (component instanceof IconBase) {
        component.attr('onClick', () => this.handleFunctionChange(name, { value: name }, component));
      }
      this.functions.appendChild(component);
    });
  }

  constructor(options: ControllerOptions) {
    super(deepAssign({}, Controller.defaultOptions, options));
  }

  render() {
    this.renderBackground();
    this.renderFunctions();
  }

  handleFunctionChange(name: string, value: any, component: DisplayObject) {
    const { onChange } = this.attributes;
    onChange?.(name as Functions, value);
  }
}
