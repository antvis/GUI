import { intersect, hasOverlap } from '../overlap/is-overlap';
import { AxisLabel } from '../types/shape';

const methods: Record<string, (items: AxisLabel[], args: any) => AxisLabel[]> = {
  parity: (items: AxisLabel[], { seq = 2 }) =>
    items.filter((item, i) => (i % seq ? (item.style.visibility = 'hidden') : 1)),
  greedy: (items: AxisLabel[], { margin }) => {
    let a: AxisLabel;
    return items.filter((b, i) => (!i || !intersect(a, b, margin) ? ((a = b), 1) : (b.style.visibility = 'hidden')));
  },
};

// reset all items to be fully visible
const reset = (source: AxisLabel[]) => (source.forEach((item) => (item.style.visibility = 'visible')), source);

/**
 * AutoHide Layout for axis label when overlap
 */
export function AutoHide(labels: AxisLabel[], labelCfg: any, method = 'greedy') {
  const reduce = methods[method] || methods.greedy;
  const { margin } = labelCfg;

  let seq = 2;
  let source = labels;
  const timeout = 1000;
  const now = Date.now();
  while (hasOverlap(source, margin)) {
    source = reduce(reset(labels), { margin, seq });
    seq++;
    if (Date.now() - now > timeout) {
      console.warn('layout time exceeded');
      return;
    }
  }
}
