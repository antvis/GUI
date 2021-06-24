import { DisplayObject, ShapeAttrs } from 'types';

/**
 * 对Group中名为shape的DisplayObject对象应用attrs中的属性
 * @param group
 * @param shape
 * @param attrs
 */
export const applyAttrs = (target: DisplayObject, attrs: ShapeAttrs) => {
  Object.entries(attrs).forEach(([attrName, attrValue]) => {
    target.attr(attrName, attrValue);
  });
};

/**
 * 平台判断
 */
export const isPC = (userAgent = undefined) => {
  const userAgentInfo = userAgent || navigator.userAgent;
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;
  Agents.forEach((item) => {
    if (userAgentInfo.indexOf(item) > 0) {
      flag = false;
    }
  });
  return flag;
};
