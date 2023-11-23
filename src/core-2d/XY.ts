// import { cloneDeep } from "lodash";
// import { Position } from "./type.ts";
//
// class XY {
//
//     #xy: Position;
//
//     constructor(xy: Position) {
//         this.#xy = cloneDeep(xy);
//     }
//
//     get x() {
//         return this.#xy[0];
//     }
//
//     set x(newX: number) {
//         this.#xy[0] = newX;
//     }
//
//     get y() {
//         return this.#xy[1];
//     }
//
//     set y(newY: number) {
//         this.#xy[1] = newY;
//     }
//
//     get xy() {
//         return cloneDeep(this.#xy);
//     }
//
//     set xy(newXY: Position) {
//         this.#xy = cloneDeep(newXY);
//     }
//
// }
//
//
// function createXY(position: Position): XY
// function createXY(x: number, y: number): XY
// function createXY(parameter1: Position | number, parameter2?: number) {
//     if (Array.isArray(parameter1)) {
//         return new XY(parameter1);
//     }
//     if (typeof parameter2 === "number") {
//         return new XY([parameter1, parameter2]);
//     }
// }
//
// export { XY, createXY };