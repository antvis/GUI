export * from './dependency';
export type { MixAttrs, StyleState } from './styles';

export type GUIOption<C> = {
  type: string;
  style: C;
};

export type Point = [number, number];
