import {
    LineStringFeature,
    MultiLineStringFeature,
    MultiPointFeature,
    MultiPolygonFeature,
    PointFeature,
    PolygonFeature
} from "./Feature.ts";
import { BBox, FeatureCollection, FeatureObjectUnion, GeoJsonGeometryTypes, LayerObjectUnion } from "../types.ts";
import { createNonexistentBBox, DefaultConfig, mergeBBox } from "../utils";
import { CircleStyleProps, DisplayObjectConfig, PolygonStyleProps, PolylineStyleProps } from "@antv/g";

class BaseLayer<F extends FeatureObjectUnion, D extends CircleStyleProps | PolylineStyleProps | PolygonStyleProps> implements FeatureCollection {

    public type: "FeatureCollection" = "FeatureCollection";
    public name: string = "";
    public bbox: BBox = createNonexistentBBox();
    public features: F[] = [];
    public displayObjectConfig: DisplayObjectConfig<D>;

    constructor(displayObjectConfig: DisplayObjectConfig<D>) {
        this.displayObjectConfig = displayObjectConfig;
    }

    public setName(newName: string) {
        this.name = newName;
    }

    public addFeature(newFeature: F) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }

}

class PointLayer extends BaseLayer<PointFeature, CircleStyleProps> {
    constructor() {
        super(DefaultConfig.defaultPointFeatureOrMultiPointFeatureDisplayObjectConfig);
    }
}

class MultiPointLayer extends BaseLayer<MultiPointFeature, CircleStyleProps> {
    constructor() {
        super(DefaultConfig.defaultPointFeatureOrMultiPointFeatureDisplayObjectConfig);
    }
}

class LineStringLayer extends BaseLayer<LineStringFeature, PolylineStyleProps> {
    constructor() {
        super(DefaultConfig.defaultLineStringFeatureOrMultiLineStringFeatureDisplayObjectConfig);
    }
}

class MultiLineStringLayer extends BaseLayer<MultiLineStringFeature, PolylineStyleProps> {
    constructor() {
        super(DefaultConfig.defaultLineStringFeatureOrMultiLineStringFeatureDisplayObjectConfig);
    }
}

class PolygonLayer extends BaseLayer<PolygonFeature, PolygonStyleProps> {
    constructor() {
        super(DefaultConfig.defaultPolygonFeatureOrMultiPolygonFeatureDisplayObjectConfig);
    }
}

class MultiPolygonLayer extends BaseLayer<MultiPolygonFeature, PolygonStyleProps> {
    constructor() {
        super(DefaultConfig.defaultPolygonFeatureOrMultiPolygonFeatureDisplayObjectConfig);
    }
}

function createPointLayer() {
    return new PointLayer();
}

function createMultiPointLayer() {
    return new MultiPointLayer();
}

function createLineStringLayer() {
    return new LineStringLayer();
}

function createMultiLineStringLayer() {
    return new MultiLineStringLayer();
}

function createPolygonLayer() {
    return new PolygonLayer();
}

function createMultiPolygonLayer() {
    return new MultiPolygonLayer();
}

function createLayer(type: GeoJsonGeometryTypes): LayerObjectUnion {
    switch (type) {
        case "Point":
            return createPointLayer();
        case "MultiPoint":
            return createMultiPointLayer();
        case "LineString":
            return createLineStringLayer();
        case "MultiLineString":
            return createMultiLineStringLayer();
        case "Polygon":
            return createPolygonLayer();
        case "MultiPolygon":
            return createMultiPolygonLayer();
        default:
            throw new Error("不是正确的Geometry类型，无法创建Feature");
    }
}

export {
    PointLayer,
    MultiPointLayer,
    LineStringLayer,
    MultiLineStringLayer,
    PolygonLayer,
    MultiPolygonLayer,
    createPointLayer,
    createMultiPointLayer,
    createLineStringLayer,
    createMultiLineStringLayer,
    createPolygonLayer,
    createMultiPolygonLayer,
    createLayer
};