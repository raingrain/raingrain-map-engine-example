import China from "./assets/data/China.json";
// import ShangHai from "./assets/data/ShangHai.json";
import {
    createMapDocument,
    createMapWindow,
    destroyMapWindow,
    FeatureCollection,
    readGeoJsonFeatureCollectionAsALayer
} from "./gr-map-engine";
import { downloadGeoJsonFeatureCollectionAsALayer } from "./gr-map-engine/utils/geojson.ts";

export const App = () => {

    function handleClickCreate() {
        const mapDocument = createMapDocument();
        const layer = readGeoJsonFeatureCollectionAsALayer(China as any as FeatureCollection);
        mapDocument.addLayer(layer);
        createMapWindow({
            container: "container",
            width: 1000,
            height: 800
        }, mapDocument);
        downloadGeoJsonFeatureCollectionAsALayer(mapDocument.layers[0]);
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
