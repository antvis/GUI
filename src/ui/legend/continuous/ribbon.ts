import { Group, parseColor, type GroupStyleProps, type PathStyleProps, type RectStyleProps } from '@antv/g';
import { isFunction } from '@antv/util';
import type { PrefixObject } from '../../../types';
import { GUI, type RequiredStyleProps } from '../../../core';
import { classNames, createComponent, select, Selection, subObjects, subStyleProps } from '../../../util';
import { ifHorizontal } from '../utils';
import { getBlockColor } from './utils';

export type Interpolate<T = string> = (val: number) => T;

export type RibbonStyleProps = {
  style: GroupStyleProps &
    PrefixObject<PathStyleProps, 'selection'> &
    PrefixObject<RectStyleProps, 'track'> & {
      size: number;
      length: number;
    } & {
      type?: 'size' | 'color';
      orientation?: 'horizontal' | 'vertical';
      color: string[] | Interpolate;
      /** select area, 0~1 */
      range?: [number, number];
      block?: boolean;
      /** partition of the block ,the length of it is the block count */
      partition?: number[];
    };
};

const CLASS_NAMES = classNames(
  {
    trackGroup: 'background-group',
    track: 'background',
    selectionGroup: 'ribbon-group',
    selection: 'ribbon',
    clipPath: 'clip-path',
  },
  'ribbon'
);

function getShape(attr: RequiredStyleProps<RibbonStyleProps>) {
  const {
    style: { orientation, size, length },
  } = attr;

  return ifHorizontal(orientation, [length, size], [size, length]);
}

function getTrackPath(attr: RequiredStyleProps<RibbonStyleProps>) {
  const {
    style: { type },
  } = attr;
  const [cw, ch] = getShape(attr);

  if (type === 'size') {
    return [['M', 0, ch], ['L', 0 + cw, 0], ['L', 0 + cw, ch], ['Z']] as any[];
  }
  return [['M', 0, ch], ['L', 0, 0], ['L', 0 + cw, 0], ['L', 0 + cw, ch], ['Z']] as any[];
}

function getSelectionPath(attr: RequiredStyleProps<RibbonStyleProps>) {
  return getTrackPath(attr);
}

function getColor(attr: RequiredStyleProps<RibbonStyleProps>) {
  const {
    style: { orientation, color, block, partition },
  } = attr;
  let colors: string[];
  if (isFunction(color)) {
    const len = 20;
    colors = new Array(len).fill(0).map((_, index, arr) => color(index / (arr.length - 1)));
  } else colors = color;

  const count = colors.length;
  const genericColor = colors.map((c) => parseColor(c).toString());
  if (!count) return '';
  if (count === 1) return genericColor[0];
  if (block) return getBlockColor(partition, genericColor, orientation);
  return genericColor.reduce(
    (r, c, idx) => (r += ` ${idx / (count - 1)}:${c}`),
    `l(${ifHorizontal(orientation, '0', '270')})`
  );
}

function getClipPath(attr: RequiredStyleProps<RibbonStyleProps>): any[] {
  const {
    style: { orientation, range },
  } = attr;
  if (!range) return [];
  const [width, height] = getShape(attr);
  const [st, et] = range;
  const x = ifHorizontal(orientation, st * width, 0);
  const y = ifHorizontal(orientation, 0, st * height);
  const w = ifHorizontal(orientation, et * width, width);
  const h = ifHorizontal(orientation, height, et * height);
  return [['M', x, y], ['L', x, h], ['L', w, h], ['L', w, y], ['Z']];
}

function renderTrack(container: Selection, attr: RequiredStyleProps<RibbonStyleProps>) {
  const { style } = subStyleProps(attr, 'track');
  container.maybeAppendByClassName(CLASS_NAMES.track, 'path').styles({ path: getTrackPath(attr), ...style });
}

function renderSelection(container: Selection, attr: RequiredStyleProps<RibbonStyleProps>) {
  const style = subStyleProps(attr, 'selection');
  const fill = getColor(attr);

  const ribbon = container
    .maybeAppendByClassName(CLASS_NAMES.selection, 'path')
    .styles({ path: getSelectionPath(attr), fill, ...style });
  const clipPath = ribbon
    .maybeAppendByClassName(CLASS_NAMES.clipPath, 'path')
    .styles({ path: getClipPath(attr) })
    .node();
  ribbon.style('clip-path', clipPath);
}

export class Ribbon extends GUI<RibbonStyleProps> {
  constructor(options: RibbonStyleProps) {
    super(options, {
      style: {
        type: 'color',
        orientation: 'horizontal',
        size: 30,
        range: [0, 1],
        length: 200,
        block: false,
        partition: [],
        color: ['#fff', '#000'],
        trackFill: '#e5e5e5',
      },
    });
  }

  render(attribute: RequiredStyleProps<RibbonStyleProps>, container: Group) {
    const trackGroup = select(container).maybeAppendByClassName(CLASS_NAMES.trackGroup, 'g');
    renderTrack(trackGroup, attribute);

    /**
     * - ribbon group
     *  |- ribbon
     * - clip path
     */
    const ribbonGroup = select(container).maybeAppendByClassName(CLASS_NAMES.selectionGroup, 'g');
    renderSelection(ribbonGroup, attribute);
  }
}
