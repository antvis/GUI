import { Text, DisplayObject, TextStyleProps } from '@antv/g';
import { defined } from './defined';
import { select } from './selection';

/**
 * 获得图形的x、y、width、height
 */
export function getShapeSpace(shape: DisplayObject) {
  const bounds = shape && shape.getRenderBounds();
  if (!bounds)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  const max = bounds.getMax();
  const min = bounds.getMin();
  return {
    x: min[0],
    y: min[1],
    width: max[0] - min[0],
    height: max[1] - min[1],
  };
}

export function createTempText(group: DisplayObject, attrs: TextStyleProps): Text {
  const textNode = select(group).append('text').node() as Text;
  textNode.attr({ ...attrs, visibility: 'hidden' });

  return textNode;
}

export function applyStyle<S>(shape: DisplayObject<S>, style: Partial<S>) {
  for (const [key, value] of Object.entries(style)) {
    // @ts-ignore
    if (defined(value)) shape.style[key] = value;
  }
}
