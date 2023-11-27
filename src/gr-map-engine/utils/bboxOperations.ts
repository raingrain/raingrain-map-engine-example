import { BBox, Geometry, Position } from "../types.ts";
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
    return bbox;
}

function getMinY(bbox: BBox) {
    return bbox[1];
}

function setMinY(bbox: BBox, newMinY: number) {
    bbox[1] = newMinY;
    return bbox;
}

function getMaxX(bbox: BBox) {
    return bbox[2];
}

function setMaxX(bbox: BBox, newMaxX: number) {
    bbox[2] = newMaxX;
    return bbox;
}

function getMaxY(bbox: BBox) {
    return bbox[3];
}

function setMaxY(bbox: BBox, newMaxY: number) {
    bbox[3] = newMaxY;
    return bbox;
}

function setBBox(bbox: BBox, newMinX: number, newMinY: number, newMaxX: number, newMaxY: number) {
    setMinX(bbox, newMinX);
    setMinY(bbox, newMinY);
    setMaxX(bbox, newMaxX);
    setMaxY(bbox, newMaxY);
    return bbox;
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
    return bbox;
}

function setCenterAndWidthAndHeight(bbox: BBox, center: Position, width: number, height: number) {
    setMinX(bbox, getX(center) - width / 2);
    setMinY(bbox, getY(center) - height / 2);
    setMaxX(bbox, getX(center) + width / 2);
    setMaxY(bbox, getY(center) + height / 2);
    return bbox;
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

function getPointBBox(coordinates: Position) {
    return createBBox(coordinates, coordinates);
}

function getMultiPointBBoxOrLineStringBBox(coordinates: Position[]) {
    return mergeBBox(...coordinates.map((point) => {
        return getPointBBox(point);
    }));
}

function getMultiLineStringBBoxOrPolygonBBox(coordinates: Position[][]) {
    return mergeBBox(...coordinates.map((lineString) => {
        return getMultiPointBBoxOrLineStringBBox(lineString);
    }));
}

function getMultiPolygonBBox(coordinates: Position[][][]) {
    return mergeBBox(...coordinates.map((polygon) => {
        return getMultiLineStringBBoxOrPolygonBBox(polygon);
    }));
}

function getGeometryBBox(geometry: Geometry) {
    switch (geometry.type) {
        case "Point":
            return getPointBBox(geometry.coordinates);
        case "MultiPoint" || "LineString":
            return getMultiPointBBoxOrLineStringBBox(geometry.coordinates);
        case "MultiLineString" || "Polygon":
            return getMultiLineStringBBoxOrPolygonBBox(geometry.coordinates);
        case "MultiPolygon":
            return getMultiPolygonBBox(geometry.coordinates);
        default:
            throw new Error("不是正确的Geometry类型，无法计算bbox");
    }
}

function createGeometryWithBBox(geometry: Geometry) {
    return {
        ...geometry,
        bbox: getGeometryBBox(geometry)
    };
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
    setCenterAndWidthAndHeight,
    getPointBBox,
    getMultiPointBBoxOrLineStringBBox,
    getMultiLineStringBBoxOrPolygonBBox,
    getMultiPolygonBBox,
    getGeometryBBox,
    createGeometryWithBBox,
    mergeBBox
};