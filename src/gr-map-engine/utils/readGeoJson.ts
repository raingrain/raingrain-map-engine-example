import { Feature, FeatureCollection } from "../types.ts";
import { createFeature, createLayer } from "../core";
import { createGeometryWithBBox } from "./index.ts";

function checkFeatureOfFeaturesHasSameType(features: Feature[]) {
    const firstFeatureType = features[0].geometry.type;
    for (const feature of features) {
        if (!Object.is(feature.geometry.type, firstFeatureType)) {
            console.error(`${feature.geometry.type}与${firstFeatureType}不匹配`);
            return false;
        }
    }
    return true;
}

function readFeatureCollectionAsALayer(featureCollection: FeatureCollection) {
    if (!checkFeatureOfFeaturesHasSameType(featureCollection.features)) {
        throw new Error("无法视作一个图层");
    }
    const layer = createLayer(featureCollection.features[0].geometry.type);
    featureCollection.features.forEach((feature) => {
        // @ts-ignore
        layer.addFeature(createFeature(createGeometryWithBBox(feature.geometry), feature.properties));
    });
    return layer;
}

export {
    readFeatureCollectionAsALayer
};