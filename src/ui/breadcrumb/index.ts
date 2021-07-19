import { Group, Text } from '@antv/g';
import { deepMix, last } from '@antv/util';
import { DisplayObject } from 'types';
import { GUI } from '../core/gui';
import { BreadCrumbAttrs, BreadCrumbOptions, BreadCrumbItem } from './type';
import { ACTIVE_STYLE, INACTIVE_STYLE, HOVER_STYLE } from './constant';

export { BreadCrumbAttrs, BreadCrumbOptions };

export class BreadCrumb extends GUI<BreadCrumbAttrs> {
  /**
   * 标签类型
   */
  public static tag = 'breadcrumb';

  /**
   * 默认参数
   */
  private static defaultOptions = {
    type: BreadCrumb.tag,
    attrs: {
      disabled: false,
      separatorPadding: 8,
      separator: {
        text: '/',
        style: INACTIVE_STYLE,
        spacing: 8,
      },
      textStyle: {
        default: INACTIVE_STYLE,
        active: ACTIVE_STYLE,
      },
    },
  };

  /**
   * 面包屑容器
   */
  private background: DisplayObject;

  /**
   * 面包屑子项容器
   */
  private breadcrumbItemShapes: DisplayObject[] = [];

  /**
   * 分隔符容器
   */
  private separatorShapes: DisplayObject[] = [];

  constructor(options: BreadCrumbOptions) {
    super(deepMix({}, BreadCrumb.defaultOptions, options));

    this.init();
  }

  public init(): void {
    const { x, y, items } = this.attributes;

    let width = 0;
    items.forEach((item, idx) => {
      // 非首项位置后面，渲染分隔符
      if (idx !== 0) {
        width = this.createSeparator(width);
      }

      const style = this.getMixinStyle(item);
      const textShape = new Text({
        attrs: {
          x: width,
          y: 0,
          lineHeight: style.fontSize,
          ...style,
          text: item.name,
        },
      });

      if (idx !== items.length - 1) {
        // 非最后一项的 item 绑定事件
        this.bindEvents(textShape, item);
      }

      // 更新 item 的 tag
      textShape.attr('tag', `${BreadCrumb.tag}-item`);
      this.breadcrumbItemShapes.push(textShape);

      // 计算并添加当前 shape 的宽度
      const textBbox = textShape.getBounds();
      const textWidth = textBbox.getMax()[0] - textBbox.getMin()[0];
      width += textWidth;
    });

    // 添加面包屑和分隔符的视图
    this.breadcrumbItemShapes.forEach((shape) => this.appendChild(shape));
    this.separatorShapes.forEach((shape) => this.appendChild(shape));

    // 设置位置
    this.translate(x, y);
  }

  private getMixinStyle(breadcrumbItem: BreadCrumbItem) {
    const { items, textStyle } = this.attributes;
    // 判断是否是激活态（最后一项）的面包屑
    const isActived = !!(last(items).name === breadcrumbItem.name);
    return isActived ? textStyle.active : textStyle.default;
  }

  /**
   * 创建分隔符shape，返回最新的宽度
   * @param y
   * @returns
   */
  private createSeparator(x: number): number {
    const { separator } = this.attributes;
    const { spacing, text, style } = separator;

    let separatorShape;
    // 如果分隔符是字符串，创建 Text
    if (typeof text === 'string') {
      separatorShape = new Text({
        attrs: {
          x: x + spacing,
          y: 0,
          lineHeight: style.fontSize,
          ...style,
          text,
        },
      });
    } else {
      // 如果传入的是 Group 组件
      (text as Group).attr({ x: x + spacing, y: 0 });
      separatorShape = text;
    }

    // 更新分隔符 tag
    separatorShape.attr('tag', `${BreadCrumb.tag}-separator`);
    this.separatorShapes.push(separatorShape);

    // 计算并添加当前 shape 的宽度
    const textBbox = separatorShape.getBounds();
    const textWidth = textBbox.getMax()[0] - textBbox.getMin()[0] + spacing * 2;

    return x + textWidth;
  }

  /**
   * 面包屑绑定事件
   * @param shape
   * @param item
   */
  private bindEvents(shape: DisplayObject, item: BreadCrumbItem) {
    const style = this.getMixinStyle(item);
    const { items, onClick } = this.attributes;

    shape.on('mouseenter', () => {
      shape.attr('cursor', 'pointer');
      shape.attr(HOVER_STYLE);
    });

    shape.on('mouseleave', () => {
      shape.attr(style);
      shape.attr('cursor', 'default');
    });

    if (onClick) {
      shape.on('click', () => {
        onClick.call(shape, item.name, item, items);
      });
    }
  }

  /**
   * 组件更新
   * @param cfg
   */
  public update(cfg: BreadCrumbAttrs): void {
    this.attr(deepMix({}, this.attributes, cfg));
  }

  /**
   * 组件清除
   */
  public clear(): void {
    this.destroy();
  }

  attributeChangedCallback(name: string, value: any): void {}
}
