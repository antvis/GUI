import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Renderer as SVGRenderer } from '@antv/g-svg';
import * as cases from './charts';

const renderers = {
  svg: new SVGRenderer(),
  canvas: new CanvasRenderer(),
};

let _select;
let _canvas;

const caseNames = Object.keys(cases);

function createSelection() {
  const controller = document.createElement('div');
  document.body.prepend(controller);
  const select = document.createElement('select');
  caseNames.forEach((testName) => {
    const option = document.createElement('option');
    option.value = testName;
    option.innerText = testName;
    select.appendChild(option);
  });
  controller.appendChild(select);
  _select = select;
  return select;
}

function createCanvas(container: HTMLElement, render) {
  let div: HTMLDivElement;
  if (!container) {
    div = document.createElement('div');
    div.id = 'container';
  } else div = container as HTMLDivElement;

  const canvas = new Canvas({
    container: div,
    width: 1000,
    height: 600,
    renderer: renderers[render],
  });
  _canvas = canvas;
  return canvas;
}

function getCase(key = 'case') {
  return new URLSearchParams(window.location.search).get(key);
}

function storeStatus(name: string) {
  if (getCase() !== name) {
    window.location.href = `${window.location.origin}?case=${name}`;
  }
}

function select(name: string) {
  if (!_canvas || !caseNames.includes(name)) return;
  _canvas.removeChildren();
  _canvas.appendChild(cases[name]());
  _select.value = name;
  storeStatus(name);
}

function recoverStatus() {
  const lastSelect = getCase();
  if (lastSelect) select(lastSelect);
  else select(caseNames[0]);
}

function onKeyPress(evt: KeyboardEvent) {
  const { key } = evt;
  const index = caseNames.indexOf(_select.value);
  if (key === 's' && index < caseNames.length - 1) {
    select(caseNames[index + 1]);
  } else if (key === 'w' && index > 0) {
    select(caseNames[index - 1]);
  }
}

function handler(container = document.getElementById('container'), render = 'svg') {
  const selectEl = createSelection();
  selectEl.onchange = (e) => {
    const testName = (e.target as HTMLSelectElement).value;
    select(testName);
  };
  const canvas = createCanvas(container!, render);
  (window as any).__g_instances__ = [canvas];
  recoverStatus();
  window.addEventListener('keypress', onKeyPress);
  canvas.addEventListener('keypress', onKeyPress);
}

window.onload = () => {
  handler();
};
