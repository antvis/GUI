import type { GroupStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import type { ComponentOptions } from '../../core';
import type { ExtendDisplayObject, PrefixObject } from '../../types';
import type { SeriesAttr } from '../../util';
import { Option } from './option';

export type OptionStyleProps = Omit<GroupStyleProps, 'width' | 'height'> &
  PrefixObject<Omit<RectStyleProps, 'width' | 'height'>, 'background'> &
  PrefixObject<Omit<TextStyleProps, 'text'>, 'label'> & {
    value: string | number;
    label: ExtendDisplayObject;
    padding?: SeriesAttr;
    width?: number;
    height?: number;
    selected?: boolean;
    onClick?: (
      value: OptionStyleProps['value'],
      option: Pick<OptionStyleProps, 'value' | 'label'>,
      item: typeof Option
    ) => void;
  };

export type OptionOptions = ComponentOptions<OptionStyleProps>;

export type SelectStyleProps = GroupStyleProps &
  PrefixObject<Omit<RectStyleProps, 'width' | 'height'>, 'select'> &
  PrefixObject<TextStyleProps, 'placeholder'> &
  PrefixObject<Omit<RectStyleProps, 'width' | 'height'>, 'dropdown'> &
  PrefixObject<TextStyleProps, 'option'> &
  PrefixObject<Omit<OptionStyleProps, 'value' | 'label'>, 'option'> & {
    /** 宽度 */
    width?: number;
    /** 高度 */
    height?: number;
    /** 是否有边框 */
    bordered?: boolean;
    /** 默认选中 */
    defaultValue?: OptionStyleProps['value'];
    /** 打开下拉框 */
    open?: boolean;
    /** 选项 */
    options?: {
      value: OptionStyleProps['value'];
      label: ExtendDisplayObject;
    }[];
    optionPadding?: SeriesAttr;
    /** 被选中时调用，参数为选中项的 value (或 key) 值 */
    onSelect?: (
      value: OptionStyleProps['value'],
      option: Pick<OptionStyleProps, 'value' | 'label'>,
      item: typeof Option
    ) => void;
  };

export type SelectOptions = ComponentOptions<SelectStyleProps>;
