import type { Group, Rect } from '@antv/g';
import { deepMix, get, isEqual, omit } from '@antv/util';
import { BaseComponent } from '../../util/create';
import { Tag } from '../tag';
import type { GUIOption } from '../../types';
import { SIZE_STYLE } from './constant';
import { maybeAppend, applyStyle } from '../../util';
import type { SwitchStyleProps, SwitchOptions } from './types';

export type { SwitchStyleProps, SwitchOptions };

// 开启颜色 默认
const OPTION_COLOR = '#1890FF';
// 关闭颜色 默认
const CLOSE_COLOR = '#00000040';

function getHandleShapeStyle(shape: Rect, spacing: number = 0, checked: boolean = true) {
  const size = Number(shape.style.height) - spacing * 2;

  return {
    x: checked ? Number(shape.style.width) + Number(shape.style.x) - spacing - size : Number(shape.style.x) + spacing,
    y: Number(shape.style.y) + spacing,
    width: size,
    height: size,
    radius: size / 2,
  };
}

function getTagShapeStyle(
  shape: Rect,
  { width, height }: { width: number; height: number },
  spacing: number = 0,
  checked: boolean = true
) {
  return {
    x: checked ? Number(shape.style.x) + spacing : Number(shape.style.width) + Number(shape.style.x) - width,
    y: Number(shape.style.y) + (Number(shape.style.height) - height) / 2,
  };
}

export class Switch extends BaseComponent<Required<SwitchStyleProps>> {
  /**
   * 组件 switch
   */
  public static tag = 'switch';

  /**
   *  开关
   */
  private checked!: boolean;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<SwitchStyleProps> = {
    type: Switch.tag,
    style: {
      x: 0,
      y: 0,
      spacing: 2,
      checked: true,
      disabled: false,
    },
  };

  constructor(options: SwitchOptions) {
    super(deepMix({}, Switch.defaultOptions, options));
  }

  public render(attributes: SwitchStyleProps, container: Group) {
    const { size = 'default', spacing, disabled, checked, unCheckedChildren, checkedChildren } = attributes;

    const group = maybeAppend(container, '.switch-content', 'g').attr('className', 'switch-content').node();
    const bounds = group.getLocalBounds();
    const { sizeStyle, tagStyle } = get(SIZE_STYLE, size, SIZE_STYLE.default);
    const cursor = disabled ? 'no-drop' : 'pointer';
    const color = checked ? OPTION_COLOR : CLOSE_COLOR;

    // 背景
    const backgroundShape = maybeAppend(group, '.switch-background', 'rect')
      .attr('className', 'switch-background')
      .style('zIndex', (group.style.zIndex || 0) - 1)
      .style('x', bounds.min[0])
      .style('y', bounds.min[1])
      .style('fill', color)
      .style('cursor', cursor)
      .style('fillOpacity', disabled ? 0.4 : 1)
      .call(applyStyle, sizeStyle)
      .node() as Rect;

    // 背景阴影动效
    const backgroundStrokeShape = maybeAppend(group, '.switch-background-stroke', 'rect')
      .attr('className', 'switch-background-stroke')
      .style('zIndex', (group.style.zIndex || 0) - 2)
      .style('x', bounds.min[0])
      .style('y', bounds.min[1])
      .style('stroke', color)
      .style('lineWidth', 0)
      .call(applyStyle, sizeStyle)
      .node() as Rect;

    // 控件
    const handleShape = maybeAppend(group, '.switch-handle', 'rect')
      .attr('className', 'switch-handle')
      .style('fill', '#fff')
      .style('cursor', cursor)
      .node() as Rect;

    // Tag 配置, 创建
    const tagCfg = checked ? checkedChildren : unCheckedChildren;
    if (checkedChildren || unCheckedChildren) {
      // 控件样式获取 主要为获取大小，好计算 Tag 的位置
      const handleShapeStyle = getHandleShapeStyle(backgroundShape as any, spacing, checked);

      const tagShape = maybeAppend(group, '.switch-tag', () => new Tag({}))
        .attr('className', 'switch-tag')
        .call((selection) =>
          (selection.node() as Tag).update(
            deepMix(
              {
                cursor,
                backgroundStyle: null,
              },
              tagStyle,
              { text: '', marker: false, background: false, ...tagCfg }
            )
          )
        )
        .node() as Tag;

      // 增加 整体宽度
      const bounds = tagShape.getLocalBounds();
      const width = bounds.max[0] - bounds.min[0] + handleShapeStyle.radius;
      const height = bounds.max[1] - bounds.min[1];

      // 内容填充背景，修改背景组件宽度
      const backgroundWidth = Math.max(width + sizeStyle.height + 2, sizeStyle.width);
      backgroundShape.attr('width', backgroundWidth);
      backgroundStrokeShape.attr('width', backgroundWidth);

      tagShape.update(getTagShapeStyle(backgroundShape as any, { width, height }, handleShapeStyle.radius, checked));
    }

    // 动画添加 通过获取 开启 和 关闭的 x 来实现动画效果
    const newHandleShapeStyle = getHandleShapeStyle(backgroundShape as any, spacing, checked);
    const oldHandleShapeStyle = getHandleShapeStyle(backgroundShape as any, spacing, !checked);
    if (handleShape.attr('x') && !isEqual(newHandleShapeStyle, oldHandleShapeStyle) && this.checked !== checked) {
      // 调整控件 和 tag 位置
      handleShape.attr(oldHandleShapeStyle);
      // 清理之前的动画
      handleShape.getAnimations()[0]?.cancel();

      handleShape.animate([{ x: oldHandleShapeStyle.x }, { x: newHandleShapeStyle.x }], {
        duration: 120,
        fill: 'both',
      });

      backgroundStrokeShape.animate(
        [
          { lineWidth: 0, strokeOpacity: 0.5 },
          { lineWidth: 14, strokeOpacity: 0 },
        ],
        {
          duration: 400,
          easing: 'ease-on',
        }
      );
    } else {
      handleShape.attr(newHandleShapeStyle);
    }

    this.checked = !!checked;
  }
}
