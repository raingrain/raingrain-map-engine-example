import { Canvas, CanvasConfig, Circle, Polygon } from "@antv/g";
import { MapDocument } from "./MapDocument.ts";
import { MultiPolygonLayer, PointLayer } from "./Layer.ts";
import { BBox, Position } from "./type.ts";
import {
    copyBBox,
    createPosition,
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
} from "./utils";


class MapWindow {

    public canvas: Canvas;
    public screenWidth: number;
    public screenHeight: number;
    // @ts-ignore
    public mapBBox: BBox;
    public mapDocument: MapDocument;
    public zoomFactor: number = 2;
    public scale: number = 0;

    constructor(config: CanvasConfig, mapDocument: MapDocument) {
        this.canvas = new Canvas(config);
        this.screenWidth = this.canvas.getConfig().width!;
        this.screenHeight = this.canvas.getConfig().height!;
        this.mapDocument = mapDocument;
        this.updateMapBBoxAndScale(copyBBox(this.mapDocument.bbox));
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
            this.draw();
        };
        this.canvas.addEventListener("mousedown", dragStart);
        this.canvas.addEventListener("mouseup", dragStop);
    };

    zoomTest = (event: any) => {
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
    };

    zoom = (event: WheelEvent) => {
        this.zoomTest(event);
        this.draw();
    };

    initializeEvent = () => {
        // this.canvas.removeEventListener("wheel", this.zoom);
        this.canvas.addEventListener("wheel", this.zoom);
        this.drag();
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

    destroyCanvas = () => {
        console.log(this.canvas);
        this.canvas.destroy(true);
    };

    draw = () => {
        for (const layer of this.mapDocument.layers) {
            if (layer instanceof PointLayer) {
                for (const feature of layer.features) {
                    const screenCoordinate = this.positionToScreenCoordinate(feature.geometry.coordinates);
                    if (!feature.displayObject) {
                        feature.displayObject = new Circle({
                            style: {
                                cx: screenCoordinate[0],
                                cy: screenCoordinate[1],
                                r: 5,
                                fill: "red",
                                cursor: "pointer"
                            }
                        });
                        feature.displayObject.addEventListener("click", () => {
                            console.log(feature);
                        });
                        this.canvas.appendChild(feature.displayObject);
                    } else {
                        feature.displayObject.setLocalPosition(screenCoordinate[0], screenCoordinate[1]);
                    }

                    // else
                    //     if (feature.shouldRender(this.grMap2D)) {
                    //         // feature.displayObject.setLocalPosition(cx, cy);
                    //         // this.canvas.appendChild(feature.displayObject);
                    //     }
                }
            } else if (layer instanceof MultiPolygonLayer) {
                for (const feature of layer.features) {
                    const polygons = feature.geometry.coordinates.map((polygon) => {
                        return polygon.map((lineString) => {
                            return lineString.map((value) => {
                                return this.positionToScreenCoordinate(value);
                            });
                        });
                    });
                    if (!feature.displayObject) {
                        feature.displayObject = [];
                        polygons.forEach((polygon) => {
                            polygon.forEach((lineString) => {
                                const newP = new Polygon({
                                    style: {
                                        points: lineString as Position[],
                                        fill: "#C6E5FF",
                                        stroke: "#1890FF",
                                        lineWidth: 2,
                                        cursor: "pointer",
                                        opacity: 0.5
                                    }
                                });
                                feature.displayObject!.push(newP);
                            });
                        });
                        feature.displayObject.forEach((p) => {
                            this.canvas.appendChild(p);
                        });
                    } else {
                        for (let i = 0; i < feature.displayObject.length; i++) {
                            // @ts-ignore
                            feature.displayObject[i].style.points = polygons[i][0];
                        }
                    }

                }
            }
        }

    };

    displayFullMap = () => {
        this.updateMapBBoxAndScale(copyBBox(this.mapDocument.bbox));
        const newMapBBoxWidth = this.scale * this.screenWidth;
        const newMapBBoxHeight = this.scale * this.screenHeight;
        this.updateMapBBoxAndScale(setCenterAndWidthAndHeight(this.mapBBox, getCenter(this.mapBBox), newMapBBoxWidth, newMapBBoxHeight));
        this.draw();
    };
}


let instanceOfGRView2D: MapWindow | null = null;

function createGRView2D(config: CanvasConfig, mapDocument: MapDocument) {
    instanceOfGRView2D ??= new MapWindow(config, mapDocument);

    // setInterval(() => {
    //     instanceOfGRView2D?.displayFullMap();
    // }, 3000);
    return instanceOfGRView2D;
}

function destroyGRView2D() {
    instanceOfGRView2D?.destroyCanvas();
    instanceOfGRView2D = null;
}


export { createGRView2D, destroyGRView2D, MapWindow };