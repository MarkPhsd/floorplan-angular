import { EventEmitter, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from './app.service';
import { Observable, Subject } from 'rxjs';
import * as i0 from "@angular/core";
export interface IFloorPlan {
    name: string;
    id: number;
    template: string;
    sort: number;
    enabled: boolean;
    image: string;
    height: number;
    width: number;
}
export declare class RoomLayoutDesignerComponent implements OnInit, OnDestroy {
    app: AppService;
    private fb;
    private dialog;
    layoutObjects: TemplateRef<any>;
    roomLayout: TemplateRef<any>;
    isAdmin: boolean;
    userMode: boolean;
    _zoom: Subject<number>;
    _userMode: Subject<boolean>;
    _clearNextSelectedTable: Subject<boolean>;
    changeObjectColor: Subject<any>;
    floorPlan: IFloorPlan;
    _floorPlan: Subject<IFloorPlan>;
    _setTableInfo: Subject<any>;
    _newOrder: Subject<any>;
    orderID: string;
    _performOperations: Subject<any>;
    _setOrder: Subject<any>;
    template: string;
    saveFloorPlan: EventEmitter<any>;
    newFloorPlan: EventEmitter<any>;
    toggleButtonHidden: boolean;
    setFloorPlanAndTable: EventEmitter<any>;
    getFloorPlan: EventEmitter<any>;
    setTable: EventEmitter<any>;
    outPutJSON: EventEmitter<any>;
    title: string;
    init: boolean;
    furnishings: {
        title: string;
        rooms: {
            title: string;
            width: number;
            height: number;
        }[];
        tables: ({
            title: string;
            width: number;
            height: number;
            lrSpacing: number;
            tbSpacing: number;
            shape: string;
            fill: string;
            selectionBackgroundColor: string;
            chairs: number;
            topChairs?: undefined;
            bottomChairs?: undefined;
            leftChairs?: undefined;
            rightChairs?: undefined;
        } | {
            title: string;
            width: number;
            height: number;
            lrSpacing: number;
            tbSpacing: number;
            shape: string;
            fill: string;
            chairs: number;
            selectionBackgroundColor?: undefined;
            topChairs?: undefined;
            bottomChairs?: undefined;
            leftChairs?: undefined;
            rightChairs?: undefined;
        } | {
            title: string;
            width: number;
            height: number;
            lrSpacing: number;
            tbSpacing: number;
            shape: string;
            fill: string;
            topChairs: number;
            bottomChairs: number;
            leftChairs: number;
            rightChairs: number;
            selectionBackgroundColor?: undefined;
            chairs?: undefined;
        })[];
        chairs: ({
            title: string;
            width: number;
            height: number;
            lrSpacing: number;
            tbSpacing: number;
            borderColor: string;
            strokeWidth: string;
            fill: string;
            stroke: string;
            parts: {
                stroke: string;
                borderColor: string;
                strokeWidth: string;
                fill: string;
                type: string;
                definition: {
                    left: number;
                    top: number;
                    width: number;
                    height: number;
                };
            }[];
            source?: undefined;
        } | {
            title: string;
            width: number;
            height: number;
            lrSpacing: number;
            tbSpacing: number;
            parts: {
                type: string;
                definition: {
                    originX: string;
                    originY: string;
                    radius: number;
                };
            }[];
            borderColor?: undefined;
            strokeWidth?: undefined;
            fill?: undefined;
            stroke?: undefined;
            source?: undefined;
        } | {
            title: string;
            width: number;
            height: number;
            lrSpacing: number;
            tbSpacing: number;
            parts: {
                type: string;
                definition: {
                    left: number;
                    top: number;
                    width: number;
                    height: number;
                };
            }[];
            borderColor?: undefined;
            strokeWidth?: undefined;
            fill?: undefined;
            stroke?: undefined;
            source?: undefined;
        } | {
            title: string;
            width: number;
            height: number;
            lrSpacing: number;
            tbSpacing: number;
            parts: ({
                type: string;
                definition: {
                    width: number;
                    height: number;
                    top?: undefined;
                };
            } | {
                type: string;
                definition: {
                    width: number;
                    height: number;
                    top: number;
                };
            })[];
            borderColor?: undefined;
            strokeWidth?: undefined;
            fill?: undefined;
            stroke?: undefined;
            source?: undefined;
        } | {
            title: string;
            source: string;
            width: number;
            height: number;
            lrSpacing: number;
            tbSpacing: number;
            parts: ({
                type: string;
                definition: {
                    width: number;
                    height: number;
                    top?: undefined;
                };
            } | {
                type: string;
                definition: {
                    width: number;
                    height: number;
                    top: number;
                };
            })[];
            borderColor?: undefined;
            strokeWidth?: undefined;
            fill?: undefined;
            stroke?: undefined;
        })[];
        miscellaneous: ({
            title: string;
            width: number;
            height: number;
            flexible: boolean;
            parts: {
                type: string;
                definition: {
                    left: number;
                    top: number;
                    width: number;
                    height: number;
                };
            }[];
        } | {
            title: string;
            width: number;
            height: number;
            parts: ({
                type: string;
                definition: {
                    left: number;
                    top: number;
                    width: number;
                    height: number;
                    stroke: string;
                };
                path?: undefined;
            } | {
                type: string;
                path: string;
                definition: {
                    left?: undefined;
                    top?: undefined;
                    width?: undefined;
                    height?: undefined;
                    stroke?: undefined;
                };
            } | {
                type: string;
                definition: {
                    left: number;
                    top: number;
                    width: number;
                    height: number;
                    stroke?: undefined;
                };
                path?: undefined;
            })[];
            flexible?: undefined;
        } | {
            title: string;
            width: number;
            height: number;
            parts: ({
                type: string;
                definition: {
                    left: number;
                    top: number;
                    strokeWidth: number;
                    stroke: string;
                    originX: string;
                    originY: string;
                    radius: number;
                };
                path?: undefined;
            } | {
                type: string;
                path: string;
                definition: {
                    strokeWidth: number;
                    stroke: string;
                    left?: undefined;
                    top?: undefined;
                    originX?: undefined;
                    originY?: undefined;
                    radius?: undefined;
                };
            })[];
            flexible?: undefined;
        })[];
        doors: {
            title: string;
            parts: ({
                type: string;
                definition: {
                    left: number;
                    width: number;
                    top: number;
                    height: number;
                    fill: string;
                    strokeWidth: number;
                    originX: string;
                    originY: string;
                    stroke?: undefined;
                };
                line?: undefined;
                path?: undefined;
            } | {
                type: string;
                line: (string | number)[];
                definition: {
                    stroke: string;
                    strokeWidth: number;
                    left?: undefined;
                    width?: undefined;
                    top?: undefined;
                    height?: undefined;
                    fill?: undefined;
                    originX?: undefined;
                    originY?: undefined;
                };
                path?: undefined;
            } | {
                type: string;
                path: string;
                definition: {
                    stroke: string;
                    strokeWidth: number;
                    fill: string;
                    left?: undefined;
                    width?: undefined;
                    top?: undefined;
                    height?: undefined;
                    originX?: undefined;
                    originY?: undefined;
                };
                line?: undefined;
            })[];
        }[];
        windows: {
            title: string;
            parts: {
                type: string;
                definition: {
                    left: number;
                    width: number;
                    top: number;
                    height: number;
                    fill: string;
                    strokeWidth: number;
                    originX: string;
                    originY: string;
                };
            }[];
        }[];
    };
    defaultChairIndex: number;
    textForm: FormGroup;
    previewItem: any;
    previewType: any;
    faReply: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faShare: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faClone: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faTrash: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faUndo: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faRedo: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faObjectGroup: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faObjectUngroup: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faPlus: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faMinus: import("@fortawesome/fontawesome-common-types").IconDefinition;
    constructor(app: AppService, fb: FormBuilder, dialog: MatDialog);
    ngOnInit(): void;
    ngOnDestroy(): void;
    _outPutJSON(): void;
    setTableInfo(): void;
    setZoom(): void;
    _setTableSelectedColor(): void;
    setOrder(): void;
    get isRoomLayoutSelector(): TemplateRef<any>;
    get islayoutObjects(): TemplateRef<any>;
    initCurrentFloorPlan(): void;
    changeBackGroundImage(): void;
    _saveFloorPlan(): void;
    intTemplateSubscriber(): void;
    setFloorPlanTemplate(data: any): void;
    loadTemplate(): void;
    clearTable(): void;
    getFloorPlanData(): void;
    toggleUserMode(): void;
    initUserModeSubscriber(): void;
    clearTableSubscriber(): void;
    _setTable(): void;
    clearLayout(): void;
    isJsonStructure(str: any): boolean;
    onZoom(value: any): void;
    toggleMode(option: boolean): void;
    performOperations(): void;
    outPutSetTable(): void;
    enableLayout(): void;
    displayLayout(item: any): void;
    refreshObservable(item$: Observable<any>): void;
    insert(object: any, type: string): void;
    defaultChairChanged(index: number): void;
    initTextForm(): void;
    insertNewText(): void;
    layoutChairs(): void;
    exampleFloor(): IFloorPlan;
    static ɵfac: i0.ɵɵFactoryDeclaration<RoomLayoutDesignerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RoomLayoutDesignerComponent, "pointless-room-layout-designer", never, { "isAdmin": "isAdmin"; "userMode": "userMode"; "_zoom": "_zoom"; "_userMode": "_userMode"; "_clearNextSelectedTable": "_clearNextSelectedTable"; "changeObjectColor": "changeObjectColor"; "floorPlan": "floorPlan"; "_floorPlan": "_floorPlan"; "_setTableInfo": "_setTableInfo"; "_newOrder": "_newOrder"; "orderID": "orderID"; "_performOperations": "_performOperations"; "_setOrder": "_setOrder"; "toggleButtonHidden": "toggleButtonHidden"; }, { "saveFloorPlan": "saveFloorPlan"; "newFloorPlan": "newFloorPlan"; "setFloorPlanAndTable": "setFloorPlanAndTable"; "getFloorPlan": "getFloorPlan"; "setTable": "setTable"; "outPutJSON": "outPutJSON"; }, never, never>;
}
