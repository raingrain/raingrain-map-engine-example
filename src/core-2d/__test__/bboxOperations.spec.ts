import { describe, expect, test } from "vitest";
import {
    copyBBox,
    createBBox,
    createNonexistentBBox,
    createPosition,
    getCenter,
    getHeight,
    getMaxX,
    getMaxY,
    getMinX,
    getMinY,
    getMultiPolygonBBox,
    getPolygonBBox,
    getWidth,
    getX,
    getY,
    mergeBBox,
    setBBox,
    setCenter,
    setMaxX,
    setMaxY,
    setMinX,
    setMinY
} from "../utils";
import { Position } from "../type.ts";

describe("bbox test", () => {
    test("test createBBox", () => {
        const bbox1 = createBBox([0, 0], [100, 100]);
        const bbox2 = createBBox(0, 0, 100, 100);
        expect(bbox1).toStrictEqual(bbox2);
    });
    test("test createNonexistentBBox", () => {
        const nonexistentBBox = createNonexistentBBox();
        expect(nonexistentBBox).toStrictEqual([Infinity, Infinity, -Infinity, -Infinity]);
    });
    test("test copyBBox", () => {
        const bbox = createBBox(0, 0, 100, 100);
        const newBBox = copyBBox(bbox);
        expect(Object.is(bbox, newBBox)).toBeFalsy();
        expect(bbox).toStrictEqual(newBBox);
    });
    test("test set and get", () => {
        const bbox = createBBox(0, 0, 100, 100);
        expect(getMinX(bbox)).toBe(0);
        expect(getMinY(bbox)).toBe(0);
        expect(getMaxX(bbox)).toBe(100);
        expect(getMaxY(bbox)).toBe(100);
        setMinX(bbox, 10);
        setMinY(bbox, 10);
        setMaxX(bbox, 90);
        setMaxY(bbox, 90);
        expect(bbox).toStrictEqual([10, 10, 90, 90]);
        setBBox(bbox, 0, 0, 100, 100);
        expect(bbox).toStrictEqual([0, 0, 100, 100]);
        expect(getWidth(bbox)).toBe(100);
        expect(getHeight(bbox)).toBe(100);
        expect(getCenter(bbox)).toStrictEqual([50, 50]);
        setCenter(bbox, [0, 0]);
        expect(bbox).toStrictEqual([-50, -50, 50, 50]);
    });
    test("test mergeBBox", () => {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        const bboxes = [];
        for (let i = 0; i < 100; i++) {
            const bottomLeft = createPosition(Math.random() * 50, Math.random() * 50);
            const topRight = createPosition(Math.random() * 50 + 50, Math.random() * 50 + 50);
            bboxes.push(createBBox(bottomLeft, topRight));
            minX = Math.min(minX, getX(bottomLeft));
            minY = Math.min(minY, getY(bottomLeft));
            maxX = Math.max(maxX, getX(topRight));
            maxY = Math.max(maxY, getY(topRight));
        }
        const bbox = mergeBBox(...bboxes);
        expect(bbox).toStrictEqual([minX, minY, maxX, maxY]);
    });
    test("test getPolygonBBox", () => {
        const coordinates: Position[][] = [
            [
                [
                    121.457689,
                    31.220196
                ],
                [
                    121.456758,
                    31.223898
                ],
                [
                    121.467464,
                    31.223862
                ],
                [
                    121.467658,
                    31.225634
                ],
                [
                    121.466129,
                    31.234917
                ],
                [
                    121.462973,
                    31.241396
                ],
                [
                    121.469563,
                    31.239216
                ],
                [
                    121.474847,
                    31.24142
                ],
                [
                    121.47892,
                    31.240294
                ],
                [
                    121.482994,
                    31.241923
                ],
                [
                    121.485969,
                    31.244091
                ],
                [
                    121.487805,
                    31.244186
                ],
                [
                    121.494826,
                    31.24221
                ],
                [
                    121.493491,
                    31.240163
                ],
                [
                    121.493491,
                    31.23615
                ],
                [
                    121.495744,
                    31.232977
                ],
                [
                    121.502014,
                    31.228018
                ],
                [
                    121.506741,
                    31.223119
                ],
                [
                    121.509397,
                    31.218459
                ],
                [
                    121.509911,
                    31.214506
                ],
                [
                    121.508368,
                    31.210158
                ],
                [
                    121.501319,
                    31.199747
                ],
                [
                    121.498066,
                    31.195601
                ],
                [
                    121.494631,
                    31.192857
                ],
                [
                    121.490752,
                    31.191467
                ],
                [
                    121.475987,
                    31.187885
                ],
                [
                    121.474944,
                    31.189886
                ],
                [
                    121.470383,
                    31.191276
                ],
                [
                    121.469605,
                    31.196404
                ],
                [
                    121.46745,
                    31.203065
                ],
                [
                    121.466449,
                    31.204395
                ],
                [
                    121.462264,
                    31.203173
                ],
                [
                    121.461555,
                    31.210194
                ],
                [
                    121.460707,
                    31.213488
                ],
                [
                    121.457689,
                    31.220196
                ]
            ]
        ];
        const bbox = getPolygonBBox(coordinates);
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        coordinates.forEach((lineString) => {
            lineString.forEach((point) => {
                minX = Math.min(minX, getX(point));
                minY = Math.min(minY, getY(point));
                maxX = Math.max(maxX, getX(point));
                maxY = Math.max(maxY, getY(point));
            });
        });
        expect(bbox).toStrictEqual([minX, minY, maxX, maxY]);
    });
    test("test getMultiPolygonBBox", () => {
        const coordinates: Position[][][] = [
            [
                [
                    [
                        121.975181,
                        31.617034
                    ],
                    [
                        121.98825,
                        31.529597
                    ],
                    [
                        121.993867,
                        31.51189
                    ],
                    [
                        121.995716,
                        31.493104
                    ],
                    [
                        121.991698,
                        31.476763
                    ],
                    [
                        121.981813,
                        31.4641
                    ],
                    [
                        121.967284,
                        31.456656
                    ],
                    [
                        121.934304,
                        31.442364
                    ],
                    [
                        121.918051,
                        31.434692
                    ],
                    [
                        121.901144,
                        31.430126
                    ],
                    [
                        121.89055,
                        31.428788
                    ],
                    [
                        121.882096,
                        31.428656
                    ],
                    [
                        121.87299,
                        31.429338
                    ],
                    [
                        121.857807,
                        31.430043
                    ],
                    [
                        121.845377,
                        31.431895
                    ],
                    [
                        121.834212,
                        31.433975
                    ],
                    [
                        121.819183,
                        31.438206
                    ],
                    [
                        121.763443,
                        31.458233
                    ],
                    [
                        121.72988,
                        31.471973
                    ],
                    [
                        121.682858,
                        31.491061
                    ],
                    [
                        121.670609,
                        31.494214
                    ],
                    [
                        121.638645,
                        31.49972
                    ],
                    [
                        121.625784,
                        31.501775
                    ],
                    [
                        121.617678,
                        31.503673
                    ],
                    [
                        121.608794,
                        31.50691
                    ],
                    [
                        121.547673,
                        31.531125
                    ],
                    [
                        121.471176,
                        31.57443
                    ],
                    [
                        121.43422,
                        31.590336
                    ],
                    [
                        121.414797,
                        31.591076
                    ],
                    [
                        121.403521,
                        31.590002
                    ],
                    [
                        121.395457,
                        31.585444
                    ],
                    [
                        121.37221,
                        31.55321
                    ],
                    [
                        121.345585,
                        31.571685
                    ],
                    [
                        121.289109,
                        31.616283
                    ],
                    [
                        121.179868,
                        31.720774
                    ],
                    [
                        121.145332,
                        31.753927
                    ],
                    [
                        121.142064,
                        31.755308
                    ],
                    [
                        121.118498,
                        31.759084
                    ],
                    [
                        121.149225,
                        31.787294
                    ],
                    [
                        121.181509,
                        31.820411
                    ],
                    [
                        121.200334,
                        31.835144
                    ],
                    [
                        121.225305,
                        31.847043
                    ],
                    [
                        121.242073,
                        31.853397
                    ],
                    [
                        121.252111,
                        31.857727
                    ],
                    [
                        121.265584,
                        31.864128
                    ],
                    [
                        121.281336,
                        31.869041
                    ],
                    [
                        121.291166,
                        31.870992
                    ],
                    [
                        121.3019,
                        31.872716
                    ],
                    [
                        121.310367,
                        31.872502
                    ],
                    [
                        121.315859,
                        31.871479
                    ],
                    [
                        121.323061,
                        31.868529
                    ],
                    [
                        121.369291,
                        31.843283
                    ],
                    [
                        121.376381,
                        31.838571
                    ],
                    [
                        121.385043,
                        31.833525
                    ],
                    [
                        121.395388,
                        31.821291
                    ],
                    [
                        121.399142,
                        31.817483
                    ],
                    [
                        121.405468,
                        31.809841
                    ],
                    [
                        121.411488,
                        31.806341
                    ],
                    [
                        121.416312,
                        31.79764
                    ],
                    [
                        121.410904,
                        31.79558
                    ],
                    [
                        121.420915,
                        31.779602
                    ],
                    [
                        121.425781,
                        31.774267
                    ],
                    [
                        121.431481,
                        31.769266
                    ],
                    [
                        121.445385,
                        31.7643
                    ],
                    [
                        121.449751,
                        31.761668
                    ],
                    [
                        121.455576,
                        31.759346
                    ],
                    [
                        121.464141,
                        31.757142
                    ],
                    [
                        121.476807,
                        31.756142
                    ],
                    [
                        121.487749,
                        31.753415
                    ],
                    [
                        121.498566,
                        31.75326
                    ],
                    [
                        121.51304,
                        31.743695
                    ],
                    [
                        121.514986,
                        31.742873
                    ],
                    [
                        121.526693,
                        31.740217
                    ],
                    [
                        121.528361,
                        31.738347
                    ],
                    [
                        121.539429,
                        31.735499
                    ],
                    [
                        121.540124,
                        31.733307
                    ],
                    [
                        121.549509,
                        31.726969
                    ],
                    [
                        121.551386,
                        31.727386
                    ],
                    [
                        121.565025,
                        31.716711
                    ],
                    [
                        121.578539,
                        31.710527
                    ],
                    [
                        121.592262,
                        31.706487
                    ],
                    [
                        121.593249,
                        31.705379
                    ],
                    [
                        121.599659,
                        31.703115
                    ],
                    [
                        121.60091,
                        31.707
                    ],
                    [
                        121.602746,
                        31.70694
                    ],
                    [
                        121.611755,
                        31.704283
                    ],
                    [
                        121.627341,
                        31.697776
                    ],
                    [
                        121.633278,
                        31.696167
                    ],
                    [
                        121.642649,
                        31.697454
                    ],
                    [
                        121.715267,
                        31.673842
                    ],
                    [
                        121.817806,
                        31.652025
                    ],
                    [
                        121.887616,
                        31.63638
                    ],
                    [
                        121.975181,
                        31.617034
                    ]
                ]
            ],
            [
                [
                    [
                        121.778862,
                        31.310196
                    ],
                    [
                        121.770951,
                        31.31168
                    ],
                    [
                        121.76425,
                        31.315306
                    ],
                    [
                        121.76076,
                        31.320344
                    ],
                    [
                        121.751166,
                        31.337801
                    ],
                    [
                        121.744659,
                        31.343675
                    ],
                    [
                        121.740766,
                        31.346486
                    ],
                    [
                        121.727933,
                        31.354799
                    ],
                    [
                        121.686682,
                        31.376591
                    ],
                    [
                        121.641036,
                        31.401115
                    ],
                    [
                        121.601425,
                        31.421855
                    ],
                    [
                        121.590371,
                        31.427545
                    ],
                    [
                        121.572255,
                        31.436066
                    ],
                    [
                        121.558463,
                        31.448793
                    ],
                    [
                        121.549773,
                        31.457062
                    ],
                    [
                        121.54328,
                        31.462403
                    ],
                    [
                        121.537413,
                        31.466704
                    ],
                    [
                        121.529515,
                        31.471172
                    ],
                    [
                        121.516849,
                        31.477313
                    ],
                    [
                        121.510134,
                        31.482581
                    ],
                    [
                        121.509105,
                        31.485352
                    ],
                    [
                        121.509355,
                        31.489795
                    ],
                    [
                        121.513457,
                        31.493355
                    ],
                    [
                        121.516933,
                        31.494298
                    ],
                    [
                        121.521132,
                        31.493976
                    ],
                    [
                        121.549926,
                        31.489747
                    ],
                    [
                        121.562356,
                        31.486367
                    ],
                    [
                        121.567347,
                        31.4835
                    ],
                    [
                        121.572811,
                        31.469452
                    ],
                    [
                        121.575828,
                        31.463813
                    ],
                    [
                        121.58303,
                        31.456262
                    ],
                    [
                        121.585561,
                        31.454672
                    ],
                    [
                        121.599812,
                        31.450681
                    ],
                    [
                        121.606319,
                        31.449403
                    ],
                    [
                        121.621752,
                        31.444145
                    ],
                    [
                        121.673835,
                        31.427748
                    ],
                    [
                        121.688294,
                        31.425883
                    ],
                    [
                        121.697193,
                        31.423995
                    ],
                    [
                        121.708316,
                        31.419728
                    ],
                    [
                        121.723707,
                        31.412364
                    ],
                    [
                        121.729296,
                        31.410356
                    ],
                    [
                        121.737485,
                        31.408814
                    ],
                    [
                        121.742185,
                        31.407212
                    ],
                    [
                        121.753725,
                        31.400362
                    ],
                    [
                        121.760857,
                        31.395185
                    ],
                    [
                        121.76938,
                        31.390749
                    ],
                    [
                        121.774135,
                        31.386982
                    ],
                    [
                        121.780572,
                        31.380154
                    ],
                    [
                        121.787886,
                        31.37164
                    ],
                    [
                        121.790875,
                        31.367059
                    ],
                    [
                        121.792377,
                        31.363304
                    ],
                    [
                        121.793002,
                        31.355074
                    ],
                    [
                        121.796005,
                        31.345624
                    ],
                    [
                        121.796478,
                        31.33542
                    ],
                    [
                        121.795866,
                        31.329976
                    ],
                    [
                        121.798772,
                        31.310352
                    ],
                    [
                        121.796701,
                        31.30736
                    ],
                    [
                        121.791042,
                        31.308353
                    ],
                    [
                        121.785494,
                        31.311058
                    ],
                    [
                        121.778862,
                        31.310196
                    ]
                ]
            ],
            [
                [
                    [
                        122.242018,
                        31.419082
                    ],
                    [
                        122.245369,
                        31.421318
                    ],
                    [
                        122.247149,
                        31.419333
                    ],
                    [
                        122.243562,
                        31.417839
                    ],
                    [
                        122.242018,
                        31.419082
                    ]
                ]
            ],
            [
                [
                    [
                        121.801775,
                        31.356976
                    ],
                    [
                        121.800566,
                        31.363997
                    ],
                    [
                        121.797674,
                        31.369642
                    ],
                    [
                        121.792808,
                        31.377571
                    ],
                    [
                        121.793864,
                        31.380477
                    ],
                    [
                        121.796756,
                        31.381075
                    ],
                    [
                        121.803458,
                        31.381219
                    ],
                    [
                        121.817445,
                        31.380585
                    ],
                    [
                        121.824744,
                        31.378588
                    ],
                    [
                        121.828401,
                        31.376447
                    ],
                    [
                        121.831752,
                        31.375526
                    ],
                    [
                        121.845586,
                        31.374582
                    ],
                    [
                        121.852885,
                        31.371376
                    ],
                    [
                        121.858516,
                        31.369379
                    ],
                    [
                        121.870376,
                        31.366007
                    ],
                    [
                        121.913074,
                        31.350445
                    ],
                    [
                        121.951726,
                        31.337274
                    ],
                    [
                        122.001556,
                        31.329246
                    ],
                    [
                        122.04107,
                        31.323814
                    ],
                    [
                        122.078012,
                        31.323527
                    ],
                    [
                        122.116678,
                        31.321229
                    ],
                    [
                        122.121975,
                        31.315438
                    ],
                    [
                        122.122684,
                        31.307205
                    ],
                    [
                        122.105207,
                        31.262136
                    ],
                    [
                        122.097769,
                        31.255658
                    ],
                    [
                        122.087285,
                        31.257538
                    ],
                    [
                        122.072005,
                        31.266829
                    ],
                    [
                        122.016447,
                        31.282285
                    ],
                    [
                        121.975779,
                        31.279998
                    ],
                    [
                        121.932261,
                        31.283147
                    ],
                    [
                        121.900755,
                        31.291167
                    ],
                    [
                        121.88959,
                        31.292028
                    ],
                    [
                        121.865968,
                        31.294937
                    ],
                    [
                        121.860782,
                        31.294949
                    ],
                    [
                        121.856681,
                        31.292818
                    ],
                    [
                        121.852885,
                        31.292364
                    ],
                    [
                        121.840566,
                        31.29544
                    ],
                    [
                        121.833601,
                        31.299653
                    ],
                    [
                        121.832043,
                        31.301711
                    ],
                    [
                        121.822617,
                        31.307372
                    ],
                    [
                        121.81319,
                        31.316228
                    ],
                    [
                        121.806642,
                        31.324173
                    ],
                    [
                        121.80375,
                        31.328445
                    ],
                    [
                        121.803152,
                        31.332106
                    ],
                    [
                        121.802693,
                        31.342789
                    ],
                    [
                        121.801775,
                        31.356976
                    ]
                ]
            ],
            [
                [
                    [
                        121.627049,
                        31.444993
                    ],
                    [
                        121.616872,
                        31.446643
                    ],
                    [
                        121.613855,
                        31.447885
                    ],
                    [
                        121.594153,
                        31.458568
                    ],
                    [
                        121.58627,
                        31.464076
                    ],
                    [
                        121.577886,
                        31.472486
                    ],
                    [
                        121.57612,
                        31.474768
                    ],
                    [
                        121.575814,
                        31.478197
                    ],
                    [
                        121.577149,
                        31.479343
                    ],
                    [
                        121.586896,
                        31.479535
                    ],
                    [
                        121.595293,
                        31.478292
                    ],
                    [
                        121.602134,
                        31.476835
                    ],
                    [
                        121.608571,
                        31.474446
                    ],
                    [
                        121.61366,
                        31.471339
                    ],
                    [
                        121.625172,
                        31.462212
                    ],
                    [
                        121.631609,
                        31.456823
                    ],
                    [
                        121.635044,
                        31.452988
                    ],
                    [
                        121.636295,
                        31.449881
                    ],
                    [
                        121.634001,
                        31.445937
                    ],
                    [
                        121.631512,
                        31.445101
                    ],
                    [
                        121.627049,
                        31.444993
                    ]
                ]
            ]
        ];
        const bbox = getMultiPolygonBBox(coordinates);
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        coordinates.forEach((polygon) => {
            polygon.forEach((lineString) => {
                lineString.forEach((point) => {
                    minX = Math.min(minX, getX(point));
                    minY = Math.min(minY, getY(point));
                    maxX = Math.max(maxX, getX(point));
                    maxY = Math.max(maxY, getY(point));
                });
            });
        });
        expect(bbox).toStrictEqual([minX, minY, maxX, maxY]);
    });
});