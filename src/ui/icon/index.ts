import { Rect, Text } from '@antv/g';
import { deepMix } from '@antv/util';
import { Marker } from '../marker';
import { IconOptions } from './types';
import { Component } from '../../abstract';

export { IconOptions };

/**
 * 带文本的 图标组件，支持 iconfont 组件
 */
export class Icon extends Component<IconOptions> {
  /**
   * 标签类型
   */
  public static tag = 'icon';

  /**
   * 默认参数
   */
  protected static defaultOptions = {
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
   * 根据 type 获取 maker shape
   */
  protected init(): void {
    // icon
    const iconAttrsCallback = () => {
      const { symbol, size, fill, markerStyle } = this.attributes;
      return {
        symbol,
        ...markerStyle,
        // 优先级
        fill,
        r: size / 2,
      };
    };
    this.appendSubComponent('iconShape', Marker, iconAttrsCallback);

    // text
    const textAttrsCallback = () => {
      const { size, spacing, text, textStyle } = this.attributes;
      return {
        x: size / 2 + spacing,
        y: 0,
        ...textStyle,
        text,
      };
    };
    this.appendSubComponent('textShape', Text, textAttrsCallback);

    // background
    const backgroundAttrsCallback = () => {
      const { size } = this.attributes;
      const bbox = this.getBounds();
      return {
        x: -size / 2 - 2,
        y: -size / 2 - 2,
        width: bbox.getMax()[0] - bbox.getMin()[0],
        height: bbox.getMax()[1] - bbox.getMin()[1],
        radius: 2,
        fill: '#fff',
      };
    };
    this.appendSubComponent('background', Rect, backgroundAttrsCallback);
    this.getSubComponent('background').toBack();

    const { x, y, size } = this.attributes;
    // 3. 最后移动到对应的位置
    this.translate(x + size / 2, y + size / 2);

    this.bindEvents();
  }

  private bindEvents() {
    this.on('mouseenter', () => {
      this.getSubComponent('background').attr('fill', '#F5F5F5');
    });

    this.on('mouseleave', () => {
      this.getSubComponent('background').attr('fill', '#fff');
    });
  }
}
