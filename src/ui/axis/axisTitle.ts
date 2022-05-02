import { Group } from '@antv/g';
import { noop } from '@antv/util';
import { Constraint } from '../../layout/constraint';
import { Bounds } from '../../layout/bounds';
import { createTempText, getEllipsisText, getFont, multi, defined, Selection, DegToRad } from '../../util';
import { getSign, ifLeft, ifBottom, ifX, ifTop, ifY } from './utils';
import { AxisTitleCfg } from './types';

type AxisTitleOptions = AxisTitleCfg & {
  /** Orient of axis */
  orient: 'top' | 'bottom' | 'left' | 'right';
};

const { cos, sin, abs } = Math;

export function getAxisTitleStyle(selection: Selection, options: AxisTitleOptions) {
  const {
    orient = 'bottom',
    titleAnchor = 'end',
    titlePadding = 0,
    maxLength,
    content: text = '',
    rotate: rotation,
    style = {},
  } = options;

  const sign = getSign(orient, -1, 1);
  // eslint-disable-next-line no-nested-ternary
  const anchorExpr = (anchor: string) => (anchor === 'start' ? 0 : anchor === 'end' ? 1 : 0.5);
  // Axis-line and axis-label-group are under the same parent node.
  const axisLineBounds = (() => {
    return new Bounds((selection.select('.axis-line').node() as Group).getBBox());
  })();
  const axisLabelBounds = (() => {
    const bbox = (selection.select('.axis-label-group').node() as Group).getBBox();
    if (!bbox.width || !bbox.height) return axisLineBounds;
    return new Bounds(bbox);
  })();

  let x = (options.positionX || 0) + axisLineBounds.left;
  let y = (options.positionY || 0) + axisLineBounds.top;
  if (!defined(options.positionX)) {
    // If x-direction, positionX is determined by `axisLine` and `titleAnchor`,
    // otherwise, positionX is determined by `orient`, `axisLabel` and `titlePadding`(distance between title and label).
    x = ifX(
      orient,
      axisLineBounds.left + anchorExpr(titleAnchor) * axisLineBounds.width!,
      ifLeft(orient, axisLabelBounds.left, axisLabelBounds.right)! + multi(sign, titlePadding)
    )!;
  }

  if (!defined(options.positionY)) {
    // If x-direction, positionY is determined by `orient`, `axisLabel` and `titlePadding`(distance between title and label),
    // otherwise, positionY is determined by `axisLine` and `titleAnchor`.
    y = ifX(
      orient,
      ifBottom(orient, axisLabelBounds.bottom, axisLabelBounds.top)!! + multi(sign, titlePadding),
      axisLineBounds.top + anchorExpr(titleAnchor) * axisLineBounds.height!
    )!;
  }

  const attrs = {
    // TextStyleProps
    x,
    y,
    ...style,
    textBaseline: style.textBaseline || (ifX(orient, ifTop(orient, 'bottom', 'top')!, 'bottom') as any),
    textAlign:
      style.textAlign ||
      (ifLeft(
        orient,
        // eslint-disable-next-line no-nested-ternary
        titleAnchor === 'start' ? 'end' : titleAnchor === 'end' ? 'start' : 'center',
        titleAnchor
      ) as any),
  };

  // Rotation angle of title shape.
  const angle = rotation ?? ifX(orient, 0, multi(sign, 90))!;

  const textNode = createTempText(selection.node(), { ...attrs, text });
  textNode.setLocalEulerAngles(angle!);
  let bbox = textNode.getBBox();
  const font = getFont(textNode as any);
  textNode.remove();

  // Add layout constraints
  let vars = {
    x,
    y,
    width: maxLength === Infinity || !defined(maxLength) ? 260 : maxLength,
  };
  const constraint = new Constraint(vars);

  const ifHorizontalText = (orient: string, angle: number, a: Function, b: Function) =>
    ifX(orient, a, abs(cos(angle)) === 1 ? a() : b());
  // Do not out of bounds. 需要相对坐标.
  // Bounds only support to limit the title width now.
  let bounds: Bounds | undefined;
  if (options.bounds) {
    const { x1, y1, x2, y2 } = options.bounds;
    bounds = new Bounds({ left: x1, top: y1, right: x2, bottom: y2 });
    const left = bounds.defined('left') ? bounds.left : undefined;
    const right = bounds.defined('right') ? bounds.right : undefined;
    const top = bounds.defined('top') ? bounds.top : undefined;
    const bottom = bounds.defined('bottom') ? bounds.bottom : undefined;

    let adjusted;
    if (left !== undefined && bbox.left < left) {
      // If out of left hand side, change `align` to left, and `x` to the `bounds.left`. Make sure it not out-of right hand side.
      constraint.addConstraint(['x'], '=', left);
      ifHorizontalText(orient, angle, () => (attrs.textAlign = 'start'), noop);
      adjusted = true;
    } else if (right !== undefined && bbox.right > right) {
      // If out of left hand side, change `align` to left, and `x` to the `bounds.left`. Make sure it not out-of right hand side.
      constraint.addConstraint(['x'], '=', right);
      ifHorizontalText(orient, angle, () => (attrs.textAlign = 'end'), noop);
      adjusted = true;
    }

    if (top !== undefined && bbox.top < top) {
      constraint.addConstraint(['y'], '=', top);
      ifHorizontalText(orient, angle, noop, () => (attrs.textAlign = sin(angle * DegToRad) < 0 ? 'end' : 'start'));
    } else if (bottom !== undefined && bbox.bottom > bottom) {
      constraint.addConstraint(['y'], '=', bottom);
      ifHorizontalText(orient, angle, noop, () => (attrs.textAlign = sin(angle * DegToRad) > 0 ? 'end' : 'start'));
    }

    if (left !== undefined && right !== undefined) {
      const ratio = abs(cos(angle * DegToRad));
      ratio > 10e-16 && constraint.addConstraint([ratio, 'width'], '<=', right - left > 0 ? right - left : 0);
    }
    if (bottom !== undefined && top !== undefined) {
      const ratio = abs(sin(angle * DegToRad));
      ratio > 10e-16 && constraint.addConstraint([ratio, 'width'], '<=', bottom - top > 0 ? bottom - top : 0);
    }
  }
  vars = constraint.collect();

  const limitLength = defined(vars.width) ? Math.floor(vars.width!) : undefined;
  return {
    id: 'axis-title',
    orient,
    // [NOTE]: 不可以传入 G 内置使用的变量 anchor
    titleAnchor,
    limitLength,
    tip: text,
    // TextStyleProps
    ...attrs,
    x: vars.x,
    y: vars.y,
    angle,
    transform: `rotate(${angle}deg)`,
    text: defined(limitLength) ? getEllipsisText(text, limitLength!, font, '...') : text,
  };
}
