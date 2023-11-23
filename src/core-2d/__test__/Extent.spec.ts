import { describe, expect, test } from "vitest";
import { cloneExtent, createExtent, createNonexistentExtent } from "../Extent.ts";
import { createXY } from "../XY.ts";

const extent1 = createExtent([0, 0, 100, 100]);
const extent2 = createExtent([0, 0], [100, 100]);
const extent3 = createExtent(createXY(0, 0), createXY(100, 100));
const extent4 = createExtent(0, 0, 100, 100);
const nonexistentExtent = createNonexistentExtent();

describe("bbox test", () => {
    test("test get", () => {
        expect(extent1.minX).toBe(0);
        expect(extent1.minY).toBe(0);
        expect(extent1.maxX).toBe(100);
        expect(extent1.maxY).toBe(100);
        expect(extent1.center.xy).toStrictEqual(createXY(50, 50).xy);
        expect(extent1.bbox).toStrictEqual([0, 0, 100, 100]);
        expect(extent1.width).toBe(100);
        expect(extent1.height).toBe(100);
    });
    test("test set", () => {
        extent1.minX = 10;
        extent1.minY = 10;
        extent1.maxX = 90;
        extent1.maxY = 90;
        expect(extent1.minX).toBe(10);
        expect(extent1.minY).toBe(10);
        expect(extent1.maxX).toBe(90);
        expect(extent1.maxY).toBe(90);
        extent1.center = createXY(45, 45);
        expect(extent1.bbox).toStrictEqual([5, 5, 85, 85]);
        extent1.bbox = [0, 0, 100, 100];
        expect(extent1.bbox).toStrictEqual([0, 0, 100, 100]);
    });
    test("test createExtend", () => {
        expect(extent1.minX).toBe(extent2.minX);
        expect(extent1.minX).toBe(extent3.minX);
        expect(extent1.minX).toBe(extent3.minX);
        expect(extent1.minY).toBe(extent2.minY);
        expect(extent1.minY).toBe(extent3.minY);
        expect(extent1.minY).toBe(extent4.minY);
        expect(extent1.maxX).toBe(extent2.maxX);
        expect(extent1.maxX).toBe(extent3.maxX);
        expect(extent1.maxX).toBe(extent4.maxX);
        expect(extent1.maxY).toBe(extent2.maxY);
        expect(extent1.maxY).toBe(extent3.maxY);
        expect(extent1.maxY).toBe(extent4.maxY);
        expect(extent1.center.xy).toStrictEqual(extent2.center.xy);
        expect(extent1.center.xy).toStrictEqual(extent3.center.xy);
        expect(extent1.center.xy).toStrictEqual(extent4.center.xy);
        expect(extent1.bbox).toStrictEqual(extent2.bbox);
        expect(extent1.bbox).toStrictEqual(extent3.bbox);
        expect(extent1.bbox).toStrictEqual(extent4.bbox);
        expect(extent1.width).toBe(extent2.width);
        expect(extent1.width).toBe(extent3.width);
        expect(extent1.width).toBe(extent4.width);
        expect(extent1.height).toBe(extent2.height);
        expect(extent1.height).toBe(extent3.height);
        expect(extent1.height).toBe(extent4.height);
    });
    test("test immutable", () => {
        expect(Object.is(extent1.bbox, extent1.bbox)).toBeFalsy();
    });
    test("test mergeBBox", () => {
        extent2.bbox = [100, 100, 200, 200];
        extent1.merge(extent2);
        expect(extent1.bbox).toStrictEqual([0, 0, 200, 200]);
        expect(extent2.bbox).toStrictEqual([100, 100, 200, 200]);
    });
    test("test nonexistentExtent", () => {
        expect(nonexistentExtent.bbox).toStrictEqual([Infinity, Infinity, -Infinity, -Infinity]);
        nonexistentExtent.merge(extent2);
        expect(nonexistentExtent.bbox).toStrictEqual(extent2.bbox);
    });
    test("test cloneExtent", () => {
        const newExtent = cloneExtent(extent1);
        expect(Object.is(extent1, newExtent)).toBeFalsy();
        expect(newExtent.bbox).toStrictEqual(extent1.bbox);
    });
});