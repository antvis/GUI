import { deepMix, isNil, omit, get, isPlainObject } from '@antv/util';
import { Rect, Line, RectStyleProps } from '@antv/g';
import type { SwitchCfg, SwitchOptions } from './types';
import { GUI } from '../core/gui';
import { getShapeSpace } from '../../util';
import { Tag } from '../tag';
import type { TagCfg } from '../tag/types';
import type { GUIOption } from '../../types';

export type { SwitchCfg, SwitchOptions };

// 开启颜色
const OPTION_COLOR = '#1890FF';
// 关闭颜色
const CLOSE_COLOR = '#00000040';
// 背景和控件间距
const PADDING = 2;
// 背景和childrenShape 的间距
const PADDING2 = 8;
// 默认样式
const rectDefaultStyle: RectStyleProps = {
  stroke: OPTION_COLOR,
  fill: OPTION_COLOR,
  width: 44,
  height: 22,
  radius: 11,
};
// 默认tag 样式
const checkedChildrenStyle = {
  backgroundStyle: false,
  textStyle: {
    default: {
      fill: '#fff',
    },
  },
} as TagCfg;

export class Switch extends GUI<SwitchCfg> {
  /**
   * 组件 tag
   */
  public static tag = 'switch';

  /** 背景 组件 */
  private backgroundShape!: Rect;

  /** 动效 组件 */
  private rectStrokeShape!: Rect;

  /** 控件 组件 */
  private handleShape!: Rect;

  /** 选中时内容 组件 */
  private childrenShape: Tag[] = [];

  /** 值 */

  private checked!: boolean;

  /** 默认值 */
  private defaultChecked!: boolean;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<SwitchCfg> = {
    type: Switch.tag,
    style: {
      x: 0,
      y: 0,
      defaultChecked: true,
    },
  };

  constructor(options: SwitchOptions) {
    super(deepMix({}, Switch.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.initShape();
    this.update({});
    this.bindEvents();
  }

  /**
   * 初始化创建
   */
  private initShape() {
    const { defaultChecked, checked } = this.attributes;
    this.defaultChecked = !!(checked || defaultChecked);
    this.checked = !!(isNil(checked) ? defaultChecked : checked);

    this.backgroundShape = this.createBackgroundShape();

    this.rectStrokeShape = this.createRectStrokeShape();

    this.handleShape = this.createHandleShape();

    this.backgroundShape.appendChild(this.handleShape);

    this.appendChild(this.rectStrokeShape);
    this.appendChild(this.backgroundShape);
  }

  // 创建 背景Shape
  public createBackgroundShape() {
    return new Rect({
      name: 'background',
      style: {
        ...Switch.defaultOptions.style,
        ...rectDefaultStyle,
      },
    });
  }

  // 创建 动效Shape
  public createRectStrokeShape() {
    return new Rect({
      name: 'rectStroke',
      style: {
        ...Switch.defaultOptions.style,
        ...rectDefaultStyle,
        strokeOpacity: 0.4,
        lineWidth: 0,
        fill: '#efefef',
      },
    });
  }

  // 创建 控件Shape
  public createHandleShape() {
    // 暂时使用 Rect 为之后的变形动画做准备
    return new Rect({
      name: 'handle',
      style: {
        width: 0,
        height: 0,
        y: PADDING,
        fill: '#fff',
      },
    });
  }

  /**
   * 组件的更新
   */
  public update(cfg: SwitchCfg) {
    this.attr(deepMix({}, this.attributes, cfg));
    // 更新开关
    const animateFlag = this.updateChecked();
    // 更新 shape attr
    this.updateShape();
    // 如果 修改了 checked 开启动画
    if (animateFlag) {
      this.animateSiwtch();
    }
  }

  public updateShape() {
    // 创建/更新/销毁 开关显示标签 Shape
    this.updateCheckedChildrenShape();
    // 更新背景 + 动效
    this.updateBackgroundShape();
    // 更新控件
    this.updateHandleShape();
  }

  // 创建/更新/销毁 开关显示标签 Shape
  public updateCheckedChildrenShape() {
    ['checkedChildren', 'unCheckedChildren'].forEach((key, index) => {
      const children = get(this.attributes, key) as TagCfg;
      if (!this.childrenShape[index]) {
        this.childrenShape[index] = new Tag({
          name: key,
          style: checkedChildrenStyle,
        });
      }
      const childrenShape = this.childrenShape[index];
      if (isPlainObject(children)) {
        childrenShape.update({ ...omit(children, ['backgroundStyle', 'textStyle', 'x']), x: 0 });
        // checked 控制这个有无
        (index === 0 ? this.checked : !this.checked)
          ? this.backgroundShape.appendChild(childrenShape)
          : this.backgroundShape.removeChild(childrenShape);
        childrenShape.update({
          x: index ? this.getShapeWidth() - getShapeSpace(childrenShape).width - PADDING2 : PADDING2,
        });
      } else {
        childrenShape?.destroy();
      }
    });
  }

  // 更新背景 + 动效
  public updateBackgroundShape() {
    const color = this.checked ? OPTION_COLOR : CLOSE_COLOR;
    const { disabled } = this.attributes;
    const width = this.getShapeWidth();
    this.backgroundShape.attr({
      width,
      fill: color,
      stroke: color,
      cursor: disabled ? 'no-drop' : 'pointer',
      fillOpacity: disabled ? 0.4 : 1,
    });

    this.rectStrokeShape.attr({
      width,
      stroke: color,
    });
  }

  // 更新控件
  public updateHandleShape() {
    const { height, radius } = rectDefaultStyle;
    const width = this.getShapeWidth();
    const r = (radius as number) - PADDING;
    this.handleShape.attr({
      x: this.defaultChecked ? width - height + PADDING : PADDING,
      width: r * 2,
      height: r * 2,
      radius: r,
      offsetPath: new Line({
        // 创建运动轨迹
        style: {
          x1: width - height + PADDING,
          y1: PADDING,
          x2: PADDING,
          y2: PADDING,
        },
      }),
    });
  }

  // 获取背景Shape宽度
  public getShapeWidth() {
    const { width } = rectDefaultStyle;
    const childrenShape = this.childrenShape[this.checked ? 0 : 1];
    const childrenWidth = childrenShape ? getShapeSpace(childrenShape).width - PADDING2 : 0;

    return childrenWidth + width;
  }

  // 更新 checked 如果 没有传入 checked 并且 checked 没有改变则不更新
  public updateChecked() {
    const { checked } = this.attributes;
    // 当不存在 checked 或 checked 没有改变 则不需要更改 checked 和 发生动效
    if (isNil(checked) || this.checked === !!checked) return false;
    this.checked = !!checked;
    return true;
  }

  /**
   * 添加交互
   */
  private bindEvents() {
    this.addEventListener('mouseenter', () => {
      this.banEvent(this.clearBackgroundLine);
    });

    this.addEventListener('mouseleave', () => {
      this.banEvent(this.addBackgroundLine);
    });

    this.addEventListener('click', () => {
      this.banEvent(this.addClick);
      const { onClick } = this.attributes;
      onClick && onClick(this.checked);
    });

    window.addEventListener('click', () => {
      this.banEvent(this.clearBackgroundLine);
    });
  }

  // disabled 时 禁止交互
  public banEvent(fn: Function) {
    const { disabled, checked } = this.attributes;
    if (disabled || !isNil(checked)) return;
    fn.apply(this);
  }

  // 去除聚焦效果
  public clearBackgroundLine() {
    this.backgroundShape.attr({
      lineWidth: 0,
    });
  }

  // 添加聚焦效果
  public addBackgroundLine() {
    this.backgroundShape.attr({
      lineWidth: 5,
      strokeOpacity: 0.2,
    });
  }

  // siwtch 点击添加
  public addClick() {
    const { onChange, checked } = this.attributes;
    this.checked = checked || !this.checked;
    onChange && onChange(this.checked);
    this.updateShape();
    this.animateSiwtch();
  }

  /**
   * 变换 背景/控件 + 动画效果 + 动效
   * 触发这个方法的情况 :
   * 1、初始化的时候，动画并不会发生， 但又改变颜色 所以可以直接使用。
   * 2、点击的时候
   * 3、update 改变 checked 的时候 外部控制 开关
   */
  public animateSiwtch() {
    // 点击动效
    this.rectStrokeShape.animate(
      [
        { lineWidth: 0, strokeOpacity: 0.5 },
        { lineWidth: 14, strokeOpacity: 0 },
      ],
      {
        duration: 400,
        easing: 'ease-on',
      }
    );

    // 中间控件 位置变换
    this.handleShape.animate(
      [
        { offsetDistance: this.checked ? 1 : 0 }, // 变换
        { offsetDistance: !this.checked ? 1 : 0 },
      ],
      {
        duration: 100,
        fill: 'forwards',
      }
    );
  }

  public getChecked() {
    return this.checked;
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.handleShape.destroy();
    this.backgroundShape.destroy();
    this.rectStrokeShape.destroy();
  }
}
