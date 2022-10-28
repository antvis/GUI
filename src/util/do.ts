import { Text } from '@antv/g';
import type { DO } from '@/types';

export function createDO(el: DO) {
  return typeof el === 'string'
    ? new Text({
        style: {
          text: el,
        },
      })
    : el;
}
