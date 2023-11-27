import { describe, expect, test } from "vitest";
import {
    copyBBox,
    createBBox,
    createGeometryWithBBox,
    createNonexistentBBox,
    createPosition,
    getCenter,
    getHeight,
    getMaxX,
    getMaxY,
    getMinX,
    getMinY,
    getMultiPolygonBBox,
    getWidth,
    getX,
    getY,
    mergeBBox,
    setBBox,
    setCenter,
    setCenterAndWidthAndHeight,
    setMaxX,
    setMaxY,
    setMinX,
    setMinY
} from "../utils";
import { Geometry, Position } from "../types.ts";
import China from "../../assets/data/China.json";

describe("bbox test", () => {
    test("test createBBox", () => {
        const bbox1 = createBBox([0, 0], [100, 100]);
        const bbox2 = createBBox(0, 0, 100, 100);
        expect(bbox1).toStrictEqual(bbox2);
    });
    test("test createNonexistentBBox", () => {
        const nonexistentBBox = createNonexistentBBox();
        expect(nonexistentBBox).toStrictEqual([Infinity, Infinity, -Infinity, -Infinity]);
    });
    test("test copyBBox", () => {
        const bbox = createBBox(0, 0, 100, 100);
        const newBBox = copyBBox(bbox);
        expect(Object.is(bbox, newBBox)).toBeFalsy();
        expect(bbox).toStrictEqual(newBBox);
    });
    test("test set and get", () => {
        const bbox = createBBox(0, 0, 100, 100);
        expect(getMinX(bbox)).toBe(0);
        expect(getMinY(bbox)).toBe(0);
        expect(getMaxX(bbox)).toBe(100);
        expect(getMaxY(bbox)).toBe(100);
        setMinX(bbox, 10);
        setMinY(bbox, 10);
        setMaxX(bbox, 90);
        setMaxY(bbox, 90);
        expect(bbox).toStrictEqual([10, 10, 90, 90]);
        setBBox(bbox, 0, 0, 100, 100);
        expect(bbox).toStrictEqual([0, 0, 100, 100]);
        expect(getWidth(bbox)).toBe(100);
        expect(getHeight(bbox)).toBe(100);
        expect(getCenter(bbox)).toStrictEqual([50, 50]);
        setCenter(bbox, [0, 0]);
        expect(bbox).toStrictEqual([-50, -50, 50, 50]);
        setCenterAndWidthAndHeight(bbox, createPosition(100, 100), 30, 30);
        expect(bbox).toStrictEqual([85, 85, 115, 115]);
    });
    test("test mergeBBox", () => {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        const bboxes = [];
        for (let i = 0; i < 100; i++) {
            const bottomLeft = createPosition(Math.random() * 50, Math.random() * 50);
            const topRight = createPosition(Math.random() * 50 + 50, Math.random() * 50 + 50);
            bboxes.push(createBBox(bottomLeft, topRight));
            minX = Math.min(minX, getX(bottomLeft));
            minY = Math.min(minY, getY(bottomLeft));
            maxX = Math.max(maxX, getX(topRight));
            maxY = Math.max(maxY, getY(topRight));
        }
        const bbox = mergeBBox(...bboxes);
        expect(bbox).toStrictEqual([minX, minY, maxX, maxY]);
    });
    test("test get different geometry BBox", () => {
        const geometry = China.features[0].geometry;
        const newGeometry = createGeometryWithBBox(geometry as any as Geometry);
        const coordinates = geometry.coordinates as Position[][][];
        const bbox = getMultiPolygonBBox(coordinates);
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        coordinates.forEach((polygon) => {
            polygon.forEach((lineString) => {
                lineString.forEach((point) => {
                    minX = Math.min(minX, getX(point));
                    minY = Math.min(minY, getY(point));
                    maxX = Math.max(maxX, getX(point));
                    maxY = Math.max(maxY, getY(point));
                });
            });
        });
        expect(newGeometry).toStrictEqual({
            type: geometry.type,
            coordinates: geometry.coordinates,
            bbox
        });
    });
});