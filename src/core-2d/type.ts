import { Circle, Polygon as GPolygon, Polyline } from "@antv/g";
import { MultiPolygonFeature, PointFeature, PolygonFeature } from "./Feature.ts";
import { MultiPolygonLayer, PointLayer, PolygonLayer } from "./Layer.ts";

type Position = [x: number, y: number];

type BBox = [minX: number, minY: number, maxX: number, maxY: number];

type GeoJsonProperties =
    {
        [name: string]: any
    }
    | null;

type PointFeatureDisplayObject = Circle | null;

type MultiPointFeatureDisplayObject = Circle[] | null;

type LineStringFeatureDisplayObject = Polyline | null;

type MultiLineStringFeatureDisplayObject = Polyline[] | null;

type PolygonFeatureDisplayObject = GPolygon | null;

type MultiPolygonFeatureDisplayObject = GPolygon[] | null

type FeatureDisplayObject =
    PointFeatureDisplayObject
    | MultiPointFeatureDisplayObject
    | LineStringFeatureDisplayObject
    | MultiLineStringFeatureDisplayObject
    | PolygonFeatureDisplayObject
    | MultiPolygonFeatureDisplayObject

type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;

type GeoJsonGeometryTypes = Geometry["type"];

type GeometryObject = Geometry;

type GeoJSON = Geometry | Feature | FeatureCollection;

type GeoJsonTypes = GeoJSON["type"];

type FeatureObjectUnion = PointFeature | PolygonFeature | MultiPolygonFeature

type FeatureObjectArrayUnion = PointFeature[] | PolygonFeature[] | MultiPolygonFeature[]

interface LayerObject {
    features: FeatureObjectArrayUnion;
    bbox: BBox;

    addFeature(newFeature: FeatureObjectUnion): void;
}

type LayerObjectUnion = PointLayer | PolygonLayer | MultiPolygonLayer;


interface GeoJsonObject {
    type: GeoJsonTypes;
    bbox: BBox;
}

interface Point extends GeoJsonObject {
    type: "Point";
    coordinates: Position;
}

interface MultiPoint extends GeoJsonObject {
    type: "MultiPoint";
    coordinates: Position[];
}

interface LineString extends GeoJsonObject {
    type: "LineString";
    coordinates: Position[];
}

interface MultiLineString extends GeoJsonObject {
    type: "MultiLineString";
    coordinates: Position[][];
}

interface Polygon extends GeoJsonObject {
    type: "Polygon";
    coordinates: Position[][];
}

interface MultiPolygon extends GeoJsonObject {
    type: "MultiPolygon";
    coordinates: Position[][][];
}

interface GeometryCollection<G extends Geometry = Geometry> extends GeoJsonObject {
    type: "GeometryCollection";
    geometries: G[];
}

interface Feature<G extends Geometry | null = Geometry, P = GeoJsonProperties> {
    type: "Feature";
    geometry: G;
    id?: string | number | undefined;
    properties: P;
}

interface FeatureCollection<G extends Geometry | null = Geometry, P = GeoJsonProperties> {
    type: "FeatureCollection";
    features: Array<Feature<G, P>>;
}


export type {
    Position,
    BBox,
    GeoJsonProperties,
    PointFeatureDisplayObject,
    MultiPointFeatureDisplayObject,
    LineStringFeatureDisplayObject,
    MultiLineStringFeatureDisplayObject,
    PolygonFeatureDisplayObject,
    MultiPolygonFeatureDisplayObject,
    FeatureDisplayObject,
    // FeatureObject,
    FeatureObjectUnion,
    FeatureObjectArrayUnion,
    LayerObject,
    LayerObjectUnion,
    Geometry,
    GeoJsonGeometryTypes,
    GeometryObject,
    GeoJSON,
    GeoJsonTypes,
    GeoJsonObject,
    Point,
    MultiPoint,
    LineString,
    MultiLineString,
    Polygon,
    MultiPolygon,
    GeometryCollection,
    Feature,
    FeatureCollection
};