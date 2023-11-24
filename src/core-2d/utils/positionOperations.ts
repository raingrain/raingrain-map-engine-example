import { Position } from "../type.ts";
import { cloneDeep } from "lodash";

function createPosition(position: Position): Position
function createPosition(x: number, y: number): Position
function createPosition(parameter1: Position | number, parameter2?: number) {
    if (Array.isArray(parameter1)) {
        return copyPosition(parameter1);
    }
    if (typeof parameter2 === "number") {
        return [parameter1, parameter2];
    }
}

function copyPosition(position: Position) {
    return cloneDeep(position);
}

function getX(position: Position) {
    return position[0];
}

function setX(position: Position, newX: number) {
    position[0] = newX;
}

function getY(position: Position) {
    return position[1];
}

function setY(position: Position, newY: number) {
    position[1] = newY;
}

export {
    createPosition,
    copyPosition,
    getX,
    getY,
    setX,
    setY
};