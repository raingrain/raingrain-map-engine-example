// import { cloneDeep } from "lodash";
// // import { createXY, XY } from "./XY";
// import { BBox, Position } from "./type";
//
// class Extent {
//
//     #bbox: BBox;
//
//     constructor(bbox: BBox) {
//         this.#bbox = cloneDeep(bbox);
//     }
//
//     get bbox() {
//         return cloneDeep(this.#bbox);
//     }
//
//     set bbox(newBBox: BBox) {
//         this.#bbox = cloneDeep(newBBox);
//     }
//
//     get minX() {
//         return this.#bbox[0];
//     }
//
//     set minX(newMinX: number) {
//         this.#bbox[0] = newMinX;
//     }
//
//     get minY() {
//         return this.#bbox[1];
//     }
//
//     set minY(newMinY: number) {
//         this.#bbox[1] = newMinY;
//     }
//
//     get maxX() {
//         return this.#bbox[2];
//     }
//
//     set maxX(newMaxX: number) {
//         this.#bbox[2] = newMaxX;
//     }
//
//     get maxY() {
//         return this.#bbox[3];
//     }
//
//     set maxY(newMaxY: number) {
//         this.#bbox[3] = newMaxY;
//     }
//
//     get width() {
//         return this.#bbox[2] - this.#bbox[0];
//     }
//
//     get height() {
//         return this.#bbox[3] - this.#bbox[1];
//     }
//
//     get center() {
//         return [(this.#bbox[0] + this.#bbox[2]) / 2, (this.#bbox[1] + this.#bbox[3]) / 2];
//     }
//
//     set center(newCenter: Position) {
//         this.#bbox = [newCenter[0] - this.width / 2, newCenter[1] - this.height / 2, newCenter[0] + this.width / 2, newCenter[1] + this.height / 2];
//     }
//
//     mergeBBox = (anotherExtent: Extent) => {
//         this.#bbox = [Math.min(this.#bbox[0], anotherExtent.#bbox[0]), Math.min(this.#bbox[1], anotherExtent.#bbox[1]), Math.max(this.#bbox[2], anotherExtent.#bbox[2]), Math.max(this.#bbox[3], anotherExtent.#bbox[3])];
//     };
//
// }
//
//
// function createExtent(bbox: BBox): Extent;
// function createExtent(bottomLeft: Position, topRight: Position): Extent;
// function createExtent(minX: number, minY: number, maxX: number, maxY: number): Extent
// function createExtent(
//     parameter1: BBox | Position | number,
//     parameter2?: Position | number,
//     parameter3?: number,
//     parameter4?: number
// ) {
//     if (Array.isArray(parameter1) && typeof parameter2 === "undefined") {
//         return new Extent(parameter1 as BBox);
//     }
//     if (Array.isArray(parameter1) && Array.isArray(parameter2)) {
//         return new Extent([...parameter1, ...parameter2] as BBox);
//     }
//     if (typeof parameter1 === "number" && typeof parameter2 === "number" && typeof parameter3 === "number" && typeof parameter4 === "number") {
//         return new Extent([parameter1, parameter2, parameter3, parameter4]);
//     }
// }
//
//
// function createNonexistentExtent() {
//     return createExtent(Infinity, Infinity, -Infinity, -Infinity);
// }
//
// function cloneExtent(bbox: Extent) {
//     return createExtent(bbox.bbox);
// }
//
// export { Extent, createExtent, createNonexistentExtent, cloneExtent };