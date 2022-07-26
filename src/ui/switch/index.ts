import type { Group, Rect } from '@antv/g';
import { deepMix, get } from '@antv/util';
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
    x: checked
      ? Number(shape.style.x) + spacing
      : Number(shape.style.width) + Number(shape.style.x) - width - spacing / 2,
    y: Number(shape.style.y) + (Number(shape.style.height) - height) / 2,
  };
}

export class Switch extends BaseComponent<Required<SwitchStyleProps>> {
  /**
   * 组件 switch
   */
  public static tag = 'switch';

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
    const { sizeStyle, tagStyle } = get(SIZE_STYLE, size);
    const cursor = disabled ? 'no-drop' : 'pointer';

    // 背景
    const backgroundShape = maybeAppend(group, '.switch-background', 'rect')
      .attr('className', 'switch-background')
      .style('zIndex', (group.style.zIndex || 0) - 1)
      .style('x', bounds.min[0])
      .style('y', bounds.min[1])
      .style('fill', checked ? OPTION_COLOR : CLOSE_COLOR)
      .style('cursor', cursor)
      .style('fillOpacity', disabled ? 0.4 : 1)
      .call(applyStyle, sizeStyle)
      .node();

    // 控件样式获取
    const handleShapeStyle = getHandleShapeStyle(backgroundShape as any, spacing, checked);
    // 控件
    const handleShape = maybeAppend(group, '.switch-handle', 'rect')
      .attr('className', 'switch-handle')
      .style('fill', '#fff')
      .style('cursor', cursor)
      .call(applyStyle, handleShapeStyle)
      .node();

    // Tag 配置
    const tagCfg = checked ? checkedChildren : unCheckedChildren;
    if (tagCfg) {
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
              tagCfg
            )
          )
        )
        .node() as Tag;

      // 增加 整体宽度
      const bounds = tagShape.getLocalBounds();
      const width = bounds.max[0] - bounds.min[0] + handleShapeStyle.radius / 2;
      const height = bounds.max[1] - bounds.min[1];

      backgroundShape.attr('width', Math.max(width + sizeStyle.height + 2, sizeStyle.width));

      // 调整控件 和 tag 位置
      const { x } = getHandleShapeStyle(backgroundShape as any, spacing, checked);
      handleShape.attr('x', x);

      tagShape.update(
        getTagShapeStyle(backgroundShape as any, { width, height }, handleShapeStyle.radius / 2, checked)
      );
    }
  }
}
