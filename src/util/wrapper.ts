import { DisplayObject, DisplayObjectConfig } from '@antv/g';

type CustomExtract<O, T, U> = O extends U ? T : never;
/** 获取函数参数类型 */
type GetArgumentsType<Type> = Type extends (...args: infer Arguments) => unknown ? Arguments : never;
/** 获取属性值为函数类型的相关属性 */
type GetFunctionTypeProperty<Type extends DisplayObject = DisplayObject> = {
  [Property in keyof Type as CustomExtract<Type[Property], Property, Function>]: Property;
};

type CtorType<S> = {
  new (config: DisplayObjectConfig<S>): DisplayObject;
};

export function wrapper<S>(Ctor: CtorType<S>, style: S, props: Omit<DisplayObjectConfig<S>, 'style'> = {}) {
  const shape = new Ctor({ ...props, style });

  return {
    style<K extends keyof S>(k: K, value: S[K]) {
      shape.style[k] = value;
      return this;
    },
    call<K extends keyof GetFunctionTypeProperty<DisplayObject>>(
      property: K,
      ...args: GetArgumentsType<DisplayObject[K]>
    ) {
      const callback = shape[property];
      if (typeof callback === 'function') {
        callback.apply(shape, args);
      }
      return this;
    },
    // 遵循 GUI 的 update
    update<K extends keyof S>(k: K, value: S[K]) {
      // @ts-ignore
      const updateFn = shape.update;
      if (typeof updateFn === 'function') {
        updateFn.call(shape, { [k]: value });
      }
      return this;
    },
    batchUpdate(styleProps: Partial<S>) {
      // @ts-ignore
      const updateFn = shape.update;
      if (typeof updateFn === 'function') {
        updateFn.call(shape, styleProps);
      }
      return this;
    },
    node: () => shape,
  };
}
