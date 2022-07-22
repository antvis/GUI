import { Group } from '@antv/g';
import { isFunction } from '@antv/util';
import { applyStyle, maybeAppend } from '../../util';
import { BaseComponent } from '../../util/create';
import { parseMarker } from './utils';
import {
  circle,
  square,
  diamond,
  triangleDown,
  triangle,
  cross,
  point,
  hexagon,
  bowtie,
  hyphen,
  tick,
  plus,
  line,
  dot,
  dash,
  smooth,
  hv,
  vh,
  hvh,
  vhv,
} from './symbol';
import type { MarkerStyleProps, MarkerOptions, FunctionalSymbol } from './types';

export type { MarkerStyleProps, MarkerOptions, FunctionalSymbol };

function getType(symbol: MarkerStyleProps['symbol']): string | null {
  const markerType = parseMarker(symbol);

  if (['base64', 'url', 'image'].includes(markerType)) {
    return 'image';
  }
  if (markerType === 'symbol') {
    return 'path';
  }

  return null;
}

export class Marker extends BaseComponent<MarkerStyleProps> {
  public render(attributes: MarkerStyleProps, container: Group) {
    const { x, y, symbol, size = 16, ...style } = attributes;
    const type = getType(symbol);
    if (!type) {
      const shape = this.querySelector('.marker');
      shape?.remove();
      return;
    }

    maybeAppend(container, `.${type}-marker`, type)
      .attr('className', `marker ${type}-marker`)
      .call((selection) => {
        if (type === 'image') {
          // todo 大小和 path symbol 保持一致
          const r = (size as number) * 2;
          selection.style('img', symbol).style('width', r).style('height', r).style('x', -size).style('y', -size);
        } else {
          const r = (size as number) / 2;
          const symbolFn = isFunction(symbol) ? symbol : Marker.getSymbol(symbol);
          selection.style('path', symbolFn?.(0, 0, r)).call(applyStyle, style);
        }
      });
  }

  private static MARKER_SYMBOL_MAP = new Map<string, FunctionalSymbol>();

  /**
   * 注册 icon 类型
   * @param type
   * @param path
   */
  public static registerSymbol = (type: string, symbol: FunctionalSymbol) => {
    Marker.MARKER_SYMBOL_MAP.set(type, symbol);
  };

  /**
   * 获取已经注册的 icon 的 path
   */
  public static getSymbol = (type: string): FunctionalSymbol | undefined => {
    return Marker.MARKER_SYMBOL_MAP.get(type);
  };
}

/** Shapes for Point Geometry */
Marker.registerSymbol('cross', cross);
Marker.registerSymbol('hyphen', hyphen);
Marker.registerSymbol('line', line);
Marker.registerSymbol('plus', plus);
Marker.registerSymbol('tick', tick);

Marker.registerSymbol('circle', circle);
Marker.registerSymbol('point', point);
Marker.registerSymbol('bowtie', bowtie);
Marker.registerSymbol('hexagon', hexagon);
Marker.registerSymbol('square', square);
Marker.registerSymbol('diamond', diamond);
Marker.registerSymbol('triangle', triangle);
Marker.registerSymbol('triangle-down', triangleDown);
/** LineSymbols */
Marker.registerSymbol('line', line);
Marker.registerSymbol('dot', dot);
Marker.registerSymbol('dash', dash);
Marker.registerSymbol('smooth', smooth);
Marker.registerSymbol('hv', hv);
Marker.registerSymbol('vh', vh);
Marker.registerSymbol('hvh', hvh);
Marker.registerSymbol('vhv', vhv);
