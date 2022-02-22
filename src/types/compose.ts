/**
 * @file 有原子、或分子组件 组合的分子组件 相关类型定义
 */

import { TagCfg } from '../ui/tag/types';
import { TextProps } from './dependency';

/**
 * 通用的标签属性 （不需要 Tag 组件灵活的交互样式设置）
 *
 * @title 标签，带文本、marker。
 * @description 标签，可以设置文本、marker 以及相关的文本样式和 marker 样式
 */
export type LabelProps = {
  /**
   * @title 文本内容
   * @description 展示的标签文本
   */
  text?: TagCfg['text'];
  /**
   * @title 文本样式
   * @description 文本样式设置，可以调整文本 fontSize、lineHeight 等，详细见: G5.0 Text 文本额外属性配置
   */
  textStyle?: Omit<TextProps, 'text'>;
  /**
   * @title 图标
   * @description 标签文本前缀的图标
   */
  marker?: TagCfg['marker'];
};
