import {
    LineStringFeature,
    MultiLineStringFeature,
    MultiPointFeature,
    MultiPolygonFeature,
    PointFeature,
    PolygonFeature
} from "./Feature.ts";
import { BBox, GeoJsonGeometryTypes, LayerObject, LayerObjectUnion } from "./type.ts";
import { createNonexistentBBox, DefaultDisplayObjectConfig, mergeBBox } from "./utils";
import { CircleStyleProps, DisplayObjectConfig, PolygonStyleProps, PolylineStyleProps } from "@antv/g";


class PointLayer implements LayerObject {

    public bbox: BBox = createNonexistentBBox();
    public features: PointFeature[] = [];
    public displayObjectConfig: DisplayObjectConfig<CircleStyleProps> = DefaultDisplayObjectConfig.defaultPointFeatureOrMultiPointFeatureDisplayObjectConfig;

    addFeature(newFeature: PointFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }
}

class MultiPointLayer implements LayerObject {

    public bbox: BBox = createNonexistentBBox();
    public features: MultiPointFeature[] = [];
    public displayObjectConfig: DisplayObjectConfig<CircleStyleProps> = DefaultDisplayObjectConfig.defaultPointFeatureOrMultiPointFeatureDisplayObjectConfig;

    public addFeature(newFeature: MultiPointFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }

}

class LineStringLayer implements LayerObject {

    public bbox: BBox = createNonexistentBBox();
    public features: LineStringFeature[] = [];
    public displayObjectConfig: DisplayObjectConfig<PolylineStyleProps> = DefaultDisplayObjectConfig.defaultLineStringFeatureOrMultiLineStringFeatureDisplayObjectConfig;

    public addFeature(newFeature: LineStringFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }

}

class MultiLineStringLayer implements LayerObject {

    public bbox: BBox = createNonexistentBBox();
    public features: MultiLineStringFeature[] = [];
    public displayObjectConfig: DisplayObjectConfig<PolylineStyleProps> = DefaultDisplayObjectConfig.defaultLineStringFeatureOrMultiLineStringFeatureDisplayObjectConfig;

    public addFeature(newFeature: MultiLineStringFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }

}

class PolygonLayer implements LayerObject {

    public bbox: BBox = createNonexistentBBox();
    public features: PolygonFeature[] = [];
    public displayObjectConfig: DisplayObjectConfig<PolygonStyleProps> = DefaultDisplayObjectConfig.defaultPolygonFeatureOrMultiPolygonFeatureDisplayObjectConfig;

    addFeature(newFeature: PolygonFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }

}

class MultiPolygonLayer implements LayerObject {

    public bbox: BBox = createNonexistentBBox();
    public features: MultiPolygonFeature[] = [];
    public displayObjectConfig: DisplayObjectConfig<PolygonStyleProps> = DefaultDisplayObjectConfig.defaultPolygonFeatureOrMultiPolygonFeatureDisplayObjectConfig;

    addFeature(newFeature: MultiPolygonFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
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
            return createMultiPolygonLayer();
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