import { MultiPolygonFeature, PointFeature, PolygonFeature } from "./Feature.ts";
import { BBox, LayerObject } from "./type.ts";
import { createNonexistentBBox, mergeBBox } from "./utils";


class PointLayer implements LayerObject {

    public features: PointFeature[] = [];
    public bbox: BBox = createNonexistentBBox();

    constructor() {}

    addFeature(newFeature: PointFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }
}

function createPointLayer() {
    return new PointLayer();
}

class PolygonLayer {

    public features: PolygonFeature[] = [];
    public bbox: BBox = createNonexistentBBox();

    constructor() {}

    addFeature(newFeature: PolygonFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }

}

function createPolygonLayer() {
    return new PolygonLayer();
}

class MultiPolygonLayer {

    public features: MultiPolygonFeature[] = [];
    public bbox: BBox = createNonexistentBBox();

    constructor() {}

    addFeature(newFeature: MultiPolygonFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }

}

function createMultiPolygonLayer() {
    return new MultiPolygonLayer();
}

export {
    PointLayer,
    PolygonLayer,
    MultiPolygonLayer,
    createPointLayer,
    createPolygonLayer,
    createMultiPolygonLayer
};