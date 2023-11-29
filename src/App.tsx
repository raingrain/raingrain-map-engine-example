import China from "./assets/data/China.json";
// import ShangHai from "./assets/data/ShangHai.json";
import {
    createMapDocument,
    createMapWindow,
    destroyMapWindow,
    FeatureCollection,
    readGeoJsonFeatureCollectionAsALayer
} from "./gr-map-engine";
import { createGeoJsonFeatureCollectionAsALayer } from "./gr-map-engine/utils/geojson.ts";

export const App = () => {

    function handleClickCreate() {
        const document = createMapDocument();
        const layer = readGeoJsonFeatureCollectionAsALayer(China as any as FeatureCollection);
        document.addLayer(layer);
        createMapWindow({
            container: "container",
            width: 1000,
            height: 800
        }, document);
        const json = createGeoJsonFeatureCollectionAsALayer(document.layers[0]);
        console.log(json);
    }


    function handleClickDestroy() {
        destroyMapWindow();
    }

    return (
        <>
            <div id="container" style={{
                "border": "1px solid red"
            }}>
            </div>
            <button onClick={handleClickCreate}>create</button>
            <button onClick={handleClickDestroy}>destroy</button>
        </>
    );
};
