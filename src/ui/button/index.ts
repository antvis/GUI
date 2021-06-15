import { Rect, Text } from '@antv/g';
import { deepMix } from '@antv/util';
import { ButtonOptions } from './types';
import { CustomElement, ShapeAttrs, DisplayObject } from '../../types';

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
    const { size = 'middle', type = 'default' } = options.attrs;

    super(
      deepMix({}, Button.defaultOptions, { attrs: Button.sizeStyle[size] }, { attrs: Button.typeStyle[type] }, options)
    );

    this.init();
  }

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: Button.tag,
    attrs: {
      textStyle: {
        textAlign: 'center',
        textBaseline: 'middle',
      },
      disabled: false,
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
    link: { textStyle: {}, buttonStyle: {}, hoverStyle: { textStyle: {}, buttonStyle: {} } },
    text: { textStyle: {}, buttonStyle: {}, hoverStyle: { textStyle: {}, buttonStyle: {} } },
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
   * 初始化button
   */
  private init(): void {
    const { x, y, text, textStyle, buttonStyle, disabled, onClick, hoverStyle } = this.attributes;

    const { height, width } = this.attributes.buttonStyle;
    const { fontSize } = this.attributes.textStyle;
    this.textShape = new Text({
      attrs: {
        x: width / 2,
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

    this.background = new Rect({
      attrs: {
        x: 0,
        y: 0,
        ...buttonStyle,
      },
    });

    this.appendChild(this.background);
    this.appendChild(this.textShape);

    // 设置位置
    this.translate(x, y);

    this.bindEvents(onClick, disabled, hoverStyle);
  }

  /**
   * 应用多个属性
   */
  private applyAttrs(shape: 'textShape' | 'background', attrs: ShapeAttrs) {
    Object.entries(attrs).forEach((attr) => {
      this[shape].attr(attr[0], attr[1]);
    });
  }

  private bindEvents(
    onClick: Function,
    disabled: Boolean,
    { textStyle, buttonStyle }: { textStyle: ShapeAttrs; buttonStyle: ShapeAttrs }
  ): void {
    if (!disabled && onClick) {
      this.on('click', () => {
        // 点击事件
        onClick.call(this, this);
      });
    }

    this.on('mouseenter', () => {
      if (!disabled) {
        // 鼠标悬浮事件
        this.applyAttrs('textShape', textStyle);
        this.applyAttrs('background', buttonStyle);
      } else {
        // 设置指针icon
      }
    });

    this.on('mouseleave', () => {
      // 恢复默认状态
      this.applyAttrs('textShape', this.attributes.textStyle);
      this.applyAttrs('background', this.attributes.buttonStyle);
    });
  }
}
