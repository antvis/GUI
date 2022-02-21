import type { DisplayObjectConfig, MixAttrs, RectProps } from '../../types';

export type CheckboxCfg = {
  x?: number;
  y?: number;
  labelTextSpacing?: number; // label文本与checkbox的间距
  style?: MixAttrs<Partial<RectProps>>; // selected的样式与unselected样式
  checked?: boolean;
  labelText?: string; // label
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export type CheckboxOptions = DisplayObjectConfig<CheckboxCfg>;
