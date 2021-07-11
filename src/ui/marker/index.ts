import { Path } from '@antv/g';
import { deepMix, isFunction } from '@antv/util';
import { MarkerOptions, FunctionalSymbol } from './types';
import { circle, square, diamond, triangleDown, triangle } from './symbol';
import { Component } from '../../abstract';

export { MarkerOptions, FunctionalSymbol };

/**
 * Marker
 */
export class Marker extends Component<MarkerOptions> {
  /**
   * 标签类型
   */
  public static tag = 'marker';

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
   * 默认参数
   */
  protected static defaultOptions = {
    type: Marker.tag,
    attrs: {
      x: 0,
      y: 0,
      r: 16,
    },
  };

  constructor(options: MarkerOptions) {
    super(deepMix({}, Marker.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any): void {
    console.log('attributeChangedCallback', name, value);
  }

  /**
   * 根据 type 获取 maker shape
   */
  protected init(): void {
    const pathAttrsCallback = () => {
      const { x, y, r, symbol, ...args } = this.attributes;
      const symbolFn = isFunction(symbol) ? symbol : Marker.MARKER_SYMBOL_MAP.get(symbol);
      const path = symbolFn(x, y, r);
      return {
        x,
        y,
        path,
        ...args,
      };
    };
    this.appendSubComponent('pathShape', Path, pathAttrsCallback);
  }
}

// 内置的组件
Marker.registerSymbol('circle', circle);
Marker.registerSymbol('square', square);
Marker.registerSymbol('diamond', diamond);
Marker.registerSymbol('triangle', triangle);
Marker.registerSymbol('triangle-down', triangleDown);
