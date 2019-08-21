/**
 * Icon 需求和设计：https://yuque.antfin-inc.com/eva-engine/specs/sh9uyn
 * 使用 icon font
 */
import { Group, PointType, Rect, Shape } from '@antv/g';
import { IconCfg } from './interface';

export default class Icon extends Group {
  // 位置偏移
  private position: PointType;

  // icon 类型，iconfont 上的 unicode
  private icon: string;
  // 文本
  private text: string;
  // 文本和 icon 的距离
  private spacing: number;
  // icon 样式
  private iconStyle: object;
  // 文本样式
  private textStyle: object;

  private interactive: boolean;

  private bg: Rect;

  constructor(cfg: IconCfg) {
    super(cfg);

    const { position = { x: 0, y: 0 }, icon, text = '', spacing = 8, iconStyle, textStyle, interactive = false } = cfg;

    this.position = position;
    this.icon = icon;
    this.text = text;
    this.spacing = spacing;
    // todo 默认样式
    this.iconStyle = {
      fontFamily: 'iconfont', // 字体名称
      fontSize: 16,
      textAlign: 'left',
      textBaseline: 'top',
      fill: '#1890ff',
      ...iconStyle,
    };
    this.textStyle = {
      fontSize: 12,
      textAlign: 'left',
      textBaseline: 'middle',
      fill: '#000',
      ...textStyle,
    };

    this.interactive = interactive;

    // 渲染
    this._initIcon();

    if (this.interactive) {
      this._bindEvent();
    }
  }

  // 绘制 icon
  private _initIcon() {
    const { x, y } = this.position;

    const icon = String.fromCharCode(parseInt(this.icon, 16));

    // icon
    const iconShape = this.addShape('text', {
      attrs: {
        x,
        y,
        text: icon, // iconfont 图标对应的 Unicode 编码
        ...this.iconStyle,
      },
    });

    // text
    if (this.text) {
      const iconBBox = iconShape.getBBox();

      this.addShape('text', {
        attrs: {
          x: x + iconBBox.width + this.spacing,
          y: y + iconBBox.height / 2,
          text: this.text,
          ...this.textStyle,
        },
      });
    }

    // 背景
    const bbox = this.getBBox();
    this.bg = this.addShape('rect', {
      attrs: {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
        radius: 2,
        fill: '#fff',
      },
      zIndex: -1,
    });

    this.sort();
  }

  /**
   * 绑定事件：
   * 1. hover 加背景
   * 2. 点击 emit 出去
   * @private
   */
  private _bindEvent() {
    this.on('mouseover', () => {
      this.bg.attr('fill', '#F5F5F5');

      this.get('canvas').draw();
    });

    this.on('mouseout', () => {
      this.bg.attr('fill', '#fff');

      this.get('canvas').draw();
    });
  }
}
