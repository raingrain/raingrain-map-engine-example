import {
    Feature,
    FeatureDisplayObjectUnion,
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

class BaseFeature<G extends Geometry, D extends FeatureDisplayObjectUnion> implements Feature {
    public type: "Feature" = "Feature";
    public geometry: G;
    public properties: GeoJsonProperties;
    public displayObject: D;

    constructor(geometry: G, properties: GeoJsonProperties = {}, displayObject: D) {
        this.geometry = geometry;
        this.properties = properties;
        this.displayObject = displayObject;
    }
}

class PointFeature extends BaseFeature<Point, PointFeatureDisplayObject> {
    constructor(geometry: Point, properties: GeoJsonProperties = {}) {
        super(geometry, properties, createDefaultPointFeatureDisplayObject());
    }
}

class MultiPointFeature extends BaseFeature<MultiPoint, MultiPointFeatureDisplayObject> {
    constructor(geometry: MultiPoint, properties: GeoJsonProperties = {}) {
        super(geometry, properties, createDefaultMultiPointFeatureDisplayObject(geometry.coordinates));
    }
}

class LineStringFeature extends BaseFeature<LineString, LineStringFeatureDisplayObject> {
    constructor(geometry: LineString, properties: GeoJsonProperties = {}) {
        super(geometry, properties, createDefaultLineStringFeatureDisplayObject());
    }
}

class MultiLineStringFeature extends BaseFeature<MultiLineString, MultiLineStringFeatureDisplayObject> {
    constructor(geometry: MultiLineString, properties: GeoJsonProperties = {}) {
        super(geometry, properties, createDefaultMultiLineStringFeatureDisplayObject(geometry.coordinates));
    }
}

class PolygonFeature extends BaseFeature<Polygon, PolygonFeatureDisplayObject> {
    constructor(geometry: Polygon, properties: GeoJsonProperties = {}) {
        super(geometry, properties, createDefaultPolygonFeatureDisplayObject());
    }
}

class MultiPolygonFeature extends BaseFeature<MultiPolygon, MultiPolygonFeatureDisplayObject> {
    constructor(geometry: MultiPolygon, properties: GeoJsonProperties = {}) {
        super(geometry, properties, createDefaultMultiPolygonFeatureDisplayObject(geometry.coordinates));
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