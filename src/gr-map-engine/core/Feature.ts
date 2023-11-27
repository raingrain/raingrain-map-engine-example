import {
    Feature,
    GeoJsonProperties,
    Geometry,
    LineString,
    LineStringFeatureDisplayObject,
    MultiLineString,
    MultiLineStringFeatureDisplayObject,
    MultiPoint,
    MultiPointFeatureDisplayObject,
    MultiPolygon,
    MultiPolygonFeatureDisplayObject,
    Point,
    PointFeatureDisplayObject,
    Polygon,
    PolygonFeatureDisplayObject
} from "../types.ts";
import {
    createDefaultLineStringFeatureDisplayObject,
    createDefaultMultiLineStringFeatureDisplayObject,
    createDefaultMultiPointFeatureDisplayObject,
    createDefaultMultiPolygonFeatureDisplayObject,
    createDefaultPointFeatureDisplayObject,
    createDefaultPolygonFeatureDisplayObject
} from "../utils";


class PointFeature implements Feature {

    public type: "Feature" = "Feature";
    public geometry: Point;
    public properties: GeoJsonProperties;
    public displayObject: PointFeatureDisplayObject = createDefaultPointFeatureDisplayObject();

    constructor(geometry: Point, properties: GeoJsonProperties = {}) {
        this.geometry = geometry;
        this.properties = properties;
    }

}

class MultiPointFeature implements Feature {

    public type: "Feature" = "Feature";
    public geometry: MultiPoint;
    public properties: GeoJsonProperties;
    public displayObject: MultiPointFeatureDisplayObject;

    constructor(geometry: MultiPoint, properties: GeoJsonProperties = {}) {
        this.geometry = geometry;
        this.properties = properties;
        this.displayObject = createDefaultMultiPointFeatureDisplayObject(this.geometry.coordinates);
    }

}

class LineStringFeature implements Feature {

    public type: "Feature" = "Feature";
    public geometry: LineString;
    public properties: GeoJsonProperties;
    public displayObject: LineStringFeatureDisplayObject = createDefaultLineStringFeatureDisplayObject();

    constructor(geometry: LineString, properties: GeoJsonProperties = {}) {
        this.geometry = geometry;
        this.properties = properties;
    }

}

class MultiLineStringFeature implements Feature {

    public type: "Feature" = "Feature";
    public geometry: MultiLineString;
    public properties: GeoJsonProperties;
    public displayObject: MultiLineStringFeatureDisplayObject;

    constructor(geometry: MultiLineString, properties: GeoJsonProperties = {}) {
        this.geometry = geometry;
        this.properties = properties;
        this.displayObject = createDefaultMultiLineStringFeatureDisplayObject(this.geometry.coordinates);
    }

}

class PolygonFeature implements Feature {

    public type: "Feature" = "Feature";
    public geometry: Polygon;
    public properties: GeoJsonProperties;
    public displayObject: PolygonFeatureDisplayObject = createDefaultPolygonFeatureDisplayObject();

    constructor(geometry: Polygon, properties: GeoJsonProperties = {}) {
        this.geometry = geometry;
        this.properties = properties;
    }

}

class MultiPolygonFeature implements Feature {

    public type: "Feature" = "Feature";
    public geometry: MultiPolygon;
    public properties: GeoJsonProperties;
    public displayObject: MultiPolygonFeatureDisplayObject;

    constructor(geometry: MultiPolygon, properties: GeoJsonProperties = {}) {
        this.geometry = geometry;
        this.properties = properties;
        this.displayObject = createDefaultMultiPolygonFeatureDisplayObject(this.geometry.coordinates);
    }
}

function createPointFeature(geometry: Point, properties: GeoJsonProperties = {}) {
    return new PointFeature(geometry, properties);
}

function createMultiPointFeature(geometry: MultiPoint, properties: GeoJsonProperties = {}) {
    return new MultiPointFeature(geometry, properties);
}

function createLineStringFeature(geometry: LineString, properties: GeoJsonProperties = {}) {
    return new LineStringFeature(geometry, properties);
}

function createMultiLineStringFeature(geometry: MultiLineString, properties: GeoJsonProperties = {}) {
    return new MultiLineStringFeature(geometry, properties);
}

function createPolygonFeature(geometry: Polygon, properties: GeoJsonProperties = {}) {
    return new PolygonFeature(geometry, properties);
}

function createMultiPolygonFeature(geometry: MultiPolygon, properties: GeoJsonProperties = {}) {
    return new MultiPolygonFeature(geometry, properties);
}


function createFeature(geometry: Geometry, properties: GeoJsonProperties = {}) {
    switch (geometry.type) {
        case "Point":
            return createPointFeature(geometry, properties);
        case "MultiPoint":
            return createMultiPointFeature(geometry, properties);
        case "LineString":
            return createLineStringFeature(geometry, properties);
        case "MultiLineString":
            return createMultiLineStringFeature(geometry, properties);
        case "Polygon":
            return createPolygonFeature(geometry, properties);
        case "MultiPolygon":
            return createMultiPolygonFeature(geometry, properties);
        default:
            throw new Error("不是正确的Geometry类型，无法创建Feature");
    }
}

export {
    PointFeature,
    MultiPointFeature,
    LineStringFeature,
    MultiLineStringFeature,
    PolygonFeature,
    MultiPolygonFeature,
    createPointFeature,
    createMultiPointFeature,
    createLineStringFeature,
    createMultiLineStringFeature,
    createPolygonFeature,
    createMultiPolygonFeature,
    createFeature
};