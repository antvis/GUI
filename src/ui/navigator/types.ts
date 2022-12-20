import type { DisplayObjectConfig, Group, PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import type { PrefixedStyle } from '../../types';

export interface NavigatorStyle
  extends Omit<RectStyleProps, 'width' | 'height'>,
    PrefixedStyle<PathStyleProps & { size?: number }, 'button'>,
    PrefixedStyle<TextStyleProps, 'pageNum'> {}

export interface NavigatorCfg {
  /** once pageWidth is not provided, it will be set to bbox shape */
  pageWidth?: number;
  /** infer to pageWidth */
  pageHeight?: number;
  effect?: string;
  duration?: number;
  orient?: 'horizontal' | 'vertical';
  initPage?: number;
  loop?: boolean;
  /** padding between buttons and page number  */
  controllerPadding?: number;
  /** spacing between controller and page content */
  controllerSpacing?: number;
  formatter?: (curr: number, total: number) => string;
}

export type NavigatorStyleProps = NavigatorStyle & NavigatorCfg;

export type NavigatorOptions = DisplayObjectConfig<NavigatorStyleProps>;
