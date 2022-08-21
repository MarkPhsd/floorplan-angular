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
        this.outPutSelectedItem = new EventEmitter();
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
            this.outPutSelectedItem.emit(obj);
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
                            this.app.alterColor('red', data);
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
}
ViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: ViewComponent, deps: [{ token: i1.AppService }], target: i0.ɵɵFactoryTarget.Component });
ViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.4", type: ViewComponent, selector: "pointless-room-layout-view", inputs: { userMode: "userMode" }, outputs: { outPutSelectedItem: "outPutSelectedItem" }, host: { listeners: { "document:keydown": "onKeyDown($event)", "document:keyup": "onKeyUp($event)" } }, ngImport: i0, template: "<div [class]=\"maincontainerClass\"  >\r\n  <canvas  id=\"main\"></canvas>\r\n</div>\r\n", styles: [".main-container{padding:24px;overflow:auto;height:calc(100% - 199px)}.main-container-usermode{padding:15px;overflow:auto;height:calc(100% - 100px)}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: ViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pointless-room-layout-view', host: {
                        '(document:keydown)': 'onKeyDown($event)',
                        '(document:keyup)': 'onKeyUp($event)'
                    }, template: "<div [class]=\"maincontainerClass\"  >\r\n  <canvas  id=\"main\"></canvas>\r\n</div>\r\n", styles: [".main-container{padding:24px;overflow:auto;height:calc(100% - 199px)}.main-container-usermode{padding:15px;overflow:auto;height:calc(100% - 100px)}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.AppService }]; }, propDecorators: { userMode: [{
                type: Input
            }], outPutSelectedItem: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvdmlldy92aWV3LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy92aWV3L3ZpZXcuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBeUIsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDaEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVwQyxPQUFPLEtBQUssQ0FBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBQ25DLDJDQUEyQztBQUMzQyw2RUFBNkU7QUFFN0UsTUFBTSxFQUNKLGFBQWEsRUFDYixjQUFjLEVBQ2QsT0FBTyxFQUNQLFdBQVcsRUFDWCxxQkFBcUIsRUFDckIscUJBQXFCLEVBQ3JCLGNBQWMsRUFDZCxjQUFjLEVBQ2QsZUFBZSxFQUNmLGNBQWMsRUFDZCxxQkFBcUIsRUFDdEIsR0FBRyxDQUFDLENBQUM7QUFFTixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQztBQUMvQixNQUNFLFVBQVUsR0FBRyxZQUFZLEVBQ3pCLFFBQVEsR0FBRyxVQUFVLEVBQ3JCLE1BQU0sR0FBRyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFFckMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVB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QUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO3lCQUNqQztvQkFDSCxDQUFDLENBQUMsQ0FBQTtpQkFDSDthQUNGO1NBRUY7UUFFRCxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtTQUM1QjtRQUVELE9BQU8sSUFBSSxDQUFFO0lBQ2YsQ0FBQzs7MEdBM3hDVSxhQUFhOzhGQUFiLGFBQWEsa1FDM0MxQiwwRkFHQTsyRkR3Q2EsYUFBYTtrQkFUekIsU0FBUzsrQkFDRSw0QkFBNEIsUUFHaEM7d0JBQ0osb0JBQW9CLEVBQUUsbUJBQW1CO3dCQUN6QyxrQkFBa0IsRUFBRSxpQkFBaUI7cUJBQ3RDO2lHQU1TLFFBQVE7c0JBQWpCLEtBQUs7Z0JBQ0ksa0JBQWtCO3NCQUEzQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEFmdGVyVmlld0luaXQsIEV2ZW50RW1pdHRlciwgT3V0cHV0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBmb3JtYXREYXRlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgZmFicmljIH0gZnJvbSAnZmFicmljJztcclxuaW1wb3J0IHsgc2F2ZUFzIH0gZnJvbSAnZmlsZS1zYXZlcic7XHJcbmltcG9ydCB7IEFwcFNlcnZpY2UgfSBmcm9tICcuLi8uLi9hcHAuc2VydmljZSc7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnLi4vLi4vaGVscGVycyc7XHJcbi8vIGltcG9ydCB7IGpzb24gfSBmcm9tICdzdHJlYW0vY29uc3VtZXJzJztcclxuLy8gaW1wb3J0IHsgVmlld0pTT05TZXJ2aWNlU2VydmljZSB9IGZyb20gJ3NyYy9hcHAvdmlldy1qc29uc2VydmljZS5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IHtcclxuICBSTF9WSUVXX1dJRFRILFxyXG4gIFJMX1ZJRVdfSEVJR0hULFxyXG4gIFJMX0ZPT1QsXHJcbiAgUkxfQUlTTEVHQVAsXHJcbiAgUkxfUk9PTV9PVVRFUl9TUEFDSU5HLFxyXG4gIFJMX1JPT01fSU5ORVJfU1BBQ0lORyxcclxuICBSTF9ST09NX1NUUk9LRSxcclxuICBSTF9DT1JORVJfRklMTCxcclxuICBSTF9VTkdST1VQQUJMRVMsXHJcbiAgUkxfQ1JFRElUX1RFWFQsXHJcbiAgUkxfQ1JFRElUX1RFWFRfUEFSQU1TXHJcbn0gPSBfO1xyXG5cclxuY29uc3QgeyBMaW5lLCBQb2ludCB9ID0gZmFicmljO1xyXG5jb25zdFxyXG4gIEhPUklaT05UQUwgPSAnSE9SSVpPTlRBTCcsXHJcbiAgVkVSVElDQUwgPSAnVkVSVElDQUwnLFxyXG4gIE9GRlNFVCA9IFJMX1JPT01fSU5ORVJfU1BBQ0lORyAvIDI7XHJcblxyXG5jb25zdCBMZWZ0ID0gKHdhbGwpID0+IHdhbGwueDEgPCB3YWxsLngyID8gd2FsbC54MSA6IHdhbGwueDI7XHJcbmNvbnN0IFRvcCA9ICh3YWxsKSA9PiB3YWxsLnkxIDwgd2FsbC55MiA/IHdhbGwueTEgOiB3YWxsLnkyO1xyXG5jb25zdCBSaWdodCA9ICh3YWxsKSA9PiB3YWxsLngxID4gd2FsbC54MiA/IHdhbGwueDEgOiB3YWxsLngyO1xyXG5jb25zdCBCb3R0b20gPSAod2FsbCkgPT4gd2FsbC55MSA+IHdhbGwueTIgPyB3YWxsLnkxIDogd2FsbC55MjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAncG9pbnRsZXNzLXJvb20tbGF5b3V0LXZpZXcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi92aWV3LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi92aWV3LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgaG9zdDoge1xyXG4gICAgJyhkb2N1bWVudDprZXlkb3duKSc6ICdvbktleURvd24oJGV2ZW50KScsXHJcbiAgICAnKGRvY3VtZW50OmtleXVwKSc6ICdvbktleVVwKCRldmVudCknXHJcbiAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gIHNlbGVjdGVkT2JqZWN0OiBhbnk7XHJcblxyXG4gIEBJbnB1dCgpICB1c2VyTW9kZTogYm9vbGVhbjtcclxuICBAT3V0cHV0KCkgb3V0UHV0U2VsZWN0ZWRJdGVtID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB2aWV3OiBmYWJyaWMuQ2FudmFzO1xyXG4gIHJvb206IGZhYnJpYy5Hcm91cDtcclxuICByb29tTGF5ZXI6IGZhYnJpYy5Hcm91cCB8IGZhYnJpYy5SZWN0O1xyXG4gIGNvcm5lcnMgPSBbXTtcclxuICB3YWxsczogZmFicmljLkxpbmVbXSA9IFtdO1xyXG4gIGxhc3RPYmplY3REZWZpbml0aW9uID0gbnVsbDtcclxuICBsYXN0T2JqZWN0ID0gbnVsbDtcclxuXHJcbiAgQ1RSTF9LRVlfRE9XTiA9IGZhbHNlO1xyXG4gIE1PVkVfV0FMTF9JRCA9IC0xO1xyXG4gIFJPT01fU0laRSA9IHsgd2lkdGg6IDk2MCwgaGVpZ2h0OiA0ODAgfTtcclxuICBERUZBVUxUX0NIQUlSID0gbnVsbDtcclxuICBSRU1PVkVfRFcgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICAvLyBwdWJsaWMgdmlld0pTT05TZXJ2aWNlU2VydmljZTogVmlld0pTT05TZXJ2aWNlU2VydmljZSxcclxuICAgIHB1YmxpYyBhcHA6IEFwcFNlcnZpY2UpIHsgfVxyXG5cclxuICBtYWluY29udGFpbmVyQ2xhc3MgPSAnbWFpbi1jb250YWluZXInXHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG5cclxuICAgIHRoaXMubG9hZEpTT04oKTtcclxuXHJcbiAgICB0aGlzLmFwcC5zZXRTZWxlY3RlZE9iamVjdENvbG9yLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICB0aGlzLnNldFNlbGVjdGVkT2JqZWN0Q29sb3IoZGF0YSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLmFwcC5yb29tRWRpdGlvbi5zdWJzY3JpYmUoZG9FZGl0ID0+IHtcclxuICAgICAgdGhpcy5jb3JuZXJzLmZvckVhY2goYyA9PiB0aGlzLnNldENvcm5lclN0eWxlKGMpKTtcclxuICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICBpZiAoZG9FZGl0KSB7IHRoaXMuZWRpdFJvb20oKTsgfSBlbHNlIHsgdGhpcy5jYW5jZWxSb29tRWRpdGlvbigpOyB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFwcC5pbnNlcnRPYmplY3Quc3Vic2NyaWJlKHJlcyA9PiB7XHJcbiAgICAgIHRoaXMuaGFuZGxlT2JqZWN0SW5zZXJ0aW9uKHJlcyk7XHJcbiAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFwcC5kZWZhdWx0Q2hhaXIuc3Vic2NyaWJlKHJlcyA9PiB0aGlzLkRFRkFVTFRfQ0hBSVIgPSByZXMpO1xyXG5cclxuICAgIHRoaXMuYXBwLnNldFNlbGVjdGVkT2JqZWN0Q29sb3Iuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRPYmplY3RDb2xvcihkYXRhKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMuYXBwLnBlcmZvcm1PcGVyYXRpb24uc3Vic2NyaWJlKG9wZXJhdGlvbiA9PiB7XHJcbiAgICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XHJcblxyXG4gICAgICAgIGNhc2UgJ1VORE8nOlxyXG4gICAgICAgICAgdGhpcy51bmRvKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnUkVETyc6XHJcbiAgICAgICAgICB0aGlzLnJlZG8oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdDT1BZJzpcclxuICAgICAgICAgIHRoaXMuY29weSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ1BBU1RFJzpcclxuICAgICAgICAgIHRoaXMucGFzdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdERUxFVEUnOlxyXG4gICAgICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdST1RBVEUnOlxyXG4gICAgICAgICAgdGhpcy5yb3RhdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdST1RBVEVfQU5USSc6XHJcbiAgICAgICAgICB0aGlzLnJvdGF0ZShmYWxzZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnc2V0T3JkZXJJRCc6XHJcbiAgICAgICAgICB0aGlzLnNldE9iamVjdE9yZGVySUQodGhpcy5hcHAub3JkZXJJRCk7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2NsZWFyTGF5b3V0JzpcclxuICAgICAgICAgIHRoaXMuY2xlYXJMYXlvdXQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0dST1VQJzpcclxuICAgICAgICAgIHRoaXMuZ3JvdXAoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdVTkdST1VQJzpcclxuICAgICAgICAgIHRoaXMudW5ncm91cCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ0hPUklaT05UQUwnOlxyXG4gICAgICAgIGNhc2UgJ1ZFUlRJQ0FMJzpcclxuICAgICAgICAgIHRoaXMucGxhY2VJbkNlbnRlcihvcGVyYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ1JPT01fT1BFUkFUSU9OJzpcclxuICAgICAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdQTkcnOlxyXG4gICAgICAgIGNhc2UgJ1NWRyc6XHJcbiAgICAgICAgICB0aGlzLnNhdmVBcyhvcGVyYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbG9hZGpzb24nOlxyXG4gICAgICAgICAgdGhpcy5sb2FkSlNPTigpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnanNvbic6XHJcbiAgICAgICAgICB0aGlzLnNhdmVBcyhvcGVyYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnWk9PTSc6XHJcbiAgICAgICAgICB0aGlzLnNldFpvb20oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdkaXNhYmxlU2VsZXRpb24nOlxyXG4gICAgICAgICAgdGhpcy5kaXNhYmxlU2VsZXRpb24oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0xFRlQnOlxyXG4gICAgICAgIGNhc2UgJ0NFTlRFUic6XHJcbiAgICAgICAgY2FzZSAnUklHSFQnOlxyXG4gICAgICAgIGNhc2UgJ1RPUCc6XHJcbiAgICAgICAgY2FzZSAnTUlERExFJzpcclxuICAgICAgICBjYXNlICdCT1RUT00nOlxyXG4gICAgICAgICAgdGhpcy5hcnJhbmdlKG9wZXJhdGlvbik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICAvKiogSW5pdGlhbGl6ZSBjYW52YXMgKi9cclxuICAgIHRoaXMuaW5pdExheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgaW5pdExheW91dCgpIHtcclxuICAgIHRoaXMuc2V0Q2FudmFzVmlldygpO1xyXG4gICAgLyoqIEFkZCByb29tICovXHJcbiAgICB0aGlzLnNldFJvb20odGhpcy5ST09NX1NJWkUpO1xyXG4gICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIGdldCByb29tX29yaWdpbigpIHtcclxuICAgIHJldHVybiBSTF9ST09NX09VVEVSX1NQQUNJTkcgKyBSTF9ST09NX0lOTkVSX1NQQUNJTkc7XHJcbiAgfVxyXG5cclxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIGNvbnN0IGNvZGUgPSBldmVudC5rZXkgfHwgZXZlbnQua2V5Q29kZTtcclxuICAgIC8vIEN0cmwgS2V5IGlzIGRvd25cclxuICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgIHRoaXMuQ1RSTF9LRVlfRE9XTiA9IHRydWU7XHJcbiAgICAgIC8vIEN0cmwgKyBTaGlmdCArIFpcclxuICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIGNvZGUgPT09IDkwKVxyXG4gICAgICAgIHRoaXMuYXBwLnJlZG8oKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gOTApXHJcbiAgICAgICAgdGhpcy5hcHAudW5kbygpO1xyXG4gICAgICBlbHNlIGlmIChjb2RlID09PSA2NylcclxuICAgICAgICB0aGlzLmFwcC5jb3B5KCk7XHJcbiAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDg2KVxyXG4gICAgICAgIHRoaXMucGFzdGUoKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMzcpXHJcbiAgICAgICAgdGhpcy5yb3RhdGUoKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMzkpXHJcbiAgICAgICAgdGhpcy5yb3RhdGUoZmFsc2UpO1xyXG4gICAgICBlbHNlIGlmIChjb2RlID09PSA3MSlcclxuICAgICAgICB0aGlzLmdyb3VwKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjb2RlID09PSA0NilcclxuICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDM3KVxyXG4gICAgICB0aGlzLm1vdmUoJ0xFRlQnKTtcclxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDM4KVxyXG4gICAgICB0aGlzLm1vdmUoJ1VQJyk7XHJcbiAgICBlbHNlIGlmIChjb2RlID09PSAzOSlcclxuICAgICAgdGhpcy5tb3ZlKCdSSUdIVCcpO1xyXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gNDApXHJcbiAgICAgIHRoaXMubW92ZSgnRE9XTicpO1xyXG4gIH1cclxuXHJcbiAgb25LZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0NvbnRyb2wnKSB7XHJcbiAgICAgIHRoaXMuQ1RSTF9LRVlfRE9XTiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25TY3JvbGwoZXZlbnQpIHsgfVxyXG5cclxuICBzZXRHcm91cGFibGVTdGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLmFwcC5zZWxlY3Rpb25zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgdGhpcy5hcHAudW5ncm91cGFibGUgPSBmYWxzZTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG9iaiA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuICAgIGNvbnN0IHR5cGUgPSBvYmoubmFtZSA/IG9iai5uYW1lLnNwbGl0KCc6JylbMF0gOiAnJztcclxuXHJcbiAgICBpZiAoUkxfVU5HUk9VUEFCTEVTLmluZGV4T2YodHlwZSkgPiAtMSkge1xyXG4gICAgICB0aGlzLmFwcC51bmdyb3VwYWJsZSA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hcHAudW5ncm91cGFibGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0T2JqZWN0U2V0dGluZ3Mob2JqZWN0ICwga2V5LCAgY29sb3IpIHtcclxuICAgIGZhYnJpYy5Hcm91cC5wcm90b3R5cGUuc2VsZWN0aW9uQmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknO1xyXG4gICAgZmFicmljLkdyb3VwLnByb3RvdHlwZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgyNTUsMTAwLDE3MSwwLjI1KSdcclxuICAgIGZhYnJpYy5Hcm91cC5wcm90b3R5cGUuZmlsbCA9ICdyZ2JhKDI1NSwxMDAsMTcxLDAuMjUpJztcclxuICAgIGZhYnJpYy5Hcm91cC5wcm90b3R5cGUuc3Ryb2tlV2lkdGggPSAzXHJcbiAgfVxyXG5cclxuICBvblNlbGVjdGVkKCkge1xyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgLy8gdGhpcy5zZXRPYmplY3RTZXR0aW5ncyhhY3RpdmUsICdmaWxsJywgJ3JlZCcpXHJcbiAgICAvLyAvLyBhY3RpdmUuX3JlbmRlckZpbGwoJ3B1cnBsZScsICgpID0+IHsgfSk7XHJcbiAgICAvLyByZXR1cm47XHJcblxyXG4gICAgYWN0aXZlLmxvY2tTY2FsaW5nWCA9IHRydWUsIGFjdGl2ZS5sb2NrU2NhbGluZ1kgPSB0cnVlO1xyXG4gICAgaWYgKCFhY3RpdmUubmFtZSkge1xyXG4gICAgICBhY3RpdmUubmFtZSA9ICdHUk9VUCc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcHAuc2VsZWN0aW9ucyA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3RzKCk7XHJcbiAgICB0aGlzLnNldEdyb3VwYWJsZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgc2V0U2VsZWN0ZWRPYmplY3RDb2xvcihjb2xvcjogc3RyaW5nKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnaXRlbS4nLCBjb2xvcilcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcbiAgICBpZiAoIWl0ZW0pIHsgcmV0dXJuIH1cclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygnaXRlbS4nLCBpdGVtLm5hbWUpXHJcbiAgICBpZiAoaXRlbS5uYW1lKSB7XHJcbiAgICAgIC8vIGNvbnN0IGpzb24gPSAgdGhpcy52aWV3SlNPTlNlcnZpY2VTZXJ2aWNlLmFsdGVyT2JqZWN0Q29sb3IoaXRlbS5uYW1lLCBjb2xvciwgaXRlbSwgdGhpcy52aWV3KVxyXG4gICAgICAvLyBjb25zdCBuZXdJdGVtID0gYCR7dWlkfTske29yZGVySUR9OyR7bmFtZX1gO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnTmV3IEl0ZW0nLCBuZXdJdGVtKVxyXG4gICAgICAvLyB0aGlzLnNlbGVjdGVkT2JqZWN0Lm5hbWUgPSBuZXdJdGVtO1xyXG5cclxuICAgICAgY29uc3QganNvbiA9IHRoaXMuYWx0ZXJPYmplY3RDb2xvcihpdGVtLm5hbWUsIGNvbG9yLCBpdGVtLCB0aGlzLnZpZXcpO1xyXG5cclxuICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2coanNvbilcclxuICAgICAgLy8gbGV0IG9iamVjdFxyXG4gICAgICAvLyBpZiAodGhpcy5pc0pzb25TdHJ1Y3R1cmUoanNvbikpIHtcclxuICAgICAgLy8gICBvYmplY3QgPSBqc29uXHJcbiAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgIC8vICAgb2JqZWN0ID0gSlNPTi5wYXJzZShqc29uKVxyXG4gICAgICAvLyB9XHJcblxyXG4gICAgICB0aGlzLnZpZXcubG9hZEZyb21KU09OKGpzb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgc2V0T2JqZWN0T3JkZXJJRChvcmRlcklEOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkT2JqZWN0KSB7XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnNlbGVjdGVkT2JqZWN0Py5uYW1lO1xyXG4gICAgICBjb25zdCB1aWQgPSBpdGVtLnNwbGl0KCc7JylbMF07XHJcbiAgICAgIGNvbnN0IG9yZGVyID0gaXRlbS5zcGxpdCgnOycpWzFdO1xyXG4gICAgICBjb25zdCBuYW1lID0gaXRlbS5zcGxpdCgnOycpWzJdO1xyXG5cclxuICAgICAgLy8gY29uc29sZS5sb2coJ3NldE9iamVjdE9yZGVySUQnLCBvcmRlcilcclxuXHJcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSBgJHt1aWR9OyR7b3JkZXJJRH07JHtuYW1lfWA7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdOZXcgSXRlbScsIG5ld0l0ZW0pXHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3QubmFtZSA9IG5ld0l0ZW07XHJcbiAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogaW5pdCB0aGUgY2FudmFzIHZpZXcgJiBiaW5kIGV2ZW50c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuICBzZXRDYW52YXNWaWV3KCkge1xyXG4gICAgY29uc3QgY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoJ21haW4nKTtcclxuICAgIGNhbnZhcy5zZXRXaWR0aChSTF9WSUVXX1dJRFRIICogUkxfRk9PVCk7XHJcbiAgICBjYW52YXMuc2V0SGVpZ2h0KFJMX1ZJRVdfSEVJR0hUICogUkxfRk9PVCk7XHJcbiAgICB0aGlzLnZpZXcgPSBjYW52YXM7XHJcblxyXG4gICAgY29uc3QgY29ybmVyc09mV2FsbCA9IChvYmo6IGZhYnJpYy5MaW5lKSA9PiB7XHJcbiAgICAgIGNvbnN0IGlkID0gTnVtYmVyKG9iai5uYW1lLnNwbGl0KCc6JylbMV0pO1xyXG4gICAgICBjb25zdCB2MUlkID0gaWQ7XHJcbiAgICAgIGNvbnN0IHYxID0gdGhpcy5jb3JuZXJzW3YxSWRdO1xyXG4gICAgICBjb25zdCB2MklkID0gKGlkICsgMSkgJSB0aGlzLndhbGxzLmxlbmd0aDtcclxuICAgICAgY29uc3QgdjIgPSB0aGlzLmNvcm5lcnNbdjJJZF07XHJcbiAgICAgIHJldHVybiB7IHYxLCB2MUlkLCB2MiwgdjJJZCB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ3NlbGVjdGlvbjpjcmVhdGVkJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMub25TZWxlY3RlZCgpO1xyXG4gICAgICBjb25zb2xlLmxvZygnc2VsZWN0aW9uOmNyZWF0ZWQnLCB0aGlzLmFwcC5yb29tRWRpdClcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignc2VsZWN0aW9uOnVwZGF0ZWQnLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5vblNlbGVjdGVkKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzZWxlY3Rpb246dXBkYXRlZCcsIHRoaXMuYXBwLnJvb21FZGl0KVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignc2VsZWN0aW9uOmNsZWFyZWQnLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGlvbjpjbGVhcmVkJywgdGhpcy5hcHAucm9vbUVkaXQpXHJcblxyXG4gICAgICB0aGlzLmFwcC5zZWxlY3Rpb25zID0gW107XHJcbiAgICAgIHRoaXMuYXBwLnVuZ3JvdXBhYmxlID0gZmFsc2U7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ29iamVjdDptb3ZlZCcsICgpID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ29iamVjdDptb3ZlZCcsIHRoaXMuYXBwLnJvb21FZGl0KVxyXG4gICAgICBpZiAodGhpcy5NT1ZFX1dBTExfSUQgIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5NT1ZFX1dBTExfSUQgPSAtMTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy52aWV3Lm9uKCdvYmplY3Q6cm90YXRlZCcsICgpID0+IHRoaXMuc2F2ZVN0YXRlKCkpO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignbW91c2U6ZG93bjpiZWZvcmUnLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBjb25zdCBvYmogPSBlLnRhcmdldDtcclxuICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdCA9IG9iajtcclxuICAgICAgdGhpcy5vdXRQdXRTZWxlY3RlZEl0ZW0uZW1pdChvYmopXHJcblxyXG4gICAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQgJiYgb2JqICYmIG9iaj8ubmFtZS5pbmRleE9mKCdXQUxMJykgPiAtMSAmJiBvYmogaW5zdGFuY2VvZiBMaW5lKSB7XHJcbiAgICAgICAgbGV0IHsgdjEsIHYyLCB2MUlkLCB2MklkIH0gPSBjb3JuZXJzT2ZXYWxsKG9iaik7XHJcbiAgICAgICAgY29uc3QgdjBJZCA9ICh2MUlkID09PSAwKSA/IHRoaXMuY29ybmVycy5sZW5ndGggLSAxIDogdjFJZCAtIDE7XHJcbiAgICAgICAgY29uc3QgdjNJZCA9ICh2MklkID09PSB0aGlzLmNvcm5lcnMubGVuZ3RoIC0gMSkgPyAwIDogdjJJZCArIDE7XHJcbiAgICAgICAgY29uc3QgdjAgPSB0aGlzLmNvcm5lcnNbdjBJZF07XHJcbiAgICAgICAgY29uc3QgdjMgPSB0aGlzLmNvcm5lcnNbdjNJZF07XHJcblxyXG4gICAgICAgIHRoaXMuTU9WRV9XQUxMX0lEID0gdjFJZDtcclxuXHJcbiAgICAgICAgaWYgKCh2MC50b3AgPT09IHYxLnRvcCAmJiB2MS50b3AgPT09IHYyLnRvcCkgfHwgKHYwLmxlZnQgPT09IHYxLmxlZnQgJiYgdjEubGVmdCA9PT0gdjIubGVmdCkpIHtcclxuICAgICAgICAgIHRoaXMuY29ybmVycy5zcGxpY2UodjFJZCwgMCwgdGhpcy5kcmF3Q29ybmVyKG5ldyBQb2ludCh2MS5sZWZ0LCB2MS50b3ApKSk7XHJcbiAgICAgICAgICB0aGlzLk1PVkVfV0FMTF9JRCA9IHYxSWQgKyAxO1xyXG4gICAgICAgICAgdjJJZCArPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCh2MS50b3AgPT09IHYyLnRvcCAmJiB2Mi50b3AgPT09IHYzLnRvcCkgfHwgKHYxLmxlZnQgPT09IHYyLmxlZnQgJiYgdjIubGVmdCA9PT0gdjMubGVmdCkpIHtcclxuICAgICAgICAgIHRoaXMuY29ybmVycy5zcGxpY2UodjJJZCArIDEsIDAsIHRoaXMuZHJhd0Nvcm5lcihuZXcgUG9pbnQodjIubGVmdCwgdjIudG9wKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignb2JqZWN0Om1vdmluZycsIChlOiBmYWJyaWMuSUV2ZW50KSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdvYmplY3Q6bW92aW5nJywgdGhpcy5hcHAucm9vbUVkaXQpXHJcbiAgICAgIGlmICh0aGlzLk1PVkVfV0FMTF9JRCAhPT0gLTEpIHtcclxuICAgICAgICBjb25zdCBwID0gZVsncG9pbnRlciddO1xyXG4gICAgICAgIGNvbnN0IHYxID0gdGhpcy5jb3JuZXJzW3RoaXMuTU9WRV9XQUxMX0lEXTtcclxuICAgICAgICBjb25zdCB2MiA9IHRoaXMuY29ybmVyc1sodGhpcy5NT1ZFX1dBTExfSUQgKyAxKSAlIHRoaXMuY29ybmVycy5sZW5ndGhdO1xyXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHYxLmxlZnQgPT09IHYyLmxlZnQgPyAnSE9SSVpPTlRBTCcgOiAnVkVSVElDQUwnO1xyXG5cclxuICAgICAgICBpZiAocC55IDwgUkxfUk9PTV9PVVRFUl9TUEFDSU5HKSB7IHAueSA9IFJMX1JPT01fT1VURVJfU1BBQ0lORzsgfVxyXG4gICAgICAgIGlmIChwLnggPCBSTF9ST09NX09VVEVSX1NQQUNJTkcpIHsgcC54ID0gUkxfUk9PTV9PVVRFUl9TUEFDSU5HOyB9XHJcblxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdWRVJUSUNBTCcpIHtcclxuICAgICAgICAgIHYxLnRvcCA9IHYyLnRvcCA9IHAueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdjEubGVmdCA9IHYyLmxlZnQgPSBwLng7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG9iaiA9IGUudGFyZ2V0O1xyXG4gICAgICBjb25zdCBwb2ludCA9IGVbJ3BvaW50ZXInXTtcclxuXHJcbiAgICAgIGlmIChvYmogJiYgdGhpcy5pc0RXKG9iaikgJiYgb2JqIGluc3RhbmNlb2YgZmFicmljLkdyb3VwKSB7XHJcbiAgICAgICAgbGV0IHdhbGwsIGRpc3RhbmNlID0gOTk5O1xyXG4gICAgICAgIGNvbnN0IGRpc3QyID0gKHYsIHcpID0+ICh2LnggLSB3LngpICogKHYueCAtIHcueCkgKyAodi55IC0gdy55KSAqICh2LnkgLSB3LnkpO1xyXG4gICAgICAgIGNvbnN0IHBvaW50X3RvX2xpbmUgPSAocCwgdiwgdykgPT4gTWF0aC5zcXJ0KGRpc3RUb1NlZ21lbnRTcXVhcmVkKHAsIHYsIHcpKTtcclxuICAgICAgICBjb25zdCBkaXN0VG9TZWdtZW50U3F1YXJlZCA9IChwLCB2LCB3KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBsMiA9IGRpc3QyKHYsIHcpO1xyXG5cclxuICAgICAgICAgIGlmIChsMiA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gZGlzdDIocCwgdik7XHJcblxyXG4gICAgICAgICAgY29uc3QgdCA9ICgocC54IC0gdi54KSAqICh3LnggLSB2LngpICsgKHAueSAtIHYueSkgKiAody55IC0gdi55KSkgLyBsMjtcclxuXHJcbiAgICAgICAgICBpZiAodCA8IDApXHJcbiAgICAgICAgICAgIHJldHVybiBkaXN0MihwLCB2KTtcclxuXHJcbiAgICAgICAgICBpZiAodCA+IDEpXHJcbiAgICAgICAgICAgIHJldHVybiBkaXN0MihwLCB3KTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gZGlzdDIocCwgeyB4OiB2LnggKyB0ICogKHcueCAtIHYueCksIHk6IHYueSArIHQgKiAody55IC0gdi55KSB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLndhbGxzLmZvckVhY2godyA9PiB7XHJcbiAgICAgICAgICBjb25zdCBkID0gcG9pbnRfdG9fbGluZShwb2ludCwgeyB4OiB3LngxLCB5OiB3LnkxIH0sIHsgeDogdy54MiwgeTogdy55MiB9KTtcclxuICAgICAgICAgIGlmIChkIDwgZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgZGlzdGFuY2UgPSBkLCB3YWxsID0gdztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGRpc3RhbmNlID4gMjApIHtcclxuICAgICAgICAgIHRoaXMuUkVNT1ZFX0RXID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5SRU1PVkVfRFcgPSBmYWxzZTtcclxuICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uT2ZXYWxsKHdhbGwpO1xyXG5cclxuICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IEhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2NhdGVEVyhvYmosIHdhbGwsIHBvaW50LngsIFRvcCh3YWxsKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvY2F0ZURXKG9iaiwgd2FsbCwgTGVmdCh3YWxsKSwgcG9pbnQueSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ21vdXNlOnVwJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgY29uc3Qgb2JqID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICBpZiAodGhpcy5SRU1PVkVfRFcpIHtcclxuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlKG9iaik7XHJcbiAgICAgICAgdGhpcy5SRU1PVkVfRFcgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignbW91c2U6ZGJsY2xpY2snLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBjb25zdCBvYmogPSBlLnRhcmdldDtcclxuXHJcbiAgICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCAmJiB0aGlzLmFwcC5yb29tRWRpdE9wZXJhdGUgPT09ICdDT1JORVInICYmIG9iaiAmJiBvYmoubmFtZS5pbmRleE9mKCdXQUxMJykgPiAtMSAmJiBvYmogaW5zdGFuY2VvZiBMaW5lKSB7XHJcbiAgICAgICAgY29uc3QgcCA9IGVbJ3BvaW50ZXInXTtcclxuICAgICAgICBjb25zdCB7IHYxLCB2MUlkLCB2MiwgdjJJZCB9ID0gY29ybmVyc09mV2FsbChvYmopO1xyXG4gICAgICAgIGNvbnN0IGluZCA9IHYxSWQgPCB2MklkID8gdjFJZCA6IHYySWQ7XHJcblxyXG4gICAgICAgIGlmICh2MS5sZWZ0ID09PSB2Mi5sZWZ0KSB7XHJcbiAgICAgICAgICBwLnggPSB2MS5sZWZ0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodjEudG9wID09PSB2Mi50b3ApIHtcclxuICAgICAgICAgIHAueSA9IHYxLnRvcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld0Nvcm5lciA9IHRoaXMuZHJhd0Nvcm5lcihuZXcgUG9pbnQocC54LCBwLnkpKTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHYxSWQgLSB2MklkKSAhPSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmNvcm5lcnMucHVzaChuZXdDb3JuZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNvcm5lcnMuc3BsaWNlKGluZCArIDEsIDAsIG5ld0Nvcm5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAqIGRyYXcgUm9vbXMgZGVmaW5lZCBpbiBNb2RlbFxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuICBzZXRSb29tKHsgd2lkdGgsIGhlaWdodCB9KSB7XHJcbiAgICBpZiAodGhpcy53YWxscy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy52aWV3LnJlbW92ZSguLi50aGlzLndhbGxzKTtcclxuICAgICAgdGhpcy52aWV3LnJlbmRlckFsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IExUID0gbmV3IFBvaW50KFJMX1JPT01fT1VURVJfU1BBQ0lORywgUkxfUk9PTV9PVVRFUl9TUEFDSU5HKTtcclxuICAgIGNvbnN0IFJUID0gbmV3IFBvaW50KExULnggKyB3aWR0aCwgTFQueSk7XHJcbiAgICBjb25zdCBMQiA9IG5ldyBQb2ludChMVC54LCBMVC55ICsgaGVpZ2h0KTtcclxuICAgIGNvbnN0IFJCID0gbmV3IFBvaW50KFJULngsIExCLnkpO1xyXG5cclxuICAgIHRoaXMuY29ybmVycyA9IFtMVCwgUlQsIFJCLCBMQl0ubWFwKHAgPT4gdGhpcy5kcmF3Q29ybmVyKHApKTtcclxuICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogc2V0IGNvcm5lciBhY2NvcmRpbmcgdG8gY3VycmVudCBlZGl0aW9uIHN0YXR1c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuICBzZXRDb3JuZXJTdHlsZShjOiBmYWJyaWMuUmVjdCkge1xyXG4gICAgYy5tb3ZlQ3Vyc29yID0gdGhpcy52aWV3LmZyZWVEcmF3aW5nQ3Vyc29yO1xyXG4gICAgYy5ob3ZlckN1cnNvciA9IHRoaXMudmlldy5mcmVlRHJhd2luZ0N1cnNvcjtcclxuICAgIGMuc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gICAgYy5ldmVudGVkID0gZmFsc2U7XHJcbiAgICBjLndpZHRoID0gYy5oZWlnaHQgPSAoUkxfUk9PTV9JTk5FUl9TUEFDSU5HIC8gKHRoaXMuYXBwLnJvb21FZGl0ID8gMS41IDogMikpICogMjtcclxuICAgIGMuc2V0KCdmaWxsJywgdGhpcy5hcHAucm9vbUVkaXQgPyBSTF9DT1JORVJfRklMTCA6IFJMX1JPT01fU1RST0tFKTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogZHJhdyBjb3JuZXJcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcbiAgZHJhd0Nvcm5lcihwOiBmYWJyaWMuUG9pbnQpIHtcclxuICAgIGNvbnN0IGMgPSBuZXcgZmFicmljLlJlY3Qoe1xyXG4gICAgICBsZWZ0OiBwLngsXHJcbiAgICAgIHRvcDogcC55LFxyXG4gICAgICBzdHJva2VXaWR0aDogMCxcclxuICAgICAgaGFzQ29udHJvbHM6IGZhbHNlLFxyXG4gICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgIG5hbWU6ICdDT1JORVInXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2V0Q29ybmVyU3R5bGUoYyk7XHJcbiAgICByZXR1cm4gYztcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogZHJhdyByb29tXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG4gIGRyYXdSb29tKCkge1xyXG5cclxuICAgIGNvbnN0IGV4aXN0cyA9IHRoaXMudmlldy5nZXRPYmplY3RzKCkuZmlsdGVyKG9iaiA9PiBvYmoubmFtZS5pbmRleE9mKCdXQUxMJykgPiAtMSB8fCBvYmoubmFtZSA9PT0gJ0NPUk5FUicpO1xyXG4gICAgdGhpcy52aWV3LnJlbW92ZSguLi5leGlzdHMpO1xyXG5cclxuICAgIHRoaXMudmlldy5hZGQoLi4udGhpcy5jb3JuZXJzKTtcclxuXHJcbiAgICBjb25zdCB3YWxsID0gKGNvb3JkczogbnVtYmVyW10sIGluZGV4OiBudW1iZXIpID0+IG5ldyBMaW5lKGNvb3Jkcywge1xyXG4gICAgICBzdHJva2U6IFJMX1JPT01fU1RST0tFLFxyXG4gICAgICBzdHJva2VXaWR0aDogUkxfUk9PTV9JTk5FUl9TUEFDSU5HLFxyXG4gICAgICBuYW1lOiBgV0FMTDoke2luZGV4fWAsXHJcbiAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxyXG4gICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcclxuICAgICAgaG92ZXJDdXJzb3I6IHRoaXMuYXBwLnJvb21FZGl0ID8gdGhpcy52aWV3Lm1vdmVDdXJzb3IgOiB0aGlzLnZpZXcuZGVmYXVsdEN1cnNvcixcclxuICAgICAgaGFzQ29udHJvbHM6IGZhbHNlLFxyXG4gICAgICBoYXNCb3JkZXJzOiBmYWxzZSxcclxuICAgICAgc2VsZWN0YWJsZTogdGhpcy5hcHAucm9vbUVkaXQsXHJcbiAgICAgIGV2ZW50ZWQ6IHRoaXMuYXBwLnJvb21FZGl0LFxyXG4gICAgICBjb3JuZXJTdHlsZTogJ3JlY3QnXHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgTFQgPSBuZXcgUG9pbnQoOTk5OSwgOTk5OSksIFJCID0gbmV3IFBvaW50KDAsIDApO1xyXG5cclxuICAgIHRoaXMud2FsbHMgPSB0aGlzLmNvcm5lcnMubWFwKChjb3JuZXIsIGkpID0+IHtcclxuICAgICAgY29uc3Qgc3RhcnQgPSBjb3JuZXI7XHJcbiAgICAgIGNvbnN0IGVuZCA9IChpID09PSB0aGlzLmNvcm5lcnMubGVuZ3RoIC0gMSkgPyB0aGlzLmNvcm5lcnNbMF0gOiB0aGlzLmNvcm5lcnNbaSArIDFdO1xyXG5cclxuICAgICAgaWYgKGNvcm5lci50b3AgPCBMVC54ICYmIGNvcm5lci5sZWZ0IDwgTFQueSlcclxuICAgICAgICBMVCA9IG5ldyBQb2ludChjb3JuZXIubGVmdCwgY29ybmVyLnRvcCk7XHJcblxyXG4gICAgICBpZiAoY29ybmVyLnRvcCA+IFJCLnkgJiYgY29ybmVyLmxlZnQgPiBSQi55KVxyXG4gICAgICAgIFJCID0gbmV3IFBvaW50KGNvcm5lci5sZWZ0LCBjb3JuZXIudG9wKTtcclxuXHJcbiAgICAgIGNvbnN0IHcgPSB3YWxsKFtzdGFydC5sZWZ0LCBzdGFydC50b3AsIGVuZC5sZWZ0LCBlbmQudG9wXSwgaSk7XHJcbiAgICAgIHJldHVybiB3O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy52aWV3LmFkZCguLi50aGlzLndhbGxzKTtcclxuICAgIHRoaXMud2FsbHMuZm9yRWFjaCh3ID0+IHcuc2VuZFRvQmFjaygpKTtcclxuICAgIHRoaXMuUk9PTV9TSVpFID0geyB3aWR0aDogUkIueCAtIExULngsIGhlaWdodDogUkIueSAtIExULnkgfTtcclxuICB9XHJcblxyXG5cclxuICBsb2NhdGVEVyhkdzogZmFicmljLkdyb3VwLCB3YWxsOiBmYWJyaWMuTGluZSwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGRXYWxsID0gdGhpcy5kaXJlY3Rpb25PZldhbGwod2FsbCk7XHJcbiAgICBjb25zdCBkRFcgPSBkdy5hbmdsZSAlIDE4MCA9PT0gMCA/IEhPUklaT05UQUwgOiBWRVJUSUNBTDtcclxuXHJcbiAgICBpZiAoZFdhbGwgIT0gZERXKSB7XHJcbiAgICAgIGR3LmFuZ2xlID0gKGR3LmFuZ2xlICsgOTApICUgMzYwO1xyXG4gICAgfVxyXG5cclxuICAgIGR3LnRvcCA9IHksIGR3LmxlZnQgPSB4O1xyXG4gICAgY29uc3QgY2VudGVyID0gZHcuZ2V0Q2VudGVyUG9pbnQoKTtcclxuXHJcbiAgICBpZiAoZFdhbGwgPT09IEhPUklaT05UQUwpXHJcbiAgICAgIGNlbnRlci55IDwgZHcudG9wID8gZHcudG9wICs9IE9GRlNFVCA6IGR3LnRvcCAtPSBPRkZTRVQ7XHJcbiAgICBlbHNlXHJcbiAgICAgIGNlbnRlci54IDwgZHcubGVmdCA/IGR3LmxlZnQgKz0gT0ZGU0VUIDogZHcubGVmdCAtPSBPRkZTRVQ7XHJcblxyXG4gICAgcmV0dXJuIGR3O1xyXG4gIH1cclxuXHJcbiAgc2V0RFdPcmlnaW4oZHc6IGZhYnJpYy5Hcm91cCkge1xyXG4gICAgaWYgKCFkdy5mbGlwWCAmJiAhZHcuZmxpcFkpXHJcbiAgICAgIGR3Lm9yaWdpblggPSAnbGVmdCcsIGR3Lm9yaWdpblkgPSAndG9wJztcclxuICAgIGVsc2UgaWYgKGR3LmZsaXBYICYmICFkdy5mbGlwWSlcclxuICAgICAgZHcub3JpZ2luWCA9ICdyaWdodCcsIGR3Lm9yaWdpblkgPSAndG9wJztcclxuICAgIGVsc2UgaWYgKCFkdy5mbGlwWCAmJiBkdy5mbGlwWSlcclxuICAgICAgZHcub3JpZ2luWCA9ICdsZWZ0JywgZHcub3JpZ2luWSA9ICdib3R0b20nO1xyXG4gICAgZWxzZSBpZiAoZHcuZmxpcFggJiYgZHcuZmxpcFkpXHJcbiAgICAgIGR3Lm9yaWdpblggPSAncmlnaHQnLCBkdy5vcmlnaW5ZID0gJ2JvdHRvbSc7XHJcbiAgICByZXR1cm4gZHc7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgZWRpdFJvb20oKSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXcuZ2V0T2JqZWN0cygpLmZvckVhY2gociA9PiB7XHJcbiAgICAgIGlmIChyLm5hbWUuaW5kZXhPZignV0FMTCcpICE9PSAtMSkge1xyXG4gICAgICAgIHIuc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICAgICAgci5ldmVudGVkID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByLnNlbGVjdGFibGUgPSBmYWxzZTtcclxuICAgICAgICByLmV2ZW50ZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0U3RhdGVzLmxlbmd0aCA9PT0gMClcclxuICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIGNhbmNlbFJvb21FZGl0aW9uKCkge1xyXG4gICAgdGhpcy52aWV3LmdldE9iamVjdHMoKS5mb3JFYWNoKHIgPT4ge1xyXG4gICAgICBpZiAoci5uYW1lLmluZGV4T2YoJ1dBTEwnKSAhPT0gLTEgfHwgci5uYW1lLmluZGV4T2YoJ0NPUk5FUicpICE9PSAtMSkge1xyXG4gICAgICAgIHIuc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHIuZXZlbnRlZCA9IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHIuc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICAgICAgci5ldmVudGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRJdGVtU3RhdHVzKHR5cGU6IHN0cmluZywgb2JqZWN0OiBhbnkpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCd0eXBlJywgdHlwZSlcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvYmplY3QnLCBvYmplY3QpXHJcblxyXG4gICAgaWYgKG9iamVjdCAmJiB0eXBlKSAge1xyXG4gICAgICBpZiAodHlwZSA9PT0gJ3RhYmxlJykge1xyXG4gICAgICAgIGlmIChvYmplY3QubmFtZSAhPSAnJykge1xyXG4gICAgICAgICAgY29uc3QgZnVsbE5hbWUgPSBvYmplY3QubmFtZTtcclxuICAgICAgICAgIGNvbnN0IGl0ZW1zID0gb2JqZWN0LnNwbGl0KCc7JylcclxuXHJcbiAgICAgICAgICAvL3R5cGVcclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPj0gMCAmJiBpdGVtc1swXSkge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vaWRcclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPj0gMSAmJiBpdGVtc1sxXSkge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vb3JkZXJcclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPj0gMiAmJiBpdGVtc1syXSkge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vc3RhdHVzXFxcclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPj0gMiAmJiBpdGVtc1szXSkge1xyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09IDMgJiYgaXRlbXNbM10pIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gaXRlbXNbM11cclxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAnJykge1xyXG4gICAgICAgICAgICAgIG9iamVjdC5maWxsID0gJ3B1cnBsZSdcclxuICAgICAgICAgICAgICBvYmplY3Quc3Ryb2tlID0gJ3doaXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gJzEnKSB7XHJcbiAgICAgICAgICAgICAgb2JqZWN0LmZpbGwgPSAnZ3JlZW4nXHJcbiAgICAgICAgICAgICAgb2JqZWN0LnN0cm9rZSA9ICd3aGl0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09ICcyJykge1xyXG4gICAgICAgICAgICAgIG9iamVjdC5maWxsID0gJ3llbGxvdydcclxuICAgICAgICAgICAgICBvYmplY3Quc3Ryb2tlID0gJ3doaXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gJzMnKSB7XHJcbiAgICAgICAgICAgICAgb2JqZWN0LmZpbGwgPSAncmVkJ1xyXG4gICAgICAgICAgICAgIG9iamVjdC5zdHJva2UgPSAnd2hpdGUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG9iamVjdFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlT2JqZWN0SW5zZXJ0aW9uKHsgdHlwZSwgb2JqZWN0IH0pIHtcclxuXHJcbiAgICBpZiAodGhpcy51c2VyTW9kZSkge1xyXG4gICAgICBpZiAodHlwZSA9PT0gJ1JPT00nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRSb29tKG9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGUgPT09ICdST09NJyB8fCB0eXBlID09PSAnRE9PUicgfHwgdHlwZSA9PT0gJ1dJTkRPVycpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9iamVjdCA9ICB0aGlzLnNldEl0ZW1TdGF0dXModHlwZSwgb2JqZWN0KTtcclxuICAgIGxldCBncm91cFxyXG4gICAgaWYgKHR5cGUgPT09ICd0YWJsZScpIHtcclxuICAgICAgY29uc3QgY2hhaXIgPSB7fSBhcyBhbnlcclxuICAgICAgZ3JvdXAgPSBfLmNyZWF0ZVRhYmxlKHR5cGUsIG9iamVjdCwgY2hhaXIpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGUgIT0gJ3RhYmxlJykge1xyXG4gICAgICBncm91cCA9IF8uY3JlYXRlRnVybml0dXJlKHR5cGUsIG9iamVjdCwgdGhpcy5ERUZBVUxUX0NIQUlSKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZSA9PT0gJ0RPT1InIHx8IHR5cGUgPT09ICdXSU5ET1cnKSB7XHJcbiAgICAgIGdyb3VwLm9yaWdpblggPSAnY2VudGVyJztcclxuICAgICAgZ3JvdXAub3JpZ2luWSA9ICd0b3AnO1xyXG5cclxuICAgICAgY29uc3QgZHdzID0gdGhpcy5maWx0ZXJPYmplY3RzKFsnRE9PUicsICdXSU5ET1cnXSk7XHJcbiAgICAgIGNvbnN0IGR3ID0gZHdzLmxlbmd0aCA/IGR3c1tkd3MubGVuZ3RoIC0gMV0gOiBudWxsO1xyXG5cclxuICAgICAgbGV0IHdhbGwsIHgsIHk7XHJcbiAgICAgIGlmICghZHcpIHtcclxuICAgICAgICB3YWxsID0gdGhpcy53YWxsc1swXTtcclxuICAgICAgICB4ID0gTGVmdCh3YWxsKSArIFJMX0FJU0xFR0FQO1xyXG4gICAgICAgIHkgPSBUb3Aod2FsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgb2QgPSBkdy5hbmdsZSAlIDE4MCA9PT0gMCA/IEhPUklaT05UQUwgOiBWRVJUSUNBTDtcclxuXHJcbiAgICAgICAgbGV0IHBsYWNlT25OZXh0V2FsbCA9IGZhbHNlO1xyXG4gICAgICAgIHdhbGwgPSB0aGlzLndhbGxPZkRXKGR3KTtcclxuXHJcbiAgICAgICAgaWYgKG9kID09PSBIT1JJWk9OVEFMKSB7XHJcbiAgICAgICAgICB4ID0gZHcubGVmdCArIGR3LndpZHRoICsgUkxfQUlTTEVHQVA7XHJcbiAgICAgICAgICB5ID0gVG9wKHdhbGwpO1xyXG4gICAgICAgICAgaWYgKHggKyBncm91cC53aWR0aCA+IFJpZ2h0KHdhbGwpKSB7XHJcbiAgICAgICAgICAgIHBsYWNlT25OZXh0V2FsbCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHkgPSBkdy50b3AgKyBkdy53aWR0aCArIFJMX0FJU0xFR0FQO1xyXG4gICAgICAgICAgeCA9IExlZnQod2FsbCk7XHJcbiAgICAgICAgICBpZiAoeSArIGdyb3VwLndpZHRoID4gQm90dG9tKHdhbGwpKSB7XHJcbiAgICAgICAgICAgIHBsYWNlT25OZXh0V2FsbCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxhY2VPbk5leHRXYWxsKSB7XHJcbiAgICAgICAgICB3YWxsID0gdGhpcy53YWxsc1soTnVtYmVyKHdhbGwubmFtZS5zcGxpdCgnOicpWzFdKSArIDEpICUgdGhpcy53YWxscy5sZW5ndGhdO1xyXG4gICAgICAgICAgY29uc3QgbmQgPSB0aGlzLmRpcmVjdGlvbk9mV2FsbCh3YWxsKTtcclxuXHJcbiAgICAgICAgICBpZiAobmQgPT09IEhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgeCA9IExlZnQod2FsbCkgKyBSTF9BSVNMRUdBUCwgeSA9IFRvcCh3YWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHggPSBMZWZ0KHdhbGwpLCB5ID0gVG9wKHdhbGwpICsgUkxfQUlTTEVHQVA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmxvY2F0ZURXKGdyb3VwLCB3YWxsLCB4LCB5KTtcclxuICAgICAgZ3JvdXAuaGFzQm9yZGVycyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnZpZXcuYWRkKGdyb3VwKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHJpZXZlIHNwYWNpbmcgZnJvbSBvYmplY3QsIHVzZSBybEFpc2xlR2FwIGlmIG5vdCBzcGVjaWZpZWRcclxuICAgIGNvbnN0IG5ld0xSID0gb2JqZWN0LmxyU3BhY2luZyB8fCBSTF9BSVNMRUdBUDtcclxuICAgIGNvbnN0IG5ld1RCID0gb2JqZWN0LnRiU3BhY2luZyB8fCBSTF9BSVNMRUdBUDtcclxuXHJcbiAgICAvLyBvYmplY3QgZ3JvdXBzIHVzZSBjZW50ZXIgYXMgb3JpZ2luLCBzbyBhZGQgaGFsZiB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZWlyIHJlcG9ydGVkXHJcbiAgICAvLyB3aWR0aCBhbmQgc2l6ZTsgbm90ZSB0aGF0IHRoaXMgd2lsbCBub3QgYWNjb3VudCBmb3IgY2hhaXJzIGFyb3VuZCB0YWJsZXMsIHdoaWNoIGlzXHJcbiAgICAvLyBpbnRlbnRpb25hbDsgdGhleSBnbyBpbiB0aGUgc3BlY2lmaWVkIGdhcHNcclxuICAgIGdyb3VwLmxlZnQgPSBuZXdMUiArIChncm91cC53aWR0aCAvIDIpICsgdGhpcy5yb29tX29yaWdpbjtcclxuICAgIGdyb3VwLnRvcCA9IG5ld1RCICsgKGdyb3VwLmhlaWdodCAvIDIpICsgdGhpcy5yb29tX29yaWdpbjtcclxuXHJcbiAgICBpZiAodGhpcy5sYXN0T2JqZWN0KSB7XHJcbiAgICAgIC8vIHJldHJpZXZlIHNwYWNpbmcgZnJvbSBvYmplY3QsIHVzZSBybEFpc2xlR2FwIGlmIG5vdCBzcGVjaWZpZWRcclxuICAgICAgY29uc3QgbGFzdExSID0gdGhpcy5sYXN0T2JqZWN0RGVmaW5pdGlvbi5sclNwYWNpbmcgfHwgUkxfQUlTTEVHQVA7XHJcbiAgICAgIGNvbnN0IGxhc3RUQiA9IHRoaXMubGFzdE9iamVjdERlZmluaXRpb24udGJTcGFjaW5nIHx8IFJMX0FJU0xFR0FQO1xyXG5cclxuICAgICAgLy8gY2FsY3VsYXRlIG1heGltdW0gZ2FwIHJlcXVpcmVkIGJ5IGxhc3QgYW5kIHRoaXMgb2JqZWN0XHJcbiAgICAgIC8vIE5vdGU6IHRoaXMgaXNuJ3Qgc21hcnQgZW5vdWdoIHRvIGdldCBuZXcgcm93IGdhcCByaWdodCB3aGVuXHJcbiAgICAgIC8vIG9iamVjdCBhYm92ZSBoYWQgYSBtdWNoIGJpZ2dlciBnYXAsIGV0Yy4gV2UgYXJlbid0IGZpdHRpbmcgeWV0LlxyXG4gICAgICBjb25zdCB1c2VMUiA9IE1hdGgubWF4KG5ld0xSLCBsYXN0TFIpLCB1c2VUQiA9IE1hdGgubWF4KG5ld1RCLCBsYXN0VEIpO1xyXG5cclxuICAgICAgLy8gdXNpbmcgbGVmdC90b3Agdm9jYWIsIHRob3VnaCBhbGwgb2JqZWN0cyBhcmUgbm93IGNlbnRlcmVkXHJcbiAgICAgIGNvbnN0IGxhc3RXaWR0aCA9IHRoaXMubGFzdE9iamVjdERlZmluaXRpb24ud2lkdGggfHwgMTAwO1xyXG4gICAgICBjb25zdCBsYXN0SGVpZ2h0ID0gdGhpcy5sYXN0T2JqZWN0RGVmaW5pdGlvbi5oZWlnaHQgfHwgNDA7XHJcblxyXG4gICAgICBsZXQgbmV3TGVmdCA9IHRoaXMubGFzdE9iamVjdC5sZWZ0ICsgbGFzdFdpZHRoICsgdXNlTFI7XHJcbiAgICAgIGxldCBuZXdUb3AgPSB0aGlzLmxhc3RPYmplY3QudG9wO1xyXG5cclxuICAgICAgLy8gbWFrZSBzdXJlIHdlIGZpdCBsZWZ0IHRvIHJpZ2h0LCBpbmNsdWRpbmcgb3VyIHJlcXVpcmVkIHJpZ2h0IHNwYWNpbmdcclxuICAgICAgaWYgKG5ld0xlZnQgKyBncm91cC53aWR0aCArIG5ld0xSID4gdGhpcy5ST09NX1NJWkUud2lkdGgpIHtcclxuICAgICAgICBuZXdMZWZ0ID0gbmV3TFIgKyAoZ3JvdXAud2lkdGggLyAyKTtcclxuICAgICAgICBuZXdUb3AgKz0gbGFzdEhlaWdodCArIHVzZVRCO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBncm91cC5sZWZ0ID0gbmV3TGVmdDtcclxuICAgICAgZ3JvdXAudG9wID0gbmV3VG9wO1xyXG5cclxuICAgICAgaWYgKChncm91cC5sZWZ0IC0gZ3JvdXAud2lkdGggLyAyKSA8IHRoaXMucm9vbV9vcmlnaW4pIHsgZ3JvdXAubGVmdCArPSB0aGlzLnJvb21fb3JpZ2luOyB9XHJcbiAgICAgIGlmICgoZ3JvdXAudG9wIC0gZ3JvdXAuaGVpZ2h0IC8gMikgPCB0aGlzLnJvb21fb3JpZ2luKSB7IGdyb3VwLnRvcCArPSB0aGlzLnJvb21fb3JpZ2luOyB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3JvdXAuZmlsbCA9ICdibHVlJ1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2dyb3VwJywgZ3JvdXApO1xyXG5cclxuICAgIHRoaXMudmlldy5hZGQoZ3JvdXApO1xyXG4gICAgdGhpcy52aWV3LnNldEFjdGl2ZU9iamVjdChncm91cCk7XHJcblxyXG4gICAgdGhpcy5sYXN0T2JqZWN0ID0gZ3JvdXA7XHJcbiAgICB0aGlzLmxhc3RPYmplY3REZWZpbml0aW9uID0gb2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgLyoqIFNhdmUgY3VycmVudCBzdGF0ZSAqL1xyXG4gIHNhdmVTdGF0ZSgpIHtcclxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy52aWV3LnRvRGF0YWxlc3NKU09OKFsnbmFtZScsICdoYXNDb250cm9scycsICdzZWxlY3RhYmxlJywgJ2hhc0JvcmRlcnMnLCAnZXZlbnRlZCcsICdob3ZlckN1cnNvcicsICdtb3ZlQ3Vyc29yJ10pO1xyXG4gICAgdGhpcy5hcHAuc2F2ZVN0YXRlLm5leHQoSlNPTi5zdHJpbmdpZnkoc3RhdGUpKTtcclxuICB9XHJcblxyXG4gIHVuZG8oKSB7XHJcbiAgICBsZXQgY3VycmVudCA9IG51bGw7XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5hcHAucm9vbUVkaXRTdGF0ZXMucG9wKCk7XHJcbiAgICAgIHRoaXMuYXBwLnJvb21FZGl0UmVkb1N0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgY3VycmVudCA9IHRoaXMuYXBwLnJvb21FZGl0U3RhdGVzW3RoaXMuYXBwLnJvb21FZGl0U3RhdGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmFwcC5zdGF0ZXMucG9wKCk7XHJcbiAgICAgIHRoaXMuYXBwLnJlZG9TdGF0ZXMucHVzaChzdGF0ZSk7XHJcbiAgICAgIGN1cnJlbnQgPSB0aGlzLmFwcC5zdGF0ZXNbdGhpcy5hcHAuc3RhdGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5jbGVhcigpO1xyXG5cclxuICAgIHRoaXMudmlldy5sb2FkRnJvbUpTT04oY3VycmVudCwgKCkgPT4ge1xyXG4gICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICAgIHRoaXMuY29ybmVycyA9IHRoaXMudmlldy5nZXRPYmplY3RzKCkuZmlsdGVyKG9iaiA9PiBvYmoubmFtZSA9PT0gJ0NPUk5FUicpO1xyXG4gICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogUmVkbyBvcGVyYXRpb24gKi9cclxuICByZWRvKCkge1xyXG4gICAgbGV0IGN1cnJlbnQgPSBudWxsO1xyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICBjdXJyZW50ID0gdGhpcy5hcHAucm9vbUVkaXRSZWRvU3RhdGVzLnBvcCgpO1xyXG4gICAgICB0aGlzLmFwcC5yb29tRWRpdFN0YXRlcy5wdXNoKGN1cnJlbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VycmVudCA9IHRoaXMuYXBwLnJlZG9TdGF0ZXMucG9wKCk7XHJcbiAgICAgIHRoaXMuYXBwLnN0YXRlcy5wdXNoKGN1cnJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5jbGVhcigpO1xyXG4gICAgdGhpcy52aWV3LmxvYWRGcm9tSlNPTihjdXJyZW50LCAoKSA9PiB7XHJcbiAgICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgICAgdGhpcy5jb3JuZXJzID0gdGhpcy52aWV3LmdldE9iamVjdHMoKS5maWx0ZXIob2JqID0+IG9iai5uYW1lID09PSAnQ09STkVSJyk7XHJcbiAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqIENvcHkgb3BlcmF0aW9uICovXHJcbiAgY29weSgpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcbiAgICBpZiAoIWFjdGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhY3RpdmUuY2xvbmUoY2xvbmVkID0+IHRoaXMuYXBwLmNvcGllZCA9IGNsb25lZCwgWyduYW1lJywgJ2hhc0NvbnRyb2xzJ10pO1xyXG4gIH1cclxuXHJcbiAgLyoqIFBhc3RlIG9wZXJhdGlvbiAqL1xyXG4gIHBhc3RlKCkge1xyXG5cclxuICAgIGlmICggdGhpcy51c2VyTW9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmFwcC5jb3BpZWQgfHwgdGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hcHAuY29waWVkLmNsb25lKChjbG9uZWQpID0+IHtcclxuICAgICAgdGhpcy52aWV3LmRpc2NhcmRBY3RpdmVPYmplY3QoKTtcclxuICAgICAgY2xvbmVkLnNldCh7XHJcbiAgICAgICAgbGVmdDogY2xvbmVkLmxlZnQgKyBSTF9BSVNMRUdBUCxcclxuICAgICAgICB0b3A6IGNsb25lZC50b3AgKyBSTF9BSVNMRUdBUFxyXG4gICAgICB9KTtcclxuICAgICAgaWYgKGNsb25lZC50eXBlID09PSAnYWN0aXZlU2VsZWN0aW9uJykge1xyXG4gICAgICAgIGNsb25lZC5jYW52YXMgPSB0aGlzLnZpZXc7XHJcbiAgICAgICAgY2xvbmVkLmZvckVhY2hPYmplY3Qob2JqID0+IHRoaXMudmlldy5hZGQob2JqKSk7XHJcbiAgICAgICAgY2xvbmVkLnNldENvb3JkcygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudmlldy5hZGQoY2xvbmVkKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFwcC5jb3BpZWQudG9wICs9IFJMX0FJU0xFR0FQO1xyXG4gICAgICB0aGlzLmFwcC5jb3BpZWQubGVmdCArPSBSTF9BSVNMRUdBUDtcclxuICAgICAgdGhpcy52aWV3LnNldEFjdGl2ZU9iamVjdChjbG9uZWQpO1xyXG4gICAgICB0aGlzLnZpZXcucmVxdWVzdFJlbmRlckFsbCgpO1xyXG4gICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgfSwgWyduYW1lJywgJ2hhc0NvbnRyb2xzJ10pO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJMYXlvdXQoKSB7XHJcbiAgICB0aGlzLmFwcC5sb2FkSnNvbignJyk7XHJcbiAgICAvLyB0aGlzLnZpZXcuY2xlYXIoKTtcclxuICAgIHRoaXMuaW5pdExheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlbGV0ZSBvcGVyYXRpb24gKi9cclxuICBkZWxldGUoKSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgY29uc29sZS5sb2coJ25vIGl0ZW1zJylcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5zZWxlY3Rpb25zKSB7XHJcbiAgICAgIHRoaXMuYXBwLnNlbGVjdGlvbnMuZm9yRWFjaChzZWxlY3Rpb24gPT4gdGhpcy52aWV3LnJlbW92ZShzZWxlY3Rpb24pKTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMudmlldy5kaXNjYXJkQWN0aXZlT2JqZWN0KCk7XHJcbiAgICAgIHRoaXMudmlldy5yZXF1ZXN0UmVuZGVyQWxsKCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlcnJvcilcclxuICAgIH1cclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogUm90YXRlIE9wZXJhdGlvbiAqL1xyXG4gIHJvdGF0ZShjbG9ja3dpc2UgPSB0cnVlKSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBhbmdsZSA9IHRoaXMuQ1RSTF9LRVlfRE9XTiA/IDkwIDogMTU7XHJcbiAgICBjb25zdCBvYmogPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcblxyXG4gICAgaWYgKCFvYmopIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgaWYgKChvYmoub3JpZ2luWCAhPT0gJ2NlbnRlcicgfHwgb2JqLm9yaWdpblkgIT09ICdjZW50ZXInKSAmJiBvYmouY2VudGVyZWRSb3RhdGlvbikge1xyXG4gICAgICBvYmoub3JpZ2luWCA9ICdjZW50ZXInO1xyXG4gICAgICBvYmoub3JpZ2luWSA9ICdjZW50ZXInO1xyXG4gICAgICBvYmoubGVmdCArPSBvYmoud2lkdGggLyAyO1xyXG4gICAgICBvYmoudG9wICs9IG9iai5oZWlnaHQgLyAyO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRFcob2JqKSkge1xyXG4gICAgICBhbmdsZSA9IG9iai5hbmdsZSArIChjbG9ja3dpc2UgPyAxODAgOiAtMTgwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFuZ2xlID0gb2JqLmFuZ2xlICsgKGNsb2Nrd2lzZSA/IGFuZ2xlIDogLWFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYW5nbGUgPiAzNjApIHsgYW5nbGUgLT0gMzYwOyB9IGVsc2UgaWYgKGFuZ2xlIDwgMCkgeyBhbmdsZSArPSAzNjA7IH1cclxuXHJcbiAgICBvYmouYW5nbGUgPSBhbmdsZTtcclxuICAgIHRoaXMudmlldy5yZXF1ZXN0UmVuZGVyQWxsKCk7XHJcbiAgfVxyXG5cclxuICAvKiogR3JvdXAgKi9cclxuICBncm91cCgpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgaWYgKCEodGhpcy5hcHAuc2VsZWN0aW9ucy5sZW5ndGggPiAxICYmIGFjdGl2ZSBpbnN0YW5jZW9mIGZhYnJpYy5BY3RpdmVTZWxlY3Rpb24pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmUudG9Hcm91cCgpO1xyXG4gICAgYWN0aXZlLmxvY2tTY2FsaW5nWCA9IHRydWUsIGFjdGl2ZS5sb2NrU2NhbGluZ1kgPSB0cnVlO1xyXG4gICAgdGhpcy5vblNlbGVjdGVkKCk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdW5ncm91cCgpIHtcclxuICAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgaWYgKCEoYWN0aXZlICYmIGFjdGl2ZSBpbnN0YW5jZW9mIGZhYnJpYy5Hcm91cCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2ZS50b0FjdGl2ZVNlbGVjdGlvbigpO1xyXG4gICAgYWN0aXZlLmxvY2tTY2FsaW5nWCA9IHRydWUsIGFjdGl2ZS5sb2NrU2NhbGluZ1kgPSB0cnVlO1xyXG4gICAgdGhpcy5vblNlbGVjdGVkKCk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgbW92ZShkaXJlY3Rpb24sIGluY3JlYW1lbnQgPSA2KSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuICAgIGlmICghYWN0aXZlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICBjYXNlICdMRUZUJzpcclxuICAgICAgICBhY3RpdmUubGVmdCAtPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdVUCc6XHJcbiAgICAgICAgYWN0aXZlLnRvcCAtPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdSSUdIVCc6XHJcbiAgICAgICAgYWN0aXZlLmxlZnQgKz0gaW5jcmVhbWVudDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnRE9XTic6XHJcbiAgICAgICAgYWN0aXZlLnRvcCArPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdGhpcy52aWV3LnJlcXVlc3RSZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBzZXRab29tKCkge1xyXG4gICAgdGhpcy52aWV3LnNldFpvb20odGhpcy5hcHAuem9vbSAvIDEwMCk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgfVxyXG5cclxuICBwbGFjZUluQ2VudGVyKGRpcmVjdGlvbikge1xyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuXHJcbiAgICBpZiAoIWFjdGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ0hPUklaT05UQUwnKSB7XHJcbiAgICAgIGFjdGl2ZS5sZWZ0ID0gdGhpcy5ST09NX1NJWkUud2lkdGggLyAyIC0gKGFjdGl2ZS5vcmlnaW5YID09PSAnY2VudGVyJyA/IDAgOiBhY3RpdmUud2lkdGggLyAyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFjdGl2ZS50b3AgPSB0aGlzLlJPT01fU0laRS5oZWlnaHQgLyAyIC0gKGFjdGl2ZS5vcmlnaW5YID09PSAnY2VudGVyJyA/IDAgOiBhY3RpdmUuaGVpZ2h0IC8gMik7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZlLnNldENvb3JkcygpO1xyXG4gICAgdGhpcy52aWV3LnJlcXVlc3RSZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBhcnJhbmdlKGFjdGlvbjogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy5nZXRCb3VuZGluZ1JlY3QodGhpcy5hcHAuc2VsZWN0aW9ucyk7XHJcbiAgICBhY3Rpb24gPSBhY3Rpb24udG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuYXBwLnNlbGVjdGlvbnMuZm9yRWFjaChzID0+IHtcclxuICAgICAgaWYgKGFjdGlvbiA9PT0gJ2xlZnQnIHx8IGFjdGlvbiA9PT0gJ3JpZ2h0JyB8fCBhY3Rpb24gPT09ICdjZW50ZXInKSB7XHJcbiAgICAgICAgcy5sZWZ0ID0gcmVjdFthY3Rpb25dO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHMudG9wID0gcmVjdFthY3Rpb25dO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBmaWx0ZXJPYmplY3RzKG5hbWVzOiBzdHJpbmdbXSkge1xyXG4gICAgcmV0dXJuIHRoaXMudmlldy5nZXRPYmplY3RzKCkuZmlsdGVyKG9iaiA9PiBuYW1lcy5zb21lKG4gPT4gb2JqLm5hbWUuaW5kZXhPZihuKSA+IC0xKSk7XHJcbiAgfVxyXG5cclxuICB3YWxsT2ZEVyhkdzogZmFicmljLkdyb3VwIHwgZmFicmljLk9iamVjdCkge1xyXG4gICAgY29uc3QgZCA9IGR3LmFuZ2xlICUgMTgwID09PSAwID8gSE9SSVpPTlRBTCA6IFZFUlRJQ0FMO1xyXG4gICAgcmV0dXJuIHRoaXMud2FsbHMuZmluZCh3ID0+IE1hdGguYWJzKGQgPT09IEhPUklaT05UQUwgPyB3LnRvcCAtIGR3LnRvcCA6IHcubGVmdCAtIGR3LmxlZnQpID09PSBPRkZTRVQpO1xyXG4gIH1cclxuXHJcbiAgZGlyZWN0aW9uT2ZXYWxsKHdhbGw6IGZhYnJpYy5MaW5lKSB7XHJcbiAgICBpZiAod2FsbC54MSA9PT0gd2FsbC54Mikge1xyXG4gICAgICByZXR1cm4gVkVSVElDQUw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gSE9SSVpPTlRBTDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzRFcob2JqZWN0KSB7XHJcbiAgICByZXR1cm4gb2JqZWN0Lm5hbWUuaW5kZXhPZignRE9PUicpID4gLTEgfHwgb2JqZWN0Lm5hbWUuaW5kZXhPZignV0lORE9XJykgPiAtMTtcclxuICB9XHJcblxyXG4gIGdldEJvdW5kaW5nUmVjdChvYmplY3RzOiBhbnlbXSkge1xyXG4gICAgbGV0IHRvcCA9IDk5OTksIGxlZnQgPSA5OTk5LCByaWdodCA9IDAsIGJvdHRvbSA9IDA7XHJcbiAgICBvYmplY3RzLmZvckVhY2gob2JqID0+IHtcclxuICAgICAgaWYgKG9iai5sZWZ0IDwgdG9wKSB7XHJcbiAgICAgICAgdG9wID0gb2JqLnRvcDtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2JqLmxlZnQgPCBsZWZ0KSB7XHJcbiAgICAgICAgbGVmdCA9IG9iai5sZWZ0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChvYmoudG9wID4gYm90dG9tKSB7XHJcbiAgICAgICAgYm90dG9tID0gb2JqLnRvcDtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2JqLmxlZnQgPiByaWdodCkge1xyXG4gICAgICAgIHJpZ2h0ID0gb2JqLmxlZnQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGNlbnRlciA9IChsZWZ0ICsgcmlnaHQpIC8gMjtcclxuICAgIGNvbnN0IG1pZGRsZSA9ICh0b3AgKyBib3R0b20pIC8gMjtcclxuXHJcbiAgICByZXR1cm4geyBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b20sIGNlbnRlciwgbWlkZGxlIH07XHJcbiAgfVxyXG5cclxuICBzYXZlQXMoZm9ybWF0OiBzdHJpbmcpIHtcclxuXHJcbiAgICBjb25zdCB7IHJpZ2h0LCBib3R0b20gfSA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KHRoaXMuY29ybmVycyk7XHJcbiAgICBjb25zdCB3aWR0aCAgPSB0aGlzLnZpZXcuZ2V0V2lkdGgoKTtcclxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMudmlldy5nZXRIZWlnaHQoKTtcclxuXHJcbiAgICB0aGlzLnZpZXcuc2V0V2lkdGgocmlnaHQgKyBSTF9ST09NX09VVEVSX1NQQUNJTkcpO1xyXG4gICAgdGhpcy52aWV3LnNldEhlaWdodChib3R0b20gKyBSTF9ST09NX09VVEVSX1NQQUNJTkcgKyAxMik7XHJcblxyXG4gICAgLy8gdGhpcy52aWV3LnNldEJhY2tncm91bmRDb2xvcigncHVycGxlJywgKCkgPT4geyB9KTtcclxuXHJcbiAgICBjb25zdCBjcmVkaXQgPSBuZXcgZmFicmljLlRleHQoUkxfQ1JFRElUX1RFWFQsXHJcbiAgICAgIHtcclxuICAgICAgICAuLi5STF9DUkVESVRfVEVYVF9QQVJBTVMsXHJcbiAgICAgICAgbGVmdDogUkxfUk9PTV9PVVRFUl9TUEFDSU5HLFxyXG4gICAgICAgIHRvcDogYm90dG9tICsgUkxfUk9PTV9PVVRFUl9TUEFDSU5HIC0gUkxfQ1JFRElUX1RFWFRfUEFSQU1TLmZvbnRTaXplXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgdGhpcy52aWV3LmFkZChjcmVkaXQpO1xyXG4gICAgdGhpcy52aWV3LmRpc2NhcmRBY3RpdmVPYmplY3QoKTtcclxuICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuXHJcbiAgICBjb25zdCByZXN0b3JlID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlKGNyZWRpdCk7XHJcbiAgICAgIHRoaXMudmlldy5zZXRCYWNrZ3JvdW5kQ29sb3IoJ3RyYW5zcGFyZW50JywgKCkgPT4geyB9KTtcclxuICAgICAgdGhpcy52aWV3LnNldFdpZHRoKHdpZHRoKTtcclxuICAgICAgdGhpcy52aWV3LnNldEhlaWdodChoZWlnaHQpO1xyXG4gICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChmb3JtYXQgPT09ICdQTkcnKSB7XHJcbiAgICAgIGNvbnN0IGNhbnZhczogYW55ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcclxuICAgICAgY2FudmFzLnRvQmxvYigoYmxvYjogQmxvYikgPT4ge1xyXG4gICAgICAgIHNhdmVBcyhibG9iLCBgcm9vbV9sYXlvdXRfJHtmb3JtYXREYXRlKG5ldyBEYXRlKCksICd5eXl5LU1NLWRkLWhoLW1tLXNzJywgJ2VuJyl9LnBuZ2ApO1xyXG4gICAgICAgIHJlc3RvcmUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ1NWRycpIHtcclxuICAgICAgY29uc3Qgc3ZnID0gdGhpcy52aWV3LnRvU1ZHKCk7XHJcbiAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbc3ZnXSwgeyB0eXBlOiAnaW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PXV0Zi04JyB9KTtcclxuICAgICAgc2F2ZUFzKGJsb2IsIGByb29tX2xheW91dF8ke2Zvcm1hdERhdGUobmV3IERhdGUoKSwgJ3l5eXktTU0tZGQtaGgtbW0tc3MnLCAnZW4nKX0uc3ZnYCk7XHJcbiAgICAgIHJlc3RvcmUoKTtcclxuICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09PSAnanNvbicpIHtcclxuICAgICAgY29uc3QganNvbiAgPSB0aGlzLnZpZXcudG9KU09OKFsnbmFtZSddKTtcclxuICAgICAgdGhpcy5hcHAuanNvblZhbHVlLm5leHQoanNvbilcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBkaXNhYmxlU2VsZXRpb24oKXtcclxuICAgIC8vIGlmICh0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIC8vIHRoaXMudmlldy5mb3JFYWNoT2JqZWN0KGZ1bmN0aW9uKG8pIHtcclxuICAgICAgLy8gICBvLnNlbGVjdGFibGUgPSBmYWxzZTtcclxuICAgICAgLy8gfSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgdGhpcy52aWV3LmdldE9iamVjdHMoKS5mb3JFYWNoKChvYmosIGluZGV4KSA9PiB7XHJcbiAgICAgICAgb2JqLnNlbGVjdGFibGUgPSBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHRoaXMudmlldyA9IG5ldyBmYWJyaWMuU3RhdGljQ2FudmFzKHRoaXMudmlldyk7XHJcblxyXG4gICAgLy8gaWYgKHRoaXMudXNlck1vZGUpIHtcclxuICAgIC8vICAgdGhpcy5tYWluY29udGFpbmVyQ2xhc3MgPSAnbWFpbi1jb250YWluZXItdXNlcm1vZGUnXHJcbiAgICAvLyAgIHRoaXMudXNlck1vZGUgPSB0cnVlO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIGlmICghdGhpcy51c2VyTW9kZSkge1xyXG4gICAgLy8gICB0aGlzLm1haW5jb250YWluZXJDbGFzcyA9ICdtYWluLWNvbnRhaW5lcidcclxuICAgIC8vICAgdGhpcy51c2VyTW9kZSA9IGZhbHNlO1xyXG4gICAgLy8gfVxyXG5cclxuICB9XHJcblxyXG4gIGxvYWRKU09OKCkge1xyXG4gICAgdGhpcy5hcHAuanNvblZhbHVlLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICBpZiAodGhpcy51c2VyTW9kZSkge1xyXG4gICAgICAgICAgdGhpcy5tYWluY29udGFpbmVyQ2xhc3MgPSAnbWFpbi1jb250YWluZXItdXNlcm1vZGUnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy51c2VyTW9kZSkge1xyXG4gICAgICAgICAgdGhpcy5tYWluY29udGFpbmVyQ2xhc3MgPSAnbWFpbi1jb250YWluZXInXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWRhdGEgfHwgZGF0YSA9PSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLnZpZXcubG9hZEZyb21KU09OKG51bGwsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG9iamVjdFxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc0pzb25TdHJ1Y3R1cmUoZGF0YSkpIHtcclxuICAgICAgICAgIG9iamVjdCA9IGRhdGFcclxuICAgICAgICAgIGNvbnN0IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG9iamVjdCA9IEpTT04ucGFyc2UoZGF0YSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgICAgICB0aGlzLnZpZXcubG9hZEZyb21KU09OKG9iamVjdCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMudXNlck1vZGUpIHtcclxuICAgICAgICAgIHRoaXMudmlldy5sb2FkRnJvbUpTT04ob2JqZWN0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy52aWV3LnJlbmRlckFsbCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBpc0pzb25TdHJ1Y3R1cmUoc3RyKSB7XHJcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiBmYWxzZTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IEpTT04ucGFyc2Uoc3RyKTtcclxuICAgICAgY29uc3QgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChyZXN1bHQpO1xyXG4gICAgICByZXR1cm4gdHlwZSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcclxuICAgICAgICAgICAgIHx8IHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBzYXZlVG9KU09OKCkge1xyXG4gIC8vICAgY29uc3QgY2FudmFzOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xyXG4gIC8vICAgY29uc3QganNvbiA9IGNhbnZhcy50b0pTT04oWyduYW1lJ10pXHJcbiAgLy8gICByZXR1cm4ganNvblxyXG4gIC8vIH1cclxuXHJcbiAgYWx0ZXJPYmplY3RDb2xvcihuYW1lOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcsIG9iajogYW55LCB2aWV3OiBhbnkpIHtcclxuICAgIGxldCBqc29uXHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICBqc29uID0gdmlldy50b0pTT04oWyduYW1lJ10pO1xyXG4gICAgICBpZiAoanNvbi5vYmplY3RzKSB7XHJcbiAgICAgICAgaWYgKGpzb24ub2JqZWN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBqc29uLm9iamVjdHMuZm9yRWFjaChkYXRhID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FsdGVyT2JqZWN0Q29sb3IgZGF0YT8uYmFja2dyb3VuZENvbG9yJywgZGF0YT8uYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICBpZiAoZGF0YT8ubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdwdXJwbGUnIHx8IGRhdGE/LmJhY2tncm91bmRDb2xvciA9PT0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2UgPSBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2VXaWR0aCA9IDEwXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaXRlbSBjb2xvciBjaGFuZ2VkIDEnLCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdwdXJwbGUnIHx8IGRhdGE/LmJhY2tncm91bmRDb2xvciA9PT0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2UgPSBjb2xvclxyXG4gICAgICAgICAgICAgICAgZGF0YS5zdHJva2VXaWR0aCA9IDEwXHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaXRlbSBjb2xvciBjaGFuZ2VkIDEnLCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICB0aGlzLmFwcC5hbHRlckNvbG9yKCdyZWQnLCBkYXRhKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodmlldyAmJiBqc29uKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdsb2FkaW5nIGpzb24nKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBqc29uIDtcclxuICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwiPGRpdiBbY2xhc3NdPVwibWFpbmNvbnRhaW5lckNsYXNzXCIgID5cclxuICA8Y2FudmFzICBpZD1cIm1haW5cIj48L2NhbnZhcz5cclxuPC9kaXY+XHJcbiJdfQ==