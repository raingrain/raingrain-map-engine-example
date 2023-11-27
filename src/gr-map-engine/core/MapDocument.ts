import { BBox, LayerObjectUnion } from "../types.ts";
import { createNonexistentBBox, mergeBBox } from "../utils";

class MapDocument {

    public layers: LayerObjectUnion[] = [];
    public bbox: BBox = createNonexistentBBox();

    constructor() {}

    addLayer(newLayer: LayerObjectUnion) {
        this.layers.push(newLayer);
        this.bbox = mergeBBox(this.bbox, newLayer.bbox);
    }
}

function createMapDocument() {
    return new MapDocument();
}

export { MapDocument, createMapDocument };