import { Canvas, Circle, Polygon } from "@antv/g";
import { Renderer } from "@antv/g-canvas";
import { MapDocument } from "./MapDocument.ts";
import { MultiPolygonLayer, PointLayer } from "./Layer.ts";
import { BBox, Position } from "./type.ts";
import {
    copyBBox,
    createNonexistentBBox,
    getCenter,
    getHeight,
    getMinX,
    getMinY,
    getWidth,
    mergeBBox,
    setCenter
} from "./utils";

class GRView2D {

    constructor(
        container: string | HTMLElement,
        public screenWidth: number,
        public screenHeight: number,
        public document: MapDocument,
        public mapBBox: BBox = createNonexistentBBox(),
        public zoomFactor: number = 1.3,
        public scaleX: number = 0,
        public scaleY: number = 0,
        public canvas: Canvas = new Canvas({
            container,
            width: screenWidth,
            height: screenHeight,
            background: "gray",
            renderer: new Renderer()
        }),
        private _zoomEnable: boolean = false,
        private _dragEnable: boolean = false
    ) {
        this.mapBBox = mergeBBox(this.document.bbox);
        this.changeScale();
        this.displayFullMap();
        this.initializeEvent();
    }

    drag = () => {

        let originCanvasX: number;
        let originCanvasY: number;

        const dragStart = (e: any) => {
            originCanvasX = e.canvasX;
            originCanvasY = e.canvasY;
        };

        const dragStop = (e: any) => {
            if (e.canvasX === originCanvasX && e.canvasY === originCanvasY) {
                return;
            }
            const screenOffsetX = e.canvasX - originCanvasX;
            const screenOffsetY = e.canvasY - originCanvasY;
            const mapOffsetX = -screenOffsetX * this.scaleX;
            const mapOffsetY = screenOffsetY * this.scaleY;
            const oldCenter = getCenter(this.mapBBox);
            oldCenter[0] += mapOffsetX;
            oldCenter[1] += mapOffsetY;
            setCenter(this.mapBBox, oldCenter);
            this.draw();
        };
        this.canvas.addEventListener("mousedown", dragStart);
        this.canvas.addEventListener("mouseup", dragStop);
    };

    get dragEnable() {
        return this._dragEnable;
    }

    set dragEnable(newDragEnable: boolean) {
        this._dragEnable = newDragEnable;
        this.drag();
    }

    // 地图放大
    // zoomInFromCenter = () => {
    //     this.mapBBox.bbox = [
    //         ((this.mapBBox.maxX + this.mapBBox.minX) - (this.mapBBox.maxX - this.mapBBox.minX) / this.zoomFactor) / 2,
    //         ((this.mapBBox.maxY + this.mapBBox.minY) - (this.mapBBox.maxY - this.mapBBox.minY) / this.zoomFactor) / 2,
    //         ((this.mapBBox.maxX + this.mapBBox.minX) + (this.mapBBox.maxX - this.mapBBox.minX) / this.zoomFactor) / 2,
    //         ((this.mapBBox.maxY + this.mapBBox.minY) + (this.mapBBox.maxY - this.mapBBox.minY) / this.zoomFactor) / 2
    //     ];
    // };

    zoomIn = (event: any) => {
        const newWidth = getWidth(this.mapBBox) / 2;
        const newHeight = getHeight(this.mapBBox) / 2;
        const zoomPoint = this.screenCoordinateToXY(event.canvasX, event.canvasY);
        const offsetX = (this.screenWidth / 2 - event.canvasX) * this.scaleX / 2;
        const offsetY = -(this.screenHeight / 2 - event.canvasY) * this.scaleY / 2;
        const newCenter = [zoomPoint[0] + offsetX, zoomPoint[1] + offsetY];
        this.mapBBox = [newCenter[0] - newWidth / 2, newCenter[1] - newHeight / 2, newCenter[0] + newWidth / 2, newCenter[1] + newHeight / 2];

    };

    // 地图缩小
    // zoomOutFromCenter = () => {
    //     this.mapBBox.bbox = [
    //         ((this.mapBBox.maxX + this.mapBBox.minX) - (this.mapBBox.maxX - this.mapBBox.minX) * this.zoomFactor) / 2,
    //         ((this.mapBBox.maxY + this.mapBBox.minY) - (this.mapBBox.maxY - this.mapBBox.minY) * this.zoomFactor) / 2,
    //         ((this.mapBBox.maxX + this.mapBBox.minX) + (this.mapBBox.maxX - this.mapBBox.minX) * this.zoomFactor) / 2,
    //         ((this.mapBBox.maxY + this.mapBBox.minY) + (this.mapBBox.maxY - this.mapBBox.minY) * this.zoomFactor) / 2
    //     ];
    // };

    zoomOut = (event: any) => {
        const newWidth = getWidth(this.mapBBox) * 2;
        const newHeight = getHeight(this.mapBBox) * 2;
        const zoomPoint = this.screenCoordinateToXY(event.canvasX, event.canvasY);
        const offsetX = (this.screenWidth / 2 - event.canvasX) * this.scaleX * 2;
        const offsetY = -(this.screenHeight / 2 - event.canvasY) * this.scaleY * 2;
        const newCenter = [zoomPoint[0] + offsetX, zoomPoint[1] + offsetY];
        this.mapBBox = [newCenter[0] - newWidth / 2, newCenter[1] - newHeight / 2, newCenter[0] + newWidth / 2, newCenter[1] + newHeight / 2];
    };

    zoom = (event: WheelEvent) => {
        event.deltaY <= 0 ? this.zoomIn(event) : this.zoomOut(event);
        this.changeScale();
        this.draw();
    };

    get zoomEnable() {
        return this._zoomEnable;
    }

    set zoomEnable(newZoomEnable: boolean) {
        this._zoomEnable = newZoomEnable;
        this._zoomEnable ? this.canvas.addEventListener("wheel", this.zoom) : this.canvas.removeEventListener("wheel", this.zoom);
    };

    initializeEvent = () => {
        this.zoomEnable = true;
        this.dragEnable = true;
    };

    xyToScreenCoordinate = (position: Position) => {
        return [
            (position[0] - getMinX(this.mapBBox)) / this.scaleX,
            this.screenHeight - (position[1] - getMinY(this.mapBBox)) / this.scaleY
        ];
    };

    changeScale = () => {
        this.scaleX = this.scaleY = Math.max(getWidth(this.mapBBox) / this.screenWidth, getHeight(this.mapBBox) / this.screenHeight);
        return this.scaleX;
    };

    screenCoordinateToXY = (x: number, y: number) => {
        return [this.scaleX * x + getMinX(this.mapBBox), this.scaleY * (this.screenHeight - y) + getMinY(this.mapBBox)];
    };

    destroyCanvas = () => {
        console.log(this.canvas);
        this.canvas.destroy(true);
    };

    draw = () => {
        for (const layer of this.document.layers) {
            if (layer instanceof PointLayer) {
                for (const feature of layer.features) {
                    const screenCoordinate = this.xyToScreenCoordinate(feature.geometry.coordinates);
                    if (!feature.renderingObject) {
                        feature.renderingObject = new Circle({
                            style: {
                                cx: screenCoordinate[0],
                                cy: screenCoordinate[1],
                                r: 5,
                                fill: "red",
                                cursor: "pointer"
                            }
                        });
                        feature.renderingObject.addEventListener("click", () => {
                            console.log(feature);
                        });
                        this.canvas.appendChild(feature.renderingObject);
                    } else {
                        feature.renderingObject.setLocalPosition(screenCoordinate[0], screenCoordinate[1]);
                    }

                    // else
                    //     if (feature.shouldRender(this.grMap2D)) {
                    //         // feature.renderingObject.setLocalPosition(cx, cy);
                    //         // this.canvas.appendChild(feature.renderingObject);
                    //     }
                }
            } else if (layer instanceof MultiPolygonLayer) {
                for (const feature of layer.features) {
                    const polygons = feature.geometry.coordinates.map((polygon) => {
                        return polygon.map((lineString) => {
                            return lineString.map((value) => {
                                return this.xyToScreenCoordinate(value);
                            });
                        });
                    });
                    if (!feature.renderingObject) {
                        feature.renderingObject = [];
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
                                feature.renderingObject!.push(newP);
                            });
                        });
                        feature.renderingObject.forEach((p) => {
                            this.canvas.appendChild(p);
                        });
                    } else {
                        for (let i = 0; i < feature.renderingObject.length; i++) {
                            // @ts-ignore
                            feature.renderingObject[i].style.points = polygons[i][0];
                        }
                    }

                }
            }
        }

    };

    displayFullMap = () => {
        this.mapBBox = copyBBox(this.document.bbox);
        this.changeScale();
        const mapWidth = this.scaleX * this.screenWidth;
        const mapHeight = this.scaleY * this.screenHeight;
        const oldCenter = getCenter(this.mapBBox);
        const newMapMinX = oldCenter[0] - mapWidth / 2;
        const newMapMinY = oldCenter[1] - mapHeight / 2;
        this.mapBBox = [newMapMinX, newMapMinY, newMapMinX + mapWidth, newMapMinY + mapHeight];
        this.changeScale();
        this.draw();
    };
}


let instanceOfGRView2D: GRView2D | null = null;

function createGRView2D(
    container: string | HTMLElement,
    screenWidth: number,
    screenHeight: number,
    document: MapDocument
) {
    instanceOfGRView2D ??= new GRView2D(
        container,
        screenWidth,
        screenHeight,
        document
    );

    // setInterval(() => {
    //     instanceOfGRView2D?.displayFullMap();
    // }, 5000);
    return instanceOfGRView2D;
}

function destroyGRView2D() {
    instanceOfGRView2D?.destroyCanvas();
    instanceOfGRView2D = null;
}


export { createGRView2D, destroyGRView2D, GRView2D };