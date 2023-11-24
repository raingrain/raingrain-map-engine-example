import { Feature, FeatureObjectUnion, GeoJSON, Geometry } from "./type.ts";
import { createMultiPolygonFeature, createPointFeature, MultiPolygonFeature, PointFeature } from "./Feature.ts";
import { createMultiPolygonLayer, createPointLayer } from "./Layer.ts";
import { createMapDocument } from "./MapDocument.ts";


function readGeoJson(geoJson: GeoJSON) {
    if (geoJson.type === "FeatureCollection") {
        readFeatures(geoJson.features);
    } else if (geoJson.type === "Feature") {
        readFeature(geoJson);
    } else {
        readGeometry(geoJson);
    }
}

function readFeatures(features: Feature[]) {
    const featureObjectArray: FeatureObjectUnion[] = [];
    features.forEach((feature) => {
        featureObjectArray.push(readFeature(feature)!);
    });
    const pointLayer = createPointLayer();
    const multiPolygonLayer = createMultiPolygonLayer();
    const layerSet = {
        pointLayer,
        multiPolygonLayer
    };
    featureObjectArray.forEach((featureObject) => {
        addFeatureObjectToLayer(featureObject, layerSet);
    });
    const mapDocument = createMapDocument();
    Object.values(layerSet).forEach((layer) => {
        if (layer.features.length !== 0) {
            mapDocument.addLayer(layer);
        }
    });
    console.log(mapDocument);
}

function addFeatureObjectToLayer(featureObj: FeatureObjectUnion, layerSet: {pointLayer: any; multiPolygonLayer: any;}) {
    if (featureObj instanceof PointFeature) {
        layerSet.pointLayer.addFeature(featureObj);
    } else if (featureObj instanceof MultiPolygonFeature) {
        layerSet.multiPolygonLayer.addFeature(featureObj);
    }
}

function readFeature(feature: Feature) {
    const featureObject = readGeometry(feature.geometry)!;
    featureObject.properties = feature.properties;
    return featureObject;
}

function readGeometry(geometry: Geometry) {
    switch (geometry.type) {
        case "Point":
            return createPointFeature(geometry.coordinates);
        case "MultiPolygon":
            return createMultiPolygonFeature(geometry.coordinates);
        default:
            break;
    }
}

// function readPoint(geometry: Point) {
//     return createPointFeature(geometry.coordinates);
// }

// function readMultiPoint(geometry: MultiPoint) {
//     console.log(geometry);
// }
//
// function readLineString(geometry: LineString) {
//
// }
//
// function readMultiLineString(geometry: MultiLineString) {
//
// }
//
// function readPolygon(geometry: Polygon) {
//
// }

// function readMultiPolygon(geometry: MultiPolygon) {
//     return new MultiPolygonFeature(geometry.coordinates);
// }

// function readGeometryCollection(geometry: GeometryCollection) {
//
// }

export {
    readGeoJson
};