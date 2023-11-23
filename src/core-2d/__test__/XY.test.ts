// import { describe, expect, test } from "vitest";
// import { createXY } from "../XY.ts";
//
// const xy1 = createXY([123, 456]);
// const xy2 = createXY(123, 456);
//
// describe.skip("xy test", () => {
//     test("test get", () => {
//         expect(xy1.x).toBe(123);
//         expect(xy1.y).toBe(456);
//         expect(xy1.xy).toStrictEqual([123, 456]);
//     });
//     test("test set x", () => {
//         xy1.x = 456;
//         expect(xy1.x).toBe(456);
//         expect(xy1.y).toBe(456);
//         expect(xy1.xy).toStrictEqual([456, 456]);
//     });
//     test("test set y", () => {
//         xy1.y = 123;
//         expect(xy1.x).toBe(456);
//         expect(xy1.y).toBe(123);
//         expect(xy1.xy).toStrictEqual([456, 123]);
//     });
//     test("test set xy", () => {
//         xy1.xy = [123, 456];
//         expect(xy1.x).toBe(123);
//         expect(xy1.y).toBe(456);
//         expect(xy1.xy).toStrictEqual([123, 456]);
//     });
//     test("test createXY", () => {
//         expect(xy2.x).toBe(xy1.x);
//         expect(xy2.y).toBe(xy1.y);
//         expect(xy2.xy).toStrictEqual(xy1.xy);
//     });
//     test("immutable", () => {
//         expect(Object.is(xy1.xy, xy1.xy)).toBeFalsy();
//     });
// });