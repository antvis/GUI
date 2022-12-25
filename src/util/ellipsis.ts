import { pick } from '@antv/util';
import type { Selection } from './selection';
import { getEllipsisText } from './text';

export function ellipsisIt(el: Selection, width: number) {
  const node = el.node();

  if (node.nodeName !== 'text') return;

  // implement ellipsis in g
  //   const cfg = { wordWrap: true, wordWrapWidth: width, maxLines: 1, textOverflow: '...' };
  //   el.call(applyStyle, cfg);

  // implement ellipsis in gui
  if (!node.attr('rawText')) node.attr('rawText', node.attr('text'));
  const text = node.attr('rawText');
  const font = pick(node.attributes, [
    'fontSize',
    'fontFamily',
    'fontWeight',
    'fontStyle',
    'fontVariant',
    'letterSpacing',
    'leading',
  ]);
  const ellipsisedText = getEllipsisText(text, width, font, '...');
  node.attr('text', ellipsisedText);
}
