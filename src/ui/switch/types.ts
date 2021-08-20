import type { TagCfg } from '../tag/types';
import type { DisplayObjectConfig } from '../../types';

export type SwitchCfg = {
  x?: number;
  y?: number;
  size?: 'small' | 'default';
  checked?: boolean;
  disabled?: boolean;
  defaultChecked?: boolean;
  checkedChildren?: TagCfg;
  unCheckedChildren?: TagCfg;
  onChange?: (checked: boolean) => void;
  onClick?: (checked: boolean) => void;
};

export type SwitchOptions = DisplayObjectConfig<SwitchCfg>;
