// [todo]

import { Point } from '../types';

/**
 * angle 是矩形绕中心逆时针旋转的角度
 */
type Box = { left: number; top: number; width: number; height: number; angle: number };

// 默认绕原点旋转
const rotate = ([x, y]: Point, deg: number, origin = [0, 0]) =>
  [
    (x - origin[0]) * Math.cos(deg) + (y - origin[1]) * Math.sin(deg) + origin[0],
    (origin[0] - x) * Math.sin(deg) + (y - origin[1]) * Math.cos(deg) + origin[1],
  ] as Point;
const toDeg = (angle: number) => (angle / 180) * Math.PI;
const getCenterPoint = (box: Box) => [box.left + box.width / 2, box.top + box.height / 2] as Point;
/**
 * 转化为顶点坐标数组
 * @param {Object} box
 */
function toRect(box: Box) {
  const deg = toDeg(box.angle);
  const cp = getCenterPoint(box);
  return [
    rotate([box.left, box.top], deg, cp),
    rotate([box.left + box.width, box.top], deg, cp),
    rotate([box.left + box.width, box.top + box.height], deg, cp),
    rotate([box.left, box.top + box.height], deg, cp),
  ];
}

/**
 * 计算投影半径
 * @param {Array(Number)} checkAxis 检测轴 [cosθ, sinθ]
 * @param {Array} axis 目标轴 [x,y]
 */
function getProjectionRadius(checkAxis: [number, number], axis: [number, number]): number {
  return Math.abs(axis[0] * checkAxis[0] + axis[1] * checkAxis[1]);
}
/**
 * 判断是否碰撞
 * @param {Array} rect1 矩形顶点坐标数组 [Pa, Pb, Pc, Pd]
 * @param {*} rect2
 */
export function isCollision(box1: Box, box2: Box) {
  const rect1 = toRect(box1);
  const rect2 = toRect(box2);
  const vector = (start: Point, end: Point) => {
    return [end[0] - start[0], end[1] - start[1]] as Point;
  };
  // 两个矩形的中心点
  const p1 = getCenterPoint(box1);
  const p2 = getCenterPoint(box2);
  // 向量 p1p2
  const vp1p2 = vector(p1, p2);
  // 矩形1的两边向量
  const AB = vector(rect1[0], rect1[1]);
  const BC = vector(rect1[1], rect1[2]);
  // 矩形2的两边向量
  const A1B1 = vector(rect2[0], rect2[1]);
  const B1C1 = vector(rect2[1], rect2[2]);
  // 矩形1 的两个弧度
  const deg11 = toDeg(box1.angle);
  const deg12 = toDeg(90 - box1.angle);
  // 矩形2 的两个弧度
  const deg21 = toDeg(box2.angle);
  const deg22 = toDeg(90 - box2.angle);
  // 投影重叠
  const isCover = (
    checkAxisRadius: number,
    deg: number,
    targetAxis1: [number, number],
    targetAxis2: [number, number]
  ) => {
    const checkAxis = [Math.cos(deg), Math.sin(deg)] as [number, number];
    const targetAxisRadius =
      (getProjectionRadius(checkAxis, targetAxis1) + getProjectionRadius(checkAxis, targetAxis2)) / 2;
    const centerPointRadius = getProjectionRadius(checkAxis, vp1p2);
    return checkAxisRadius + targetAxisRadius > centerPointRadius;
  };
  return (
    isCover(box1.width / 2, deg11, A1B1, B1C1) &&
    isCover(box1.height / 2, deg12, A1B1, B1C1) &&
    isCover(box2.width / 2, deg21, AB, BC) &&
    isCover(box2.height / 2, deg22, AB, BC)
  );
}
// test
// (function main() {
//   let box1 = {
//     left: 0,
//     top: 0,
//     width: 100,
//     height: 100,
//     angle: 30
//   }
//   let box2 = {
//     left: 100,
//     top: 0,
//     width: 100,
//     height: 100,
//     angle: 0
//   }
//   return isCollision(box1, box2); // true
// })()
