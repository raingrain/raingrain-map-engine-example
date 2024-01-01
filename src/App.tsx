import China from "./assets/data/China.json";
import {
    createGeoJsonFeatureCollectionAsALayer,
    createMapDocument,
    createMapWindow,
    destroyMapWindow,
    downloadGeoJsonFile,
    FeatureCollection,
    readGeoJsonFeatureCollectionAsALayer
} from "raingrain-map-engine";

export const App = () => {

    function handleClickCreate() {
        const mapDocument = createMapDocument();
        const layer = readGeoJsonFeatureCollectionAsALayer(China as any as FeatureCollection);
        layer.setName("China");
        mapDocument.addLayer(layer);
        createMapWindow({
            container: "container",
            width: 600,
            height: 600
        }, mapDocument);
        downloadGeoJsonFile(createGeoJsonFeatureCollectionAsALayer(mapDocument.layers[0]), layer.name);
    }

    function handleClickDestroy() {
        destroyMapWindow();
    }

    return (
        <>
            <div id="container"></div>
            <button onClick={handleClickCreate}>create</button>
            <button onClick={handleClickDestroy}>destroy</button>
        </>
    );
};
