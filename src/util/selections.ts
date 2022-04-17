/* eslint-disable no-underscore-dangle */
import { Group, Rect, DisplayObject, Circle, Path, Text, Ellipse, Image, Line, Polygon, Polyline, HTML } from '@antv/g';

type Element = DisplayObject & {
  __data__?: any;
};

export function diff<T = any>(oldElements: Element[], data: T[], id: (d: T, idx: number) => unknown = (d) => d) {
  // An array of new data
  const enter: T[] = [];

  // An array of elements to be updated
  const update: Element[] = [];

  // A Map from key to each element.
  const keyElement = new Map(oldElements.map((d, idx) => [id(d.__data__, idx), d]));

  // Diff
  Object.entries(data).forEach(([, datum], idx) => {
    const key = id(datum, idx);
    if (keyElement.has(key)) {
      const element = keyElement.get(key)!;
      element.__data__ = datum;
      update.push(element);
      keyElement.delete(key);
    } else {
      enter.push(datum);
    }
  });
  // An array to be removed
  const exit = Array.from(keyElement.values());

  return { enter, update, exit };
}

export class Selection<T = any> {
  static registry: Record<string, new () => Element> = {
    g: Group,
    rect: Rect,
    circle: Circle,
    path: Path,
    text: Text,
    ellipse: Ellipse,
    image: Image,
    line: Line,
    polygon: Polygon,
    polyline: Polyline,
    html: HTML,
  };

  private _elements: Element[] = [];

  private _data: T[];

  private _parent: Element;

  private _enter: Selection | null = null;

  private _update: Selection | null = null;

  private _exit: Selection | null = null;

  constructor(
    elements: Element[] = [],
    data: T[] | null,
    parent: Element,
    selections: [Selection | null, Selection | null, Selection | null] = [null, null, null]
  ) {
    this._elements = elements;
    this._data = data || [];
    this._parent = parent;
    [this._enter, this._update, this._exit] = selections;
  }

  append(node: string | ((data: T, i: number) => Element)): Selection<T> {
    const createElement = (type: string) => {
      const Ctor = Selection.registry[type];
      if (Ctor) return new Ctor();
      throw new Error(`Unknown node type: ${type}`);
    };
    const callback = typeof node === 'function' ? node : () => createElement(node);

    const elements = [];
    if (this._data !== null) {
      // For empty selection, append new element to parent.
      // Each element is bind with datum.
      for (let i = 0; i < this._data.length; i++) {
        const datum = this._data[i];
        const newElement = callback(datum, i);
        newElement.__data__ = datum;
        this._parent.appendChild(newElement);
        elements.push(newElement);
      }
      return new Selection(elements, null, this._parent);
    }
    // For non-empty selection, append new element to
    // selected element and return new selection.
    for (let i = 0; i < this._elements.length; i++) {
      const element = this._elements[i];
      const datum = element.__data__;
      const newElement = callback(datum, i);
      element.appendChild(newElement);
      elements.push(newElement);
    }
    return new Selection(elements, null, elements[0]);
  }

  each(callback: (element: Element, datum: T, index: number) => any): Selection<T> {
    for (let i = 0; i < this._elements.length; i++) {
      const element = this._elements[i];
      const datum = element.__data__;
      callback.call(element, element, datum, i);
    }
    return this;
  }

  attr(key: string, value: any): Selection<T> {
    const callback = typeof value !== 'function' ? () => value : value;
    this.each(function doEach(d, i) {
      // @ts-ignore
      if (value !== undefined) this[key] = callback.call(this, d, i);
    });
    return this;
  }

  merge(other: Selection<T>): Selection<T> {
    const elements = [...this._elements, ...other._elements];
    return new Selection<T>(elements, null, this._parent);
  }

  /**
   * Apply callback for each selection(enter, update, exit)
   * and merge them into one selection.
   */
  join<T>(
    enter: (selection: Selection<T>) => Selection<T> = (d) => d,
    update: (selection: Selection<T>) => Selection<T> = (d) => d,
    exit: (selection: Selection<T>) => Selection<T> = (d) => d && d.remove()
  ): Selection<T> {
    const empty = new Selection([], [], this._parent);
    const newEnter = enter(this._enter || empty);
    const newUpdate = update(this._update || empty);
    const newExit = exit(this._exit || empty);
    return newUpdate.merge(newEnter).merge(newExit);
  }

  remove(): Selection<T> {
    const elements = [...this._elements];
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.parentNode) {
        element.parentNode.removeChild(element);
        const index = elements.indexOf(element);
        elements.splice(index, 1);
      }
    }
    return new Selection<T>(elements, null, this._parent);
  }

  data<T>(data: T[], id: (d: T, index: number) => unknown = (d) => d): Selection<T> {
    const { enter, update, exit } = diff(this._elements, data, id);

    // Create new selection with enter, update and exit.
    const S: [Selection<T>, Selection<T>, Selection<T>] = [
      new Selection<T>([], enter, this._parent),
      new Selection<T>(update, null, this._parent),
      new Selection<T>(exit, null, this._parent),
    ];

    return new Selection<T>(this._elements, null, this._parent, S);
  }

  getElements() {
    return this._elements;
  }
}
