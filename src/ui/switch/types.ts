import type { TagCfg } from '../tag/types';
import type { DisplayObjectConfig, MixAttrs, RectProps } from '../../types';

export type SwitchCfg = {
  /**
   * @title x 坐标
   * @description 局部坐标系下 x 轴坐标
   */
  x?: number;
  /**
   * @title y 坐标
   * @description 局部坐标系下 y 轴坐标
   */
  y?: number;
  /**
   * @title 大小
   * @description switch 开关组件大小。组件的高度等于 size，宽度默认等于 size * 2，会随着内部的子元素大小自动调整。
   * @default 22
   */
  size?: number;
  /**
   * @title 是否选中
   * @description 指定当前是否选中
   */
  checked?: boolean;
  /**
   * @title 是否禁用
   * @description 指定当前是否禁用
   */
  disabled?: boolean;
  /**
   * @title 组件的内边距
   * @description 组件的内边距
   * @default 2
   */
  spacing?: number;
  /**
   * @title 初始是否选中
   * @description 指定组件的初始状态，是否选中
   * @default true
   */
  defaultChecked?: boolean;
  /**
   * @title 选中时的内容
   * @description 选中时的内容。可以设置一个 Tag 组件类型，自定义文本和图标
   */
  checkedChildren?: TagCfg;
  /**
   * @title 非选中时的内容
   * @description 选中时的内容。可以设置一个 Tag 组件类型，自定义文本和图标
   */
  unCheckedChildren?: TagCfg;
  /**
   * @title 样式
   * @description 可设置组件的默认样式（default）和选中样式（selected）
   */
  style?: MixAttrs<Partial<RectProps>>;
  /**
   * @title 变化时回调函数
   * @description 变化时回调函数
   */
  onChange?: (checked: boolean, e: Event) => void;
  /**
   * @title 点击时回调函数
   * @description 点击时回调函数
   */
  onClick?: (checked: boolean, e: Event) => void;
};

export type SwitchOptions = DisplayObjectConfig<SwitchCfg>;
