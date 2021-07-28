import { Text } from '@antv/g';
import { deepMix, isNil } from '@antv/util';
import { GUI } from '../core/gui';
import type { StatisticAttrs, StatisticOptions } from './types';
import type { DisplayObject } from '../../types';

export { StatisticAttrs, StatisticOptions } from './types';

export class Statistic extends GUI<StatisticAttrs> {
  /**
   * 标签类型
   */
  public static tag = 'statistic';

  /**
   * 标题
   */
  protected titleShape: DisplayObject;

  /**
   * 内容
   */
  protected valueShape: DisplayObject;

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Statistic.tag,
    attrs: {
      title: {
        // 标题
        text: '',
        style: {
          // 默认居中
          fontSize: 14, // 字体大小
          fill: '#00000073', // 颜色
        },
      }, // 值 number | string
      value: {
        style: {
          // 默认居中
          fontSize: 24,
          fill: '#000000d9',
        },
      }, // 值 number | string
      spacing: 5,
      dynamicTime: false,
    },
  };

  constructor(options: StatisticOptions) {
    super(deepMix({}, Statistic.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any): void {}

  public init(): void {
    const { x, y } = this.attributes;
    this.createText();

    // 设置位置
    this.translate(x, y);
  }

  public createText() {
    this.createTitleShape();
    this.createValueShape();
  }

  // 创建标题
  public createTitleShape() {
    this.titleShape = new Text({
      attrs: this.getTitleShapeAttrs(),
    });
    this.appendChild(this.titleShape);
  }

  // 创建内容
  public createValueShape() {
    this.valueShape = new Text({
      attrs: this.getValueShapeAttrs(),
    });
    this.appendChild(this.valueShape);
  }

  // 获取标题配置
  public getTitleShapeAttrs() {
    const {
      title: { style },
    } = this.attributes;
    const titleHeight = style.fontSize + 5;

    return {
      x: 0,
      y: titleHeight,
      lineHeight: titleHeight,
      ...style,
      text: this.getNewText('title'),
    };
  }

  // 获取内容配置
  public getValueShapeAttrs() {
    const { title, value, spacing } = this.attributes;

    const { style: titleStyle } = title;
    const { style: valueStyle } = value;

    const titleHeight = titleStyle.fontSize + 5;
    const valueHeight = valueStyle.fontSize + 5;

    const valueX = 0;

    return {
      x: valueX,
      y: spacing + titleHeight + Math.max(valueX, valueHeight), // title 文本高度 + spacing 上下间距
      lineHeight: valueHeight,
      ...valueStyle,
      text: this.getNewText('value'),
    };
  }

  // 过滤用
  public getNewText(key) {
    const { text, formatter } = this.attributes[key];
    if (isNil(text)) {
      return '';
    }
    return `${formatter ? formatter(text) : text}`;
  }

  /**
   * 组件的更新
   */
  public update(cfg: StatisticAttrs) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.titleShape.attr(this.getTitleShapeAttrs());
    this.valueShape.attr(this.getValueShapeAttrs());
  }

  public clear() {
    this.valueShape.destroy();
    this.titleShape.destroy();
  }
}
