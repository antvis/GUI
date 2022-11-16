import { deepAssign } from '../../util';

export const CROSSHAIR_BASE_DEFAULT_STYLE = {
  tagText: '',
  lineStroke: '#416180',
  lineStrokeOpacity: 0.45,
  lineLineWidth: 1,
  lineLineDash: [5, 5],
};

export const LINE_CROSSHAIR_DEFAULT_STYLE = deepAssign({}, CROSSHAIR_BASE_DEFAULT_STYLE, {
  type: 'line',
  tagPosition: 'start',
  tagAlign: 'center',
  tagVerticalAlign: 'bottom',
});

export const CIRCLE_CROSSHAIR_DEFAULT_STYLE = deepAssign({}, CROSSHAIR_BASE_DEFAULT_STYLE, {
  type: 'circle',
  defaultRadius: 0,
});

export const POLYGON_CROSSHAIR_DEFAULT_STYLE = deepAssign({}, CROSSHAIR_BASE_DEFAULT_STYLE, {
  type: 'polygon',
  defaultRadius: 0,
  startAngle: 0,
});
