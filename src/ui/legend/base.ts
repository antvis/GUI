import { deepMix, get, isNumber } from '@antv/util';
import { Rect, Text } from '@antv/g';
import { GUI } from '../core/gui';
import type { LegendBaseCfg, LegendBaseOptions, StyleStatus } from './types';

export default abstract class LegendBase<T extends LegendBaseCfg> extends GUI<T> {
  public static tag = 'legendBase';

  // background
  private backgroundShape: Rect;

  private titleShape: Text;

  protected static defaultOptions = {
    type: LegendBase.tag,
    attrs: {
      width: 200,
      height: 40,
      padding: 0,
      orient: 'horizontal',
      indicator: false,
      backgroundStyle: {
        fill: '#dcdee2',
        lineWidth: 0,
      },
      title: {
        content: '',
        spacing: 10,
        style: {
          fontSize: 16,
          align: 'left',
          textBaseline: 'top',
        },
        formatter: (text: string) => text,
      },
    },
  };

  constructor(options: LegendBaseOptions) {
    super(deepMix({}, LegendBase.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any) {}

  public init() {
    this.createBackground();
    this.createTitle();
  }

  // 获取对应状态的样式
  private getStyle(name: string | string[], status?: StyleStatus) {
    const { active, disabled, checked, ...args } = get(this.attributes, name);
    // 返回默认样式
    if (!status) return args;
    return get(this.attributes, [name, status]) || {};
  }

  // 获取padding
  private getPadding() {
    const { padding } = this.attributes;
    if (isNumber(padding)) {
      return new Array(4).fill(padding);
    }
    return padding;
  }

  // 获取容器内可用空间
  private getAvailableSpace() {
    // 容器大小 - padding - title
    const { width, height, title } = this.attributes;
    const { fontSize: lineHeight, spacing } = title;
    const [top, right, bottom, left] = this.getPadding();
    return {
      x: left,
      y: top + lineHeight + spacing,
      width: width - (left + right),
      height: height - (top + bottom) - lineHeight - spacing,
    };
  }

  private getBackgroundAttrs() {
    return {
      ...this.getAvailableSpace(),
      ...this.getStyle('backgroundStyle'),
    };
  }

  // 绘制背景
  private createBackground() {
    this.backgroundShape = new Rect({
      name: 'background',
      attrs: this.getBackgroundAttrs(),
    });
    this.backgroundShape.toBack();
    this.appendChild(this.backgroundShape);
  }

  /**
   * 创建图例标题配置
   */
  private getTitleAttrs() {
    const { width, title } = this.attributes;
    const { content, style, formatter } = title;
    const { align, ...restStyle } = style;

    let layout: Object;
    switch (align) {
      case 'left':
        layout = { x: 0, y: 0, textAlign: 'left' };
        break;
      case 'right':
        layout = { x: width, y: 0, textAlign: 'end' };
        break;
      case 'center':
        layout = { x: width / 2, y: 0, textAlign: 'center' };
        break;
      default:
        break;
    }

    return {
      ...restStyle,
      ...layout,
      text: formatter(content),
    };
  }

  /**
   * 创建图例标题
   */
  private createTitle() {
    this.titleShape = new Text({
      name: 'title',
      attrs: this.getTitleAttrs(),
    });
    this.appendChild(this.titleShape);
  }
}
