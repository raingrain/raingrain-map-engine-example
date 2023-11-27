import { describe, expect, test } from "vitest";
import { copyPosition, createPosition, getX, getY, setX, setXY, setY } from "../utils";

describe("position test", () => {
    test("test createPosition", () => {
        const position1 = createPosition(0, 0);
        const position2 = createPosition([0, 0]);
        expect(position1).toStrictEqual(position2);
    });
    test("test copyPosition", () => {
        const position = createPosition(0, 0);
        const newPosition = copyPosition(position);
        expect(Object.is(position, newPosition)).toBeFalsy();
        expect(position).toStrictEqual(newPosition);
    });
    test("test get and set", () => {
        const position = createPosition(0, 100);
        expect(getX(position)).toBe(0);
        expect(getY(position)).toBe(100);
        setX(position, 100);
        setY(position, 0);
        expect(position).toStrictEqual([100, 0]);
        setXY(position, 200, 300);
        expect(position).toStrictEqual([200, 300]);
    });
});