import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { SpeedControl } from '../../../../src/ui/timeline/speedcontrol';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});
const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 500,
  height: 500,
  renderer,
});

describe('speedcontrol', () => {
  test('basic', () => {
    const speedcontrol = new SpeedControl({
      style: {
        x: 50,
        y: 50,
        speeds: [1.0, 2.0, 3.0, 4.0, 5.0],
        width: 35,
      },
    });
    speedcontrol.update({ currentSpeedIdx: 4 });
    canvas.appendChild(speedcontrol);
    expect(speedcontrol.getBounds()!.max[0]).toBe(50 + 35);
  });
  // test('playButton', () => {
  //   const playMarker: FunctionalSymbol = (x: number, y: number) => {
  //     return [['M', x + 3, y], ['L', x - 1.5, y - 1.5 * Math.sqrt(3)], ['L', x - 1.5, y + 1.5 * Math.sqrt(3)], ['Z']];
  //   };
  //   const playButton = new Button({
  //     style: {
  //       x: 80,
  //       y: 50,
  //       width: 20,
  //       height: 20,
  //       buttonStyle: {
  //         default: {
  //           fill: '#F7F7F7',
  //           stroke: '#bfbfbf',
  //           radius: 10,
  //         },
  //         active: {
  //           fill: 'rgba(52, 113, 249, 0.1)',
  //           stroke: '#3471F9',
  //           radius: 10,
  //         },
  //       },
  //       markerStyle: {
  //         default: {
  //           stroke: '#bfbfbf',
  //         },
  //         active: {
  //           stroke: '#3471F9',
  //         },
  //       },
  //       marker: playMarker,
  //     },
  //   });
  //   const stopMarker: FunctionalSymbol = (x: number, y: number) => {
  //     return [
  //       ['M', x + 2, y + 3],
  //       ['L', x + 2, y - 3],
  //       ['M', x - 2, y + 3],
  //       ['L', x - 2, y - 3],
  //     ];
  //   };
  //   playButton.addEventListener('click', () => {
  //     playButton.update({
  //       marker: stopMarker,
  //     });
  //   });
  //   canvas.appendChild(playButton);
  // });
  // test('prev next', () => {
  //   const prevMarker: FunctionalSymbol = (x: number, y: number) => {
  //     return [
  //       ['M', x + 6, y + 6],
  //       ['L', x, y],
  //       ['L', x + 6, y - 6],
  //       ['M', x, y + 6],
  //       ['L', x - 6, y],
  //       ['L', x, y - 6],
  //     ];
  //   };
  //   const nextMarker: FunctionalSymbol = (x: number, y: number) => {
  //     return [
  //       ['M', x, y + 6],
  //       ['L', x + 6, y],
  //       ['L', x, y - 6],
  //       ['M', x - 6, y + 6],
  //       ['L', x, y],
  //       ['L', x - 6, y - 6],
  //     ];
  //   };
  //   const prevBtn = new Button({
  //     style: {
  //       x: 60,
  //       y: 50,
  //       width: 12,
  //       height: 12,
  //       buttonStyle: {
  //         default: {
  //           stroke: 'none',
  //         },
  //         selected: {
  //           stroke: 'none',
  //         },
  //         active: {
  //           stroke: 'none',
  //         },
  //       },
  //       marker: prevMarker,
  //       markerStyle: {
  //         default: {
  //           stroke: '#bfbfbf',
  //         },
  //         active: {
  //           stroke: '#3471F9',
  //         },
  //       },
  //     },
  //   });
  //   const nextBtn = new Button({
  //     style: {
  //       x: 110,
  //       y: 50,
  //       width: 12,
  //       height: 12,
  //       buttonStyle: {
  //         default: {
  //           stroke: 'none',
  //         },
  //         selected: {
  //           stroke: 'none',
  //         },
  //         active: {
  //           stroke: 'none',
  //         },
  //       },
  //       marker: nextMarker,
  //       markerStyle: {
  //         default: {
  //           stroke: '#bfbfbf',
  //         },
  //         active: {
  //           stroke: '#3471F9',
  //         },
  //       },
  //     },
  //   });
  //   canvas.appendChild(nextBtn);
  //   canvas.appendChild(prevBtn);
  // });
});
