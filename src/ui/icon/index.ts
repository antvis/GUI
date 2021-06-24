import { Rect, Text } from '@antv/g';
import { deepMix, pick } from '@antv/util';
import { IconOptions } from './types';
import { Marker } from '../marker';
import { measureTextWidth } from '../../util';
import { CustomElement, DisplayObject } from '../../types';

export { IconOptions };

/**
 * 带文本的 图标组件，支持 iconfont 组件
 */
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

  /**
   * 背景，用于在交互中显示
   */
  private background: DisplayObject;

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
      textPosition: 'right',
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

  public setText(text: string) {
    this.textShape.setAttribute('text', text);
    this.setAttribute('text', text);
  }

  /**
   * 根据 type 获取 maker shape
   */
  private init(): void {
    const { x, y, symbol, size, fill, spacing, text, textStyle, markerStyle } = this.attributes;

    //  图标
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

    const { position: textPosition } = textStyle;
    // 文字
    this.textShape = new Text({
      attrs: {
        // 居中，和 icon 间距 4px
        x: 0,
        y: 0,
        ...textStyle,
        text,
      },
    });

    this.textShape.setAttribute(
      'x',
      (() => {
        const _ = size / 2 + spacing;
        const textLen = measureTextWidth(
          text,
          pick(this.textShape.attr(), ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'fontVariant'])
        );
        if (textPosition === 'left') {
          return -(textLen + _);
        }
        if (textPosition === 'right') {
          return _;
        }
        // center
        return -(textLen / 2);
      })()
    );
    this.textShape.setAttribute(
      'y',
      (() => {
        const _ = size + spacing;
        if (textPosition === 'above') {
          return -_;
        }
        if (textPosition === 'below') {
          return _;
        }
        return 0;
      })()
    );

    this.appendChild(this.textShape);

    // 背景
    const bbox = this.getBounds();
    this.background = new Rect({
      attrs: {
        // 加一个 边距
        x: -size / 2 - 2,
        y: -size / 2 - 2,
        width: bbox.getMax()[0] - bbox.getMin()[0],
        height: bbox.getMax()[1] - bbox.getMin()[1],
        radius: 2,
        fill: '#fff',
      },
    });

    this.appendChild(this.background);
    // 放到背景中
    this.background.toBack();

    // 3. 最后移动到对应的位置
    this.translate(x + size / 2, y + size / 2);

    this.bindEvents();
  }

  private bindEvents() {
    this.on('mouseenter', () => {
      this.background.attr('fill', '#F5F5F5');
    });

    this.on('mouseleave', () => {
      this.background.attr('fill', '#fff');
    });
  }
}
