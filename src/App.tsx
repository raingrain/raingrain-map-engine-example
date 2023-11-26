// import data from "./310000.json";
import data from "./china.json";
import { createMapDocument } from "./core-2d/MapDocument.ts";
import { readFeatureCollectionAsALayer } from "./core-2d/read.ts";
import { FeatureCollection } from "./core-2d/type.ts";
import { createGRView2D } from "./core-2d/MapWindow.ts";

export const App = () => {

    function handleClick1() {
        const document = createMapDocument();
        const layer = readFeatureCollectionAsALayer(data as any as FeatureCollection);

        // const pointLayer = createPointLayer();
        // readGeoJson(shangHai as any as GeoJSON);
        // const pointData = shangHai.features.map((value) => {
        //     return value.properties.centroid;
        // });
        // pointData.forEach((value) => {
        //     pointLayer.addFeature(createPointFeature([value[0], value[1]]));
        // });
        document.addLayer(layer);

        // const polygonLayer = new PolygonLayer();
        // let polygonData = shangHai.features.map((value) => {
        //     return value.geometry.coordinates[0][0];
        // });
        // polygonData.forEach((value) => {
        //     polygonLayer.addFeature(new PolygonFeature(value.map((value) => {
        //         return createXY(value[0], value[1]);
        //     })));
        // });
        // mapDocument.addLayer(polygonLayer);

        // const multiPolygonLayer = createMultiPolygonLayer();
        // let polygonData = shangHai.features.map((value) => {
        //     return value.geometry.coordinates;
        // });
        // polygonData.forEach((polygon) => {
        //     const position = polygon.map((p) => {
        //         return p.map((l) => {
        //             return l.map((position) => {
        //                 return position;
        //             });
        //         });
        //     });
        //     console.log(position);
        //     multiPolygonLayer.addFeature(createMultiPolygonFeature(position as Position[][][]));
        // });
        // document.addLayer(multiPolygonLayer);
        // console.log(document);
        createGRView2D({
            container: "container",
            width: 1000,
            height: 800
        }, document);
        // document.layers.forEach((layer) => {
        //     layer.features.forEach((feature) => {
        //         console.log(feature.properties.name);
        //     });
        // });
    }

    // function handleClick2() {
    //     // destroyGRView2D();
    // }
    //
    // function handleClick3() {
    // }
    //
    // function handleClick4() {
    //     console.log(data);
    // }


    return (
        <>
            <div id="container" style={{
                "border": "1px solid red"
            }}>
            </div>
            <button onClick={handleClick1}>create</button>
            {/*<button onClick={handleClick2}>delete</button>*/}
            {/*<button onClick={handleClick3}>+</button>*/}
            {/*<button onClick={handleClick4}>-</button>*/}
        </>
    );
};
