import { Rect, Text } from '@antv/g';
import _ from 'lodash';
import { deepMix, pick } from '@antv/util';
import { ButtonOptions } from './types';
import { CustomElement, ShapeAttrs, DisplayObject } from '../../types';
import { getEllipsisText } from '../../util';

export { ButtonOptions };

/**
 * 尺寸配置
 */
const sizeStyle = {
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
const typeStyle = {
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

/**
 * disabled style
 */
const disabledStyle = {
  // 严格需要替换的样式
  strict: {
    textStyle: {
      fill: '#b8b8b8',
    },
    buttonStyle: {
      stroke: '#d9d9d9',
    },
  },
  textStyle: {},
  buttonStyle: {
    fill: '#f5f5f5',
  },
};

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
      },
      hoverStyle: {
        textStyle: {},
        buttonStyle: {},
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
    const { size, type, disabled } = this.attributes;
    const mixedStyle = deepMix(
      {},
      typeStyle[type][name],
      name === 'hoverStyle' ? {} : sizeStyle[size][name],
      this.attributes[name]
    );

    if (disabled && name !== 'hoverStyle') {
      // 从disabledStyle中pick mixedStyle里已有的style
      Object.keys(mixedStyle).forEach((key) => {
        if (key in disabledStyle[name]) {
          // mixedStyle[key] = disabledStyle[name][key];
          mixedStyle[key] = _.get(disabledStyle, [name, key]);
        }
      });
      Object.keys(disabledStyle.strict[name]).forEach((key) => {
        mixedStyle[key] = _.get(disabledStyle, ['strict', name, key]);
        // mixedStyle[key] = disabledStyle.strict[name][key];
      });
    }

    return mixedStyle;
  }

  /**
   * 初始化button
   */
  private init(): void {
    const { x, y, text, padding, ellipsis, onClick } = this.attributes;
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
        // width: newWidth,
      },
    });

    this.appendChild(this.background);
    this.appendChild(this.textShape);

    // 设置位置
    this.translate(x, y);

    this.bindEvents(onClick);
  }

  /**
   * 应用多个属性
   */
  private applyAttrs(shape: 'textShape' | 'background', attrs: ShapeAttrs) {
    Object.entries(attrs).forEach((attr) => {
      this[shape].attr(attr[0], attr[1]);
    });
  }

  private bindEvents(onClick: Function): void {
    const { disabled } = this.attributes;

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
