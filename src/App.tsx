import { createMapDocument } from "./core-2d/MapDocument.ts";
import { createMultiPolygonLayer, createPointLayer } from "./core-2d/Layer.ts";
import { createGRView2D, destroyGRView2D } from "./core-2d/GRView2D.ts";
import { shangHai } from "./310000.ts";
import { readGeoJson } from "./core-2d/read.ts";
import { createMultiPolygonFeature, createPointFeature } from "./core-2d/Feature.ts";
import { GeoJSON, Position } from "./core-2d/type.ts";


// function createRandomPoint(width: number, height: number) {
//     let data = [];
//     for (let i = 0; i < 10000; i++) {
//         data.push([Math.random() * width, Math.random() * height]);
//     }
//     return data;
// }

export const App = () => {

    function handleClick1() {
        const document = createMapDocument();
        const pointLayer = createPointLayer();
        readGeoJson(shangHai as any as GeoJSON);
        const pointData = shangHai.features.map((value) => {
            return value.properties.centroid;
        });
        pointData.forEach((value) => {
            pointLayer.addFeature(createPointFeature([value[0], value[1]]));
        });
        document.addLayer(pointLayer);

        // const polygonLayer = new PolygonLayer();
        // let polygonData = shangHai.features.map((value) => {
        //     return value.geometry.coordinates[0][0];
        // });
        // polygonData.forEach((value) => {
        //     polygonLayer.addFeature(new PolygonFeature(value.map((value) => {
        //         return createXY(value[0], value[1]);
        //     })));
        // });
        // document.addLayer(polygonLayer);

        const multiPolygonLayer = createMultiPolygonLayer();
        let polygonData = shangHai.features.map((value) => {
            return value.geometry.coordinates;
        });
        polygonData.forEach((polygon) => {
            const position = polygon.map((p) => {
                return p.map((l) => {
                    return l.map((position) => {
                        return position;
                    });
                });
            });
            console.log(position);
            multiPolygonLayer.addFeature(createMultiPolygonFeature(position as Position[][][]));
        });
        document.addLayer(multiPolygonLayer);
        console.log(document);
        createGRView2D(
            "container",
            800,
            800,
            document
        );
        // grView.canvas.appendChild(new Circle({
        //     style: {
        //
        //         cx: 400,
        //         cy: 250,
        //         r: 10,
        //         fill: "purple",
        //         cursor: "pointer"
        //     }
        // }));
    }

    function handleClick2() {
        destroyGRView2D();
    }

    function handleClick3() {
    }

    function handleClick4() {
        console.log();
    }


    return (
        <>
            <div id="container" style={{
                "border": "1px solid red"
            }}>
            </div>
            <button onClick={handleClick1}>create</button>
            <button onClick={handleClick2}>delete</button>
            <button onClick={handleClick3}>+</button>
            <button onClick={handleClick4}>-</button>
        </>
    );
};
