import { Feature, FeatureCollection } from "./type.ts";
import { createFeature } from "./Feature.ts";
import { createLayer } from "./Layer.ts";
import { createGeometryWithBBox } from "./utils";


// function readGeoJson(geoJson: GeoJSON) {
//     if (geoJson.type === "FeatureCollection") {
//         readFeatures(geoJson.features);
//     } else if (geoJson.type === "Feature") {
//         readFeature(geoJson);
//     } else {
//         readGeometry(geoJson);
//     }
// }
//
// function readFeatures(features: Feature[]) {
//     const featureObjectArray: FeatureObjectUnion[] = [];
//     features.forEach((feature) => {
//         featureObjectArray.push(readFeature(feature)!);
//     });
//     const pointLayer = createPointLayer();
//     const multiPolygonLayer = createMultiPolygonLayer();
//     const layerSet = {
//         pointLayer,
//         multiPolygonLayer
//     };
//     featureObjectArray.forEach((featureObject) => {
//         addFeatureObjectToLayer(featureObject, layerSet);
//     });
//     const mapDocument = createMapDocument();
//     Object.values(layerSet).forEach((layer) => {
//         if (layer.features.length !== 0) {
//             mapDocument.addLayer(layer);
//         }
//     });
//     console.log(mapDocument);
// }

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
        throw new Error("无法称为一个图层");
    }
    const layer = createLayer(featureCollection.features[0].geometry.type);
    featureCollection.features.forEach((feature) => {
        // @ts-ignore
        layer.addFeature(createFeature(createGeometryWithBBox(feature.geometry), feature.properties));
    });
    return layer;
}

// function addFeatureObjectToLayer(featureObj: FeatureObjectUnion, layerSet: {pointLayer: any; multiPolygonLayer: any;}) {
//     if (featureObj instanceof PointFeature) {
//         layerSet.pointLayer.addFeature(featureObj);
//     } else if (featureObj instanceof MultiPolygonFeature) {
//         layerSet.multiPolygonLayer.addFeature(featureObj);
//     }
// }

export {
    readFeatureCollectionAsALayer
};