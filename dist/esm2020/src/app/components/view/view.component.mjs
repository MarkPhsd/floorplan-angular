import { Component, EventEmitter, Output, Input } from '@angular/core';
import { formatDate } from '@angular/common';
import { fabric } from 'fabric';
import { saveAs } from 'file-saver';
import * as _ from '../../helpers';
import * as i0 from "@angular/core";
import * as i1 from "../../app.service";
// import { json } from 'stream/consumers';
// import { ViewJSONServiceService } from 'src/app/view-jsonservice.service';
const { RL_VIEW_WIDTH, RL_VIEW_HEIGHT, RL_FOOT, RL_AISLEGAP, RL_ROOM_OUTER_SPACING, RL_ROOM_INNER_SPACING, RL_ROOM_STROKE, RL_CORNER_FILL, RL_UNGROUPABLES, RL_CREDIT_TEXT, RL_CREDIT_TEXT_PARAMS } = _;
const { Line, Point } = fabric;
const HORIZONTAL = 'HORIZONTAL', VERTICAL = 'VERTICAL', OFFSET = RL_ROOM_INNER_SPACING / 2;
const Left = (wall) => wall.x1 < wall.x2 ? wall.x1 : wall.x2;
const Top = (wall) => wall.y1 < wall.y2 ? wall.y1 : wall.y2;
const Right = (wall) => wall.x1 > wall.x2 ? wall.x1 : wall.x2;
const Bottom = (wall) => wall.y1 > wall.y2 ? wall.y1 : wall.y2;
export class ViewComponent {
    constructor(
    // public viewJSONServiceService: ViewJSONServiceService,
    app) {
        this.app = app;
        this.outPutTable = new EventEmitter();
        this.corners = [];
        this.walls = [];
        this.lastObjectDefinition = null;
        this.lastObject = null;
        this.CTRL_KEY_DOWN = false;
        this.MOVE_WALL_ID = -1;
        this.ROOM_SIZE = { width: 960, height: 480 };
        this.DEFAULT_CHAIR = null;
        this.REMOVE_DW = false;
        this.maincontainerClass = 'main-container';
    }
    ngOnInit() {
        this.loadJSON();
        this.app.setSelectedObjectColor.subscribe(data => {
            if (data) {
                this.setSelectedObjectColor(data);
            }
        });
        this.app.roomEdition.subscribe(doEdit => {
            this.corners.forEach(c => this.setCornerStyle(c));
            this.drawRoom();
            if (doEdit) {
                this.editRoom();
            }
            else {
                this.cancelRoomEdition();
            }
        });
        this.app.insertObject.subscribe(res => {
            this.handleObjectInsertion(res);
            this.saveState();
        });
        this.app.defaultChair.subscribe(res => this.DEFAULT_CHAIR = res);
        this.app.setSelectedObjectColor.subscribe(data => {
            if (data) {
                this.setSelectedObjectColor(data);
            }
        });
        this.app.performOperation.subscribe(operation => {
            switch (operation) {
                case 'UNDO':
                    this.undo();
                    break;
                case 'REDO':
                    this.redo();
                    break;
                case 'COPY':
                    this.copy();
                    break;
                case 'PASTE':
                    this.paste();
                    break;
                case 'DELETE':
                    this.delete();
                    break;
                case 'ROTATE':
                    this.rotate();
                    break;
                case 'ROTATE_ANTI':
                    this.rotate(false);
                    break;
                case 'setOrderID':
                    this.setObjectOrderID(this.app.orderID);
                    break;
                case 'clearLayout':
                    this.clearLayout();
                    break;
                case 'GROUP':
                    this.group();
                    break;
                case 'UNGROUP':
                    this.ungroup();
                    break;
                case 'HORIZONTAL':
                case 'VERTICAL':
                    this.placeInCenter(operation);
                    break;
                case 'ROOM_OPERATION':
                    this.drawRoom();
                    break;
                case 'PNG':
                case 'SVG':
                    this.saveAs(operation);
                    break;
                case 'loadjson':
                    this.loadJSON();
                    break;
                case 'json':
                    this.saveAs(operation);
                    break;
                case 'ZOOM':
                    this.setZoom();
                    break;
                case 'disableSeletion':
                    this.disableSeletion();
                    break;
                case 'LEFT':
                case 'CENTER':
                case 'RIGHT':
                case 'TOP':
                case 'MIDDLE':
                case 'BOTTOM':
                    this.arrange(operation);
                    break;
            }
        });
    }
    ngAfterViewInit() {
        /** Initialize canvas */
        this.initLayout();
    }
    initLayout() {
        this.setCanvasView();
        /** Add room */
        this.setRoom(this.ROOM_SIZE);
        this.saveState();
    }
    get room_origin() {
        return RL_ROOM_OUTER_SPACING + RL_ROOM_INNER_SPACING;
    }
    onKeyDown(event) {
        const code = event.key || event.keyCode;
        // Ctrl Key is down
        if (event.ctrlKey) {
            this.CTRL_KEY_DOWN = true;
            // Ctrl + Shift + Z
            if (event.shiftKey && code === 90)
                this.app.redo();
            else if (code === 90)
                this.app.undo();
            else if (code === 67)
                this.app.copy();
            else if (code === 86)
                this.paste();
            else if (code === 37)
                this.rotate();
            else if (code === 39)
                this.rotate(false);
            else if (code === 71)
                this.group();
        }
        else if (code === 46)
            this.delete();
        else if (code === 37)
            this.move('LEFT');
        else if (code === 38)
            this.move('UP');
        else if (code === 39)
            this.move('RIGHT');
        else if (code === 40)
            this.move('DOWN');
    }
    onKeyUp(event) {
        if (event.key === 'Control') {
            this.CTRL_KEY_DOWN = false;
        }
    }
    onScroll(event) { }
    setGroupableState() {
        if (this.app.selections.length > 1) {
            this.app.ungroupable = false;
            return;
        }
        const obj = this.view.getActiveObject();
        const type = obj.name ? obj.name.split(':')[0] : '';
        if (RL_UNGROUPABLES.indexOf(type) > -1) {
            this.app.ungroupable = false;
        }
        else {
            this.app.ungroupable = true;
        }
    }
    setObjectSettings(object, key, color) {
        fabric.Group.prototype.selectionBackgroundColor = 'rgba(255,100,171,0.25)';
        fabric.Group.prototype.backgroundColor = 'rgba(255,100,171,0.25)';
        fabric.Group.prototype.fill = 'rgba(255,100,171,0.25)';
        fabric.Group.prototype.strokeWidth = 3;
    }
    onSelected() {
        const active = this.view.getActiveObject();
        // this.setObjectSettings(active, 'fill', 'red')
        // // active._renderFill('purple', () => { });
        // return;
        active.lockScalingX = true, active.lockScalingY = true;
        if (!active.name) {
            active.name = 'GROUP';
        }
        this.app.selections = this.view.getActiveObjects();
        this.setGroupableState();
    }
    setSelectedObjectColor(color) {
        // console.log('item.', color)
        const item = this.view.getActiveObject();
        if (!item) {
            return;
        }
        // console.log('item.', item.name)
        if (item.name) {
            // const json =  this.viewJSONServiceService.alterObjectColor(item.name, color, item, this.view)
            // const newItem = `${uid};${orderID};${name}`;
            // console.log('New Item', newItem)
            // this.selectedObject.name = newItem;
            const json = this.alterObjectColor(item.name, color, item, this.view);
            this.drawRoom();
            this.saveState();
            // console.log(json)
            // let object
            // if (this.isJsonStructure(json)) {
            //   object = json
            // } else {
            //   object = JSON.parse(json)
            // }
            this.view.loadFromJSON(json, function () {
                // this.view.renderAll();
            });
        }
        return;
    }
    setObjectOrderID(orderID) {
        if (this.selectedObject) {
            const item = this.selectedObject?.name;
            const uid = item.split(';')[0];
            const order = item.split(';')[1];
            const name = item.split(';')[2];
            // console.log('setObjectOrderID', order)
            const newItem = `${uid};${orderID};${name}`;
            // console.log('New Item', newItem)
            this.selectedObject.name = newItem;
            this.drawRoom();
            this.saveState();
        }
    }
    /**********************************************************************************************************
     * init the canvas view & bind events
     * -------------------------------------------------------------------------------------------------------
     */
    setCanvasView() {
        const canvas = new fabric.Canvas('main');
        canvas.setWidth(RL_VIEW_WIDTH * RL_FOOT);
        canvas.setHeight(RL_VIEW_HEIGHT * RL_FOOT);
        this.view = canvas;
        const cornersOfWall = (obj) => {
            const id = Number(obj.name.split(':')[1]);
            const v1Id = id;
            const v1 = this.corners[v1Id];
            const v2Id = (id + 1) % this.walls.length;
            const v2 = this.corners[v2Id];
            return { v1, v1Id, v2, v2Id };
        };
        this.view.on('selection:created', (e) => {
            if (this.app.roomEdit) {
                return;
            }
            this.onSelected();
            console.log('selection:created', this.app.roomEdit);
        });
        this.view.on('selection:updated', (e) => {
            if (this.app.roomEdit) {
                return;
            }
            this.onSelected();
            // console.log('selection:updated', this.app.roomEdit)
        });
        this.view.on('selection:cleared', (e) => {
            if (this.app.roomEdit) {
                return;
            }
            console.log('selection:cleared', this.app.roomEdit);
            this.app.selections = [];
            this.app.ungroupable = false;
        });
        this.view.on('object:moved', () => {
            // console.log('object:moved', this.app.roomEdit)
            if (this.MOVE_WALL_ID !== -1) {
                this.MOVE_WALL_ID = -1;
            }
            this.saveState();
        });
        this.view.on('object:rotated', () => this.saveState());
        this.view.on('mouse:down:before', (e) => {
            const obj = e.target;
            this.selectedObject = obj;
            // console.log(obj)
            if (this.app.roomEdit && obj && obj?.name.indexOf('WALL') > -1 && obj instanceof Line) {
                let { v1, v2, v1Id, v2Id } = cornersOfWall(obj);
                const v0Id = (v1Id === 0) ? this.corners.length - 1 : v1Id - 1;
                const v3Id = (v2Id === this.corners.length - 1) ? 0 : v2Id + 1;
                const v0 = this.corners[v0Id];
                const v3 = this.corners[v3Id];
                this.MOVE_WALL_ID = v1Id;
                if ((v0.top === v1.top && v1.top === v2.top) || (v0.left === v1.left && v1.left === v2.left)) {
                    this.corners.splice(v1Id, 0, this.drawCorner(new Point(v1.left, v1.top)));
                    this.MOVE_WALL_ID = v1Id + 1;
                    v2Id += 1;
                }
                if ((v1.top === v2.top && v2.top === v3.top) || (v1.left === v2.left && v2.left === v3.left)) {
                    this.corners.splice(v2Id + 1, 0, this.drawCorner(new Point(v2.left, v2.top)));
                }
                this.drawRoom();
                this.saveState();
            }
        });
        this.view.on('object:moving', (e) => {
            // console.log('object:moving', this.app.roomEdit)
            if (this.MOVE_WALL_ID !== -1) {
                const p = e['pointer'];
                const v1 = this.corners[this.MOVE_WALL_ID];
                const v2 = this.corners[(this.MOVE_WALL_ID + 1) % this.corners.length];
                const direction = v1.left === v2.left ? 'HORIZONTAL' : 'VERTICAL';
                if (p.y < RL_ROOM_OUTER_SPACING) {
                    p.y = RL_ROOM_OUTER_SPACING;
                }
                if (p.x < RL_ROOM_OUTER_SPACING) {
                    p.x = RL_ROOM_OUTER_SPACING;
                }
                if (direction === 'VERTICAL') {
                    v1.top = v2.top = p.y;
                }
                else {
                    v1.left = v2.left = p.x;
                }
                this.drawRoom();
            }
            const obj = e.target;
            const point = e['pointer'];
            if (obj && this.isDW(obj) && obj instanceof fabric.Group) {
                let wall, distance = 999;
                const dist2 = (v, w) => (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
                const point_to_line = (p, v, w) => Math.sqrt(distToSegmentSquared(p, v, w));
                const distToSegmentSquared = (p, v, w) => {
                    const l2 = dist2(v, w);
                    if (l2 == 0)
                        return dist2(p, v);
                    const t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
                    if (t < 0)
                        return dist2(p, v);
                    if (t > 1)
                        return dist2(p, w);
                    return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
                };
                this.walls.forEach(w => {
                    const d = point_to_line(point, { x: w.x1, y: w.y1 }, { x: w.x2, y: w.y2 });
                    if (d < distance) {
                        distance = d, wall = w;
                    }
                });
                if (distance > 20) {
                    this.REMOVE_DW = true;
                }
                else {
                    this.REMOVE_DW = false;
                    const direction = this.directionOfWall(wall);
                    if (direction === HORIZONTAL) {
                        this.locateDW(obj, wall, point.x, Top(wall));
                    }
                    else {
                        this.locateDW(obj, wall, Left(wall), point.y);
                    }
                }
            }
        });
        this.view.on('mouse:up', (e) => {
            const obj = e.target;
            if (this.REMOVE_DW) {
                this.view.remove(obj);
                this.REMOVE_DW = false;
            }
        });
        this.view.on('mouse:dblclick', (e) => {
            const obj = e.target;
            if (this.app.roomEdit && this.app.roomEditOperate === 'CORNER' && obj && obj.name.indexOf('WALL') > -1 && obj instanceof Line) {
                const p = e['pointer'];
                const { v1, v1Id, v2, v2Id } = cornersOfWall(obj);
                const ind = v1Id < v2Id ? v1Id : v2Id;
                if (v1.left === v2.left) {
                    p.x = v1.left;
                }
                else if (v1.top === v2.top) {
                    p.y = v1.top;
                }
                const newCorner = this.drawCorner(new Point(p.x, p.y));
                if (Math.abs(v1Id - v2Id) != 1) {
                    this.corners.push(newCorner);
                }
                else {
                    this.corners.splice(ind + 1, 0, newCorner);
                }
                this.drawRoom();
                this.saveState();
            }
        });
    }
    /**********************************************************************************************************
     * draw Rooms defined in Model
     * -------------------------------------------------------------------------------------------------------
     */
    setRoom({ width, height }) {
        if (this.walls.length) {
            this.view.remove(...this.walls);
            this.view.renderAll();
        }
        const LT = new Point(RL_ROOM_OUTER_SPACING, RL_ROOM_OUTER_SPACING);
        const RT = new Point(LT.x + width, LT.y);
        const LB = new Point(LT.x, LT.y + height);
        const RB = new Point(RT.x, LB.y);
        this.corners = [LT, RT, RB, LB].map(p => this.drawCorner(p));
        this.drawRoom();
    }
    /**********************************************************************************************************
     * set corner according to current edition status
     * -------------------------------------------------------------------------------------------------------
     */
    setCornerStyle(c) {
        c.moveCursor = this.view.freeDrawingCursor;
        c.hoverCursor = this.view.freeDrawingCursor;
        c.selectable = false;
        c.evented = false;
        c.width = c.height = (RL_ROOM_INNER_SPACING / (this.app.roomEdit ? 1.5 : 2)) * 2;
        c.set('fill', this.app.roomEdit ? RL_CORNER_FILL : RL_ROOM_STROKE);
    }
    /**********************************************************************************************************
     * draw corner
     * -------------------------------------------------------------------------------------------------------
     */
    drawCorner(p) {
        const c = new fabric.Rect({
            left: p.x,
            top: p.y,
            strokeWidth: 0,
            hasControls: false,
            originX: 'center',
            originY: 'center',
            name: 'CORNER'
        });
        this.setCornerStyle(c);
        return c;
    }
    /**********************************************************************************************************
     * draw room
     * -------------------------------------------------------------------------------------------------------
     */
    drawRoom() {
        const exists = this.view.getObjects().filter(obj => obj.name.indexOf('WALL') > -1 || obj.name === 'CORNER');
        this.view.remove(...exists);
        this.view.add(...this.corners);
        const wall = (coords, index) => new Line(coords, {
            stroke: RL_ROOM_STROKE,
            strokeWidth: RL_ROOM_INNER_SPACING,
            name: `WALL:${index}`,
            originX: 'center',
            originY: 'center',
            hoverCursor: this.app.roomEdit ? this.view.moveCursor : this.view.defaultCursor,
            hasControls: false,
            hasBorders: false,
            selectable: this.app.roomEdit,
            evented: this.app.roomEdit,
            cornerStyle: 'rect'
        });
        let LT = new Point(9999, 9999), RB = new Point(0, 0);
        this.walls = this.corners.map((corner, i) => {
            const start = corner;
            const end = (i === this.corners.length - 1) ? this.corners[0] : this.corners[i + 1];
            if (corner.top < LT.x && corner.left < LT.y)
                LT = new Point(corner.left, corner.top);
            if (corner.top > RB.y && corner.left > RB.y)
                RB = new Point(corner.left, corner.top);
            const w = wall([start.left, start.top, end.left, end.top], i);
            return w;
        });
        this.view.add(...this.walls);
        this.walls.forEach(w => w.sendToBack());
        this.ROOM_SIZE = { width: RB.x - LT.x, height: RB.y - LT.y };
    }
    locateDW(dw, wall, x, y) {
        const dWall = this.directionOfWall(wall);
        const dDW = dw.angle % 180 === 0 ? HORIZONTAL : VERTICAL;
        if (dWall != dDW) {
            dw.angle = (dw.angle + 90) % 360;
        }
        dw.top = y, dw.left = x;
        const center = dw.getCenterPoint();
        if (dWall === HORIZONTAL)
            center.y < dw.top ? dw.top += OFFSET : dw.top -= OFFSET;
        else
            center.x < dw.left ? dw.left += OFFSET : dw.left -= OFFSET;
        return dw;
    }
    setDWOrigin(dw) {
        if (!dw.flipX && !dw.flipY)
            dw.originX = 'left', dw.originY = 'top';
        else if (dw.flipX && !dw.flipY)
            dw.originX = 'right', dw.originY = 'top';
        else if (!dw.flipX && dw.flipY)
            dw.originX = 'left', dw.originY = 'bottom';
        else if (dw.flipX && dw.flipY)
            dw.originX = 'right', dw.originY = 'bottom';
        return dw;
    }
    /**********************************************************************************************************/
    editRoom() {
        if (this.userMode) {
            return;
        }
        this.view.getObjects().forEach(r => {
            if (r.name.indexOf('WALL') !== -1) {
                r.selectable = true;
                r.evented = true;
            }
            else {
                r.selectable = false;
                r.evented = false;
            }
        });
        if (this.app.roomEditStates.length === 0)
            this.saveState();
    }
    cancelRoomEdition() {
        this.view.getObjects().forEach(r => {
            if (r.name.indexOf('WALL') !== -1 || r.name.indexOf('CORNER') !== -1) {
                r.selectable = false;
                r.evented = false;
            }
            else {
                r.selectable = true;
                r.evented = true;
            }
        });
    }
    setItemStatus(type, object) {
        // console.log('type', type)
        // console.log('object', object)
        if (object && type) {
            if (type === 'table') {
                if (object.name != '') {
                    const fullName = object.name;
                    const items = object.split(';');
                    //type
                    if (items.length >= 0 && items[0]) {
                    }
                    //id
                    if (items.length >= 1 && items[1]) {
                    }
                    //order
                    if (items.length >= 2 && items[2]) {
                    }
                    //status\
                    if (items.length >= 2 && items[3]) {
                    }
                    if (items.length == 3 && items[3]) {
                        const status = items[3];
                        if (status == '') {
                            object.fill = 'purple';
                            object.stroke = 'white';
                        }
                        if (status == '1') {
                            object.fill = 'green';
                            object.stroke = 'white';
                        }
                        if (status == '2') {
                            object.fill = 'yellow';
                            object.stroke = 'white';
                        }
                        if (status == '3') {
                            object.fill = 'red';
                            object.stroke = 'white';
                        }
                    }
                }
            }
            return object;
        }
    }
    handleObjectInsertion({ type, object }) {
        if (this.userMode) {
            if (type === 'ROOM') {
                this.setRoom(object);
                return;
            }
        }
        if (type === 'ROOM' || type === 'DOOR' || type === 'WINDOW') {
            return;
        }
        object = this.setItemStatus(type, object);
        let group;
        if (type === 'table') {
            const chair = {};
            group = _.createTable(type, object, chair);
        }
        if (type != 'table') {
            group = _.createFurniture(type, object, this.DEFAULT_CHAIR);
        }
        if (type === 'DOOR' || type === 'WINDOW') {
            group.originX = 'center';
            group.originY = 'top';
            const dws = this.filterObjects(['DOOR', 'WINDOW']);
            const dw = dws.length ? dws[dws.length - 1] : null;
            let wall, x, y;
            if (!dw) {
                wall = this.walls[0];
                x = Left(wall) + RL_AISLEGAP;
                y = Top(wall);
            }
            else {
                const od = dw.angle % 180 === 0 ? HORIZONTAL : VERTICAL;
                let placeOnNextWall = false;
                wall = this.wallOfDW(dw);
                if (od === HORIZONTAL) {
                    x = dw.left + dw.width + RL_AISLEGAP;
                    y = Top(wall);
                    if (x + group.width > Right(wall)) {
                        placeOnNextWall = true;
                    }
                }
                else {
                    y = dw.top + dw.width + RL_AISLEGAP;
                    x = Left(wall);
                    if (y + group.width > Bottom(wall)) {
                        placeOnNextWall = true;
                    }
                }
                if (placeOnNextWall) {
                    wall = this.walls[(Number(wall.name.split(':')[1]) + 1) % this.walls.length];
                    const nd = this.directionOfWall(wall);
                    if (nd === HORIZONTAL) {
                        x = Left(wall) + RL_AISLEGAP, y = Top(wall);
                    }
                    else {
                        x = Left(wall), y = Top(wall) + RL_AISLEGAP;
                    }
                }
            }
            this.locateDW(group, wall, x, y);
            group.hasBorders = false;
            this.view.add(group);
            return;
        }
        // retrieve spacing from object, use rlAisleGap if not specified
        const newLR = object.lrSpacing || RL_AISLEGAP;
        const newTB = object.tbSpacing || RL_AISLEGAP;
        // object groups use center as origin, so add half width and height of their reported
        // width and size; note that this will not account for chairs around tables, which is
        // intentional; they go in the specified gaps
        group.left = newLR + (group.width / 2) + this.room_origin;
        group.top = newTB + (group.height / 2) + this.room_origin;
        if (this.lastObject) {
            // retrieve spacing from object, use rlAisleGap if not specified
            const lastLR = this.lastObjectDefinition.lrSpacing || RL_AISLEGAP;
            const lastTB = this.lastObjectDefinition.tbSpacing || RL_AISLEGAP;
            // calculate maximum gap required by last and this object
            // Note: this isn't smart enough to get new row gap right when
            // object above had a much bigger gap, etc. We aren't fitting yet.
            const useLR = Math.max(newLR, lastLR), useTB = Math.max(newTB, lastTB);
            // using left/top vocab, though all objects are now centered
            const lastWidth = this.lastObjectDefinition.width || 100;
            const lastHeight = this.lastObjectDefinition.height || 40;
            let newLeft = this.lastObject.left + lastWidth + useLR;
            let newTop = this.lastObject.top;
            // make sure we fit left to right, including our required right spacing
            if (newLeft + group.width + newLR > this.ROOM_SIZE.width) {
                newLeft = newLR + (group.width / 2);
                newTop += lastHeight + useTB;
            }
            group.left = newLeft;
            group.top = newTop;
            if ((group.left - group.width / 2) < this.room_origin) {
                group.left += this.room_origin;
            }
            if ((group.top - group.height / 2) < this.room_origin) {
                group.top += this.room_origin;
            }
        }
        group.fill = 'blue';
        // console.log('group', group);
        this.view.add(group);
        this.view.setActiveObject(group);
        this.lastObject = group;
        this.lastObjectDefinition = object;
    }
    /** Save current state */
    saveState() {
        const state = this.view.toDatalessJSON(['name', 'hasControls', 'selectable', 'hasBorders', 'evented', 'hoverCursor', 'moveCursor']);
        this.app.saveState.next(JSON.stringify(state));
    }
    undo() {
        let current = null;
        if (this.app.roomEdit) {
            const state = this.app.roomEditStates.pop();
            this.app.roomEditRedoStates.push(state);
            current = this.app.roomEditStates[this.app.roomEditStates.length - 1];
        }
        else {
            const state = this.app.states.pop();
            this.app.redoStates.push(state);
            current = this.app.states[this.app.states.length - 1];
        }
        this.view.clear();
        this.view.loadFromJSON(current, () => {
            this.view.renderAll();
            this.corners = this.view.getObjects().filter(obj => obj.name === 'CORNER');
            this.drawRoom();
        });
    }
    /** Redo operation */
    redo() {
        let current = null;
        if (this.app.roomEdit) {
            current = this.app.roomEditRedoStates.pop();
            this.app.roomEditStates.push(current);
        }
        else {
            current = this.app.redoStates.pop();
            this.app.states.push(current);
        }
        this.view.clear();
        this.view.loadFromJSON(current, () => {
            this.view.renderAll();
            this.corners = this.view.getObjects().filter(obj => obj.name === 'CORNER');
            this.drawRoom();
        });
    }
    /** Copy operation */
    copy() {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!active) {
            return;
        }
        active.clone(cloned => this.app.copied = cloned, ['name', 'hasControls']);
    }
    /** Paste operation */
    paste() {
        if (this.userMode) {
            return;
        }
        if (!this.app.copied || this.app.roomEdit) {
            return;
        }
        this.app.copied.clone((cloned) => {
            this.view.discardActiveObject();
            cloned.set({
                left: cloned.left + RL_AISLEGAP,
                top: cloned.top + RL_AISLEGAP
            });
            if (cloned.type === 'activeSelection') {
                cloned.canvas = this.view;
                cloned.forEachObject(obj => this.view.add(obj));
                cloned.setCoords();
            }
            else {
                this.view.add(cloned);
            }
            this.app.copied.top += RL_AISLEGAP;
            this.app.copied.left += RL_AISLEGAP;
            this.view.setActiveObject(cloned);
            this.view.requestRenderAll();
            this.saveState();
        }, ['name', 'hasControls']);
    }
    clearLayout() {
        this.app.loadJson('');
        // this.view.clear();
        this.initLayout();
    }
    /** Delete operation */
    delete() {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            console.log('no items');
            return;
        }
        if (this.app.selections) {
            this.app.selections.forEach(selection => this.view.remove(selection));
        }
        try {
            this.view.discardActiveObject();
            this.view.requestRenderAll();
        }
        catch (error) {
            console.log('error', error);
        }
        this.saveState();
    }
    /** Rotate Operation */
    rotate(clockwise = true) {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        let angle = this.CTRL_KEY_DOWN ? 90 : 15;
        const obj = this.view.getActiveObject();
        if (!obj) {
            return;
        }
        if ((obj.originX !== 'center' || obj.originY !== 'center') && obj.centeredRotation) {
            obj.originX = 'center';
            obj.originY = 'center';
            obj.left += obj.width / 2;
            obj.top += obj.height / 2;
        }
        if (this.isDW(obj)) {
            angle = obj.angle + (clockwise ? 180 : -180);
        }
        else {
            angle = obj.angle + (clockwise ? angle : -angle);
        }
        if (angle > 360) {
            angle -= 360;
        }
        else if (angle < 0) {
            angle += 360;
        }
        obj.angle = angle;
        this.view.requestRenderAll();
    }
    /** Group */
    group() {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!(this.app.selections.length > 1 && active instanceof fabric.ActiveSelection)) {
            return;
        }
        active.toGroup();
        active.lockScalingX = true, active.lockScalingY = true;
        this.onSelected();
        this.view.renderAll();
        this.saveState();
    }
    ungroup() {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!(active && active instanceof fabric.Group)) {
            return;
        }
        active.toActiveSelection();
        active.lockScalingX = true, active.lockScalingY = true;
        this.onSelected();
        this.view.renderAll();
        this.saveState();
    }
    move(direction, increament = 6) {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!active) {
            return;
        }
        switch (direction) {
            case 'LEFT':
                active.left -= increament;
                break;
            case 'UP':
                active.top -= increament;
                break;
            case 'RIGHT':
                active.left += increament;
                break;
            case 'DOWN':
                active.top += increament;
                break;
        }
        this.view.requestRenderAll();
        this.saveState();
    }
    setZoom() {
        this.view.setZoom(this.app.zoom / 100);
        this.view.renderAll();
    }
    placeInCenter(direction) {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!active) {
            return;
        }
        if (direction === 'HORIZONTAL') {
            active.left = this.ROOM_SIZE.width / 2 - (active.originX === 'center' ? 0 : active.width / 2);
        }
        else {
            active.top = this.ROOM_SIZE.height / 2 - (active.originX === 'center' ? 0 : active.height / 2);
        }
        active.setCoords();
        this.view.requestRenderAll();
        this.saveState();
    }
    arrange(action) {
        const rect = this.getBoundingRect(this.app.selections);
        action = action.toLowerCase();
        this.app.selections.forEach(s => {
            if (action === 'left' || action === 'right' || action === 'center') {
                s.left = rect[action];
            }
            else {
                s.top = rect[action];
            }
        });
        this.view.renderAll();
        this.saveState();
    }
    filterObjects(names) {
        return this.view.getObjects().filter(obj => names.some(n => obj.name.indexOf(n) > -1));
    }
    wallOfDW(dw) {
        const d = dw.angle % 180 === 0 ? HORIZONTAL : VERTICAL;
        return this.walls.find(w => Math.abs(d === HORIZONTAL ? w.top - dw.top : w.left - dw.left) === OFFSET);
    }
    directionOfWall(wall) {
        if (wall.x1 === wall.x2) {
            return VERTICAL;
        }
        else {
            return HORIZONTAL;
        }
    }
    isDW(object) {
        return object.name.indexOf('DOOR') > -1 || object.name.indexOf('WINDOW') > -1;
    }
    getBoundingRect(objects) {
        let top = 9999, left = 9999, right = 0, bottom = 0;
        objects.forEach(obj => {
            if (obj.left < top) {
                top = obj.top;
            }
            if (obj.left < left) {
                left = obj.left;
            }
            if (obj.top > bottom) {
                bottom = obj.top;
            }
            if (obj.left > right) {
                right = obj.left;
            }
        });
        const center = (left + right) / 2;
        const middle = (top + bottom) / 2;
        return { left, top, right, bottom, center, middle };
    }
    saveAs(format) {
        const { right, bottom } = this.getBoundingRect(this.corners);
        const width = this.view.getWidth();
        const height = this.view.getHeight();
        this.view.setWidth(right + RL_ROOM_OUTER_SPACING);
        this.view.setHeight(bottom + RL_ROOM_OUTER_SPACING + 12);
        // this.view.setBackgroundColor('purple', () => { });
        const credit = new fabric.Text(RL_CREDIT_TEXT, {
            ...RL_CREDIT_TEXT_PARAMS,
            left: RL_ROOM_OUTER_SPACING,
            top: bottom + RL_ROOM_OUTER_SPACING - RL_CREDIT_TEXT_PARAMS.fontSize
        });
        this.view.add(credit);
        this.view.discardActiveObject();
        this.view.renderAll();
        const restore = () => {
            this.view.remove(credit);
            this.view.setBackgroundColor('transparent', () => { });
            this.view.setWidth(width);
            this.view.setHeight(height);
            this.view.renderAll();
        };
        if (format === 'PNG') {
            const canvas = document.getElementById('main');
            canvas.toBlob((blob) => {
                saveAs(blob, `room_layout_${formatDate(new Date(), 'yyyy-MM-dd-hh-mm-ss', 'en')}.png`);
                restore();
            });
        }
        else if (format === 'SVG') {
            const svg = this.view.toSVG();
            const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            saveAs(blob, `room_layout_${formatDate(new Date(), 'yyyy-MM-dd-hh-mm-ss', 'en')}.svg`);
            restore();
        }
        else if (format === 'json') {
            const json = this.view.toJSON(['name']);
            this.app.jsonValue.next(json);
        }
    }
    disableSeletion() {
        // if (this.userMode) {
        // this.view.forEachObject(function(o) {
        //   o.selectable = false;
        // });
        // }
        this.view.getObjects().forEach((obj, index) => {
            obj.selectable = false;
        });
        // this.view = new fabric.StaticCanvas(this.view);
        // if (this.userMode) {
        //   this.maincontainerClass = 'main-container-usermode'
        //   this.userMode = true;
        // }
        // if (!this.userMode) {
        //   this.maincontainerClass = 'main-container'
        //   this.userMode = false;
        // }
    }
    loadJSON() {
        this.app.jsonValue.subscribe(data => {
            if (this.userMode) {
                this.maincontainerClass = 'main-container-usermode';
            }
            if (!this.userMode) {
                this.maincontainerClass = 'main-container';
            }
            if (!data || data == null) {
                this.view.loadFromJSON(null, function () {
                    this.view.renderAll();
                });
                return;
            }
            let object;
            if (this.isJsonStructure(data)) {
                object = data;
                const string = JSON.stringify(data);
            }
            else {
                object = JSON.parse(data);
            }
            if (this.userMode) {
                this.view.loadFromJSON(object, function () {
                    this.view.renderAll();
                });
            }
            if (!this.userMode) {
                this.view.loadFromJSON(object, function () {
                    this.view.renderAll();
                });
            }
        });
    }
    isJsonStructure(str) {
        if (typeof str !== 'string')
            return false;
        try {
            const result = JSON.parse(str);
            const type = Object.prototype.toString.call(result);
            return type === '[object Object]'
                || type === '[object Array]';
        }
        catch (err) {
            return false;
        }
    }
    // saveToJSON() {
    //   const canvas: any = document.getElementById('main');
    //   const json = canvas.toJSON(['name'])
    //   return json
    // }
    alterObjectColor(name, color, obj, view) {
        let json;
        if (view) {
            json = view.toJSON(['name']);
            if (json.objects) {
                if (json.objects.length > 0) {
                    json.objects.forEach(data => {
                        console.log('alterObjectColor data?.backgroundColor', data?.backgroundColor);
                        if (data?.name === name) {
                            if (data?.backgroundColor === 'purple' || data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                                data.backgroundColor = color;
                                data.borderColor = color;
                                data.stroke = color;
                                data.strokeWidth = 10;
                                // console.log('item color changed 1', data?.backgroundColor)
                            }
                            if (data?.backgroundColor === 'purple' || data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                                data.backgroundColor = color;
                                data.borderColor = color;
                                data.stroke = color;
                                data.strokeWidth = 10;
                                // console.log('item color changed 1', data?.backgroundColor)
                            }
                            this.alterColor('red', data);
                        }
                    });
                }
            }
        }
        if (view && json) {
            console.log('loading json');
        }
        return json;
    }
    setObjectColor(name, color, obj, view) {
        let json;
        if (view) {
            // json = view.toJSON(['name']);
            this.alterColor(color, obj);
            if (obj.objects) {
                if (obj.objects.length > 0) {
                    obj.objects.forEach(data => {
                        console.log('alterObjectColor data?.backgroundColor', data?.backgroundColor);
                        if (data?.name === name) {
                            if (data?.backgroundColor === 'purple' || data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                                data.backgroundColor = color;
                                data.borderColor = color;
                                data.stroke = color;
                                data.strokeWidth = 10;
                                // console.log('item color changed 1', data?.backgroundColor)
                            }
                            if (data?.backgroundColor === 'purple' || data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                                data.backgroundColor = color;
                                data.borderColor = color;
                                data.stroke = color;
                                data.strokeWidth = 10;
                                // console.log('item color changed 1', data?.backgroundColor)
                            }
                            this.alterColor('red', data);
                        }
                    });
                }
            }
        }
        if (view && obj) {
            console.log('loading json');
        }
        return obj;
    }
    alterColor(color, obj) {
        // console.log('obj', obj, obj.length)
        // if (obj?.backgroundColor === 'purple' || obj?.backgroundColor === 'rgba(255,100,171,0.25)') {
        // obj.backgroundColor = color;
        obj.borderColor = color;
        obj.stroke = color;
        obj.strokeWidth = 3;
        // console.log('item color changed 2', obj.backgroundColor)
        // }
        if (obj.objects && obj.objects.length > 0) {
            obj.objects.forEach(item => {
                this.alterColor(color, item);
            });
        }
        return obj;
    }
}
ViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: ViewComponent, deps: [{ token: i1.AppService }], target: i0.ɵɵFactoryTarget.Component });
ViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.4", type: ViewComponent, selector: "pointless-room-layout-view", inputs: { userMode: "userMode" }, outputs: { outPutTable: "outPutTable" }, host: { listeners: { "document:keydown": "onKeyDown($event)", "document:keyup": "onKeyUp($event)" } }, ngImport: i0, template: "<div [class]=\"maincontainerClass\"  >\r\n  <canvas  id=\"main\"></canvas>\r\n</div>\r\n", styles: [".main-container{padding:24px;overflow:auto;height:calc(100% - 199px)}.main-container-usermode{padding:15px;overflow:auto;height:calc(100% - 100px)}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: ViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pointless-room-layout-view', host: {
                        '(document:keydown)': 'onKeyDown($event)',
                        '(document:keyup)': 'onKeyUp($event)'
                    }, template: "<div [class]=\"maincontainerClass\"  >\r\n  <canvas  id=\"main\"></canvas>\r\n</div>\r\n", styles: [".main-container{padding:24px;overflow:auto;height:calc(100% - 199px)}.main-container-usermode{padding:15px;overflow:auto;height:calc(100% - 100px)}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.AppService }]; }, propDecorators: { userMode: [{
                type: Input
            }], outPutTable: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvdmlldy92aWV3LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy92aWV3L3ZpZXcuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBeUIsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDaEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVwQyxPQUFPLEtBQUssQ0FBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBQ25DLDJDQUEyQztBQUMzQyw2RUFBNkU7QUFFN0UsTUFBTSxFQUNKLGFBQWEsRUFDYixjQUFjLEVBQ2QsT0FBTyxFQUNQLFdBQVcsRUFDWCxxQkFBcUIsRUFDckIscUJBQXFCLEVBQ3JCLGNBQWMsRUFDZCxjQUFjLEVBQ2QsZUFBZSxFQUNmLGNBQWMsRUFDZCxxQkFBcUIsRUFDdEIsR0FBRyxDQUFDLENBQUM7QUFFTixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQztBQUMvQixNQUNFLFVBQVUsR0FBRyxZQUFZLEVBQ3pCLFFBQVEsR0FBRyxVQUFVLEVBQ3JCLE1BQU0sR0FBRyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFFckMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVB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R0FNUSxRQUFRO3NCQUFoQixLQUFLO2dCQUNJLFdBQVc7c0JBQXBCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGZvcm1hdERhdGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBmYWJyaWMgfSBmcm9tICdmYWJyaWMnO1xyXG5pbXBvcnQgeyBzYXZlQXMgfSBmcm9tICdmaWxlLXNhdmVyJztcclxuaW1wb3J0IHsgQXBwU2VydmljZSB9IGZyb20gJy4uLy4uL2FwcC5zZXJ2aWNlJztcclxuaW1wb3J0ICogYXMgXyBmcm9tICcuLi8uLi9oZWxwZXJzJztcclxuLy8gaW1wb3J0IHsganNvbiB9IGZyb20gJ3N0cmVhbS9jb25zdW1lcnMnO1xyXG4vLyBpbXBvcnQgeyBWaWV3SlNPTlNlcnZpY2VTZXJ2aWNlIH0gZnJvbSAnc3JjL2FwcC92aWV3LWpzb25zZXJ2aWNlLnNlcnZpY2UnO1xyXG5cclxuY29uc3Qge1xyXG4gIFJMX1ZJRVdfV0lEVEgsXHJcbiAgUkxfVklFV19IRUlHSFQsXHJcbiAgUkxfRk9PVCxcclxuICBSTF9BSVNMRUdBUCxcclxuICBSTF9ST09NX09VVEVSX1NQQUNJTkcsXHJcbiAgUkxfUk9PTV9JTk5FUl9TUEFDSU5HLFxyXG4gIFJMX1JPT01fU1RST0tFLFxyXG4gIFJMX0NPUk5FUl9GSUxMLFxyXG4gIFJMX1VOR1JPVVBBQkxFUyxcclxuICBSTF9DUkVESVRfVEVYVCxcclxuICBSTF9DUkVESVRfVEVYVF9QQVJBTVNcclxufSA9IF87XHJcblxyXG5jb25zdCB7IExpbmUsIFBvaW50IH0gPSBmYWJyaWM7XHJcbmNvbnN0XHJcbiAgSE9SSVpPTlRBTCA9ICdIT1JJWk9OVEFMJyxcclxuICBWRVJUSUNBTCA9ICdWRVJUSUNBTCcsXHJcbiAgT0ZGU0VUID0gUkxfUk9PTV9JTk5FUl9TUEFDSU5HIC8gMjtcclxuXHJcbmNvbnN0IExlZnQgPSAod2FsbCkgPT4gd2FsbC54MSA8IHdhbGwueDIgPyB3YWxsLngxIDogd2FsbC54MjtcclxuY29uc3QgVG9wID0gKHdhbGwpID0+IHdhbGwueTEgPCB3YWxsLnkyID8gd2FsbC55MSA6IHdhbGwueTI7XHJcbmNvbnN0IFJpZ2h0ID0gKHdhbGwpID0+IHdhbGwueDEgPiB3YWxsLngyID8gd2FsbC54MSA6IHdhbGwueDI7XHJcbmNvbnN0IEJvdHRvbSA9ICh3YWxsKSA9PiB3YWxsLnkxID4gd2FsbC55MiA/IHdhbGwueTEgOiB3YWxsLnkyO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdwb2ludGxlc3Mtcm9vbS1sYXlvdXQtdmlldycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpZXcuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3ZpZXcuY29tcG9uZW50LnNjc3MnXSxcclxuICBob3N0OiB7XHJcbiAgICAnKGRvY3VtZW50OmtleWRvd24pJzogJ29uS2V5RG93bigkZXZlbnQpJyxcclxuICAgICcoZG9jdW1lbnQ6a2V5dXApJzogJ29uS2V5VXAoJGV2ZW50KSdcclxuICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcclxuXHJcbiAgc2VsZWN0ZWRPYmplY3Q6IGFueTtcclxuXHJcbiAgQElucHV0KCkgdXNlck1vZGU6IGJvb2xlYW47XHJcbiAgQE91dHB1dCgpIG91dFB1dFRhYmxlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB2aWV3OiBmYWJyaWMuQ2FudmFzO1xyXG4gIHJvb206IGZhYnJpYy5Hcm91cDtcclxuICByb29tTGF5ZXI6IGZhYnJpYy5Hcm91cCB8IGZhYnJpYy5SZWN0O1xyXG4gIGNvcm5lcnMgPSBbXTtcclxuICB3YWxsczogZmFicmljLkxpbmVbXSA9IFtdO1xyXG4gIGxhc3RPYmplY3REZWZpbml0aW9uID0gbnVsbDtcclxuICBsYXN0T2JqZWN0ID0gbnVsbDtcclxuXHJcbiAgQ1RSTF9LRVlfRE9XTiA9IGZhbHNlO1xyXG4gIE1PVkVfV0FMTF9JRCA9IC0xO1xyXG4gIFJPT01fU0laRSA9IHsgd2lkdGg6IDk2MCwgaGVpZ2h0OiA0ODAgfTtcclxuICBERUZBVUxUX0NIQUlSID0gbnVsbDtcclxuICBSRU1PVkVfRFcgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICAvLyBwdWJsaWMgdmlld0pTT05TZXJ2aWNlU2VydmljZTogVmlld0pTT05TZXJ2aWNlU2VydmljZSxcclxuICAgIHB1YmxpYyBhcHA6IEFwcFNlcnZpY2UpIHsgfVxyXG5cclxuICBtYWluY29udGFpbmVyQ2xhc3MgPSAnbWFpbi1jb250YWluZXInXHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG5cclxuICAgIHRoaXMubG9hZEpTT04oKTtcclxuXHJcbiAgICB0aGlzLmFwcC5zZXRTZWxlY3RlZE9iamVjdENvbG9yLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICB0aGlzLnNldFNlbGVjdGVkT2JqZWN0Q29sb3IoZGF0YSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLmFwcC5yb29tRWRpdGlvbi5zdWJzY3JpYmUoZG9FZGl0ID0+IHtcclxuICAgICAgdGhpcy5jb3JuZXJzLmZvckVhY2goYyA9PiB0aGlzLnNldENvcm5lclN0eWxlKGMpKTtcclxuICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICBpZiAoZG9FZGl0KSB7IHRoaXMuZWRpdFJvb20oKTsgfSBlbHNlIHsgdGhpcy5jYW5jZWxSb29tRWRpdGlvbigpOyB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFwcC5pbnNlcnRPYmplY3Quc3Vic2NyaWJlKHJlcyA9PiB7XHJcbiAgICAgIHRoaXMuaGFuZGxlT2JqZWN0SW5zZXJ0aW9uKHJlcyk7XHJcbiAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFwcC5kZWZhdWx0Q2hhaXIuc3Vic2NyaWJlKHJlcyA9PiB0aGlzLkRFRkFVTFRfQ0hBSVIgPSByZXMpO1xyXG5cclxuICAgIHRoaXMuYXBwLnNldFNlbGVjdGVkT2JqZWN0Q29sb3Iuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRPYmplY3RDb2xvcihkYXRhKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMuYXBwLnBlcmZvcm1PcGVyYXRpb24uc3Vic2NyaWJlKG9wZXJhdGlvbiA9PiB7XHJcbiAgICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XHJcblxyXG4gICAgICAgIGNhc2UgJ1VORE8nOlxyXG4gICAgICAgICAgdGhpcy51bmRvKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnUkVETyc6XHJcbiAgICAgICAgICB0aGlzLnJlZG8oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdDT1BZJzpcclxuICAgICAgICAgIHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ1BBU1RFJzpcclxuICAgICAgICAgIHRoaXMucGFzdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdERUxFVEUnOlxyXG4gICAgICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdST1RBVEUnOlxyXG4gICAgICAgICAgdGhpcy5yb3RhdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdST1RBVEVfQU5USSc6XHJcbiAgICAgICAgICB0aGlzLnJvdGF0ZShmYWxzZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnc2V0T3JkZXJJRCc6XHJcbiAgICAgICAgICB0aGlzLnNldE9iamVjdE9yZGVySUQodGhpcy5hcHAub3JkZXJJRCk7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2NsZWFyTGF5b3V0JzpcclxuICAgICAgICAgIHRoaXMuY2xlYXJMYXlvdXQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0dST1VQJzpcclxuICAgICAgICAgIHRoaXMuZ3JvdXAoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdVTkdST1VQJzpcclxuICAgICAgICAgIHRoaXMudW5ncm91cCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ0hPUklaT05UQUwnOlxyXG4gICAgICAgIGNhc2UgJ1ZFUlRJQ0FMJzpcclxuICAgICAgICAgIHRoaXMucGxhY2VJbkNlbnRlcihvcGVyYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ1JPT01fT1BFUkFUSU9OJzpcclxuICAgICAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdQTkcnOlxyXG4gICAgICAgIGNhc2UgJ1NWRyc6XHJcbiAgICAgICAgICB0aGlzLnNhdmVBcyhvcGVyYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbG9hZGpzb24nOlxyXG4gICAgICAgICAgdGhpcy5sb2FkSlNPTigpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnanNvbic6XHJcbiAgICAgICAgICB0aGlzLnNhdmVBcyhvcGVyYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnWk9PTSc6XHJcbiAgICAgICAgICB0aGlzLnNldFpvb20oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdkaXNhYmxlU2VsZXRpb24nOlxyXG4gICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZXRpb24oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0xFRlQnOlxyXG4gICAgICAgIGNhc2UgJ0NFTlRFUic6XHJcbiAgICAgICAgY2FzZSAnUklHSFQnOlxyXG4gICAgICAgIGNhc2UgJ1RPUCc6XHJcbiAgICAgICAgY2FzZSAnTUlERExFJzpcclxuICAgICAgICBjYXNlICdCT1RUT00nOlxyXG4gICAgICAgICAgdGhpcy5hcnJhbmdlKG9wZXJhdGlvbik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICAvKiogSW5pdGlhbGl6ZSBjYW52YXMgKi9cclxuICAgIHRoaXMuaW5pdExheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgaW5pdExheW91dCgpIHtcclxuICAgIHRoaXMuc2V0Q2FudmFzVmlldygpO1xyXG4gICAgLyoqIEFkZCByb29tICovXHJcbiAgICB0aGlzLnNldFJvb20odGhpcy5ST09NX1NJWkUpO1xyXG4gICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIGdldCByb29tX29yaWdpbigpIHtcclxuICAgIHJldHVybiBSTF9ST09NX09VVEVSX1NQQUNJTkcgKyBSTF9ST09NX0lOTkVSX1NQQUNJTkc7XHJcbiAgfVxyXG5cclxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIGNvbnN0IGNvZGUgPSBldmVudC5rZXkgfHwgZXZlbnQua2V5Q29kZTtcclxuICAgIC8vIEN0cmwgS2V5IGlzIGRvd25cclxuICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgIHRoaXMuQ1RSTF9LRVlfRE9XTiA9IHRydWU7XHJcbiAgICAgIC8vIEN0cmwgKyBTaGlmdCArIFpcclxuICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIGNvZGUgPT09IDkwKVxyXG4gICAgICAgIHRoaXMuYXBwLnJlZG8oKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gOTApXHJcbiAgICAgICAgdGhpcy5hcHAudW5kbygpO1xyXG4gICAgICBlbHNlIGlmIChjb2RlID09PSA2NylcclxuICAgICAgICB0aGlzLmFwcC5jb3B5KCk7XHJcbiAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDg2KVxyXG4gICAgICAgIHRoaXMucGFzdGUoKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMzcpXHJcbiAgICAgICAgdGhpcy5yb3RhdGUoKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMzkpXHJcbiAgICAgICAgdGhpcy5yb3RhdGUoZmFsc2UpO1xyXG4gICAgICBlbHNlIGlmIChjb2RlID09PSA3MSlcclxuICAgICAgICB0aGlzLmdyb3VwKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjb2RlID09PSA0NilcclxuICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDM3KVxyXG4gICAgICB0aGlzLm1vdmUoJ0xFRlQnKTtcclxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDM4KVxyXG4gICAgICB0aGlzLm1vdmUoJ1VQJyk7XHJcbiAgICBlbHNlIGlmIChjb2RlID09PSAzOSlcclxuICAgICAgdGhpcy5tb3ZlKCdSSUdIVCcpO1xyXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gNDApXHJcbiAgICAgIHRoaXMubW92ZSgnRE9XTicpO1xyXG4gIH1cclxuXHJcbiAgb25LZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0NvbnRyb2wnKSB7XHJcbiAgICAgIHRoaXMuQ1RSTF9LRVlfRE9XTiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25TY3JvbGwoZXZlbnQpIHsgfVxyXG5cclxuICBzZXRHcm91cGFibGVTdGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLmFwcC5zZWxlY3Rpb25zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgdGhpcy5hcHAudW5ncm91cGFibGUgPSBmYWxzZTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG9iaiA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuICAgIGNvbnN0IHR5cGUgPSBvYmoubmFtZSA/IG9iai5uYW1lLnNwbGl0KCc6JylbMF0gOiAnJztcclxuXHJcbiAgICBpZiAoUkxfVU5HUk9VUEFCTEVTLmluZGV4T2YodHlwZSkgPiAtMSkge1xyXG4gICAgICB0aGlzLmFwcC51bmdyb3VwYWJsZSA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hcHAudW5ncm91cGFibGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0T2JqZWN0U2V0dGluZ3Mob2JqZWN0ICwga2V5LCAgY29sb3IpIHtcclxuICAgIGZhYnJpYy5Hcm91cC5wcm90b3R5cGUuc2VsZWN0aW9uQmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknO1xyXG4gICAgZmFicmljLkdyb3VwLnByb3RvdHlwZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgyNTUsMTAwLDE3MSwwLjI1KSdcclxuICAgIGZhYnJpYy5Hcm91cC5wcm90b3R5cGUuZmlsbCA9ICdyZ2JhKDI1NSwxMDAsMTcxLDAuMjUpJztcclxuICAgIGZhYnJpYy5Hcm91cC5wcm90b3R5cGUuc3Ryb2tlV2lkdGggPSAzXHJcbiAgfVxyXG5cclxuICBvblNlbGVjdGVkKCkge1xyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgLy8gdGhpcy5zZXRPYmplY3RTZXR0aW5ncyhhY3RpdmUsICdmaWxsJywgJ3JlZCcpXHJcbiAgICAvLyAvLyBhY3RpdmUuX3JlbmRlckZpbGwoJ3B1cnBsZScsICgpID0+IHsgfSk7XHJcbiAgICAvLyByZXR1cm47XHJcblxyXG4gICAgYWN0aXZlLmxvY2tTY2FsaW5nWCA9IHRydWUsIGFjdGl2ZS5sb2NrU2NhbGluZ1kgPSB0cnVlO1xyXG4gICAgaWYgKCFhY3RpdmUubmFtZSkge1xyXG4gICAgICBhY3RpdmUubmFtZSA9ICdHUk9VUCc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcHAuc2VsZWN0aW9ucyA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3RzKCk7XHJcbiAgICB0aGlzLnNldEdyb3VwYWJsZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgc2V0U2VsZWN0ZWRPYmplY3RDb2xvcihjb2xvcjogc3RyaW5nKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnaXRlbS4nLCBjb2xvcilcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcbiAgICBpZiAoIWl0ZW0pIHsgcmV0dXJuIH1cclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnaXRlbS4nLCBpdGVtLm5hbWUpXHJcbiAgICBpZiAoaXRlbS5uYW1lKSB7XHJcbiAgICAgIC8vIGNvbnN0IGpzb24gPSAgdGhpcy52aWV3SlNPTlNlcnZpY2VTZXJ2aWNlLmFsdGVyT2JqZWN0Q29sb3IoaXRlbS5uYW1lLCBjb2xvciwgaXRlbSwgdGhpcy52aWV3KVxyXG4gICAgICAvLyBjb25zdCBuZXdJdGVtID0gYCR7dWlkfTske29yZGVySUR9OyR7bmFtZX1gO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnTmV3IEl0ZW0nLCBuZXdJdGVtKVxyXG4gICAgICAvLyB0aGlzLnNlbGVjdGVkT2JqZWN0Lm5hbWUgPSBuZXdJdGVtO1xyXG5cclxuICAgICAgY29uc3QganNvbiA9IHRoaXMuYWx0ZXJPYmplY3RDb2xvcihpdGVtLm5hbWUsIGNvbG9yLCBpdGVtLCB0aGlzLnZpZXcpO1xyXG5cclxuICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2coanNvbilcclxuICAgICAgLy8gbGV0IG9iamVjdFxyXG4gICAgICAvLyBpZiAodGhpcy5pc0pzb25TdHJ1Y3R1cmUoanNvbikpIHtcclxuICAgICAgLy8gICBvYmplY3QgPSBqc29uXHJcbiAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgIC8vICAgb2JqZWN0ID0gSlNPTi5wYXJzZShqc29uKVxyXG4gICAgICAvLyB9XHJcblxyXG4gICAgICB0aGlzLnZpZXcubG9hZEZyb21KU09OKGpzb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgc2V0T2JqZWN0T3JkZXJJRChvcmRlcklEOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkT2JqZWN0KSB7XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnNlbGVjdGVkT2JqZWN0Py5uYW1lO1xyXG4gICAgICBjb25zdCB1aWQgPSBpdGVtLnNwbGl0KCc7JylbMF07XHJcbiAgICAgIGNvbnN0IG9yZGVyID0gaXRlbS5zcGxpdCgnOycpWzFdO1xyXG4gICAgICBjb25zdCBuYW1lID0gaXRlbS5zcGxpdCgnOycpWzJdO1xyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2coJ3NldE9iamVjdE9yZGVySUQnLCBvcmRlcilcclxuXHJcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSBgJHt1aWR9OyR7b3JkZXJJRH07JHtuYW1lfWA7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdOZXcgSXRlbScsIG5ld0l0ZW0pXHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3QubmFtZSA9IG5ld0l0ZW07XHJcbiAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogaW5pdCB0aGUgY2FudmFzIHZpZXcgJiBiaW5kIGV2ZW50c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuICBzZXRDYW52YXNWaWV3KCkge1xyXG4gICAgY29uc3QgY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoJ21haW4nKTtcclxuICAgIGNhbnZhcy5zZXRXaWR0aChSTF9WSUVXX1dJRFRIICogUkxfRk9PVCk7XHJcbiAgICBjYW52YXMuc2V0SGVpZ2h0KFJMX1ZJRVdfSEVJR0hUICogUkxfRk9PVCk7XHJcbiAgICB0aGlzLnZpZXcgPSBjYW52YXM7XHJcblxyXG4gICAgY29uc3QgY29ybmVyc09mV2FsbCA9IChvYmo6IGZhYnJpYy5MaW5lKSA9PiB7XHJcbiAgICAgIGNvbnN0IGlkID0gTnVtYmVyKG9iai5uYW1lLnNwbGl0KCc6JylbMV0pO1xyXG4gICAgICBjb25zdCB2MUlkID0gaWQ7XHJcbiAgICAgIGNvbnN0IHYxID0gdGhpcy5jb3JuZXJzW3YxSWRdO1xyXG4gICAgICBjb25zdCB2MklkID0gKGlkICsgMSkgJSB0aGlzLndhbGxzLmxlbmd0aDtcclxuICAgICAgY29uc3QgdjIgPSB0aGlzLmNvcm5lcnNbdjJJZF07XHJcbiAgICAgIHJldHVybiB7IHYxLCB2MUlkLCB2MiwgdjJJZCB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ3NlbGVjdGlvbjpjcmVhdGVkJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMub25TZWxlY3RlZCgpO1xyXG4gICAgICBjb25zb2xlLmxvZygnc2VsZWN0aW9uOmNyZWF0ZWQnLCB0aGlzLmFwcC5yb29tRWRpdClcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignc2VsZWN0aW9uOnVwZGF0ZWQnLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5vblNlbGVjdGVkKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzZWxlY3Rpb246dXBkYXRlZCcsIHRoaXMuYXBwLnJvb21FZGl0KVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignc2VsZWN0aW9uOmNsZWFyZWQnLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGlvbjpjbGVhcmVkJywgdGhpcy5hcHAucm9vbUVkaXQpXHJcblxyXG4gICAgICB0aGlzLmFwcC5zZWxlY3Rpb25zID0gW107XHJcbiAgICAgIHRoaXMuYXBwLnVuZ3JvdXBhYmxlID0gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ29iamVjdDptb3ZlZCcsICgpID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ29iamVjdDptb3ZlZCcsIHRoaXMuYXBwLnJvb21FZGl0KVxyXG4gICAgICBpZiAodGhpcy5NT1ZFX1dBTExfSUQgIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5NT1ZFX1dBTExfSUQgPSAtMTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy52aWV3Lm9uKCdvYmplY3Q6cm90YXRlZCcsICgpID0+IHRoaXMuc2F2ZVN0YXRlKCkpO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignbW91c2U6ZG93bjpiZWZvcmUnLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBjb25zdCBvYmogPSBlLnRhcmdldDtcclxuICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdCA9IG9iajtcclxuICAgICAgLy8gY29uc29sZS5sb2cob2JqKVxyXG4gICAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQgJiYgb2JqICYmIG9iaj8ubmFtZS5pbmRleE9mKCdXQUxMJykgPiAtMSAmJiBvYmogaW5zdGFuY2VvZiBMaW5lKSB7XHJcbiAgICAgICAgbGV0IHsgdjEsIHYyLCB2MUlkLCB2MklkIH0gPSBjb3JuZXJzT2ZXYWxsKG9iaik7XHJcbiAgICAgICAgY29uc3QgdjBJZCA9ICh2MUlkID09PSAwKSA/IHRoaXMuY29ybmVycy5sZW5ndGggLSAxIDogdjFJZCAtIDE7XHJcbiAgICAgICAgY29uc3QgdjNJZCA9ICh2MklkID09PSB0aGlzLmNvcm5lcnMubGVuZ3RoIC0gMSkgPyAwIDogdjJJZCArIDE7XHJcbiAgICAgICAgY29uc3QgdjAgPSB0aGlzLmNvcm5lcnNbdjBJZF07XHJcbiAgICAgICAgY29uc3QgdjMgPSB0aGlzLmNvcm5lcnNbdjNJZF07XHJcblxyXG4gICAgICAgIHRoaXMuTU9WRV9XQUxMX0lEID0gdjFJZDtcclxuXHJcbiAgICAgICAgaWYgKCh2MC50b3AgPT09IHYxLnRvcCAmJiB2MS50b3AgPT09IHYyLnRvcCkgfHwgKHYwLmxlZnQgPT09IHYxLmxlZnQgJiYgdjEubGVmdCA9PT0gdjIubGVmdCkpIHtcclxuICAgICAgICAgIHRoaXMuY29ybmVycy5zcGxpY2UodjFJZCwgMCwgdGhpcy5kcmF3Q29ybmVyKG5ldyBQb2ludCh2MS5sZWZ0LCB2MS50b3ApKSk7XHJcbiAgICAgICAgICB0aGlzLk1PVkVfV0FMTF9JRCA9IHYxSWQgKyAxO1xyXG4gICAgICAgICAgdjJJZCArPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCh2MS50b3AgPT09IHYyLnRvcCAmJiB2Mi50b3AgPT09IHYzLnRvcCkgfHwgKHYxLmxlZnQgPT09IHYyLmxlZnQgJiYgdjIubGVmdCA9PT0gdjMubGVmdCkpIHtcclxuICAgICAgICAgIHRoaXMuY29ybmVycy5zcGxpY2UodjJJZCArIDEsIDAsIHRoaXMuZHJhd0Nvcm5lcihuZXcgUG9pbnQodjIubGVmdCwgdjIudG9wKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignb2JqZWN0Om1vdmluZycsIChlOiBmYWJyaWMuSUV2ZW50KSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdvYmplY3Q6bW92aW5nJywgdGhpcy5hcHAucm9vbUVkaXQpXHJcbiAgICAgIGlmICh0aGlzLk1PVkVfV0FMTF9JRCAhPT0gLTEpIHtcclxuICAgICAgICBjb25zdCBwID0gZVsncG9pbnRlciddO1xyXG4gICAgICAgIGNvbnN0IHYxID0gdGhpcy5jb3JuZXJzW3RoaXMuTU9WRV9XQUxMX0lEXTtcclxuICAgICAgICBjb25zdCB2MiA9IHRoaXMuY29ybmVyc1sodGhpcy5NT1ZFX1dBTExfSUQgKyAxKSAlIHRoaXMuY29ybmVycy5sZW5ndGhdO1xyXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHYxLmxlZnQgPT09IHYyLmxlZnQgPyAnSE9SSVpPTlRBTCcgOiAnVkVSVElDQUwnO1xyXG5cclxuICAgICAgICBpZiAocC55IDwgUkxfUk9PTV9PVVRFUl9TUEFDSU5HKSB7IHAueSA9IFJMX1JPT01fT1VURVJfU1BBQ0lORzsgfVxyXG4gICAgICAgIGlmIChwLnggPCBSTF9ST09NX09VVEVSX1NQQUNJTkcpIHsgcC54ID0gUkxfUk9PTV9PVVRFUl9TUEFDSU5HOyB9XHJcblxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdWRVJUSUNBTCcpIHtcclxuICAgICAgICAgIHYxLnRvcCA9IHYyLnRvcCA9IHAueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdjEubGVmdCA9IHYyLmxlZnQgPSBwLng7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG9iaiA9IGUudGFyZ2V0O1xyXG4gICAgICBjb25zdCBwb2ludCA9IGVbJ3BvaW50ZXInXTtcclxuXHJcbiAgICAgIGlmIChvYmogJiYgdGhpcy5pc0RXKG9iaikgJiYgb2JqIGluc3RhbmNlb2YgZmFicmljLkdyb3VwKSB7XHJcbiAgICAgICAgbGV0IHdhbGwsIGRpc3RhbmNlID0gOTk5O1xyXG4gICAgICAgIGNvbnN0IGRpc3QyID0gKHYsIHcpID0+ICh2LnggLSB3LngpICogKHYueCAtIHcueCkgKyAodi55IC0gdy55KSAqICh2LnkgLSB3LnkpO1xyXG4gICAgICAgIGNvbnN0IHBvaW50X3RvX2xpbmUgPSAocCwgdiwgdykgPT4gTWF0aC5zcXJ0KGRpc3RUb1NlZ21lbnRTcXVhcmVkKHAsIHYsIHcpKTtcclxuICAgICAgICBjb25zdCBkaXN0VG9TZWdtZW50U3F1YXJlZCA9IChwLCB2LCB3KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBsMiA9IGRpc3QyKHYsIHcpO1xyXG5cclxuICAgICAgICAgIGlmIChsMiA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gZGlzdDIocCwgdik7XHJcblxyXG4gICAgICAgICAgY29uc3QgdCA9ICgocC54IC0gdi54KSAqICh3LnggLSB2LngpICsgKHAueSAtIHYueSkgKiAody55IC0gdi55KSkgLyBsMjtcclxuXHJcbiAgICAgICAgICBpZiAodCA8IDApXHJcbiAgICAgICAgICAgIHJldHVybiBkaXN0MihwLCB2KTtcclxuXHJcbiAgICAgICAgICBpZiAodCA+IDEpXHJcbiAgICAgICAgICAgIHJldHVybiBkaXN0MihwLCB3KTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gZGlzdDIocCwgeyB4OiB2LnggKyB0ICogKHcueCAtIHYueCksIHk6IHYueSArIHQgKiAody55IC0gdi55KSB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLndhbGxzLmZvckVhY2godyA9PiB7XHJcbiAgICAgICAgICBjb25zdCBkID0gcG9pbnRfdG9fbGluZShwb2ludCwgeyB4OiB3LngxLCB5OiB3LnkxIH0sIHsgeDogdy54MiwgeTogdy55MiB9KTtcclxuICAgICAgICAgIGlmIChkIDwgZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgZGlzdGFuY2UgPSBkLCB3YWxsID0gdztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGRpc3RhbmNlID4gMjApIHtcclxuICAgICAgICAgIHRoaXMuUkVNT1ZFX0RXID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5SRU1PVkVfRFcgPSBmYWxzZTtcclxuICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uT2ZXYWxsKHdhbGwpO1xyXG5cclxuICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IEhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2NhdGVEVyhvYmosIHdhbGwsIHBvaW50LngsIFRvcCh3YWxsKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvY2F0ZURXKG9iaiwgd2FsbCwgTGVmdCh3YWxsKSwgcG9pbnQueSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ21vdXNlOnVwJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgY29uc3Qgb2JqID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICBpZiAodGhpcy5SRU1PVkVfRFcpIHtcclxuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlKG9iaik7XHJcbiAgICAgICAgdGhpcy5SRU1PVkVfRFcgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignbW91c2U6ZGJsY2xpY2snLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBjb25zdCBvYmogPSBlLnRhcmdldDtcclxuXHJcbiAgICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCAmJiB0aGlzLmFwcC5yb29tRWRpdE9wZXJhdGUgPT09ICdDT1JORVInICYmIG9iaiAmJiBvYmoubmFtZS5pbmRleE9mKCdXQUxMJykgPiAtMSAmJiBvYmogaW5zdGFuY2VvZiBMaW5lKSB7XHJcbiAgICAgICAgY29uc3QgcCA9IGVbJ3BvaW50ZXInXTtcclxuICAgICAgICBjb25zdCB7IHYxLCB2MUlkLCB2MiwgdjJJZCB9ID0gY29ybmVyc09mV2FsbChvYmopO1xyXG4gICAgICAgIGNvbnN0IGluZCA9IHYxSWQgPCB2MklkID8gdjFJZCA6IHYySWQ7XHJcblxyXG4gICAgICAgIGlmICh2MS5sZWZ0ID09PSB2Mi5sZWZ0KSB7XHJcbiAgICAgICAgICBwLnggPSB2MS5sZWZ0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodjEudG9wID09PSB2Mi50b3ApIHtcclxuICAgICAgICAgIHAueSA9IHYxLnRvcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0Nvcm5lciA9IHRoaXMuZHJhd0Nvcm5lcihuZXcgUG9pbnQocC54LCBwLnkpKTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHYxSWQgLSB2MklkKSAhPSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmNvcm5lcnMucHVzaChuZXdDb3JuZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNvcm5lcnMuc3BsaWNlKGluZCArIDEsIDAsIG5ld0Nvcm5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAqIGRyYXcgUm9vbXMgZGVmaW5lZCBpbiBNb2RlbFxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuICBzZXRSb29tKHsgd2lkdGgsIGhlaWdodCB9KSB7XHJcbiAgICBpZiAodGhpcy53YWxscy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy52aWV3LnJlbW92ZSguLi50aGlzLndhbGxzKTtcclxuICAgICAgdGhpcy52aWV3LnJlbmRlckFsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IExUID0gbmV3IFBvaW50KFJMX1JPT01fT1VURVJfU1BBQ0lORywgUkxfUk9PTV9PVVRFUl9TUEFDSU5HKTtcclxuICAgIGNvbnN0IFJUID0gbmV3IFBvaW50KExULnggKyB3aWR0aCwgTFQueSk7XHJcbiAgICBjb25zdCBMQiA9IG5ldyBQb2ludChMVC54LCBMVC55ICsgaGVpZ2h0KTtcclxuICAgIGNvbnN0IFJCID0gbmV3IFBvaW50KFJULngsIExCLnkpO1xyXG5cclxuICAgIHRoaXMuY29ybmVycyA9IFtMVCwgUlQsIFJCLCBMQl0ubWFwKHAgPT4gdGhpcy5kcmF3Q29ybmVyKHApKTtcclxuICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogc2V0IGNvcm5lciBhY2NvcmRpbmcgdG8gY3VycmVudCBlZGl0aW9uIHN0YXR1c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuICBzZXRDb3JuZXJTdHlsZShjOiBmYWJyaWMuUmVjdCkge1xyXG4gICAgYy5tb3ZlQ3Vyc29yID0gdGhpcy52aWV3LmZyZWVEcmF3aW5nQ3Vyc29yO1xyXG4gICAgYy5ob3ZlckN1cnNvciA9IHRoaXMudmlldy5mcmVlRHJhd2luZ0N1cnNvcjtcclxuICAgIGMuc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gICAgYy5ldmVudGVkID0gZmFsc2U7XHJcbiAgICBjLndpZHRoID0gYy5oZWlnaHQgPSAoUkxfUk9PTV9JTk5FUl9TUEFDSU5HIC8gKHRoaXMuYXBwLnJvb21FZGl0ID8gMS41IDogMikpICogMjtcclxuICAgIGMuc2V0KCdmaWxsJywgdGhpcy5hcHAucm9vbUVkaXQgPyBSTF9DT1JORVJfRklMTCA6IFJMX1JPT01fU1RST0tFKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogZHJhdyBjb3JuZXJcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcbiAgZHJhd0Nvcm5lcihwOiBmYWJyaWMuUG9pbnQpIHtcclxuICAgIGNvbnN0IGMgPSBuZXcgZmFicmljLlJlY3Qoe1xyXG4gICAgICBsZWZ0OiBwLngsXHJcbiAgICAgIHRvcDogcC55LFxyXG4gICAgICBzdHJva2VXaWR0aDogMCxcclxuICAgICAgaGFzQ29udHJvbHM6IGZhbHNlLFxyXG4gICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgIG5hbWU6ICdDT1JORVInXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2V0Q29ybmVyU3R5bGUoYyk7XHJcbiAgICByZXR1cm4gYztcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogZHJhdyByb29tXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG4gIGRyYXdSb29tKCkge1xyXG5cclxuICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMudmlldy5nZXRPYmplY3RzKCkuZmlsdGVyKG9iaiA9PiBvYmoubmFtZS5pbmRleE9mKCdXQUxMJykgPiAtMSB8fCBvYmoubmFtZSA9PT0gJ0NPUk5FUicpO1xyXG4gICAgdGhpcy52aWV3LnJlbW92ZSguLi5leGlzdHMpO1xyXG5cclxuICAgIHRoaXMudmlldy5hZGQoLi4udGhpcy5jb3JuZXJzKTtcclxuXHJcbiAgICBjb25zdCB3YWxsID0gKGNvb3JkczogbnVtYmVyW10sIGluZGV4OiBudW1iZXIpID0+IG5ldyBMaW5lKGNvb3Jkcywge1xyXG4gICAgICBzdHJva2U6IFJMX1JPT01fU1RST0tFLFxyXG4gICAgICBzdHJva2VXaWR0aDogUkxfUk9PTV9JTk5FUl9TUEFDSU5HLFxyXG4gICAgICBuYW1lOiBgV0FMTDoke2luZGV4fWAsXHJcbiAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxyXG4gICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcclxuICAgICAgaG92ZXJDdXJzb3I6IHRoaXMuYXBwLnJvb21FZGl0ID8gdGhpcy52aWV3Lm1vdmVDdXJzb3IgOiB0aGlzLnZpZXcuZGVmYXVsdEN1cnNvcixcclxuICAgICAgaGFzQ29udHJvbHM6IGZhbHNlLFxyXG4gICAgICBoYXNCb3JkZXJzOiBmYWxzZSxcclxuICAgICAgc2VsZWN0YWJsZTogdGhpcy5hcHAucm9vbUVkaXQsXHJcbiAgICAgIGV2ZW50ZWQ6IHRoaXMuYXBwLnJvb21FZGl0LFxyXG4gICAgICBjb3JuZXJTdHlsZTogJ3JlY3QnXHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgTFQgPSBuZXcgUG9pbnQoOTk5OSwgOTk5OSksIFJCID0gbmV3IFBvaW50KDAsIDApO1xyXG5cclxuICAgIHRoaXMud2FsbHMgPSB0aGlzLmNvcm5lcnMubWFwKChjb3JuZXIsIGkpID0+IHtcclxuICAgICAgY29uc3Qgc3RhcnQgPSBjb3JuZXI7XHJcbiAgICAgIGNvbnN0IGVuZCA9IChpID09PSB0aGlzLmNvcm5lcnMubGVuZ3RoIC0gMSkgPyB0aGlzLmNvcm5lcnNbMF0gOiB0aGlzLmNvcm5lcnNbaSArIDFdO1xyXG5cclxuICAgICAgaWYgKGNvcm5lci50b3AgPCBMVC54ICYmIGNvcm5lci5sZWZ0IDwgTFQueSlcclxuICAgICAgICBMVCA9IG5ldyBQb2ludChjb3JuZXIubGVmdCwgY29ybmVyLnRvcCk7XHJcblxyXG4gICAgICBpZiAoY29ybmVyLnRvcCA+IFJCLnkgJiYgY29ybmVyLmxlZnQgPiBSQi55KVxyXG4gICAgICAgIFJCID0gbmV3IFBvaW50KGNvcm5lci5sZWZ0LCBjb3JuZXIudG9wKTtcclxuXHJcbiAgICAgIGNvbnN0IHcgPSB3YWxsKFtzdGFydC5sZWZ0LCBzdGFydC50b3AsIGVuZC5sZWZ0LCBlbmQudG9wXSwgaSk7XHJcbiAgICAgIHJldHVybiB3O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy52aWV3LmFkZCguLi50aGlzLndhbGxzKTtcclxuICAgIHRoaXMud2FsbHMuZm9yRWFjaCh3ID0+IHcuc2VuZFRvQmFjaygpKTtcclxuICAgIHRoaXMuUk9PTV9TSVpFID0geyB3aWR0aDogUkIueCAtIExULngsIGhlaWdodDogUkIueSAtIExULnkgfTtcclxuICB9XHJcblxyXG5cclxuICBsb2NhdGVEVyhkdzogZmFicmljLkdyb3VwLCB3YWxsOiBmYWJyaWMuTGluZSwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGRXYWxsID0gdGhpcy5kaXJlY3Rpb25PZldhbGwod2FsbCk7XHJcbiAgICBjb25zdCBkRFcgPSBkdy5hbmdsZSAlIDE4MCA9PT0gMCA/IEhPUklaT05UQUwgOiBWRVJUSUNBTDtcclxuXHJcbiAgICBpZiAoZFdhbGwgIT0gZERXKSB7XHJcbiAgICAgIGR3LmFuZ2xlID0gKGR3LmFuZ2xlICsgOTApICUgMzYwO1xyXG4gICAgfVxyXG5cclxuICAgIGR3LnRvcCA9IHksIGR3LmxlZnQgPSB4O1xyXG4gICAgY29uc3QgY2VudGVyID0gZHcuZ2V0Q2VudGVyUG9pbnQoKTtcclxuXHJcbiAgICBpZiAoZFdhbGwgPT09IEhPUklaT05UQUwpXHJcbiAgICAgIGNlbnRlci55IDwgZHcudG9wID8gZHcudG9wICs9IE9GRlNFVCA6IGR3LnRvcCAtPSBPRkZTRVQ7XHJcbiAgICBlbHNlXHJcbiAgICAgIGNlbnRlci54IDwgZHcubGVmdCA/IGR3LmxlZnQgKz0gT0ZGU0VUIDogZHcubGVmdCAtPSBPRkZTRVQ7XHJcblxyXG4gICAgcmV0dXJuIGR3O1xyXG4gIH1cclxuXHJcbiAgc2V0RFdPcmlnaW4oZHc6IGZhYnJpYy5Hcm91cCkge1xyXG4gICAgaWYgKCFkdy5mbGlwWCAmJiAhZHcuZmxpcFkpXHJcbiAgICAgIGR3Lm9yaWdpblggPSAnbGVmdCcsIGR3Lm9yaWdpblkgPSAndG9wJztcclxuICAgIGVsc2UgaWYgKGR3LmZsaXBYICYmICFkdy5mbGlwWSlcclxuICAgICAgZHcub3JpZ2luWCA9ICdyaWdodCcsIGR3Lm9yaWdpblkgPSAndG9wJztcclxuICAgIGVsc2UgaWYgKCFkdy5mbGlwWCAmJiBkdy5mbGlwWSlcclxuICAgICAgZHcub3JpZ2luWCA9ICdsZWZ0JywgZHcub3JpZ2luWSA9ICdib3R0b20nO1xyXG4gICAgZWxzZSBpZiAoZHcuZmxpcFggJiYgZHcuZmxpcFkpXHJcbiAgICAgIGR3Lm9yaWdpblggPSAncmlnaHQnLCBkdy5vcmlnaW5ZID0gJ2JvdHRvbSc7XHJcbiAgICByZXR1cm4gZHc7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgZWRpdFJvb20oKSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXcuZ2V0T2JqZWN0cygpLmZvckVhY2gociA9PiB7XHJcbiAgICAgIGlmIChyLm5hbWUuaW5kZXhPZignV0FMTCcpICE9PSAtMSkge1xyXG4gICAgICAgIHIuc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICAgICAgci5ldmVudGVkID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByLnNlbGVjdGFibGUgPSBmYWxzZTtcclxuICAgICAgICByLmV2ZW50ZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0U3RhdGVzLmxlbmd0aCA9PT0gMClcclxuICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIGNhbmNlbFJvb21FZGl0aW9uKCkge1xyXG4gICAgdGhpcy52aWV3LmdldE9iamVjdHMoKS5mb3JFYWNoKHIgPT4ge1xyXG4gICAgICBpZiAoci5uYW1lLmluZGV4T2YoJ1dBTEwnKSAhPT0gLTEgfHwgci5uYW1lLmluZGV4T2YoJ0NPUk5FUicpICE9PSAtMSkge1xyXG4gICAgICAgIHIuc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHIuZXZlbnRlZCA9IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHIuc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICAgICAgci5ldmVudGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRJdGVtU3RhdHVzKHR5cGU6IHN0cmluZywgb2JqZWN0OiBhbnkpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCd0eXBlJywgdHlwZSlcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvYmplY3QnLCBvYmplY3QpXHJcblxyXG4gICAgaWYgKG9iamVjdCAmJiB0eXBlKSAge1xyXG4gICAgICBpZiAodHlwZSA9PT0gJ3RhYmxlJykge1xyXG4gICAgICAgIGlmIChvYmplY3QubmFtZSAhPSAnJykge1xyXG4gICAgICAgICAgY29uc3QgZnVsbE5hbWUgPSBvYmplY3QubmFtZTtcclxuICAgICAgICAgIGNvbnN0IGl0ZW1zID0gb2JqZWN0LnNwbGl0KCc7JylcclxuXHJcbiAgICAgICAgICAvL3R5cGVcclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPj0gMCAmJiBpdGVtc1swXSkge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vaWRcclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPj0gMSAmJiBpdGVtc1sxXSkge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vb3JkZXJcclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPj0gMiAmJiBpdGVtc1syXSkge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vc3RhdHVzXFxcclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPj0gMiAmJiBpdGVtc1szXSkge1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09IDMgJiYgaXRlbXNbM10pIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gaXRlbXNbM11cclxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAnJykge1xyXG4gICAgICAgICAgICAgIG9iamVjdC5maWxsID0gJ3B1cnBsZSdcclxuICAgICAgICAgICAgICBvYmplY3Quc3Ryb2tlID0gJ3doaXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gJzEnKSB7XHJcbiAgICAgICAgICAgICAgb2JqZWN0LmZpbGwgPSAnZ3JlZW4nXHJcbiAgICAgICAgICAgICAgb2JqZWN0LnN0cm9rZSA9ICd3aGl0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09ICcyJykge1xyXG4gICAgICAgICAgICAgIG9iamVjdC5maWxsID0gJ3llbGxvdydcclxuICAgICAgICAgICAgICBvYmplY3Quc3Ryb2tlID0gJ3doaXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gJzMnKSB7XHJcbiAgICAgICAgICAgICAgb2JqZWN0LmZpbGwgPSAncmVkJ1xyXG4gICAgICAgICAgICAgIG9iamVjdC5zdHJva2UgPSAnd2hpdGUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG9iamVjdFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlT2JqZWN0SW5zZXJ0aW9uKHsgdHlwZSwgb2JqZWN0IH0pIHtcclxuXHJcbiAgICBpZiAodGhpcy51c2VyTW9kZSkge1xyXG4gICAgICBpZiAodHlwZSA9PT0gJ1JPT00nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRSb29tKG9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGUgPT09ICdST09NJyB8fCB0eXBlID09PSAnRE9PUicgfHwgdHlwZSA9PT0gJ1dJTkRPVycpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9iamVjdCA9ICB0aGlzLnNldEl0ZW1TdGF0dXModHlwZSwgb2JqZWN0KTtcclxuICAgIGxldCBncm91cFxyXG4gICAgaWYgKHR5cGUgPT09ICd0YWJsZScpIHtcclxuICAgICAgY29uc3QgY2hhaXIgPSB7fSBhcyBhbnlcclxuICAgICAgZ3JvdXAgPSBfLmNyZWF0ZVRhYmxlKHR5cGUsIG9iamVjdCwgY2hhaXIpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGUgIT0gJ3RhYmxlJykge1xyXG4gICAgICBncm91cCA9IF8uY3JlYXRlRnVybml0dXJlKHR5cGUsIG9iamVjdCwgdGhpcy5ERUZBVUxUX0NIQUlSKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZSA9PT0gJ0RPT1InIHx8IHR5cGUgPT09ICdXSU5ET1cnKSB7XHJcbiAgICAgIGdyb3VwLm9yaWdpblggPSAnY2VudGVyJztcclxuICAgICAgZ3JvdXAub3JpZ2luWSA9ICd0b3AnO1xyXG5cclxuICAgICAgY29uc3QgZHdzID0gdGhpcy5maWx0ZXJPYmplY3RzKFsnRE9PUicsICdXSU5ET1cnXSk7XHJcbiAgICAgIGNvbnN0IGR3ID0gZHdzLmxlbmd0aCA/IGR3c1tkd3MubGVuZ3RoIC0gMV0gOiBudWxsO1xyXG5cclxuICAgICAgbGV0IHdhbGwsIHgsIHk7XHJcbiAgICAgIGlmICghZHcpIHtcclxuICAgICAgICB3YWxsID0gdGhpcy53YWxsc1swXTtcclxuICAgICAgICB4ID0gTGVmdCh3YWxsKSArIFJMX0FJU0xFR0FQO1xyXG4gICAgICAgIHkgPSBUb3Aod2FsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgb2QgPSBkdy5hbmdsZSAlIDE4MCA9PT0gMCA/IEhPUklaT05UQUwgOiBWRVJUSUNBTDtcclxuXHJcbiAgICAgICAgbGV0IHBsYWNlT25OZXh0V2FsbCA9IGZhbHNlO1xyXG4gICAgICAgIHdhbGwgPSB0aGlzLndhbGxPZkRXKGR3KTtcclxuXHJcbiAgICAgICAgaWYgKG9kID09PSBIT1JJWk9OVEFMKSB7XHJcbiAgICAgICAgICB4ID0gZHcubGVmdCArIGR3LndpZHRoICsgUkxfQUlTTEVHQVA7XHJcbiAgICAgICAgICB5ID0gVG9wKHdhbGwpO1xyXG4gICAgICAgICAgaWYgKHggKyBncm91cC53aWR0aCA+IFJpZ2h0KHdhbGwpKSB7XHJcbiAgICAgICAgICAgIHBsYWNlT25OZXh0V2FsbCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHkgPSBkdy50b3AgKyBkdy53aWR0aCArIFJMX0FJU0xFR0FQO1xyXG4gICAgICAgICAgeCA9IExlZnQod2FsbCk7XHJcbiAgICAgICAgICBpZiAoeSArIGdyb3VwLndpZHRoID4gQm90dG9tKHdhbGwpKSB7XHJcbiAgICAgICAgICAgIHBsYWNlT25OZXh0V2FsbCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxhY2VPbk5leHRXYWxsKSB7XHJcbiAgICAgICAgICB3YWxsID0gdGhpcy53YWxsc1soTnVtYmVyKHdhbGwubmFtZS5zcGxpdCgnOicpWzFdKSArIDEpICUgdGhpcy53YWxscy5sZW5ndGhdO1xyXG4gICAgICAgICAgY29uc3QgbmQgPSB0aGlzLmRpcmVjdGlvbk9mV2FsbCh3YWxsKTtcclxuXHJcbiAgICAgICAgICBpZiAobmQgPT09IEhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgeCA9IExlZnQod2FsbCkgKyBSTF9BSVNMRUdBUCwgeSA9IFRvcCh3YWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHggPSBMZWZ0KHdhbGwpLCB5ID0gVG9wKHdhbGwpICsgUkxfQUlTTEVHQVA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmxvY2F0ZURXKGdyb3VwLCB3YWxsLCB4LCB5KTtcclxuICAgICAgZ3JvdXAuaGFzQm9yZGVycyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnZpZXcuYWRkKGdyb3VwKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHJpZXZlIHNwYWNpbmcgZnJvbSBvYmplY3QsIHVzZSBybEFpc2xlR2FwIGlmIG5vdCBzcGVjaWZpZWRcclxuICAgIGNvbnN0IG5ld0xSID0gb2JqZWN0LmxyU3BhY2luZyB8fCBSTF9BSVNMRUdBUDtcclxuICAgIGNvbnN0IG5ld1RCID0gb2JqZWN0LnRiU3BhY2luZyB8fCBSTF9BSVNMRUdBUDtcclxuXHJcbiAgICAvLyBvYmplY3QgZ3JvdXBzIHVzZSBjZW50ZXIgYXMgb3JpZ2luLCBzbyBhZGQgaGFsZiB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZWlyIHJlcG9ydGVkXHJcbiAgICAvLyB3aWR0aCBhbmQgc2l6ZTsgbm90ZSB0aGF0IHRoaXMgd2lsbCBub3QgYWNjb3VudCBmb3IgY2hhaXJzIGFyb3VuZCB0YWJsZXMsIHdoaWNoIGlzXHJcbiAgICAvLyBpbnRlbnRpb25hbDsgdGhleSBnbyBpbiB0aGUgc3BlY2lmaWVkIGdhcHNcclxuICAgIGdyb3VwLmxlZnQgPSBuZXdMUiArIChncm91cC53aWR0aCAvIDIpICsgdGhpcy5yb29tX29yaWdpbjtcclxuICAgIGdyb3VwLnRvcCA9IG5ld1RCICsgKGdyb3VwLmhlaWdodCAvIDIpICsgdGhpcy5yb29tX29yaWdpbjtcclxuXHJcbiAgICBpZiAodGhpcy5sYXN0T2JqZWN0KSB7XHJcbiAgICAgIC8vIHJldHJpZXZlIHNwYWNpbmcgZnJvbSBvYmplY3QsIHVzZSBybEFpc2xlR2FwIGlmIG5vdCBzcGVjaWZpZWRcclxuICAgICAgY29uc3QgbGFzdExSID0gdGhpcy5sYXN0T2JqZWN0RGVmaW5pdGlvbi5sclNwYWNpbmcgfHwgUkxfQUlTTEVHQVA7XHJcbiAgICAgIGNvbnN0IGxhc3RUQiA9IHRoaXMubGFzdE9iamVjdERlZmluaXRpb24udGJTcGFjaW5nIHx8IFJMX0FJU0xFR0FQO1xyXG5cclxuICAgICAgLy8gY2FsY3VsYXRlIG1heGltdW0gZ2FwIHJlcXVpcmVkIGJ5IGxhc3QgYW5kIHRoaXMgb2JqZWN0XHJcbiAgICAgIC8vIE5vdGU6IHRoaXMgaXNuJ3Qgc21hcnQgZW5vdWdoIHRvIGdldCBuZXcgcm93IGdhcCByaWdodCB3aGVuXHJcbiAgICAgIC8vIG9iamVjdCBhYm92ZSBoYWQgYSBtdWNoIGJpZ2dlciBnYXAsIGV0Yy4gV2UgYXJlbid0IGZpdHRpbmcgeWV0LlxyXG4gICAgICBjb25zdCB1c2VMUiA9IE1hdGgubWF4KG5ld0xSLCBsYXN0TFIpLCB1c2VUQiA9IE1hdGgubWF4KG5ld1RCLCBsYXN0VEIpO1xyXG5cclxuICAgICAgLy8gdXNpbmcgbGVmdC90b3Agdm9jYWIsIHRob3VnaCBhbGwgb2JqZWN0cyBhcmUgbm93IGNlbnRlcmVkXHJcbiAgICAgIGNvbnN0IGxhc3RXaWR0aCA9IHRoaXMubGFzdE9iamVjdERlZmluaXRpb24ud2lkdGggfHwgMTAwO1xyXG4gICAgICBjb25zdCBsYXN0SGVpZ2h0ID0gdGhpcy5sYXN0T2JqZWN0RGVmaW5pdGlvbi5oZWlnaHQgfHwgNDA7XHJcblxyXG4gICAgICBsZXQgbmV3TGVmdCA9IHRoaXMubGFzdE9iamVjdC5sZWZ0ICsgbGFzdFdpZHRoICsgdXNlTFI7XHJcbiAgICAgIGxldCBuZXdUb3AgPSB0aGlzLmxhc3RPYmplY3QudG9wO1xyXG5cclxuICAgICAgLy8gbWFrZSBzdXJlIHdlIGZpdCBsZWZ0IHRvIHJpZ2h0LCBpbmNsdWRpbmcgb3VyIHJlcXVpcmVkIHJpZ2h0IHNwYWNpbmdcclxuICAgICAgaWYgKG5ld0xlZnQgKyBncm91cC53aWR0aCArIG5ld0xSID4gdGhpcy5ST09NX1NJWkUud2lkdGgpIHtcclxuICAgICAgICBuZXdMZWZ0ID0gbmV3TFIgKyAoZ3JvdXAud2lkdGggLyAyKTtcclxuICAgICAgICBuZXdUb3AgKz0gbGFzdEhlaWdodCArIHVzZVRCO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBncm91cC5sZWZ0ID0gbmV3TGVmdDtcclxuICAgICAgZ3JvdXAudG9wID0gbmV3VG9wO1xyXG5cclxuICAgICAgaWYgKChncm91cC5sZWZ0IC0gZ3JvdXAud2lkdGggLyAyKSA8IHRoaXMucm9vbV9vcmlnaW4pIHsgZ3JvdXAubGVmdCArPSB0aGlzLnJvb21fb3JpZ2luOyB9XHJcbiAgICAgIGlmICgoZ3JvdXAudG9wIC0gZ3JvdXAuaGVpZ2h0IC8gMikgPCB0aGlzLnJvb21fb3JpZ2luKSB7IGdyb3VwLnRvcCArPSB0aGlzLnJvb21fb3JpZ2luOyB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3JvdXAuZmlsbCA9ICdibHVlJ1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2dyb3VwJywgZ3JvdXApO1xyXG5cclxuICAgIHRoaXMudmlldy5hZGQoZ3JvdXApO1xyXG4gICAgdGhpcy52aWV3LnNldEFjdGl2ZU9iamVjdChncm91cCk7XHJcblxyXG4gICAgdGhpcy5sYXN0T2JqZWN0ID0gZ3JvdXA7XHJcbiAgICB0aGlzLmxhc3RPYmplY3REZWZpbml0aW9uID0gb2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgLyoqIFNhdmUgY3VycmVudCBzdGF0ZSAqL1xyXG4gIHNhdmVTdGF0ZSgpIHtcclxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy52aWV3LnRvRGF0YWxlc3NKU09OKFsnbmFtZScsICdoYXNDb250cm9scycsICdzZWxlY3RhYmxlJywgJ2hhc0JvcmRlcnMnLCAnZXZlbnRlZCcsICdob3ZlckN1cnNvcicsICdtb3ZlQ3Vyc29yJ10pO1xyXG4gICAgdGhpcy5hcHAuc2F2ZVN0YXRlLm5leHQoSlNPTi5zdHJpbmdpZnkoc3RhdGUpKTtcclxuICB9XHJcblxyXG4gIHVuZG8oKSB7XHJcbiAgICBsZXQgY3VycmVudCA9IG51bGw7XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5hcHAucm9vbUVkaXRTdGF0ZXMucG9wKCk7XHJcbiAgICAgIHRoaXMuYXBwLnJvb21FZGl0UmVkb1N0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgY3VycmVudCA9IHRoaXMuYXBwLnJvb21FZGl0U3RhdGVzW3RoaXMuYXBwLnJvb21FZGl0U3RhdGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmFwcC5zdGF0ZXMucG9wKCk7XHJcbiAgICAgIHRoaXMuYXBwLnJlZG9TdGF0ZXMucHVzaChzdGF0ZSk7XHJcbiAgICAgIGN1cnJlbnQgPSB0aGlzLmFwcC5zdGF0ZXNbdGhpcy5hcHAuc3RhdGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5jbGVhcigpO1xyXG5cclxuICAgIHRoaXMudmlldy5sb2FkRnJvbUpTT04oY3VycmVudCwgKCkgPT4ge1xyXG4gICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICAgIHRoaXMuY29ybmVycyA9IHRoaXMudmlldy5nZXRPYmplY3RzKCkuZmlsdGVyKG9iaiA9PiBvYmoubmFtZSA9PT0gJ0NPUk5FUicpO1xyXG4gICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogUmVkbyBvcGVyYXRpb24gKi9cclxuICByZWRvKCkge1xyXG4gICAgbGV0IGN1cnJlbnQgPSBudWxsO1xyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICBjdXJyZW50ID0gdGhpcy5hcHAucm9vbUVkaXRSZWRvU3RhdGVzLnBvcCgpO1xyXG4gICAgICB0aGlzLmFwcC5yb29tRWRpdFN0YXRlcy5wdXNoKGN1cnJlbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VycmVudCA9IHRoaXMuYXBwLnJlZG9TdGF0ZXMucG9wKCk7XHJcbiAgICAgIHRoaXMuYXBwLnN0YXRlcy5wdXNoKGN1cnJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5jbGVhcigpO1xyXG4gICAgdGhpcy52aWV3LmxvYWRGcm9tSlNPTihjdXJyZW50LCAoKSA9PiB7XHJcbiAgICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgICAgdGhpcy5jb3JuZXJzID0gdGhpcy52aWV3LmdldE9iamVjdHMoKS5maWx0ZXIob2JqID0+IG9iai5uYW1lID09PSAnQ09STkVSJyk7XHJcbiAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqIENvcHkgb3BlcmF0aW9uICovXHJcbiAgY29weSgpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcbiAgICBpZiAoIWFjdGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhY3RpdmUuY2xvbmUoY2xvbmVkID0+IHRoaXMuYXBwLmNvcGllZCA9IGNsb25lZCwgWyduYW1lJywgJ2hhc0NvbnRyb2xzJ10pO1xyXG4gIH1cclxuXHJcbiAgLyoqIFBhc3RlIG9wZXJhdGlvbiAqL1xyXG4gIHBhc3RlKCkge1xyXG5cclxuICAgIGlmICggdGhpcy51c2VyTW9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmFwcC5jb3BpZWQgfHwgdGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hcHAuY29waWVkLmNsb25lKChjbG9uZWQpID0+IHtcclxuICAgICAgdGhpcy52aWV3LmRpc2NhcmRBY3RpdmVPYmplY3QoKTtcclxuICAgICAgY2xvbmVkLnNldCh7XHJcbiAgICAgICAgbGVmdDogY2xvbmVkLmxlZnQgKyBSTF9BSVNMRUdBUCxcclxuICAgICAgICB0b3A6IGNsb25lZC50b3AgKyBSTF9BSVNMRUdBUFxyXG4gICAgICB9KTtcclxuICAgICAgaWYgKGNsb25lZC50eXBlID09PSAnYWN0aXZlU2VsZWN0aW9uJykge1xyXG4gICAgICAgIGNsb25lZC5jYW52YXMgPSB0aGlzLnZpZXc7XHJcbiAgICAgICAgY2xvbmVkLmZvckVhY2hPYmplY3Qob2JqID0+IHRoaXMudmlldy5hZGQob2JqKSk7XHJcbiAgICAgICAgY2xvbmVkLnNldENvb3JkcygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudmlldy5hZGQoY2xvbmVkKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFwcC5jb3BpZWQudG9wICs9IFJMX0FJU0xFR0FQO1xyXG4gICAgICB0aGlzLmFwcC5jb3BpZWQubGVmdCArPSBSTF9BSVNMRUdBUDtcclxuICAgICAgdGhpcy52aWV3LnNldEFjdGl2ZU9iamVjdChjbG9uZWQpO1xyXG4gICAgICB0aGlzLnZpZXcucmVxdWVzdFJlbmRlckFsbCgpO1xyXG4gICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgfSwgWyduYW1lJywgJ2hhc0NvbnRyb2xzJ10pO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJMYXlvdXQoKSB7XHJcbiAgICB0aGlzLmFwcC5sb2FkSnNvbignJyk7XHJcbiAgICAvLyB0aGlzLnZpZXcuY2xlYXIoKTtcclxuICAgIHRoaXMuaW5pdExheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlbGV0ZSBvcGVyYXRpb24gKi9cclxuICBkZWxldGUoKSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgY29uc29sZS5sb2coJ25vIGl0ZW1zJylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5zZWxlY3Rpb25zKSB7XHJcbiAgICAgIHRoaXMuYXBwLnNlbGVjdGlvbnMuZm9yRWFjaChzZWxlY3Rpb24gPT4gdGhpcy52aWV3LnJlbW92ZShzZWxlY3Rpb24pKTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMudmlldy5kaXNjYXJkQWN0aXZlT2JqZWN0KCk7XHJcbiAgICAgIHRoaXMudmlldy5yZXF1ZXN0UmVuZGVyQWxsKCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlcnJvcilcclxuICAgIH1cclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogUm90YXRlIE9wZXJhdGlvbiAqL1xyXG4gIHJvdGF0ZShjbG9ja3dpc2UgPSB0cnVlKSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBhbmdsZSA9IHRoaXMuQ1RSTF9LRVlfRE9XTiA/IDkwIDogMTU7XHJcbiAgICBjb25zdCBvYmogPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcblxyXG4gICAgaWYgKCFvYmopIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgaWYgKChvYmoub3JpZ2luWCAhPT0gJ2NlbnRlcicgfHwgb2JqLm9yaWdpblkgIT09ICdjZW50ZXInKSAmJiBvYmouY2VudGVyZWRSb3RhdGlvbikge1xyXG4gICAgICBvYmoub3JpZ2luWCA9ICdjZW50ZXInO1xyXG4gICAgICBvYmoub3JpZ2luWSA9ICdjZW50ZXInO1xyXG4gICAgICBvYmoubGVmdCArPSBvYmoud2lkdGggLyAyO1xyXG4gICAgICBvYmoudG9wICs9IG9iai5oZWlnaHQgLyAyO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRFcob2JqKSkge1xyXG4gICAgICBhbmdsZSA9IG9iai5hbmdsZSArIChjbG9ja3dpc2UgPyAxODAgOiAtMTgwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFuZ2xlID0gb2JqLmFuZ2xlICsgKGNsb2Nrd2lzZSA/IGFuZ2xlIDogLWFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYW5nbGUgPiAzNjApIHsgYW5nbGUgLT0gMzYwOyB9IGVsc2UgaWYgKGFuZ2xlIDwgMCkgeyBhbmdsZSArPSAzNjA7IH1cclxuXHJcbiAgICBvYmouYW5nbGUgPSBhbmdsZTtcclxuICAgIHRoaXMudmlldy5yZXF1ZXN0UmVuZGVyQWxsKCk7XHJcbiAgfVxyXG5cclxuICAvKiogR3JvdXAgKi9cclxuICBncm91cCgpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgaWYgKCEodGhpcy5hcHAuc2VsZWN0aW9ucy5sZW5ndGggPiAxICYmIGFjdGl2ZSBpbnN0YW5jZW9mIGZhYnJpYy5BY3RpdmVTZWxlY3Rpb24pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmUudG9Hcm91cCgpO1xyXG4gICAgYWN0aXZlLmxvY2tTY2FsaW5nWCA9IHRydWUsIGFjdGl2ZS5sb2NrU2NhbGluZ1kgPSB0cnVlO1xyXG4gICAgdGhpcy5vblNlbGVjdGVkKCk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdW5ncm91cCgpIHtcclxuICAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgaWYgKCEoYWN0aXZlICYmIGFjdGl2ZSBpbnN0YW5jZW9mIGZhYnJpYy5Hcm91cCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2ZS50b0FjdGl2ZVNlbGVjdGlvbigpO1xyXG4gICAgYWN0aXZlLmxvY2tTY2FsaW5nWCA9IHRydWUsIGFjdGl2ZS5sb2NrU2NhbGluZ1kgPSB0cnVlO1xyXG4gICAgdGhpcy5vblNlbGVjdGVkKCk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgbW92ZShkaXJlY3Rpb24sIGluY3JlYW1lbnQgPSA2KSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuICAgIGlmICghYWN0aXZlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICBjYXNlICdMRUZUJzpcclxuICAgICAgICBhY3RpdmUubGVmdCAtPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdVUCc6XHJcbiAgICAgICAgYWN0aXZlLnRvcCAtPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdSSUdIVCc6XHJcbiAgICAgICAgYWN0aXZlLmxlZnQgKz0gaW5jcmVhbWVudDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnRE9XTic6XHJcbiAgICAgICAgYWN0aXZlLnRvcCArPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdGhpcy52aWV3LnJlcXVlc3RSZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBzZXRab29tKCkge1xyXG4gICAgdGhpcy52aWV3LnNldFpvb20odGhpcy5hcHAuem9vbSAvIDEwMCk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgfVxyXG5cclxuICBwbGFjZUluQ2VudGVyKGRpcmVjdGlvbikge1xyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuXHJcbiAgICBpZiAoIWFjdGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ0hPUklaT05UQUwnKSB7XHJcbiAgICAgIGFjdGl2ZS5sZWZ0ID0gdGhpcy5ST09NX1NJWkUud2lkdGggLyAyIC0gKGFjdGl2ZS5vcmlnaW5YID09PSAnY2VudGVyJyA/IDAgOiBhY3RpdmUud2lkdGggLyAyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFjdGl2ZS50b3AgPSB0aGlzLlJPT01fU0laRS5oZWlnaHQgLyAyIC0gKGFjdGl2ZS5vcmlnaW5YID09PSAnY2VudGVyJyA/IDAgOiBhY3RpdmUuaGVpZ2h0IC8gMik7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZlLnNldENvb3JkcygpO1xyXG4gICAgdGhpcy52aWV3LnJlcXVlc3RSZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBhcnJhbmdlKGFjdGlvbjogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy5nZXRCb3VuZGluZ1JlY3QodGhpcy5hcHAuc2VsZWN0aW9ucyk7XHJcbiAgICBhY3Rpb24gPSBhY3Rpb24udG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuYXBwLnNlbGVjdGlvbnMuZm9yRWFjaChzID0+IHtcclxuICAgICAgaWYgKGFjdGlvbiA9PT0gJ2xlZnQnIHx8IGFjdGlvbiA9PT0gJ3JpZ2h0JyB8fCBhY3Rpb24gPT09ICdjZW50ZXInKSB7XHJcbiAgICAgICAgcy5sZWZ0ID0gcmVjdFthY3Rpb25dO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHMudG9wID0gcmVjdFthY3Rpb25dO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBmaWx0ZXJPYmplY3RzKG5hbWVzOiBzdHJpbmdbXSkge1xyXG4gICAgcmV0dXJuIHRoaXMudmlldy5nZXRPYmplY3RzKCkuZmlsdGVyKG9iaiA9PiBuYW1lcy5zb21lKG4gPT4gb2JqLm5hbWUuaW5kZXhPZihuKSA+IC0xKSk7XHJcbiAgfVxyXG5cclxuICB3YWxsT2ZEVyhkdzogZmFicmljLkdyb3VwIHwgZmFicmljLk9iamVjdCkge1xyXG4gICAgY29uc3QgZCA9IGR3LmFuZ2xlICUgMTgwID09PSAwID8gSE9SSVpPTlRBTCA6IFZFUlRJQ0FMO1xyXG4gICAgcmV0dXJuIHRoaXMud2FsbHMuZmluZCh3ID0+IE1hdGguYWJzKGQgPT09IEhPUklaT05UQUwgPyB3LnRvcCAtIGR3LnRvcCA6IHcubGVmdCAtIGR3LmxlZnQpID09PSBPRkZTRVQpO1xyXG4gIH1cclxuXHJcbiAgZGlyZWN0aW9uT2ZXYWxsKHdhbGw6IGZhYnJpYy5MaW5lKSB7XHJcbiAgICBpZiAod2FsbC54MSA9PT0gd2FsbC54Mikge1xyXG4gICAgICByZXR1cm4gVkVSVElDQUw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gSE9SSVpPTlRBTDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzRFcob2JqZWN0KSB7XHJcbiAgICByZXR1cm4gb2JqZWN0Lm5hbWUuaW5kZXhPZignRE9PUicpID4gLTEgfHwgb2JqZWN0Lm5hbWUuaW5kZXhPZignV0lORE9XJykgPiAtMTtcclxuICB9XHJcblxyXG4gIGdldEJvdW5kaW5nUmVjdChvYmplY3RzOiBhbnlbXSkge1xyXG4gICAgbGV0IHRvcCA9IDk5OTksIGxlZnQgPSA5OTk5LCByaWdodCA9IDAsIGJvdHRvbSA9IDA7XHJcbiAgICBvYmplY3RzLmZvckVhY2gob2JqID0+IHtcclxuICAgICAgaWYgKG9iai5sZWZ0IDwgdG9wKSB7XHJcbiAgICAgICAgdG9wID0gb2JqLnRvcDtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2JqLmxlZnQgPCBsZWZ0KSB7XHJcbiAgICAgICAgbGVmdCA9IG9iai5sZWZ0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChvYmoudG9wID4gYm90dG9tKSB7XHJcbiAgICAgICAgYm90dG9tID0gb2JqLnRvcDtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2JqLmxlZnQgPiByaWdodCkge1xyXG4gICAgICAgIHJpZ2h0ID0gb2JqLmxlZnQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGNlbnRlciA9IChsZWZ0ICsgcmlnaHQpIC8gMjtcclxuICAgIGNvbnN0IG1pZGRsZSA9ICh0b3AgKyBib3R0b20pIC8gMjtcclxuXHJcbiAgICByZXR1cm4geyBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b20sIGNlbnRlciwgbWlkZGxlIH07XHJcbiAgfVxyXG5cclxuICBzYXZlQXMoZm9ybWF0OiBzdHJpbmcpIHtcclxuXHJcbiAgICBjb25zdCB7IHJpZ2h0LCBib3R0b20gfSA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KHRoaXMuY29ybmVycyk7XHJcbiAgICBjb25zdCB3aWR0aCAgPSB0aGlzLnZpZXcuZ2V0V2lkdGgoKTtcclxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMudmlldy5nZXRIZWlnaHQoKTtcclxuXHJcbiAgICB0aGlzLnZpZXcuc2V0V2lkdGgocmlnaHQgKyBSTF9ST09NX09VVEVSX1NQQUNJTkcpO1xyXG4gICAgdGhpcy52aWV3LnNldEhlaWdodChib3R0b20gKyBSTF9ST09NX09VVEVSX1NQQUNJTkcgKyAxMik7XHJcblxyXG4gICAgLy8gdGhpcy52aWV3LnNldEJhY2tncm91bmRDb2xvcigncHVycGxlJywgKCkgPT4geyB9KTtcclxuXHJcbiAgICBjb25zdCBjcmVkaXQgPSBuZXcgZmFicmljLlRleHQoUkxfQ1JFRElUX1RFWFQsXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5STF9DUkVESVRfVEVYVF9QQVJBTVMsXHJcbiAgICAgICAgbGVmdDogUkxfUk9PTV9PVVRFUl9TUEFDSU5HLFxyXG4gICAgICAgIHRvcDogYm90dG9tICsgUkxfUk9PTV9PVVRFUl9TUEFDSU5HIC0gUkxfQ1JFRElUX1RFWFRfUEFSQU1TLmZvbnRTaXplXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgdGhpcy52aWV3LmFkZChjcmVkaXQpO1xyXG4gICAgdGhpcy52aWV3LmRpc2NhcmRBY3RpdmVPYmplY3QoKTtcclxuICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuXHJcbiAgICBjb25zdCByZXN0b3JlID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlKGNyZWRpdCk7XHJcbiAgICAgIHRoaXMudmlldy5zZXRCYWNrZ3JvdW5kQ29sb3IoJ3RyYW5zcGFyZW50JywgKCkgPT4geyB9KTtcclxuICAgICAgdGhpcy52aWV3LnNldFdpZHRoKHdpZHRoKTtcclxuICAgICAgdGhpcy52aWV3LnNldEhlaWdodChoZWlnaHQpO1xyXG4gICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChmb3JtYXQgPT09ICdQTkcnKSB7XHJcbiAgICAgIGNvbnN0IGNhbnZhczogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcclxuICAgICAgY2FudmFzLnRvQmxvYigoYmxvYjogQmxvYikgPT4ge1xyXG4gICAgICAgIHNhdmVBcyhibG9iLCBgcm9vbV9sYXlvdXRfJHtmb3JtYXREYXRlKG5ldyBEYXRlKCksICd5eXl5LU1NLWRkLWhoLW1tLXNzJywgJ2VuJyl9LnBuZ2ApO1xyXG4gICAgICAgIHJlc3RvcmUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ1NWRycpIHtcclxuICAgICAgY29uc3Qgc3ZnID0gdGhpcy52aWV3LnRvU1ZHKCk7XHJcbiAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbc3ZnXSwgeyB0eXBlOiAnaW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PXV0Zi04JyB9KTtcclxuICAgICAgc2F2ZUFzKGJsb2IsIGByb29tX2xheW91dF8ke2Zvcm1hdERhdGUobmV3IERhdGUoKSwgJ3l5eXktTU0tZGQtaGgtbW0tc3MnLCAnZW4nKX0uc3ZnYCk7XHJcbiAgICAgIHJlc3RvcmUoKTtcclxuICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnanNvbicpIHtcclxuICAgICAgY29uc3QganNvbiAgPSB0aGlzLnZpZXcudG9KU09OKFsnbmFtZSddKTtcclxuICAgICAgdGhpcy5hcHAuanNvblZhbHVlLm5leHQoanNvbilcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBkaXNhYmxlU2VsZXRpb24oKXtcclxuICAgIC8vIGlmICh0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIC8vIHRoaXMudmlldy5mb3JFYWNoT2JqZWN0KGZ1bmN0aW9uKG8pIHtcclxuICAgICAgLy8gICBvLnNlbGVjdGFibGUgPSBmYWxzZTtcclxuICAgICAgLy8gfSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgdGhpcy52aWV3LmdldE9iamVjdHMoKS5mb3JFYWNoKChvYmosIGluZGV4KSA9PiB7XHJcbiAgICAgICAgb2JqLnNlbGVjdGFibGUgPSBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHRoaXMudmlldyA9IG5ldyBmYWJyaWMuU3RhdGljQ2FudmFzKHRoaXMudmlldyk7XHJcblxyXG4gICAgLy8gaWYgKHRoaXMudXNlck1vZGUpIHtcclxuICAgIC8vICAgdGhpcy5tYWluY29udGFpbmVyQ2xhc3MgPSAnbWFpbi1jb250YWluZXItdXNlcm1vZGUnXHJcbiAgICAvLyAgIHRoaXMudXNlck1vZGUgPSB0cnVlO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIGlmICghdGhpcy51c2VyTW9kZSkge1xyXG4gICAgLy8gICB0aGlzLm1haW5jb250YWluZXJDbGFzcyA9ICdtYWluLWNvbnRhaW5lcidcclxuICAgIC8vICAgdGhpcy51c2VyTW9kZSA9IGZhbHNlO1xyXG4gICAgLy8gfVxyXG5cclxuICB9XHJcblxyXG4gIGxvYWRKU09OKCkge1xyXG4gICAgdGhpcy5hcHAuanNvblZhbHVlLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICBpZiAodGhpcy51c2VyTW9kZSkge1xyXG4gICAgICAgICAgdGhpcy5tYWluY29udGFpbmVyQ2xhc3MgPSAnbWFpbi1jb250YWluZXItdXNlcm1vZGUnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy51c2VyTW9kZSkge1xyXG4gICAgICAgICAgdGhpcy5tYWluY29udGFpbmVyQ2xhc3MgPSAnbWFpbi1jb250YWluZXInXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGEgfHwgZGF0YSA9PSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLnZpZXcubG9hZEZyb21KU09OKG51bGwsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG9iamVjdFxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0pzb25TdHJ1Y3R1cmUoZGF0YSkpIHtcclxuICAgICAgICAgIG9iamVjdCA9IGRhdGFcclxuICAgICAgICAgIGNvbnN0IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG9iamVjdCA9IEpTT04ucGFyc2UoZGF0YSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgICAgICB0aGlzLnZpZXcubG9hZEZyb21KU09OKG9iamVjdCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMudXNlck1vZGUpIHtcclxuICAgICAgICAgIHRoaXMudmlldy5sb2FkRnJvbUpTT04ob2JqZWN0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy52aWV3LnJlbmRlckFsbCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBpc0pzb25TdHJ1Y3R1cmUoc3RyKSB7XHJcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiBmYWxzZTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IEpTT04ucGFyc2Uoc3RyKTtcclxuICAgICAgY29uc3QgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChyZXN1bHQpO1xyXG4gICAgICByZXR1cm4gdHlwZSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcclxuICAgICAgICAgICAgIHx8IHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBzYXZlVG9KU09OKCkge1xyXG4gIC8vICAgY29uc3QgY2FudmFzOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xyXG4gIC8vICAgY29uc3QganNvbiA9IGNhbnZhcy50b0pTT04oWyduYW1lJ10pXHJcbiAgLy8gICByZXR1cm4ganNvblxyXG4gIC8vIH1cclxuXHJcbiAgYWx0ZXJPYmplY3RDb2xvcihuYW1lOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcsIG9iajogYW55LCB2aWV3OiBhbnkpIHtcclxuICAgIGxldCBqc29uXHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICBqc29uID0gdmlldy50b0pTT04oWyduYW1lJ10pO1xyXG4gICAgICBpZiAoanNvbi5vYmplY3RzKSB7XHJcbiAgICAgICAgaWYgKGpzb24ub2JqZWN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBqc29uLm9iamVjdHMuZm9yRWFjaChkYXRhID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FsdGVyT2JqZWN0Q29sb3IgZGF0YT8uYmFja2dyb3VuZENvbG9yJywgZGF0YT8uYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICBpZiAoZGF0YT8ubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdwdXJwbGUnIHx8IGRhdGE/LmJhY2tncm91bmRDb2xvciA9PT0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2UgPSBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2VXaWR0aCA9IDEwXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaXRlbSBjb2xvciBjaGFuZ2VkIDEnLCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdwdXJwbGUnIHx8IGRhdGE/LmJhY2tncm91bmRDb2xvciA9PT0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2UgPSBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2VXaWR0aCA9IDEwXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaXRlbSBjb2xvciBjaGFuZ2VkIDEnLCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB0aGlzLmFsdGVyQ29sb3IoJ3JlZCcsIGRhdGEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGlmICh2aWV3ICYmIGpzb24pIHtcclxuICAgICAgY29uc29sZS5sb2coJ2xvYWRpbmcganNvbicpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGpzb24gO1xyXG4gIH1cclxuXHJcbiAgc2V0T2JqZWN0Q29sb3IobmFtZTogc3RyaW5nLCBjb2xvcjogc3RyaW5nLCBvYmo6IGFueSwgdmlldzogYW55KSB7XHJcbiAgICBsZXQganNvblxyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgLy8ganNvbiA9IHZpZXcudG9KU09OKFsnbmFtZSddKTtcclxuICAgICAgdGhpcy5hbHRlckNvbG9yKGNvbG9yLCBvYmopO1xyXG5cclxuICAgICAgaWYgKG9iai5vYmplY3RzKSB7XHJcbiAgICAgICAgaWYgKG9iai5vYmplY3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgb2JqLm9iamVjdHMuZm9yRWFjaChkYXRhID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FsdGVyT2JqZWN0Q29sb3IgZGF0YT8uYmFja2dyb3VuZENvbG9yJywgZGF0YT8uYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICBpZiAoZGF0YT8ubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdwdXJwbGUnIHx8IGRhdGE/LmJhY2tncm91bmRDb2xvciA9PT0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2UgPSBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2VXaWR0aCA9IDEwXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaXRlbSBjb2xvciBjaGFuZ2VkIDEnLCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdwdXJwbGUnIHx8IGRhdGE/LmJhY2tncm91bmRDb2xvciA9PT0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2UgPSBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2VXaWR0aCA9IDEwXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaXRlbSBjb2xvciBjaGFuZ2VkIDEnLCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHRoaXMuYWx0ZXJDb2xvcigncmVkJywgZGF0YSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZpZXcgJiYgb2JqKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdsb2FkaW5nIGpzb24nKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvYmogO1xyXG4gIH1cclxuXHJcbiAgYWx0ZXJDb2xvcihjb2xvciwgb2JqKSB7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ29iaicsIG9iaiwgb2JqLmxlbmd0aClcclxuICAgIC8vIGlmIChvYmo/LmJhY2tncm91bmRDb2xvciA9PT0gJ3B1cnBsZScgfHwgb2JqPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdyZ2JhKDI1NSwxMDAsMTcxLDAuMjUpJykge1xyXG4gICAgICAvLyBvYmouYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcbiAgICAgIG9iai5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICBvYmouc3Ryb2tlID0gY29sb3JcclxuICAgICAgb2JqLnN0cm9rZVdpZHRoID0gM1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnaXRlbSBjb2xvciBjaGFuZ2VkIDInLCBvYmouYmFja2dyb3VuZENvbG9yKVxyXG4gICAgLy8gfVxyXG5cclxuICAgIGlmIChvYmoub2JqZWN0cyAmJiBvYmoub2JqZWN0cy5sZW5ndGggPiAwICkge1xyXG4gICAgICBvYmoub2JqZWN0cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIHRoaXMuYWx0ZXJDb2xvcihjb2xvciwgaXRlbSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiBvYmpcclxuICB9XHJcblxyXG59XHJcbiIsIjxkaXYgW2NsYXNzXT1cIm1haW5jb250YWluZXJDbGFzc1wiICA+XHJcbiAgPGNhbnZhcyAgaWQ9XCJtYWluXCI+PC9jYW52YXM+XHJcbjwvZGl2PlxyXG4iXX0=