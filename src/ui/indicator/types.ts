import type { GroupStyleProps, PathStyleProps, TextStyleProps } from '../../shapes';
import type { ComponentOptions } from '../../core';
import type { ExtendDisplayObject, PrefixObject } from '../../types';
import type { SeriesAttr } from '../../util';

export type Position = 'top' | 'right' | 'bottom' | 'left';

export type IndicatorStyleProps<T = any> = GroupStyleProps &
  PrefixObject<PathStyleProps, 'background'> &
  PrefixObject<Omit<TextStyleProps, 'text'>, 'label'> & {
    labelText?: T;
    /** position of indicator related to pointer  */
    position?: Position;
    padding?: SeriesAttr;
    formatter?: (val: T) => ExtendDisplayObject;
  };

export type IndicatorOptions = ComponentOptions<IndicatorStyleProps>;
