import { DisplayObject } from '@antv/g';

export function traverse(element: DisplayObject, callback: (node: DisplayObject) => void) {
  callback(element);
  if (element.children) {
    element.children.forEach((child) => {
      if (child instanceof DisplayObject) traverse(child, callback);
    });
  }
}
