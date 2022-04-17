import { hasOverlap } from '../overlap/is-overlap';
import { AxisLabel } from '../types/shape';

export function rotateLabel(label: AxisLabel, rotation: number) {
  label.setEulerAngles(rotation);

  const { orient } = label.style;
  const applyStyle = (key: 'textBaseline' | 'textAlign', value: any) => (label.style[key] = value);

  // Choose 14deg and -14deg as threshold.
  if (orient === 'top') {
    if (rotation > 14 || rotation <= -14) applyStyle('textAlign', 'right'), applyStyle('textBaseline', 'middle');
  } else if (orient === 'bottom') {
    if (rotation > 14 || rotation <= -14) applyStyle('textAlign', 'left'), applyStyle('textBaseline', 'middle');
  } else if (orient === 'left' || orient === 'right') {
    if (rotation > 14)
      applyStyle('textAlign', 'center'), applyStyle('textBaseline', orient === 'left' ? 'top' : 'bottom');
    if (rotation < -14)
      applyStyle('textAlign', 'center'), applyStyle('textBaseline', orient === 'right' ? 'top' : 'bottom');
  }
}

export function AutoRotate(labels: AxisLabel[], labelCfg: any) {
  const { optionalAngles = [0, 90], margin } = labelCfg;

  for (let i = 0; i < optionalAngles.length; i++) {
    labels.forEach((label) => rotateLabel(label, optionalAngles[i]));
    if (!hasOverlap(labels, margin)) break;
  }
}
