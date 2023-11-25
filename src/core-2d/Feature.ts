import {
    Feature,
    GeoJsonProperties,
    MultiPolygon,
    MultiPolygonFeatureDisplayObject,
    Point,
    PointFeatureDisplayObject,
    Polygon,
    PolygonFeatureDisplayObject,
    Position
} from "./type.ts";
import { createBBox, getMultiPolygonBBox, getPolygonBBox } from "./utils";
import { Circle, Polygon as GPolygon } from "@antv/g";
import { DefaultDisplayObjectConfig } from "./Layer.ts";


class PointFeature implements Feature {

    public type: "Feature" = "Feature";
    public geometry: Point;
    public properties: GeoJsonProperties;
    public displayObject: PointFeatureDisplayObject;

    constructor(coordinates: Position, properties: GeoJsonProperties = null) {
        this.geometry = {
            type: "Point",
            coordinates,
            bbox: createBBox(coordinates, coordinates)
        };
        this.properties = properties;
        this.displayObject = new Circle(DefaultDisplayObjectConfig.defaultPointFeatureDisplayObjectConfig);
    }


}

function createPointFeature(position: Position, properties: GeoJsonProperties = null) {
    return new PointFeature(position, properties);
}

class PolygonFeature implements Feature {

    public type: "Feature" = "Feature";
    public geometry: Polygon;
    public properties: GeoJsonProperties;
    public displayObject: PolygonFeatureDisplayObject;

    constructor(coordinates: Position[][], properties: GeoJsonProperties = null) {
        this.geometry = {
            type: "Polygon",
            coordinates,
            bbox: getPolygonBBox(coordinates)
        };
        this.properties = properties;
        this.displayObject = new GPolygon(DefaultDisplayObjectConfig.defaultPolygonFeatureDisplayObjectConfig);
    }

}

function createPolygonFeature(coordinates: Position[][], properties: GeoJsonProperties = null) {
    return new PolygonFeature(coordinates, properties);
}

class MultiPolygonFeature implements Feature {

    public type: "Feature" = "Feature";
    public geometry: MultiPolygon;
    public properties: GeoJsonProperties;
    public displayObject: MultiPolygonFeatureDisplayObject;

    constructor(coordinates: Position[][][], properties: GeoJsonProperties = null) {
        this.geometry = {
            type: "MultiPolygon",
            coordinates,
            bbox: getMultiPolygonBBox(coordinates)
        };
        this.properties = properties;
        this.displayObject = coordinates.map(() => {
            return new GPolygon(DefaultDisplayObjectConfig.defaultPolygonFeatureDisplayObjectConfig);
        });
    }
}

function createMultiPolygonFeature(coordinates: Position[][][], properties: GeoJsonProperties = null) {
    return new MultiPolygonFeature(coordinates, properties);
}

export {
    PointFeature,
    PolygonFeature,
    MultiPolygonFeature,
    createPointFeature,
    createPolygonFeature,
    createMultiPolygonFeature
};