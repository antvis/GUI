import { Text } from '@antv/g';
import { deepMix, last } from '@antv/util';
import { DisplayObject } from 'types';
import { GUI } from '../core/gui';
import { BreadCrumbAttrs, BreadCrumbOptions, BreadCrumbItem } from './types';
import { ACTIVE_STYLE, INACTIVE_STYLE, HOVER_STYLE } from './constants';

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
      separator: '/',
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
        this.bindEvents(textShape, item);
      }

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
    const { items } = this.attributes;
    // 判断是否是激活态（最后一项）的面包屑
    const isActived = !!(last(items).name === breadcrumbItem.name);
    return deepMix({}, isActived ? ACTIVE_STYLE : INACTIVE_STYLE, breadcrumbItem.style);
  }

  /**
   * 创建分隔符shape，返回最新的宽度
   * @param y
   * @returns
   */
  private createSeparator(x: number): number {
    const { fontSize } = INACTIVE_STYLE;
    const { separatorPadding, separator } = this.attributes;

    const separatorShape = new Text({
      attrs: {
        x: x + separatorPadding,
        y: 0,
        lineHeight: fontSize,
        ...INACTIVE_STYLE,
        text: separator,
      },
    });

    this.separatorShapes.push(separatorShape);

    // 计算并添加当前 shape 的宽度
    const textBbox = separatorShape.getBounds();
    const textWidth = textBbox.getMax()[0] - textBbox.getMin()[0] + separatorPadding * 2;

    return x + textWidth;
  }

  private bindEvents(shape: DisplayObject, item: BreadCrumbItem) {
    const style = this.getMixinStyle(item);
    const { items } = this.attributes;

    shape.on('mouseenter', () => {
      shape.attr('cursor', 'pointer');
      shape.attr(HOVER_STYLE);
    });

    shape.on('mouseleave', () => {
      shape.attr(style);
      shape.attr('cursor', 'default');
    });

    if (item.onClick) {
      shape.on('click', () => {
        item.onClick.call(shape, item.name, item, items);
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
