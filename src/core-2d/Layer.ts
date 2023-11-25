import { MultiPolygonFeature, PointFeature, PolygonFeature } from "./Feature.ts";
import { BBox, LayerObject } from "./type.ts";
import { createNonexistentBBox, mergeBBox } from "./utils";
import { CircleStyleProps, DisplayObjectConfig, PolygonStyleProps } from "@antv/g";

// import { BaseStyleProps } from "@antv/g-lite/dist/types";

class DefaultDisplayObjectConfig {
    static readonly defaultPointFeatureDisplayObjectConfig: DisplayObjectConfig<CircleStyleProps> = {
        style: {
            cx: 0,
            cy: 0,
            r: 5,
            fill: "red",
            cursor: "pointer"
        }
    };
    static readonly defaultPolygonFeatureDisplayObjectConfig: DisplayObjectConfig<PolygonStyleProps> = {
        style: {
            points: [[0, 0]],
            fill: "#C6E5FF",
            stroke: "#1890FF",
            lineWidth: 2,
            cursor: "pointer",
            opacity: 0.5
        }
    };
}

class PointLayer implements LayerObject {

    public features: PointFeature[] = [];
    public bbox: BBox = createNonexistentBBox();
    public displayObjectConfig: DisplayObjectConfig<CircleStyleProps> = DefaultDisplayObjectConfig.defaultPointFeatureDisplayObjectConfig;

    constructor() {}

    addFeature(newFeature: PointFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }
}

function createPointLayer() {
    return new PointLayer();
}

class PolygonLayer implements LayerObject {

    public features: PolygonFeature[] = [];
    public bbox: BBox = createNonexistentBBox();
    public displayObjectConfig: DisplayObjectConfig<PolygonStyleProps> = DefaultDisplayObjectConfig.defaultPolygonFeatureDisplayObjectConfig;

    constructor() {}

    addFeature(newFeature: PolygonFeature) {
        this.features.push(newFeature);
        this.bbox = mergeBBox(this.bbox, newFeature.geometry.bbox);
    }

}

function createPolygonLayer() {
    return new PolygonLayer();
}

class MultiPolygonLayer implements LayerObject {

    public features: MultiPolygonFeature[] = [];
    public bbox: BBox = createNonexistentBBox();
    public displayObjectConfig: DisplayObjectConfig<PolygonStyleProps> = DefaultDisplayObjectConfig.defaultPolygonFeatureDisplayObjectConfig;

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
    createMultiPolygonLayer,
    DefaultDisplayObjectConfig
};