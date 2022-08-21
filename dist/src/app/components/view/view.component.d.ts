import { OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { fabric } from 'fabric';
import { AppService } from '../../app.service';
import * as i0 from "@angular/core";
export declare class ViewComponent implements OnInit, AfterViewInit {
    app: AppService;
    selectedObject: any;
    userMode: boolean;
    outPutSelectedItem: EventEmitter<any>;
    view: fabric.Canvas;
    room: fabric.Group;
    roomLayer: fabric.Group | fabric.Rect;
    corners: any[];
    walls: fabric.Line[];
    lastObjectDefinition: any;
    lastObject: any;
    CTRL_KEY_DOWN: boolean;
    MOVE_WALL_ID: number;
    ROOM_SIZE: {
        width: number;
        height: number;
    };
    DEFAULT_CHAIR: any;
    REMOVE_DW: boolean;
    constructor(app: AppService);
    maincontainerClass: string;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    initLayout(): void;
    get room_origin(): number;
    onKeyDown(event: KeyboardEvent): void;
    onKeyUp(event: KeyboardEvent): void;
    onScroll(event: any): void;
    setGroupableState(): void;
    setObjectSettings(object: any, key: any, color: any): void;
    onSelected(): void;
    setSelectedObjectColor(color: string): void;
    setObjectOrderID(orderID: string): void;
    /**********************************************************************************************************
     * init the canvas view & bind events
     * -------------------------------------------------------------------------------------------------------
     */
    setCanvasView(): void;
    /**********************************************************************************************************
     * draw Rooms defined in Model
     * -------------------------------------------------------------------------------------------------------
     */
    setRoom({ width, height }: {
        width: any;
        height: any;
    }): void;
    /**********************************************************************************************************
     * set corner according to current edition status
     * -------------------------------------------------------------------------------------------------------
     */
    setCornerStyle(c: fabric.Rect): void;
    /**********************************************************************************************************
     * draw corner
     * -------------------------------------------------------------------------------------------------------
     */
    drawCorner(p: fabric.Point): fabric.Rect;
    /**********************************************************************************************************
     * draw room
     * -------------------------------------------------------------------------------------------------------
     */
    drawRoom(): void;
    locateDW(dw: fabric.Group, wall: fabric.Line, x: number, y: number): fabric.Group;
    setDWOrigin(dw: fabric.Group): fabric.Group;
    /**********************************************************************************************************/
    editRoom(): void;
    cancelRoomEdition(): void;
    setItemStatus(type: string, object: any): any;
    handleObjectInsertion({ type, object }: {
        type: any;
        object: any;
    }): void;
    /** Save current state */
    saveState(): void;
    undo(): void;
    /** Redo operation */
    redo(): void;
    /** Copy operation */
    copy(): void;
    /** Paste operation */
    paste(): void;
    clearLayout(): void;
    /** Delete operation */
    delete(): void;
    /** Rotate Operation */
    rotate(clockwise?: boolean): void;
    /** Group */
    group(): void;
    ungroup(): void;
    move(direction: any, increament?: number): void;
    setZoom(): void;
    placeInCenter(direction: any): void;
    arrange(action: string): void;
    filterObjects(names: string[]): fabric.Object[];
    wallOfDW(dw: fabric.Group | fabric.Object): fabric.Line;
    directionOfWall(wall: fabric.Line): "VERTICAL" | "HORIZONTAL";
    isDW(object: any): boolean;
    getBoundingRect(objects: any[]): {
        left: number;
        top: number;
        right: number;
        bottom: number;
        center: number;
        middle: number;
    };
    saveAs(format: string): void;
    disableSeletion(): void;
    loadJSON(): void;
    isJsonStructure(str: any): boolean;
    alterObjectColor(name: string, color: string, obj: any, view: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ViewComponent, "pointless-room-layout-view", never, { "userMode": "userMode"; }, { "outPutSelectedItem": "outPutSelectedItem"; }, never, never>;
}
