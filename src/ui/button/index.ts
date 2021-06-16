import { Rect, Text } from '@antv/g';
import { deepMix, pick } from '@antv/util';
import { ButtonOptions } from './types';
import { CustomElement, ShapeAttrs, DisplayObject } from '../../types';
import { getEllipsisText } from '../../util';

export { ButtonOptions };

export class Button extends CustomElement {
  /**
   * 标签类型
   */
  public static tag = 'button';

  /**
   * 文本
   */
  private textShape: DisplayObject;

  /**
   * 按钮容器
   */
  private background: DisplayObject;

  constructor(options: ButtonOptions) {
    super(deepMix({}, Button.defaultOptions, options));

    this.init();
  }

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Button.tag,
    attrs: {
      disabled: false,
      padding: 10,
      size: 'middle',
      type: 'default',
      textStyle: {
        textAlign: 'center',
        textBaseline: 'middle',
      },
      buttonStyle: {
        lineWidth: 1,
        radius: 5,
        fill: '#fff',
      },
    },
  };

  /**
   * 尺寸配置
   */
  private static sizeStyle = {
    small: {
      textStyle: {
        fontSize: 10,
      },
      buttonStyle: {
        width: 40,
        height: 20,
      },
    },
    middle: {
      textStyle: {
        fontSize: 12,
      },
      buttonStyle: {
        width: 60,
        height: 30,
      },
    },
    large: {
      textStyle: {
        fontSize: 16,
      },
      buttonStyle: {
        width: 80,
        height: 40,
      },
    },
  };

  /**
   * 类型配置
   */
  private static typeStyle = {
    primary: {
      textStyle: {
        fill: '#fff',
      },
      buttonStyle: {
        fill: '#1890ff',
        lineWidth: 0,
      },
      hoverStyle: {
        textStyle: {},
        buttonStyle: {
          fill: '#40a9ff',
        },
      },
    },
    ghost: { textStyle: {}, buttonStyle: {}, hoverStyle: { textStyle: {}, buttonStyle: {} } },
    dashed: {
      textStyle: {},
      buttonStyle: {
        stroke: '#bbb',
        lineDash: [5, 5],
      },
      hoverStyle: {
        textStyle: {},
        buttonStyle: {},
      },
    },
    link: {
      textStyle: {
        fill: '#1890ff',
      },
      buttonStyle: {
        lineWidth: 0,
      },
      hoverStyle: { textStyle: {}, buttonStyle: {} },
    },
    text: {
      textStyle: {
        fill: '#000',
      },
      buttonStyle: {
        lineWidth: 0,
      },
      hoverStyle: { textStyle: {}, buttonStyle: {} },
    },
    default: {
      textStyle: {
        fill: '#000',
      },
      buttonStyle: { stroke: '#bbb' },
      hoverStyle: {
        textStyle: {
          fill: '#1890ff',
        },
        buttonStyle: {
          stroke: '#1890ff',
        },
      },
    },
  };

  attributeChangedCallback(name: string, value: any): void {
    console.log('attributeChangedCallback', name, value);
  }

  /**
   * 获取text
   */
  public getTextShape(): DisplayObject {
    return this.textShape;
  }

  /**
   * 获取button
   */
  public getBackground(): DisplayObject {
    return this.background;
  }

  /**
   * 根据size、type属性生成实际渲染的属性
   */
  private getMixinStyle(name: 'textStyle' | 'buttonStyle' | 'hoverStyle') {
    const { size, type } = this.attributes;
    return deepMix(
      {},
      name === 'hoverStyle' ? {} : Button.sizeStyle[size][name],
      Button.typeStyle[type][name],
      this.attributes[name]
    );
  }

  /**
   * 初始化button
   */
  private init(): void {
    const { x, y, text, disabled, padding, ellipsis, onClick } = this.attributes;
    const textStyle = this.getMixinStyle('textStyle');
    const buttonStyle = this.getMixinStyle('buttonStyle');

    const { height, width } = buttonStyle;
    const { fontSize } = textStyle;

    this.textShape = new Text({
      attrs: {
        x: 0,
        y: height - fontSize,
        lineHeight: fontSize,
        ...textStyle,
        text,
      },
    });

    /**
     * 文本超长
     *
     * 1. 按钮边长
     * 计算文本实际长度
     * canvas 需要调用ctx.measureText(text).width 方法
     *
     * 2. 省略文本
     */
    const textBbox = this.textShape.getBounds();
    const textWidth = textBbox.getMax()[0] - textBbox.getMin()[0] + padding * 2;
    let newWidth = width;

    if (ellipsis && textWidth > width) {
      // 缩略文本
      const style = pick(this.textShape.attr(), ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'fontVariant']);
      const ellipsisText = getEllipsisText(text, width - padding * 2, style);
      this.textShape.attr('text', ellipsisText);
    } else if (textWidth > newWidth) {
      // 加宽button
      newWidth = textWidth;
      this.attr('buttonStyle', {
        ...buttonStyle,
        width: newWidth,
      });
    }

    this.background = new Rect({
      attrs: {
        x: -newWidth / 2,
        y: 0,
        ...this.getMixinStyle('buttonStyle'),
        width: newWidth,
      },
    });

    this.appendChild(this.background);
    this.appendChild(this.textShape);

    // 设置位置
    this.translate(x, y);

    this.bindEvents(onClick, disabled);
  }

  /**
   * 应用多个属性
   */
  private applyAttrs(shape: 'textShape' | 'background', attrs: ShapeAttrs) {
    Object.entries(attrs).forEach((attr) => {
      this[shape].attr(attr[0], attr[1]);
    });
  }

  private bindEvents(onClick: Function, disabled: Boolean): void {
    if (!disabled && onClick) {
      this.on('click', () => {
        // 点击事件
        onClick.call(this, this);
      });
    }

    this.on('mouseenter', () => {
      if (!disabled) {
        // 鼠标悬浮事件
        const hoverStyle = this.getMixinStyle('hoverStyle');
        this.applyAttrs('textShape', hoverStyle.textStyle);
        this.applyAttrs('background', hoverStyle.buttonStyle);
        this.attr('cursor', 'pointer');
      } else {
        // 设置指针icon
        this.attr('cursor', 'not-allowed');
      }
    });

    this.on('mouseleave', () => {
      // 恢复默认状态
      this.applyAttrs('textShape', this.getMixinStyle('textStyle'));
      this.applyAttrs('background', this.getMixinStyle('buttonStyle'));
    });
  }
}
