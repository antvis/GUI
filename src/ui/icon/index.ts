import { Text } from '@antv/g';
import { deepMix } from '@antv/util';
import { CustomElement, DisplayObject } from '../../types';
import { Marker } from '../marker';
import { IconOptions } from './types';

export { IconOptions };

/**
 * 带文本的 图标组件，支持 iconfont 组件
 */
export class Icon extends CustomElement {
  /**
   * 标签类型
   */
  public static tag = 'icon';

  private static ICON_TYPE_MAP = new Map<string, any>();

  /**
   * 注册 icon 类型
   * @param type
   * @param path
   */
  public static registerIcon = (type: string, path: any) => {
    Icon.ICON_TYPE_MAP.set(type, path);
  };

  /**
   * 图标
   */
  private iconShape: DisplayObject;

  /**
   * 文本
   */
  private textShape: DisplayObject;

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Icon.tag,
    attrs: {
      size: 16,
      fill: '#1890ff',
      spacing: 8,
      markerStyle: {
        fill: '#1890ff',
      },
      textStyle: {
        fontSize: 12,
        textAlign: 'left',
        textBaseline: 'middle',
        fill: '#000',
      },
    },
  };

  constructor(options: IconOptions) {
    super(deepMix({}, Icon.defaultOptions, options));

    this.init();
  }

  attributeChangedCallback(name: string, value: any): void {
    console.log('attributeChangedCallback', name, value);
  }

  /**
   * 获取 icon 图标
   */
  public getIconShape() {
    return this.iconShape;
  }

  /**
   * 获取 text 文本
   */
  public getTextShape() {
    return this.textShape;
  }

  /**
   * 根据 type 获取 maker shape
   */
  private init(): void {
    const { x, y, symbol, size, fill, spacing, text, textStyle, markerStyle } = this.attributes;

    //  1. 图标
    this.iconShape = new Marker({
      attrs: {
        // 左上角锚点
        x: 0,
        y: 0,
        symbol,
        ...markerStyle,
        // 优先级
        fill,
        r: size / 2,
      },
    });
    this.appendChild(this.iconShape);

    // 2. 文字
    this.textShape = new Text({
      attrs: {
        // 居中，和 icon 间距 8px
        x: size / 2 + spacing,
        y: 0,
        ...textStyle,
        text,
      },
    });
    this.textShape = this.appendChild(this.textShape);

    // 3. 最后移动到对应的位置
    this.translate(x, y);
  }
}
