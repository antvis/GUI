import { Group, type DisplayObject } from '@antv/g';
import { hide } from './visibility';

class OffscreenGroup extends Group {
  appendChild(child: any, index?: number | undefined) {
    hide(child);
    return super.appendChild(child, index);
  }
}

export function createOffscreenGroup(container: DisplayObject) {
  const group = container.appendChild(
    new OffscreenGroup({
      class: 'offscreen',
    })
  );
  hide(group);
  return group;
}
