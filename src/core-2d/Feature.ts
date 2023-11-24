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


class PointFeature implements Feature {

    public type: "Feature" = "Feature";
    public properties: GeoJsonProperties;
    public displayObject: PointFeatureDisplayObject = null;
    public geometry: Point;

    constructor(coordinates: Position, properties: GeoJsonProperties = null) {
        this.properties = properties;
        this.geometry = {
            type: "Point",
            coordinates,
            bbox: createBBox(coordinates, coordinates)
        };
    }


}

function createPointFeature(position: Position, properties: GeoJsonProperties = null) {
    return new PointFeature(position, properties);
}

class PolygonFeature implements Feature {

    public type: "Feature" = "Feature";
    public properties: GeoJsonProperties;
    public displayObject: PolygonFeatureDisplayObject = null;
    public geometry: Polygon;

    constructor(coordinates: Position[][], properties: GeoJsonProperties = null) {
        this.properties = properties;
        this.geometry = {
            type: "Polygon",
            coordinates,
            bbox: getPolygonBBox(coordinates)
        };
    }

}

function createPolygonFeature(coordinates: Position[][], properties: GeoJsonProperties = null) {
    return new PolygonFeature(coordinates, properties);
}

class MultiPolygonFeature implements Feature {

    public type: "Feature" = "Feature";
    public properties: GeoJsonProperties;
    public displayObject: MultiPolygonFeatureDisplayObject = null;
    public geometry: MultiPolygon;

    constructor(coordinates: Position[][][], properties: GeoJsonProperties = null) {
        this.properties = properties;
        this.geometry = {
            type: "MultiPolygon",
            coordinates,
            bbox: getMultiPolygonBBox(coordinates)
        };
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