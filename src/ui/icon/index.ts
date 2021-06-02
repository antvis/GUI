import { Text, Rect } from '@antv/g';
import { CustomElement, DisplayObject } from '../../types';
import { IconOptions } from './types';

export { IconOptions };

export class Icon extends CustomElement {
  /**
   * 标签类型
   */
  public static tag = 'icon';

  /**
   * 图标
   */
  private iconShape: DisplayObject;

  /**
   * 文本
   */
  private textShape: DisplayObject;

  constructor(options: IconOptions) {
    super({
      ...options,
      type: Icon.tag,
    });

    const { x, y, type, size, fill, text, textStyle } = this.attributes;

    //  1. 图标
    this.iconShape = this.getMarker(type, x, y, size, fill);
    this.appendChild(this.iconShape!);

    // 2. 文字
    this.textShape = this.appendChild(
      new Text({
        attrs: {
          // 居中，和 icon 间距 8px
          x: size + 8,
          y: size / 2,
          text,
          textAlign: 'left',
          textBaseline: 'middle',
          fontSize: 12,
          ...textStyle,
        },
      })
    );

    // 整体偏移 x y 位置
    this.translate(x, y);
  }

  attributeChangedCallback(name: string, value: any): void {
    console.log(111, name, value);
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
  private getMarker(type: string, x: number, y: number, size: number, fill: string): DisplayObject {
    return new Rect({
      attrs: {
        x: 0,
        y: 0,
        width: size,
        height: size,
        fill,
      },
    });
  }
}
