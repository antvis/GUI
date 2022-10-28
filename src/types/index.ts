// ----------------------------------------------------------------

import { DisplayObject } from '@antv/g';

export * from './dependency';
export * from './compose';
export type { MixAttrs, StyleState } from './styles';

export type GUIOption<C> = {
  type: string;
  style: C;
};

export type Point = [number, number];
export type Vector2 = [number, number];

export type PrefixedStyle<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${Capitalize<K>}` : never]?: T[K];
};

export type DO = string | DisplayObject;

export type Callbackable<T, P extends any[]> = T | ((...args: P) => T);

export type CallbackParameter<T = any, E extends any[] = []> = [datum: T, index: number, data: T[], ...args: E];

export type CallbackableObject<T extends { [keys: string]: any }, P extends any[]> = {
  [K in keyof T]: Callbackable<T[K], P>;
};

export type InferPrefixStyle<T> = T extends PrefixedStyle<infer P, any> ? P : never;

export type InferCallbackableStyle<T> = T extends CallbackableObject<PrefixedStyle<infer P, any>, infer Q>
  ? CallbackableObject<P, Q>
  : never;

export type InferStyle<T> = InferPrefixStyle<T> & InferCallbackableStyle<T>;
