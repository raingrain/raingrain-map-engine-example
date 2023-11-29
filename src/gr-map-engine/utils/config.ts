import {
    CanvasConfig,
    Circle,
    CircleStyleProps,
    DisplayObjectConfig,
    Polygon as GPolygon,
    PolygonStyleProps,
    Polyline,
    PolylineStyleProps
} from "@antv/g";
import { Position } from "../types.ts";
import { Renderer } from "@antv/g-canvas";

class DefaultConfig {
    public static readonly defaultPointFeatureOrMultiPointFeatureDisplayObjectConfig: DisplayObjectConfig<CircleStyleProps> = {
        style: {
            cx: 0,
            cy: 0,
            r: 5,
            fill: "red",
            cursor: "pointer"
        }
    };
    public static readonly defaultLineStringFeatureOrMultiLineStringFeatureDisplayObjectConfig: DisplayObjectConfig<PolylineStyleProps> = {
        style: {
            points: [[0, 0]],
            stroke: "#1890FF",
            lineWidth: 2
        }
    };
    public static readonly defaultPolygonFeatureOrMultiPolygonFeatureDisplayObjectConfig: DisplayObjectConfig<PolygonStyleProps> = {
        style: {
            points: [[0, 0]],
            fill: "#C6E5FF",
            stroke: "#1890FF",
            lineWidth: 2,
            cursor: "pointer",
            opacity: 0.5
        }
    };
    public static readonly defaultCanvasConfig: CanvasConfig = {
        background: "gray",
        renderer: new Renderer()
    };
}

function createDefaultPointFeatureDisplayObject() {
    return new Circle(DefaultConfig.defaultPointFeatureOrMultiPointFeatureDisplayObjectConfig);
}

function createDefaultMultiPointFeatureDisplayObject(coordinates: Position[]) {
    return coordinates.map(() => {
        return createDefaultPointFeatureDisplayObject();
    });
}

function createDefaultLineStringFeatureDisplayObject() {
    return new Polyline(DefaultConfig.defaultLineStringFeatureOrMultiLineStringFeatureDisplayObjectConfig);
}

function createDefaultMultiLineStringFeatureDisplayObject(coordinates: Position[][]) {
    return coordinates.map(() => {
        return createDefaultLineStringFeatureDisplayObject();
    });
}

function createDefaultPolygonFeatureDisplayObject() {
    return new GPolygon(DefaultConfig.defaultPolygonFeatureOrMultiPolygonFeatureDisplayObjectConfig);
}

function createDefaultMultiPolygonFeatureDisplayObject(coordinates: Position[][][]) {
    return coordinates.map(() => {
        return createDefaultPolygonFeatureDisplayObject();
    });
}

export {
    DefaultConfig,
    createDefaultPointFeatureDisplayObject,
    createDefaultMultiPointFeatureDisplayObject,
    createDefaultLineStringFeatureDisplayObject,
    createDefaultMultiLineStringFeatureDisplayObject,
    createDefaultPolygonFeatureDisplayObject,
    createDefaultMultiPolygonFeatureDisplayObject
};