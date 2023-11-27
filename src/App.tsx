import China from "./assets/data/China.json";
import {
    createMapDocument,
    createMapWindow,
    destroyMapWindow,
    FeatureCollection,
    readFeatureCollectionAsALayer
} from "./gr-map-engine";

export const App = () => {

    function handleClickCreate() {
        const document = createMapDocument();
        const layer = readFeatureCollectionAsALayer(China as any as FeatureCollection);
        document.addLayer(layer);
        createMapWindow({
            container: "container",
            width: 1000,
            height: 800
        }, document);
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
