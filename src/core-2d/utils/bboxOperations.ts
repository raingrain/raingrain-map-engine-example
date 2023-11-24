import { BBox, Position } from "../type.ts";
import { createPosition, getX, getY } from "./positionOperations.ts";
import { cloneDeep } from "lodash";

function createBBox(bottomLeft: Position, topRight: Position): BBox;
function createBBox(minX: number, minY: number, maxX: number, maxY: number): BBox
function createBBox(
    parameter1: Position | number,
    parameter2?: Position | number,
    parameter3?: number,
    parameter4?: number
) {
    if (Array.isArray(parameter1) && Array.isArray(parameter2)) {
        return [...parameter1, ...parameter2];
    }
    if (typeof parameter1 === "number" && typeof parameter2 === "number" && typeof parameter3 === "number" && typeof parameter4 === "number") {
        return [parameter1, parameter2, parameter3, parameter4];
    }
}

function createNonexistentBBox(): BBox {
    return createBBox(Infinity, Infinity, -Infinity, -Infinity);
}

function getMinX(bbox: BBox) {
    return bbox[0];
}

function setMinX(bbox: BBox, newMinX: number) {
    bbox[0] = newMinX;
}

function getMinY(bbox: BBox) {
    return bbox[1];
}

function setMinY(bbox: BBox, newMinY: number) {
    bbox[1] = newMinY;
}

function getMaxX(bbox: BBox) {
    return bbox[2];
}

function setMaxX(bbox: BBox, newMaxX: number) {
    bbox[2] = newMaxX;
}

function getMaxY(bbox: BBox) {
    return bbox[3];
}

function setMaxY(bbox: BBox, newMaxY: number) {
    bbox[3] = newMaxY;
}

function setBBox(bbox: BBox, newMinX: number, newMinY: number, newMaxX: number, newMaxY: number) {
    setMinX(bbox, newMinX);
    setMinY(bbox, newMinY);
    setMaxX(bbox, newMaxX);
    setMaxY(bbox, newMaxY);
}

function getWidth(bbox: BBox) {
    return getMaxX(bbox) - getMinX(bbox);
}

function getHeight(bbox: BBox) {
    return getMaxY(bbox) - getMinY(bbox);
}

function getCenter(bbox: BBox) {
    return createPosition((getMinX(bbox) + getMaxX(bbox)) / 2, (getMinY(bbox) + getMaxY(bbox)) / 2);
}

function setCenter(bbox: BBox, newCenter: Position) {
    const width = getWidth(bbox);
    const height = getHeight(bbox);
    const newCenterX = getX(newCenter);
    const newCenterY = getY(newCenter);
    const newMinX = newCenterX - width / 2;
    const newMinY = newCenterY - height / 2;
    const newMaxX = newCenterX + width / 2;
    const newMaxY = newCenterY + height / 2;
    setMinX(bbox, newMinX);
    setMinY(bbox, newMinY);
    setMaxX(bbox, newMaxX);
    setMaxY(bbox, newMaxY);
}

function copyBBox(bbox: BBox) {
    return cloneDeep(bbox);
}

function mergeBBox(...bboxes: BBox[]) {
    const mergeBBox = createNonexistentBBox();
    bboxes.forEach((bbox) => {
        setBBox(
            mergeBBox,
            Math.min(getMinX(mergeBBox), getMinX(bbox)),
            Math.min(getMinY(mergeBBox), getMinY(bbox)),
            Math.max(getMaxX(mergeBBox), getMaxX(bbox)),
            Math.max(getMaxY(mergeBBox), getMaxY(bbox))
        );
    });
    return mergeBBox;
}

function getPolygonBBox(coordinates: Position[][]) {
    const bbox = createNonexistentBBox();
    coordinates.forEach((lineString) => {
        lineString.forEach((point) => {
            setBBox(
                bbox,
                Math.min(getMinX(bbox), getX(point)),
                Math.min(getMinY(bbox), getY(point)),
                Math.max(getMaxX(bbox), getX(point)),
                Math.max(getMaxY(bbox), getY(point))
            );
        });
    });
    return bbox;
}

function getMultiPolygonBBox(coordinates: Position[][][]) {
    const multiPolygonBBox = coordinates.map((polygon) => {
        return getPolygonBBox(polygon);
    });
    return mergeBBox(...multiPolygonBBox);
}

export {
    createBBox,
    createNonexistentBBox,
    copyBBox,
    getMinX,
    getMinY,
    getMaxX,
    getMaxY,
    setMinX,
    setMinY,
    setMaxX,
    setMaxY,
    setBBox,
    getWidth,
    getHeight,
    getCenter,
    setCenter,
    getPolygonBBox,
    getMultiPolygonBBox,
    mergeBBox
};