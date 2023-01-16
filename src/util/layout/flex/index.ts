import type { FlexContainerConfig, FlexLayoutConfig } from './types';
import type { LayoutExecuter } from '../types';
import { getItemsBBox } from '../utils';

export const flex: LayoutExecuter<FlexLayoutConfig> = function (container, children, config) {
  const { width, height } = container;
  const {
    flexDirection = 'row',
    flexWrap = 'nowrap',
    justifyContent = 'flex-start',
    alignContent = 'flex-start',
    alignItems = 'flex-start',
  } = config;

  const isHorizontalFlow = flexDirection === 'row'; // || flexDirection === 'row-reverse';
  const isLeftToRightFlow = flexDirection === 'row' || flexDirection === 'column';

  // implement default layout;
  // flex direction
  const direction = isHorizontalFlow ? (isLeftToRightFlow ? [1, 0] : [-1, 0]) : isLeftToRightFlow ? [0, 1] : [0, -1];

  let [offsetX, offsetY] = [0, 0];
  const itemsFromDirection = children.map((child) => {
    const { width, height } = child;
    const [x, y] = [offsetX, offsetY];
    [offsetX, offsetY] = [offsetX + width * direction[0], offsetY + height * direction[1]];
    return new DOMRect(x, y, width, height);
  });

  // flex wrap
  // todo

  // justify content
  // flex-start, flex-end, center
  const itemsForJustifyContentBBox = getItemsBBox(itemsFromDirection);
  const justifyContentOffset = {
    'flex-start': 0,
    'flex-end': isHorizontalFlow
      ? width - itemsForJustifyContentBBox.width
      : height - itemsForJustifyContentBBox.height,
    center: isHorizontalFlow
      ? (width - itemsForJustifyContentBBox.width) / 2
      : (height - itemsForJustifyContentBBox.height) / 2,
  };
  const itemsFromJustifyContent = itemsFromDirection.map((item) => {
    const { x, y } = item;
    const itemBox = DOMRect.fromRect(item);
    itemBox.x = isHorizontalFlow ? x + justifyContentOffset[justifyContent] : x;
    itemBox.y = isHorizontalFlow ? y : y + justifyContentOffset[justifyContent];
    return itemBox;
  });

  // align items
  // flex-start, flex-end, center
  const itemsForAlignItemsBBox = getItemsBBox(itemsFromJustifyContent);
  const alignItemsOffset = {
    'flex-start': 0,
    'flex-end': isHorizontalFlow ? height - itemsForAlignItemsBBox.height : width - itemsForAlignItemsBBox.width,
    center: isHorizontalFlow
      ? (height - itemsForAlignItemsBBox.height) / 2
      : (width - itemsForAlignItemsBBox.width) / 2,
  };
  const itemsFromAlignItems = itemsFromJustifyContent.map((item) => {
    const { x, y } = item;
    const itemBox = DOMRect.fromRect(item);
    itemBox.x = isHorizontalFlow ? x : x + alignItemsOffset[alignItems];
    itemBox.y = isHorizontalFlow ? y + alignItemsOffset[alignItems] : y;
    return itemBox;
  });

  return itemsFromAlignItems;
};
