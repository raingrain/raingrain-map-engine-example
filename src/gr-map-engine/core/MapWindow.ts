import { Canvas, CanvasConfig } from "@antv/g";
import { MapDocument } from "./MapDocument.ts";
import { MultiPolygonLayer, PointLayer } from "./Layer.ts";
import { BBox, DisplayObjectUnion, FeatureObjectUnion, LayerObjectUnion, Position } from "../types.ts";
import {
    copyBBox,
    createPosition,
    DefaultConfig,
    getCenter,
    getHeight,
    getMinX,
    getMinY,
    getWidth,
    getX,
    getY,
    setCenter,
    setCenterAndWidthAndHeight,
    setXY
} from "../utils";
import { LineStringFeature, PointFeature, PolygonFeature } from "./Feature.ts";

class MapWindow {

    public canvas: Canvas;
    public screenWidth: number;
    public screenHeight: number;
    // @ts-ignore
    public mapBBox: BBox;
    // @ts-ignore
    public scale: number;
    public mapDocument: MapDocument;
    public zoomFactor: number = 2;

    constructor(config: CanvasConfig, mapDocument: MapDocument) {
        this.canvas = new Canvas(config);
        this.screenWidth = this.canvas.getConfig().width!;
        this.screenHeight = this.canvas.getConfig().height!;
        this.mapDocument = mapDocument;
        this.updateMapBBoxAndScale(copyBBox(this.mapDocument.bbox));
        this.beforeFirstDraw();
        this.displayFullMap();
        this.initializeEvent();
    }

    updateMapBBoxAndScale = (newMapBBox: BBox) => {
        this.mapBBox = newMapBBox;
        this.scale = Math.max(getWidth(this.mapBBox) / this.screenWidth, getHeight(this.mapBBox) / this.screenHeight);
    };

    drag = () => {

        let dragStartScreenCoordinate: Position;

        const dragStart = (e: any) => {
            dragStartScreenCoordinate = createPosition(e.canvasX, e.canvasY);
        };

        const dragStop = (e: any) => {
            const dragStopScreenCoordinate = createPosition(e.canvasX, e.canvasY);
            if (getX(dragStopScreenCoordinate) === getX(dragStartScreenCoordinate) && getY(dragStopScreenCoordinate) === getY(dragStartScreenCoordinate)) {
                return;
            }
            const screenOffsetXFromDragStartToDragStop = getX(dragStopScreenCoordinate) - getX(dragStartScreenCoordinate);
            const screenOffsetYFromDragStartToDragStop = getY(dragStopScreenCoordinate) - getY(dragStartScreenCoordinate);
            const mapOffsetXFromDragStartToDragStop = -screenOffsetXFromDragStartToDragStop * this.scale;
            const mapOffsetYFromDragStartToDragStop = screenOffsetYFromDragStartToDragStop * this.scale;
            const oldMapBBoxCenter = getCenter(this.mapBBox);
            this.updateMapBBoxAndScale(setCenter(this.mapBBox, setXY(
                oldMapBBoxCenter,
                getX(oldMapBBoxCenter) + mapOffsetXFromDragStartToDragStop,
                getY(oldMapBBoxCenter) + mapOffsetYFromDragStartToDragStop
            )));
            this.redraw();
        };
        this.canvas.addEventListener("mousedown", dragStart);
        this.canvas.addEventListener("mouseup", dragStop);
    };

    zoom = (event: any) => {
        const zoomFactor = event.deltaY <= 0 ? 1 / this.zoomFactor : this.zoomFactor;
        const newMapBBoxWidth = getWidth(this.mapBBox) * zoomFactor;
        const newMapBBoxHeight = getHeight(this.mapBBox) * zoomFactor;
        const zoomCenterScreenCoordinate = createPosition(event.canvasX, event.canvasY);
        const zoomCenterPosition = this.screenCoordinateToPosition(zoomCenterScreenCoordinate);
        const screenCenterScreenCoordinate = createPosition(this.screenWidth / 2, this.screenHeight / 2);
        const screenOffsetXFromZoomCenterToScreenCenter = getX(screenCenterScreenCoordinate) - getX(zoomCenterScreenCoordinate);
        const mapOffsetXFromZoomCenterToScreenCenter = screenOffsetXFromZoomCenterToScreenCenter * this.scale * zoomFactor;
        const screenOffsetYFromZoomCenterToScreenCenter = getY(screenCenterScreenCoordinate) - getY(zoomCenterScreenCoordinate);
        const mapOffsetYFromZoomCenterToScreenCenter = -screenOffsetYFromZoomCenterToScreenCenter * this.scale * zoomFactor;
        this.updateMapBBoxAndScale(setCenterAndWidthAndHeight(this.mapBBox, createPosition(getX(zoomCenterPosition) + mapOffsetXFromZoomCenterToScreenCenter, getY(zoomCenterPosition) + mapOffsetYFromZoomCenterToScreenCenter), newMapBBoxWidth, newMapBBoxHeight));
        this.redraw();
    };

    initializeEvent = () => {
        // this.canvas.removeEventListener("wheel", this.zoom);
        this.canvas.addEventListener("wheel", this.zoom);
        this.drag();
        // setInterval(() => {
        //     this.displayFullMap();
        // }, 3000);
    };

    positionToScreenCoordinate = (position: Position) => {
        return createPosition(
            (getX(position) - getMinX(this.mapBBox)) / this.scale,
            this.screenHeight - (getY(position) - getMinY(this.mapBBox)) / this.scale
        );
    };

    screenCoordinateToPosition = (screenCoordinate: Position) => {
        return createPosition(
            this.scale * getX(screenCoordinate) + getMinX(this.mapBBox),
            this.scale * (this.screenHeight - getY(screenCoordinate)) + getMinY(this.mapBBox)
        );
    };

    destroy = () => {
        this.canvas.destroyChildren();
        this.canvas.destroy(true);
    };

    displayFullMap = () => {
        this.updateMapBBoxAndScale(copyBBox(this.mapDocument.bbox));
        const newMapBBoxWidth = this.scale * this.screenWidth;
        const newMapBBoxHeight = this.scale * this.screenHeight;
        this.updateMapBBoxAndScale(setCenterAndWidthAndHeight(this.mapBBox, getCenter(this.mapBBox), newMapBBoxWidth, newMapBBoxHeight));
        this.redraw();
    };

    private appendDisplayObjectToCanvas = (displayObject: DisplayObjectUnion) => {
        this.canvas.appendChild(displayObject);
    };

    private addEventListenerToDisplayObject = (layer: LayerObjectUnion, feature: FeatureObjectUnion, displayObject: DisplayObjectUnion) => {
        displayObject!.addEventListener("click", () => {
            console.log(layer);
            console.log(feature);
        });
    };

    private appendDisplayObjectToCanvasAndAddEventListenerToDisplayObject = (layer: LayerObjectUnion, feature: FeatureObjectUnion, displayObject: DisplayObjectUnion) => {
        this.appendDisplayObjectToCanvas(displayObject);
        this.addEventListenerToDisplayObject(layer, feature, displayObject);
    };

    private beforeFirstDraw = () => {
        this.mapDocument.layers.forEach((layer) => {
            layer.features.forEach((feature) => {
                if (feature instanceof PointFeature || feature instanceof LineStringFeature || feature instanceof PolygonFeature) {
                    this.appendDisplayObjectToCanvasAndAddEventListenerToDisplayObject(layer, feature, feature.displayObject);
                } else {
                    feature.displayObject.forEach((object) => {
                        this.appendDisplayObjectToCanvasAndAddEventListenerToDisplayObject(layer, feature, object);
                    });
                }
            });
        });
    };

    private redraw = () => {
        for (const layer of this.mapDocument.layers) {
            if (layer instanceof PointLayer) {
                for (const feature of layer.features) {
                    const screenCoordinate = this.positionToScreenCoordinate(feature.geometry.coordinates);
                    feature.displayObject.setLocalPosition(getX(screenCoordinate), getY(screenCoordinate));
                }
            }
            if (layer instanceof MultiPolygonLayer) {
                for (const feature of layer.features) {
                    const screenCoordinates = feature.geometry.coordinates.map((polygon) => {
                        return polygon.map((lineString) => {
                            return lineString.map((value) => {
                                return this.positionToScreenCoordinate(value);
                            });
                        });
                    });
                    for (let i = 0; i < feature.displayObject.length; i++) {
                        feature.displayObject[i].style.points = screenCoordinates[i][0];
                    }
                }
            }
        }
    };
}

let instanceOfGRView2D: MapWindow | null = null;

function createMapWindow(config: {
    container: string | HTMLElement;
    width: number;
    height: number;
}, mapDocument: MapDocument) {
    instanceOfGRView2D ??= new MapWindow({
        ...config,
        ...DefaultConfig.defaultCanvasConfig
    }, mapDocument);
    return instanceOfGRView2D;
}

function destroyMapWindow() {
    instanceOfGRView2D?.destroy();
    instanceOfGRView2D = null;
}

export { createMapWindow, destroyMapWindow };