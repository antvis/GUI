import { Selection } from './selection';

export function ifShow(show: boolean, container: Selection, creator: () => void, removeChildren?: boolean) {
  if (show) {
    creator();
  } else if (removeChildren) container.node().removeChildren();
}
