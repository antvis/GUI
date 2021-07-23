import { Text } from '@antv/g';
import { deepMix, get, isNil } from '@antv/util';
import { GUI } from '../core/gui';
import { Marker } from '../marker';
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
   * 内容
   */
  protected fixShape: DisplayObject[] = [];

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
      prefix: '',
      suffix: '',
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

    if (this.fixShape.length) {
      this.fixShape.forEach((shape) => {
        this.valueShape.appendChild(shape);
      });
    }
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
    const newTitleText = this.getNewText('title');

    return {
      x: 0,
      y: titleHeight,
      lineHeight: titleHeight,
      ...style,
      text: newTitleText,
    };
  }

  // 获取内容配置
  public getValueShapeAttrs() {
    const { title, value, prefix, suffix, spacing } = this.attributes;

    const { style: titleStyle } = title;
    const { style: valueStyle } = value;

    const titleHeight = titleStyle.fontSize + 5;
    const valueHeight = valueStyle.fontSize + 5;

    let newValueText = this.getNewText('value');
    let valueX = 0;

    ['prefix', 'suffix'].forEach((fix, index) => {
      const fixGui = this.addFixAdapter(fix);
      if (fixGui) {
        this.fixShape.push(fixGui);
        if (!index) {
          valueX = get(fixGui, 'attributes.r');
        }
      } else {
        newValueText = index ? `${newValueText}${suffix}` : `${prefix}${newValueText}`;
      }
    });

    return {
      x: valueX,
      y: spacing + titleHeight + Math.max(valueX, valueHeight), // title 文本高度 + spacing 上下间距
      lineHeight: valueHeight,
      ...valueStyle,
      text: newValueText,
    };
  }

  // 过滤用
  public getNewText(key) {
    const { text, formatter } = this.attributes[key];
    if (isNil(text)) {
      return '';
    }
    return formatter ? formatter(text) : text;
  }

  // 添加 addPrefix suffix;
  public addFixAdapter(location: string) {
    const fix = this.attributes[location];
    if (fix.constructor === Marker && get(fix, '__proto__') === Marker.prototype) {
      return fix;
    }
    return false;
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
