import { DisplayObject, ShapeAttrs } from 'types';

/**
 * 对Group中名为shape的DisplayObject对象应用attrs中的属性
 * @param group
 * @param shape
 * @param attrs
 */
export const applyAttrs = (group: DisplayObject, shape: string, attrs: ShapeAttrs) => {
  Object.entries(attrs).forEach((attr) => {
    group[shape].attr(attr[0], attr[1]);
  });
};
