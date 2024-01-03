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
        // 创建地图文档
        const mapDocument = createMapDocument();
        // 创建图层并命名
        const layer = readGeoJsonFeatureCollectionAsALayer(China as any as FeatureCollection);
        layer.setName("China");
        // 将图层加入到地图文档
        mapDocument.addLayer(layer);
        // 创建地图窗口并渲染
        createMapWindow({
            container: "container",
            width: 600,
            height: 600
        }, mapDocument);
        // 下载图层数据至geojson
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
