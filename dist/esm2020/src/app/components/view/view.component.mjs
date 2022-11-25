import { Component, EventEmitter, Output, Input } from '@angular/core';
import { fabric } from 'fabric';
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
    constructor(app) {
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
        try {
            this.app.setSelectedObjectColor.subscribe(data => {
                this.alterObjectColor(data.uuid, data.color);
                console.log('alter object color');
            });
            this.view.renderAll();
        }
        catch (error) {
        }
        try {
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
        }
        catch (error) {
        }
        try {
            this.app.insertObject.subscribe(res => {
                this.handleObjectInsertion(res);
                this.saveState();
            });
        }
        catch (error) {
        }
        this.app.defaultChair.subscribe(res => this.DEFAULT_CHAIR = res);
        try {
            this.app.selectedBackGroundImage.subscribe(data => {
                this.setBackgroundImage(data);
            });
        }
        catch (error) {
        }
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
                case 'setTableName':
                    this.setTableName(this.app.tableName);
                    break;
                case 'setOrderID':
                    if (this.app.clearNextSelectedTable) {
                        this.setObjectOrderID('');
                        this.app.clearNextSelectedTable = false;
                        return;
                    }
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
                    // this.drawRoom();
                    break;
                case 'PNG':
                    break;
                case 'loadjson':
                    this.loadJSON();
                    break;
                case 'save':
                    this.saveState();
                    break;
                case 'json':
                    this.saveState();
                    break;
                case 'saveFullJson':
                    this.app.jsonValue.next(JSON.stringify(this.view.toJSON(['name'])));
                    break;
                case 'ZOOM':
                    this.setZoom();
                    break;
                case 'InitLayout':
                    this.initLayout();
                    break;
                case 'disableSelection':
                    this.toggleSelection(false);
                    break;
                case 'disableSelection':
                    this.toggleSelection(true);
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
        this.app.saveState.next(JSON.stringify(null));
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
        try {
            const type = obj.name ? obj.name.split(':')[0] : '';
            if (RL_UNGROUPABLES.indexOf(type) > -1) {
                this.app.ungroupable = false;
            }
            else {
                this.app.ungroupable = true;
            }
        }
        catch (error) {
        }
    }
    setObjectSettings(object, key, color) {
        fabric.Group.prototype.selectionBackgroundColor = 'rgba(255,100,171,0.25)';
        fabric.Group.prototype.backgroundColor = 'rgba(255,100,171,0.25)';
        fabric.Group.prototype.fill = 'rgba(255,100,171,0.25)';
        fabric.Group.prototype.strokeWidth = 3;
    }
    onSelected() {
        if (!this.view) {
            console.log('view is undefined');
            return;
        }
        const active = this.view.getActiveObject();
        if (!this.view || !active) {
            console.log('active is undefined');
            return;
        }
        // this.setObjectSettings(active, 'fill', 'red')
        // // active._renderFill('purple', () => { });
        // return;
        try {
            active.lockScalingX = true, active.lockScalingY = true;
            if (!active.name) {
                active.name = 'GROUP';
            }
        }
        catch (error) {
        }
        this.app.selections = this.view.getActiveObjects();
        this.setGroupableState();
    }
    setSelectedObjectColor(item, color, saveState) {
        // const item = this.view.getActiveObject();
        if (!item) {
            return;
        }
        if (item.name) {
            const uid = item.name.split(';')[0];
            // const json = this.alterObjectColor(item.name, color);
            this.drawRoom();
            this.saveState();
            // this.view.loadFromJSON(json, function() { });
        }
        return;
    }
    setBackgroundImage(image) {
        if (!image || image === '') {
            return;
        }
        this.view.setBackgroundImage(image, this.view.renderAll.bind(this.view), {});
    }
    setObjectOrderID(orderID) {
        if (this.selectedObject) {
            const item = this.selectedObject?.name;
            if (item) {
                const uid = item.split(';')[0];
                const name = item.split(';')[2];
                let status = item.split(';')[3];
                status = this.getStatusDescription(orderID);
                const newItem = `${uid};${orderID};${name};${status}`;
                // if (!orderID) {
                //   this.alterObjectColor(uid, 'red')
                // }
                // if (!orderID)  {
                //   this.alterObjectColor(uid, 'green')
                // }
                this.selectedObject.name = newItem;
                // this.saveState();
            }
        }
    }
    getStatusDescription(orderID) {
        let status;
        if (orderID) {
            if (status) {
                status = 'active';
            }
        }
        if (!orderID) {
            if (!status) {
                status = 'inactive';
            }
        }
        return status;
    }
    setTableName(name) {
        if (this.selectedObject) {
            let order;
            let status;
            let uuid;
            const item = this.selectedObject?.name;
            if (item && (item.split(';').length > 0 || item.split(';').length == 0)) {
                uuid = item.split(';')[0];
            }
            // if (item && (item.split(';').length>1 || item.split(';').length == 1) ){
            //    uid   = item.split(';')[1];
            // }
            // if (item && (item.split(';').length>2 || item.split(';').length == 2) ){
            //    name   = item.split(';')[2];
            // }
            // if (item && (item.split(';').length>3 || item.split(';').length == 3) ){
            //    status   = item.split(';')[3];
            // }
            status = 'inactive';
            const newItem = `${uuid};${order};${name};${status}`;
            console.log('newItem', newItem);
            this.selectedObject.name = newItem;
            this.saveState();
            this.app.tableName = '';
        }
    }
    setTableStatus(status) {
        if (this.selectedObject) {
            const item = this.selectedObject?.name;
            const uid = item.split(';')[0];
            const order = item.split(';')[1];
            const name = item.split(';')[2];
            const newItem = `${uid};${order};${name};${status}`;
            this.selectedObject.name = newItem;
            this.saveState();
            this.app.tableStatus = '';
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
            // console.log('selection:created', this.app.roomEdit)
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
            this.app.selections = [];
            const obj = e.target;
            this.selectedObject = obj;
            this.app.selections.push(obj);
            this.app.selectededObject.next(obj);
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
            ;
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
        let exists;
        try {
            exists = this.view.getObjects().filter(obj => obj.name.indexOf('WALL') > -1 || obj.name === 'CORNER');
        }
        catch (error) {
        }
        try {
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
        catch (error) {
        }
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
        if (this.view.getObjects()) {
            let items = this.view.getObjects();
            items.forEach(r => {
                if ((r === null || r === void 0 ? void 0 : r?.name?.indexOf('WALL')) !== -1) {
                    r.selectable = false;
                    r.evented = false;
                }
                else {
                    if (this.app.userMode) {
                        r.selectable = false;
                        r.evented = true;
                    }
                    if (!this.app.userMode) {
                        r.selectable = true;
                        r.evented = true;
                    }
                }
            });
        }
        if (this.app.roomEditStates.length === 0)
            this.saveState();
    }
    cancelRoomEdition() {
        this.view.getObjects().forEach(r => {
            try {
                if (r.name.indexOf('WALL') !== -1 || r.name.indexOf('CORNER') !== -1) {
                    r.selectable = false;
                    r.evented = false;
                }
                else {
                    r.selectable = true;
                    r.evented = true;
                }
            }
            catch (error) {
            }
        });
    }
    setItemStatus(type, object) {
        if (object && type) {
            if (type === 'table') {
                if (object.name != '') {
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
        // console.log(group);
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
        this.view.add(group);
        this.view.setActiveObject(group);
        this.lastObject = group;
        this.lastObjectDefinition = object;
    }
    /** Save current state */
    saveState() {
        if (this.app.userMode) {
            const state = this.view.toDatalessJSON(['name', 'hasControls', 'selectable',
                'hasBorders', 'evented', 'hoverCursor']);
            this.app.saveState.next(JSON.stringify(state));
            return;
        }
        const state = this.view.toDatalessJSON(['name', 'hasControls', 'selectable',
            'hasBorders', 'evented', 'hoverCursor', 'moveCursor']);
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
        active.clone(cloned => this.app.copied = cloned, ['pointname', 'name', 'hasControls']);
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
        this.initLayout();
    }
    /** Delete operation */
    delete() {
        // console.log(this.app.selections)
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
    setScalingZoom() {
        // this.view.setDimensions({ width: this.view.getWidth() * this.app.scaleRatio,
        //                        height: this.view.getHeight() * this.app.scaleRatio });
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
    loadJSON() {
        this.app.jsonValue.subscribe(data => {
            if (this.userMode) {
                this.maincontainerClass = 'main-container-usermode';
            }
            if (!this.userMode) {
                this.maincontainerClass = 'main-container';
            }
            try {
                if (!data || data == null && this.view) {
                    console.log('clear');
                    this.view.loadFromJSON(null, function () {
                        this.view.renderAll();
                    });
                    this.view.loadFromJSON(data, this.view.renderAll.bind(this.view));
                    return;
                }
            }
            catch (error) {
                console.log('error', error);
            }
            this.view.loadFromJSON(data, this.view.renderAll.bind(this.view));
        });
    }
    toggleSelection(selectable) {
        this.view.getObjects().forEach((obj, index) => {
            obj.selectable = selectable;
            obj.evented = true;
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
    alterObjectColor(uuID, color) {
        const view = this.view;
        if (view) {
            console.log('uuid', uuID);
            console.log(view._objects);
            if (view._objects) {
                view._objects.forEach(data => {
                    if (data && data?.type && (data?.type === 'group')) {
                        const itemValue = data?.name.split(";");
                        console.log(data?.name, uuID);
                        console.log('itemValue', itemValue);
                        if (itemValue.length > 0) {
                            const itemUUID = itemValue[0];
                            if (uuID === itemUUID) {
                                console.log('itemValue update ', itemValue);
                                let stroke = 5;
                                if (color === 'red' || color === 'rgb(200,10,10)') {
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    let stroke = 8;
                                }
                                if (color === 'green' || color === 'rgb(10,10,200)') {
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    let stroke = 5;
                                }
                                if (color === 'yellow' || color === 'rgb(10,10,200)') {
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    let stroke = 5;
                                }
                                if (data?.backgroundColor === 'purple' ||
                                    data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                                    // console.log('name successful setting color', name, data?.backgroundColor, color);
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    data.stroke = color;
                                    data.strokeWidth = stroke;
                                }
                                if (data?.backgroundColor === 'purple' ||
                                    data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                                    // console.log('name successful setting color 2', name, data?.backgroundColor, color);
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    data.stroke = color;
                                    data.strokeWidth = stroke;
                                }
                                this.alterColor(color, data, stroke - 3);
                                //   }
                                // }
                            }
                            ;
                        }
                    }
                });
            }
        }
        return view;
    }
    alterColor(color, obj, stroke) {
        obj.borderColor = color;
        obj.stroke = color;
        obj.strokeWidth = stroke;
        if (obj.objects && obj.objects.length > 0) {
            obj.objects.forEach(item => {
                this.alterColor(color, item, stroke);
            });
        }
        return obj;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvdmlldy92aWV3LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy92aWV3L3ZpZXcuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBeUIsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUYsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUdoQyxPQUFPLEtBQUssQ0FBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBRW5DLDJDQUEyQztBQUMzQyw2RUFBNkU7QUFFN0UsTUFBTSxFQUNKLGFBQWEsRUFDYixjQUFjLEVBQ2QsT0FBTyxFQUNQLFdBQVcsRUFDWCxxQkFBcUIsRUFDckIscUJBQXFCLEVBQ3JCLGNBQWMsRUFDZCxjQUFjLEVBQ2QsZUFBZSxFQUNmLGNBQWMsRUFDZCxxQkFBcUIsRUFDdEIsR0FBRyxDQUFDLENBQUM7QUFFTixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQztBQUMvQixNQUNFLFVBQVUsR0FBRyxZQUFZLEVBQ3pCLFFBQVEsR0FBRyxVQUFVLEVBQ3JCLE1BQU0sR0FBRyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFFckMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUM3RCxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMs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UUM1QzFCLDBGQUdBOzJGRHlDYSxhQUFhO2tCQVR6QixTQUFTOytCQUNFLDRCQUE0QixRQUdoQzt3QkFDSixvQkFBb0IsRUFBRSxtQkFBbUI7d0JBQ3pDLGtCQUFrQixFQUFFLGlCQUFpQjtxQkFDdEM7aUdBTVMsUUFBUTtzQkFBakIsS0FBSztnQkFDSSxrQkFBa0I7c0JBQTNCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGZvcm1hdERhdGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBmYWJyaWMgfSBmcm9tICdmYWJyaWMnO1xyXG5pbXBvcnQgeyBzYXZlQXMgfSBmcm9tICdmaWxlLXNhdmVyJztcclxuaW1wb3J0IHsgQXBwU2VydmljZSB9IGZyb20gJy4uLy4uL2FwcC5zZXJ2aWNlJztcclxuaW1wb3J0ICogYXMgXyBmcm9tICcuLi8uLi9oZWxwZXJzJztcclxuaW1wb3J0IHsgZmFMaXN0U3F1YXJlcyB9IGZyb20gJ0Bmb3J0YXdlc29tZS9mcmVlLXNvbGlkLXN2Zy1pY29ucyc7XHJcbi8vIGltcG9ydCB7IGpzb24gfSBmcm9tICdzdHJlYW0vY29uc3VtZXJzJztcclxuLy8gaW1wb3J0IHsgVmlld0pTT05TZXJ2aWNlU2VydmljZSB9IGZyb20gJ3NyYy9hcHAvdmlldy1qc29uc2VydmljZS5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IHtcclxuICBSTF9WSUVXX1dJRFRILFxyXG4gIFJMX1ZJRVdfSEVJR0hULFxyXG4gIFJMX0ZPT1QsXHJcbiAgUkxfQUlTTEVHQVAsXHJcbiAgUkxfUk9PTV9PVVRFUl9TUEFDSU5HLFxyXG4gIFJMX1JPT01fSU5ORVJfU1BBQ0lORyxcclxuICBSTF9ST09NX1NUUk9LRSxcclxuICBSTF9DT1JORVJfRklMTCxcclxuICBSTF9VTkdST1VQQUJMRVMsXHJcbiAgUkxfQ1JFRElUX1RFWFQsXHJcbiAgUkxfQ1JFRElUX1RFWFRfUEFSQU1TXHJcbn0gPSBfO1xyXG5cclxuY29uc3QgeyBMaW5lLCBQb2ludCB9ID0gZmFicmljO1xyXG5jb25zdFxyXG4gIEhPUklaT05UQUwgPSAnSE9SSVpPTlRBTCcsXHJcbiAgVkVSVElDQUwgPSAnVkVSVElDQUwnLFxyXG4gIE9GRlNFVCA9IFJMX1JPT01fSU5ORVJfU1BBQ0lORyAvIDI7XHJcblxyXG5jb25zdCBMZWZ0ID0gKHdhbGwpID0+IHdhbGwueDEgPCB3YWxsLngyID8gd2FsbC54MSA6IHdhbGwueDI7XHJcbmNvbnN0IFRvcCA9ICh3YWxsKSA9PiB3YWxsLnkxIDwgd2FsbC55MiA/IHdhbGwueTEgOiB3YWxsLnkyO1xyXG5jb25zdCBSaWdodCA9ICh3YWxsKSA9PiB3YWxsLngxID4gd2FsbC54MiA/IHdhbGwueDEgOiB3YWxsLngyO1xyXG5jb25zdCBCb3R0b20gPSAod2FsbCkgPT4gd2FsbC55MSA+IHdhbGwueTIgPyB3YWxsLnkxIDogd2FsbC55MjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAncG9pbnRsZXNzLXJvb20tbGF5b3V0LXZpZXcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi92aWV3LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi92aWV3LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgaG9zdDoge1xyXG4gICAgJyhkb2N1bWVudDprZXlkb3duKSc6ICdvbktleURvd24oJGV2ZW50KScsXHJcbiAgICAnKGRvY3VtZW50OmtleXVwKSc6ICdvbktleVVwKCRldmVudCknXHJcbiAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gIHNlbGVjdGVkT2JqZWN0OiBhbnk7XHJcblxyXG4gIEBJbnB1dCgpICB1c2VyTW9kZTogYm9vbGVhbjtcclxuICBAT3V0cHV0KCkgb3V0UHV0U2VsZWN0ZWRJdGVtID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB2aWV3OiBmYWJyaWMuQ2FudmFzO1xyXG4gIHJvb206IGZhYnJpYy5Hcm91cDtcclxuICByb29tTGF5ZXI6IGZhYnJpYy5Hcm91cCB8IGZhYnJpYy5SZWN0O1xyXG4gIGNvcm5lcnMgPSBbXTtcclxuICB3YWxsczogZmFicmljLkxpbmVbXSA9IFtdO1xyXG4gIGxhc3RPYmplY3REZWZpbml0aW9uID0gbnVsbDtcclxuICBsYXN0T2JqZWN0ID0gbnVsbDtcclxuXHJcbiAgQ1RSTF9LRVlfRE9XTiA9IGZhbHNlO1xyXG4gIE1PVkVfV0FMTF9JRCA9IC0xO1xyXG4gIFJPT01fU0laRSA9IHsgd2lkdGg6IDk2MCwgaGVpZ2h0OiA0ODAgfTtcclxuICBERUZBVUxUX0NIQUlSID0gbnVsbDtcclxuICBSRU1PVkVfRFcgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoIHB1YmxpYyBhcHA6IEFwcFNlcnZpY2UgKSB7IH1cclxuXHJcbiAgbWFpbmNvbnRhaW5lckNsYXNzID0gJ21haW4tY29udGFpbmVyJ1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuXHJcbiAgICB0aGlzLmxvYWRKU09OKCk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5hcHAuc2V0U2VsZWN0ZWRPYmplY3RDb2xvci5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgIHRoaXMuYWx0ZXJPYmplY3RDb2xvcihkYXRhLnV1aWQsIGRhdGEuY29sb3IpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnYWx0ZXIgb2JqZWN0IGNvbG9yJylcclxuICAgICAgfSlcclxuICAgICAgdGhpcy52aWV3LnJlbmRlckFsbCgpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLmFwcC5yb29tRWRpdGlvbi5zdWJzY3JpYmUoZG9FZGl0ID0+IHtcclxuICAgICAgICB0aGlzLmNvcm5lcnMuZm9yRWFjaChjID0+IHRoaXMuc2V0Q29ybmVyU3R5bGUoYykpO1xyXG4gICAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgICAgICBpZiAoZG9FZGl0KSB7XHJcbiAgICAgICAgICB0aGlzLmVkaXRSb29tKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY2FuY2VsUm9vbUVkaXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuYXBwLmluc2VydE9iamVjdC5zdWJzY3JpYmUocmVzID0+IHtcclxuICAgICAgICAgIHRoaXMuaGFuZGxlT2JqZWN0SW5zZXJ0aW9uKHJlcyk7XHJcbiAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFwcC5kZWZhdWx0Q2hhaXIuc3Vic2NyaWJlKHJlcyA9PiB0aGlzLkRFRkFVTFRfQ0hBSVIgPSByZXMpO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuYXBwLnNlbGVjdGVkQmFja0dyb3VuZEltYWdlLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICB0aGlzLnNldEJhY2tncm91bmRJbWFnZShkYXRhKVxyXG4gICAgICB9KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdGhpcy5hcHAucGVyZm9ybU9wZXJhdGlvbi5zdWJzY3JpYmUob3BlcmF0aW9uID0+IHtcclxuICAgICAgc3dpdGNoIChvcGVyYXRpb24pIHtcclxuXHJcbiAgICAgICAgY2FzZSAnVU5ETyc6XHJcbiAgICAgICAgICB0aGlzLnVuZG8oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdSRURPJzpcclxuICAgICAgICAgIHRoaXMucmVkbygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ0NPUFknOlxyXG4gICAgICAgICAgdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnUEFTVEUnOlxyXG4gICAgICAgICAgdGhpcy5wYXN0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ0RFTEVURSc6XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ1JPVEFURSc6XHJcbiAgICAgICAgICB0aGlzLnJvdGF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ1JPVEFURV9BTlRJJzpcclxuICAgICAgICAgIHRoaXMucm90YXRlKGZhbHNlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3NldFRhYmxlTmFtZSc6XHJcbiAgICAgICAgICB0aGlzLnNldFRhYmxlTmFtZSh0aGlzLmFwcC50YWJsZU5hbWUpO1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICdzZXRPcmRlcklEJzpcclxuICAgICAgICAgIGlmICh0aGlzLmFwcC5jbGVhck5leHRTZWxlY3RlZFRhYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0T2JqZWN0T3JkZXJJRCgnJyk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwLmNsZWFyTmV4dFNlbGVjdGVkVGFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnNldE9iamVjdE9yZGVySUQodGhpcy5hcHAub3JkZXJJRCk7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2NsZWFyTGF5b3V0JzpcclxuICAgICAgICAgIHRoaXMuY2xlYXJMYXlvdXQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0dST1VQJzpcclxuICAgICAgICAgIHRoaXMuZ3JvdXAoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdVTkdST1VQJzpcclxuICAgICAgICAgIHRoaXMudW5ncm91cCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ0hPUklaT05UQUwnOlxyXG4gICAgICAgIGNhc2UgJ1ZFUlRJQ0FMJzpcclxuICAgICAgICAgIHRoaXMucGxhY2VJbkNlbnRlcihvcGVyYXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnUk9PTV9PUEVSQVRJT04nOlxyXG4gICAgICAgICAgLy8gdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnUE5HJzpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2xvYWRqc29uJzpcclxuICAgICAgICAgIHRoaXMubG9hZEpTT04oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3NhdmUnOlxyXG4gICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2pzb24nOlxyXG4gICAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3NhdmVGdWxsSnNvbic6XHJcbiAgICAgICAgICB0aGlzLmFwcC5qc29uVmFsdWUubmV4dCggSlNPTi5zdHJpbmdpZnkodGhpcy52aWV3LnRvSlNPTihbJ25hbWUnXSkpIClcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ1pPT00nOlxyXG4gICAgICAgICAgdGhpcy5zZXRab29tKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdJbml0TGF5b3V0JzpcclxuICAgICAgICAgIHRoaXMuaW5pdExheW91dCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnZGlzYWJsZVNlbGVjdGlvbic6XHJcbiAgICAgICAgICB0aGlzLnRvZ2dsZVNlbGVjdGlvbihmYWxzZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdkaXNhYmxlU2VsZWN0aW9uJzpcclxuICAgICAgICAgICAgdGhpcy50b2dnbGVTZWxlY3Rpb24odHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0xFRlQnOlxyXG4gICAgICAgIGNhc2UgJ0NFTlRFUic6XHJcbiAgICAgICAgY2FzZSAnUklHSFQnOlxyXG4gICAgICAgIGNhc2UgJ1RPUCc6XHJcbiAgICAgICAgY2FzZSAnTUlERExFJzpcclxuICAgICAgICBjYXNlICdCT1RUT00nOlxyXG4gICAgICAgICAgdGhpcy5hcnJhbmdlKG9wZXJhdGlvbik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgLyoqIEluaXRpYWxpemUgY2FudmFzICovXHJcbiAgICB0aGlzLmluaXRMYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIGluaXRMYXlvdXQoKSB7XHJcbiAgICB0aGlzLmFwcC5zYXZlU3RhdGUubmV4dChKU09OLnN0cmluZ2lmeShudWxsKSk7XHJcbiAgICB0aGlzLnNldENhbnZhc1ZpZXcoKTtcclxuICAgIC8qKiBBZGQgcm9vbSAqL1xyXG4gICAgdGhpcy5zZXRSb29tKHRoaXMuUk9PTV9TSVpFKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgcm9vbV9vcmlnaW4oKSB7XHJcbiAgICByZXR1cm4gUkxfUk9PTV9PVVRFUl9TUEFDSU5HICsgUkxfUk9PTV9JTk5FUl9TUEFDSU5HO1xyXG4gIH1cclxuXHJcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICBjb25zdCBjb2RlID0gZXZlbnQua2V5IHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgICAvLyBDdHJsIEtleSBpcyBkb3duXHJcbiAgICBpZiAoZXZlbnQuY3RybEtleSkge1xyXG4gICAgICB0aGlzLkNUUkxfS0VZX0RPV04gPSB0cnVlO1xyXG4gICAgICAvLyBDdHJsICsgU2hpZnQgKyBaXHJcbiAgICAgIGlmIChldmVudC5zaGlmdEtleSAmJiBjb2RlID09PSA5MClcclxuICAgICAgICB0aGlzLmFwcC5yZWRvKCk7XHJcbiAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDkwKVxyXG4gICAgICAgIHRoaXMuYXBwLnVuZG8oKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gNjcpXHJcbiAgICAgICAgdGhpcy5hcHAuY29weSgpO1xyXG4gICAgICBlbHNlIGlmIChjb2RlID09PSA4NilcclxuICAgICAgICB0aGlzLnBhc3RlKCk7XHJcbiAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDM3KVxyXG4gICAgICAgIHRoaXMucm90YXRlKCk7XHJcbiAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDM5KVxyXG4gICAgICAgIHRoaXMucm90YXRlKGZhbHNlKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gNzEpXHJcbiAgICAgICAgdGhpcy5ncm91cCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gNDYpXHJcbiAgICAgIHRoaXMuZGVsZXRlKCk7XHJcbiAgICBlbHNlIGlmIChjb2RlID09PSAzNylcclxuICAgICAgdGhpcy5tb3ZlKCdMRUZUJyk7XHJcbiAgICBlbHNlIGlmIChjb2RlID09PSAzOClcclxuICAgICAgdGhpcy5tb3ZlKCdVUCcpO1xyXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gMzkpXHJcbiAgICAgIHRoaXMubW92ZSgnUklHSFQnKTtcclxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDQwKVxyXG4gICAgICB0aGlzLm1vdmUoJ0RPV04nKTtcclxuICB9XHJcblxyXG4gIG9uS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIGlmIChldmVudC5rZXkgPT09ICdDb250cm9sJykge1xyXG4gICAgICB0aGlzLkNUUkxfS0VZX0RPV04gPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uU2Nyb2xsKGV2ZW50KSB7IH1cclxuXHJcbiAgc2V0R3JvdXBhYmxlU3RhdGUoKSB7XHJcbiAgICBpZiAodGhpcy5hcHAuc2VsZWN0aW9ucy5sZW5ndGggPiAxKSB7XHJcbiAgICAgIHRoaXMuYXBwLnVuZ3JvdXBhYmxlID0gZmFsc2U7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvYmogPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgdHlwZSA9IG9iai5uYW1lID8gb2JqLm5hbWUuc3BsaXQoJzonKVswXSA6ICcnO1xyXG4gICAgICBpZiAoUkxfVU5HUk9VUEFCTEVTLmluZGV4T2YodHlwZSkgPiAtMSkge1xyXG4gICAgICAgIHRoaXMuYXBwLnVuZ3JvdXBhYmxlID0gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5hcHAudW5ncm91cGFibGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldE9iamVjdFNldHRpbmdzKG9iamVjdCAsIGtleSwgIGNvbG9yKSB7XHJcbiAgICBmYWJyaWMuR3JvdXAucHJvdG90eXBlLnNlbGVjdGlvbkJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDI1NSwxMDAsMTcxLDAuMjUpJztcclxuICAgIGZhYnJpYy5Hcm91cC5wcm90b3R5cGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknO1xyXG4gICAgZmFicmljLkdyb3VwLnByb3RvdHlwZS5maWxsID0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknO1xyXG4gICAgZmFicmljLkdyb3VwLnByb3RvdHlwZS5zdHJva2VXaWR0aCA9IDM7XHJcbiAgfVxyXG5cclxuICBvblNlbGVjdGVkKCkge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHtcclxuICAgICAgY29uc29sZS5sb2coJ3ZpZXcgaXMgdW5kZWZpbmVkJylcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG5cclxuICAgIGlmICghdGhpcy52aWV3IHx8ICFhY3RpdmUpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2FjdGl2ZSBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICAvLyB0aGlzLnNldE9iamVjdFNldHRpbmdzKGFjdGl2ZSwgJ2ZpbGwnLCAncmVkJylcclxuICAgIC8vIC8vIGFjdGl2ZS5fcmVuZGVyRmlsbCgncHVycGxlJywgKCkgPT4geyB9KTtcclxuICAgIC8vIHJldHVybjtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBhY3RpdmUubG9ja1NjYWxpbmdYID0gdHJ1ZSwgYWN0aXZlLmxvY2tTY2FsaW5nWSA9IHRydWU7XHJcbiAgICAgIGlmICghYWN0aXZlLm5hbWUpIHtcclxuICAgICAgICBhY3RpdmUubmFtZSA9ICdHUk9VUCc7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBwLnNlbGVjdGlvbnMgPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0cygpO1xyXG4gICAgdGhpcy5zZXRHcm91cGFibGVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgc2V0U2VsZWN0ZWRPYmplY3RDb2xvcihpdGVtLCBjb2xvcjogc3RyaW5nLCBzYXZlU3RhdGU6IGJvb2xlYW4pIHtcclxuICAgIC8vIGNvbnN0IGl0ZW0gPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcbiAgICBpZiAoIWl0ZW0pIHsgcmV0dXJuIH1cclxuICAgIGlmIChpdGVtLm5hbWUpIHtcclxuICAgICAgY29uc3QgdWlkICA9IGl0ZW0ubmFtZS5zcGxpdCgnOycpWzBdO1xyXG4gICAgICAvLyBjb25zdCBqc29uID0gdGhpcy5hbHRlck9iamVjdENvbG9yKGl0ZW0ubmFtZSwgY29sb3IpO1xyXG4gICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICAgIC8vIHRoaXMudmlldy5sb2FkRnJvbUpTT04oanNvbiwgZnVuY3Rpb24oKSB7IH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgc2V0QmFja2dyb3VuZEltYWdlKGltYWdlOiBzdHJpbmcpIHtcclxuICAgIGlmICghaW1hZ2UgfHwgaW1hZ2UgPT09ICcnKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgdGhpcy52aWV3LnNldEJhY2tncm91bmRJbWFnZShpbWFnZSwgdGhpcy52aWV3LnJlbmRlckFsbC5iaW5kKHRoaXMudmlldyksIHtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0T2JqZWN0T3JkZXJJRChvcmRlcklEKSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZE9iamVjdCkge1xyXG4gICAgY29uc3QgaXRlbSA9IHRoaXMuc2VsZWN0ZWRPYmplY3Q/Lm5hbWVcclxuICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgdWlkID0gaXRlbS5zcGxpdCgnOycpWzBdO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBpdGVtLnNwbGl0KCc7JylbMl07XHJcbiAgICAgICAgbGV0IHN0YXR1cyA9IGl0ZW0uc3BsaXQoJzsnKVszXTtcclxuICAgICAgICBzdGF0dXMgPSB0aGlzLmdldFN0YXR1c0Rlc2NyaXB0aW9uKG9yZGVySUQpO1xyXG4gICAgICAgIGNvbnN0IG5ld0l0ZW0gPSBgJHt1aWR9OyR7b3JkZXJJRH07JHtuYW1lfTske3N0YXR1c31gO1xyXG5cclxuICAgICAgICAvLyBpZiAoIW9yZGVySUQpIHtcclxuICAgICAgICAvLyAgIHRoaXMuYWx0ZXJPYmplY3RDb2xvcih1aWQsICdyZWQnKVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBpZiAoIW9yZGVySUQpICB7XHJcbiAgICAgICAgLy8gICB0aGlzLmFsdGVyT2JqZWN0Q29sb3IodWlkLCAnZ3JlZW4nKVxyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdC5uYW1lID0gbmV3SXRlbTtcclxuICAgICAgICAvLyB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRTdGF0dXNEZXNjcmlwdGlvbihvcmRlcklEKSB7XHJcbiAgICBsZXQgc3RhdHVzXHJcbiAgICBpZiAob3JkZXJJRCkge1xyXG4gICAgICBpZiAoc3RhdHVzKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ2FjdGl2ZSdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFvcmRlcklEKSB7XHJcbiAgICAgIGlmICghc3RhdHVzKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ2luYWN0aXZlJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdHVzXHJcbiAgfVxyXG5cclxuICBzZXRUYWJsZU5hbWUobmFtZTogc3RyaW5nKSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZE9iamVjdCkge1xyXG5cclxuICAgICAgbGV0IG9yZGVyO1xyXG4gICAgICBsZXQgc3RhdHVzO1xyXG4gICAgICBsZXQgdXVpZDtcclxuICAgICAgY29uc3QgaXRlbSAgPSB0aGlzLnNlbGVjdGVkT2JqZWN0Py5uYW1lO1xyXG4gICAgICBpZiAoaXRlbSAmJiAoaXRlbS5zcGxpdCgnOycpLmxlbmd0aD4wIHx8IGl0ZW0uc3BsaXQoJzsnKS5sZW5ndGggPT0gMCkgKXtcclxuICAgICAgICB1dWlkICAgPSBpdGVtLnNwbGl0KCc7JylbMF07XHJcbiAgICAgIH1cclxuICAgICAgLy8gaWYgKGl0ZW0gJiYgKGl0ZW0uc3BsaXQoJzsnKS5sZW5ndGg+MSB8fCBpdGVtLnNwbGl0KCc7JykubGVuZ3RoID09IDEpICl7XHJcbiAgICAgIC8vICAgIHVpZCAgID0gaXRlbS5zcGxpdCgnOycpWzFdO1xyXG4gICAgICAvLyB9XHJcbiAgICAgIC8vIGlmIChpdGVtICYmIChpdGVtLnNwbGl0KCc7JykubGVuZ3RoPjIgfHwgaXRlbS5zcGxpdCgnOycpLmxlbmd0aCA9PSAyKSApe1xyXG4gICAgICAvLyAgICBuYW1lICAgPSBpdGVtLnNwbGl0KCc7JylbMl07XHJcbiAgICAgIC8vIH1cclxuICAgICAgLy8gaWYgKGl0ZW0gJiYgKGl0ZW0uc3BsaXQoJzsnKS5sZW5ndGg+MyB8fCBpdGVtLnNwbGl0KCc7JykubGVuZ3RoID09IDMpICl7XHJcbiAgICAgIC8vICAgIHN0YXR1cyAgID0gaXRlbS5zcGxpdCgnOycpWzNdO1xyXG4gICAgICAvLyB9XHJcblxyXG4gICAgICBzdGF0dXMgPSAnaW5hY3RpdmUnXHJcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSBgJHt1dWlkfTske29yZGVyfTske25hbWV9OyR7c3RhdHVzfWA7XHJcbiAgICAgIGNvbnNvbGUubG9nKCduZXdJdGVtJywgbmV3SXRlbSlcclxuICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdC5uYW1lID0gbmV3SXRlbTtcclxuICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgdGhpcy5hcHAudGFibGVOYW1lID0gJydcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldFRhYmxlU3RhdHVzKHN0YXR1czogc3RyaW5nKSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZE9iamVjdCkge1xyXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5zZWxlY3RlZE9iamVjdD8ubmFtZTtcclxuICAgICAgY29uc3QgdWlkID0gaXRlbS5zcGxpdCgnOycpWzBdO1xyXG4gICAgICBjb25zdCBvcmRlciA9IGl0ZW0uc3BsaXQoJzsnKVsxXTtcclxuICAgICAgY29uc3QgbmFtZSA9IGl0ZW0uc3BsaXQoJzsnKVsyXTtcclxuICAgICAgY29uc3QgbmV3SXRlbSA9IGAke3VpZH07JHtvcmRlcn07JHtuYW1lfTske3N0YXR1c31gO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0Lm5hbWUgPSBuZXdJdGVtO1xyXG4gICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgICB0aGlzLmFwcC50YWJsZVN0YXR1cyA9ICcnXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAqIGluaXQgdGhlIGNhbnZhcyB2aWV3ICYgYmluZCBldmVudHNcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcbiAgc2V0Q2FudmFzVmlldygpIHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IG5ldyBmYWJyaWMuQ2FudmFzKCdtYWluJyk7XHJcbiAgICBjYW52YXMuc2V0V2lkdGgoUkxfVklFV19XSURUSCAqIFJMX0ZPT1QpO1xyXG4gICAgY2FudmFzLnNldEhlaWdodChSTF9WSUVXX0hFSUdIVCAqIFJMX0ZPT1QpO1xyXG4gICAgdGhpcy52aWV3ID0gY2FudmFzO1xyXG5cclxuICAgIGNvbnN0IGNvcm5lcnNPZldhbGwgPSAob2JqOiBmYWJyaWMuTGluZSkgPT4ge1xyXG4gICAgICBjb25zdCBpZCA9IE51bWJlcihvYmoubmFtZS5zcGxpdCgnOicpWzFdKTtcclxuICAgICAgY29uc3QgdjFJZCA9IGlkO1xyXG4gICAgICBjb25zdCB2MSA9IHRoaXMuY29ybmVyc1t2MUlkXTtcclxuICAgICAgY29uc3QgdjJJZCA9IChpZCArIDEpICUgdGhpcy53YWxscy5sZW5ndGg7XHJcbiAgICAgIGNvbnN0IHYyID0gdGhpcy5jb3JuZXJzW3YySWRdO1xyXG4gICAgICByZXR1cm4geyB2MSwgdjFJZCwgdjIsIHYySWQgfTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy52aWV3Lm9uKCdzZWxlY3Rpb246Y3JlYXRlZCcsIChlOiBmYWJyaWMuSUV2ZW50KSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLm9uU2VsZWN0ZWQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3NlbGVjdGlvbjpjcmVhdGVkJywgdGhpcy5hcHAucm9vbUVkaXQpXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ3NlbGVjdGlvbjp1cGRhdGVkJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMub25TZWxlY3RlZCgpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnc2VsZWN0aW9uOnVwZGF0ZWQnLCB0aGlzLmFwcC5yb29tRWRpdClcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ3NlbGVjdGlvbjpjbGVhcmVkJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuYXBwLnNlbGVjdGlvbnMgPSBbXTtcclxuICAgICAgdGhpcy5hcHAudW5ncm91cGFibGUgPSBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignb2JqZWN0Om1vdmVkJywgKCkgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnb2JqZWN0Om1vdmVkJywgdGhpcy5hcHAucm9vbUVkaXQpXHJcbiAgICAgIGlmICh0aGlzLk1PVkVfV0FMTF9JRCAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLk1PVkVfV0FMTF9JRCA9IC0xO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ29iamVjdDpyb3RhdGVkJywgKCkgPT4gdGhpcy5zYXZlU3RhdGUoKSk7XHJcblxyXG4gICAgdGhpcy52aWV3Lm9uKCdtb3VzZTpkb3duOmJlZm9yZScsIChlOiBmYWJyaWMuSUV2ZW50KSA9PiB7XHJcbiAgICAgIHRoaXMuYXBwLnNlbGVjdGlvbnMgPSBbXTtcclxuICAgICAgY29uc3Qgb2JqID0gZS50YXJnZXQ7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3QgPSBvYmo7XHJcbiAgICAgIHRoaXMuYXBwLnNlbGVjdGlvbnMucHVzaChvYmopO1xyXG4gICAgICB0aGlzLmFwcC5zZWxlY3RlZGVkT2JqZWN0Lm5leHQob2JqKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCAmJiBvYmogJiYgb2JqPy5uYW1lLmluZGV4T2YoJ1dBTEwnKSA+IC0xICYmIG9iaiBpbnN0YW5jZW9mIExpbmUpIHtcclxuICAgICAgICBsZXQgeyB2MSwgdjIsIHYxSWQsIHYySWQgfSA9IGNvcm5lcnNPZldhbGwob2JqKTtcclxuICAgICAgICBjb25zdCB2MElkID0gKHYxSWQgPT09IDApID8gdGhpcy5jb3JuZXJzLmxlbmd0aCAtIDEgOiB2MUlkIC0gMTtcclxuICAgICAgICBjb25zdCB2M0lkID0gKHYySWQgPT09IHRoaXMuY29ybmVycy5sZW5ndGggLSAxKSA/IDAgOiB2MklkICsgMTtcclxuICAgICAgICBjb25zdCB2MCA9IHRoaXMuY29ybmVyc1t2MElkXTtcclxuICAgICAgICBjb25zdCB2MyA9IHRoaXMuY29ybmVyc1t2M0lkXTtcclxuXHJcbiAgICAgICAgdGhpcy5NT1ZFX1dBTExfSUQgPSB2MUlkO1xyXG5cclxuICAgICAgICBpZiAoKHYwLnRvcCA9PT0gdjEudG9wICYmIHYxLnRvcCA9PT0gdjIudG9wKSB8fCAodjAubGVmdCA9PT0gdjEubGVmdCAmJiB2MS5sZWZ0ID09PSB2Mi5sZWZ0KSkge1xyXG4gICAgICAgICAgdGhpcy5jb3JuZXJzLnNwbGljZSh2MUlkLCAwLCB0aGlzLmRyYXdDb3JuZXIobmV3IFBvaW50KHYxLmxlZnQsIHYxLnRvcCkpKTtcclxuICAgICAgICAgIHRoaXMuTU9WRV9XQUxMX0lEID0gdjFJZCArIDE7XHJcbiAgICAgICAgICB2MklkICs9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKHYxLnRvcCA9PT0gdjIudG9wICYmIHYyLnRvcCA9PT0gdjMudG9wKSB8fCAodjEubGVmdCA9PT0gdjIubGVmdCAmJiB2Mi5sZWZ0ID09PSB2My5sZWZ0KSkge1xyXG4gICAgICAgICAgdGhpcy5jb3JuZXJzLnNwbGljZSh2MklkICsgMSwgMCwgdGhpcy5kcmF3Q29ybmVyKG5ldyBQb2ludCh2Mi5sZWZ0LCB2Mi50b3ApKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ29iamVjdDptb3ZpbmcnLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnb2JqZWN0Om1vdmluZycsIHRoaXMuYXBwLnJvb21FZGl0KVxyXG4gICAgICBpZiAodGhpcy5NT1ZFX1dBTExfSUQgIT09IC0xKSB7XHJcbiAgICAgICAgY29uc3QgcCA9IGVbJ3BvaW50ZXInXTtcclxuICAgICAgICBjb25zdCB2MSA9IHRoaXMuY29ybmVyc1t0aGlzLk1PVkVfV0FMTF9JRF07XHJcbiAgICAgICAgY29uc3QgdjIgPSB0aGlzLmNvcm5lcnNbKHRoaXMuTU9WRV9XQUxMX0lEICsgMSkgJSB0aGlzLmNvcm5lcnMubGVuZ3RoXTtcclxuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSB2MS5sZWZ0ID09PSB2Mi5sZWZ0ID8gJ0hPUklaT05UQUwnIDogJ1ZFUlRJQ0FMJztcclxuXHJcbiAgICAgICAgaWYgKHAueSA8IFJMX1JPT01fT1VURVJfU1BBQ0lORykgeyBwLnkgPSBSTF9ST09NX09VVEVSX1NQQUNJTkc7IH1cclxuICAgICAgICBpZiAocC54IDwgUkxfUk9PTV9PVVRFUl9TUEFDSU5HKSB7IHAueCA9IFJMX1JPT01fT1VURVJfU1BBQ0lORzsgfVxyXG5cclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnVkVSVElDQUwnKSB7XHJcbiAgICAgICAgICB2MS50b3AgPSB2Mi50b3AgPSBwLnk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHYxLmxlZnQgPSB2Mi5sZWZ0ID0gcC54O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBvYmogPSBlLnRhcmdldDtcclxuICAgICAgY29uc3QgcG9pbnQgPSBlWydwb2ludGVyJ107XHJcblxyXG4gICAgICBpZiAob2JqICYmIHRoaXMuaXNEVyhvYmopICYmIG9iaiBpbnN0YW5jZW9mIGZhYnJpYy5Hcm91cCkge1xyXG4gICAgICAgIGxldCB3YWxsLCBkaXN0YW5jZSA9IDk5OTtcclxuICAgICAgICBjb25zdCBkaXN0MiA9ICh2LCB3KSA9PiAodi54IC0gdy54KSAqICh2LnggLSB3LngpICsgKHYueSAtIHcueSkgKiAodi55IC0gdy55KTtcclxuICAgICAgICBjb25zdCBwb2ludF90b19saW5lID0gKHAsIHYsIHcpID0+IE1hdGguc3FydChkaXN0VG9TZWdtZW50U3F1YXJlZChwLCB2LCB3KSk7XHJcbiAgICAgICAgY29uc3QgZGlzdFRvU2VnbWVudFNxdWFyZWQgPSAocCwgdiwgdykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbDIgPSBkaXN0Mih2LCB3KTtcclxuXHJcbiAgICAgICAgICBpZiAobDIgPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIGRpc3QyKHAsIHYpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHQgPSAoKHAueCAtIHYueCkgKiAody54IC0gdi54KSArIChwLnkgLSB2LnkpICogKHcueSAtIHYueSkpIC8gbDI7XHJcblxyXG4gICAgICAgICAgaWYgKHQgPCAwKVxyXG4gICAgICAgICAgICByZXR1cm4gZGlzdDIocCwgdik7XHJcblxyXG4gICAgICAgICAgaWYgKHQgPiAxKVxyXG4gICAgICAgICAgICByZXR1cm4gZGlzdDIocCwgdyk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIGRpc3QyKHAsIHsgeDogdi54ICsgdCAqICh3LnggLSB2LngpLCB5OiB2LnkgKyB0ICogKHcueSAtIHYueSkgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy53YWxscy5mb3JFYWNoKHcgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZCA9IHBvaW50X3RvX2xpbmUocG9pbnQsIHsgeDogdy54MSwgeTogdy55MSB9LCB7IHg6IHcueDIsIHk6IHcueTIgfSk7XHJcbiAgICAgICAgICBpZiAoZCA8IGRpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGRpc3RhbmNlID0gZCwgd2FsbCA9IHc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChkaXN0YW5jZSA+IDIwKSB7XHJcbiAgICAgICAgICB0aGlzLlJFTU9WRV9EVyA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuUkVNT1ZFX0RXID0gZmFsc2U7XHJcbiAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbk9mV2FsbCh3YWxsKTtcclxuXHJcbiAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBIT1JJWk9OVEFMKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYXRlRFcob2JqLCB3YWxsLCBwb2ludC54LCBUb3Aod2FsbCkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2NhdGVEVyhvYmosIHdhbGwsIExlZnQod2FsbCksIHBvaW50LnkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy52aWV3Lm9uKCdtb3VzZTp1cCcsIChlOiBmYWJyaWMuSUV2ZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IG9iaiA9IGUudGFyZ2V0O1xyXG4gICAgICBpZiAodGhpcy5SRU1PVkVfRFcpIHtcclxuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlKG9iaik7XHJcbiAgICAgICAgdGhpcy5SRU1PVkVfRFcgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy52aWV3Lm9uKCdtb3VzZTpkYmxjbGljaycsIChlOiBmYWJyaWMuSUV2ZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IG9iaiA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0ICYmIHRoaXMuYXBwLnJvb21FZGl0T3BlcmF0ZSA9PT0gJ0NPUk5FUicgJiYgb2JqICYmIG9iai5uYW1lLmluZGV4T2YoJ1dBTEwnKSA+IC0xICYmIG9iaiBpbnN0YW5jZW9mIExpbmUpIHtcclxuICAgICAgICBjb25zdCBwID0gZVsncG9pbnRlciddO1xyXG4gICAgICAgIGNvbnN0IHsgdjEsIHYxSWQsIHYyLCB2MklkIH0gPSBjb3JuZXJzT2ZXYWxsKG9iaik7XHJcbiAgICAgICAgY29uc3QgaW5kID0gdjFJZCA8IHYySWQgPyB2MUlkIDogdjJJZDtcclxuXHJcbiAgICAgICAgaWYgKHYxLmxlZnQgPT09IHYyLmxlZnQpIHtcclxuICAgICAgICAgIHAueCA9IHYxLmxlZnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmICh2MS50b3AgPT09IHYyLnRvcCkge1xyXG4gICAgICAgICAgcC55ID0gdjEudG9wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3Q29ybmVyID0gdGhpcy5kcmF3Q29ybmVyKG5ldyBQb2ludChwLngsIHAueSkpO1xyXG5cclxuICAgICAgICBpZiAoTWF0aC5hYnModjFJZCAtIHYySWQpICE9IDEpIHtcclxuICAgICAgICAgIHRoaXMuY29ybmVycy5wdXNoKG5ld0Nvcm5lcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29ybmVycy5zcGxpY2UoaW5kICsgMSwgMCwgbmV3Q29ybmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogZHJhdyBSb29tcyBkZWZpbmVkIGluIE1vZGVsXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG4gIHNldFJvb20oeyB3aWR0aCwgaGVpZ2h0IH0pIHtcclxuICAgIGlmICh0aGlzLndhbGxzLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlKC4uLnRoaXMud2FsbHMpO1xyXG4gICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgTFQgPSBuZXcgUG9pbnQoUkxfUk9PTV9PVVRFUl9TUEFDSU5HLCBSTF9ST09NX09VVEVSX1NQQUNJTkcpO1xyXG4gICAgY29uc3QgUlQgPSBuZXcgUG9pbnQoTFQueCArIHdpZHRoLCBMVC55KTtcclxuICAgIGNvbnN0IExCID0gbmV3IFBvaW50KExULngsIExULnkgKyBoZWlnaHQpO1xyXG4gICAgY29uc3QgUkIgPSBuZXcgUG9pbnQoUlQueCwgTEIueSk7XHJcblxyXG4gICAgdGhpcy5jb3JuZXJzID0gW0xULCBSVCwgUkIsIExCXS5tYXAocCA9PiB0aGlzLmRyYXdDb3JuZXIocCkpO1xyXG4gICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKiBzZXQgY29ybmVyIGFjY29yZGluZyB0byBjdXJyZW50IGVkaXRpb24gc3RhdHVzXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG4gIHNldENvcm5lclN0eWxlKGM6IGZhYnJpYy5SZWN0KSB7XHJcbiAgICBjLm1vdmVDdXJzb3IgPSB0aGlzLnZpZXcuZnJlZURyYXdpbmdDdXJzb3I7XHJcbiAgICBjLmhvdmVyQ3Vyc29yID0gdGhpcy52aWV3LmZyZWVEcmF3aW5nQ3Vyc29yO1xyXG4gICAgYy5zZWxlY3RhYmxlID0gZmFsc2U7XHJcbiAgICBjLmV2ZW50ZWQgPSBmYWxzZTtcclxuICAgIGMud2lkdGggPSBjLmhlaWdodCA9IChSTF9ST09NX0lOTkVSX1NQQUNJTkcgLyAodGhpcy5hcHAucm9vbUVkaXQgPyAxLjUgOiAyKSkgKiAyO1xyXG4gICAgYy5zZXQoJ2ZpbGwnLCB0aGlzLmFwcC5yb29tRWRpdCA/IFJMX0NPUk5FUl9GSUxMIDogUkxfUk9PTV9TVFJPS0UpO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKiBkcmF3IGNvcm5lclxyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuICBkcmF3Q29ybmVyKHA6IGZhYnJpYy5Qb2ludCkge1xyXG5cclxuICAgIGNvbnN0IGMgPSBuZXcgZmFicmljLlJlY3Qoe1xyXG4gICAgICBsZWZ0OiBwLngsXHJcbiAgICAgIHRvcDogcC55LFxyXG4gICAgICBzdHJva2VXaWR0aDogMCxcclxuICAgICAgaGFzQ29udHJvbHM6IGZhbHNlLFxyXG4gICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgIG5hbWU6ICdDT1JORVInXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2V0Q29ybmVyU3R5bGUoYyk7XHJcbiAgICByZXR1cm4gYztcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogZHJhdyByb29tXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG4gIGRyYXdSb29tKCkge1xyXG4gICAgbGV0IGV4aXN0cyA6IGFueTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgZXhpc3RzID0gdGhpcy52aWV3LmdldE9iamVjdHMoKS5maWx0ZXIob2JqID0+IG9iai5uYW1lLmluZGV4T2YoJ1dBTEwnKSA+IC0xIHx8IG9iai5uYW1lID09PSAnQ09STkVSJyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlKC4uLmV4aXN0cyk7XHJcblxyXG4gICAgICB0aGlzLnZpZXcuYWRkKC4uLnRoaXMuY29ybmVycyk7XHJcblxyXG4gICAgICBjb25zdCB3YWxsID0gKGNvb3JkczogbnVtYmVyW10sIGluZGV4OiBudW1iZXIpID0+IG5ldyBMaW5lKGNvb3Jkcywge1xyXG4gICAgICAgIHN0cm9rZTogUkxfUk9PTV9TVFJPS0UsXHJcbiAgICAgICAgc3Ryb2tlV2lkdGg6IFJMX1JPT01fSU5ORVJfU1BBQ0lORyxcclxuICAgICAgICBuYW1lOiBgV0FMTDoke2luZGV4fWAsXHJcbiAgICAgICAgb3JpZ2luWDogJ2NlbnRlcicsXHJcbiAgICAgICAgb3JpZ2luWTogJ2NlbnRlcicsXHJcbiAgICAgICAgaG92ZXJDdXJzb3I6IHRoaXMuYXBwLnJvb21FZGl0ID8gdGhpcy52aWV3Lm1vdmVDdXJzb3IgOiB0aGlzLnZpZXcuZGVmYXVsdEN1cnNvcixcclxuICAgICAgICBoYXNDb250cm9sczogZmFsc2UsXHJcbiAgICAgICAgaGFzQm9yZGVyczogZmFsc2UsXHJcbiAgICAgICAgc2VsZWN0YWJsZTogdGhpcy5hcHAucm9vbUVkaXQsXHJcbiAgICAgICAgZXZlbnRlZDogdGhpcy5hcHAucm9vbUVkaXQsXHJcbiAgICAgICAgY29ybmVyU3R5bGU6ICdyZWN0J1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGxldCBMVCA9IG5ldyBQb2ludCg5OTk5LCA5OTk5KSwgUkIgPSBuZXcgUG9pbnQoMCwgMCk7XHJcblxyXG4gICAgICB0aGlzLndhbGxzID0gdGhpcy5jb3JuZXJzLm1hcCgoY29ybmVyLCBpKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBjb3JuZXI7XHJcbiAgICAgICAgY29uc3QgZW5kID0gKGkgPT09IHRoaXMuY29ybmVycy5sZW5ndGggLSAxKSA/IHRoaXMuY29ybmVyc1swXSA6IHRoaXMuY29ybmVyc1tpICsgMV07XHJcblxyXG4gICAgICAgIGlmIChjb3JuZXIudG9wIDwgTFQueCAmJiBjb3JuZXIubGVmdCA8IExULnkpXHJcbiAgICAgICAgICBMVCA9IG5ldyBQb2ludChjb3JuZXIubGVmdCwgY29ybmVyLnRvcCk7XHJcblxyXG4gICAgICAgIGlmIChjb3JuZXIudG9wID4gUkIueSAmJiBjb3JuZXIubGVmdCA+IFJCLnkpXHJcbiAgICAgICAgICBSQiA9IG5ldyBQb2ludChjb3JuZXIubGVmdCwgY29ybmVyLnRvcCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHcgPSB3YWxsKFtzdGFydC5sZWZ0LCBzdGFydC50b3AsIGVuZC5sZWZ0LCBlbmQudG9wXSwgaSk7XHJcbiAgICAgICAgcmV0dXJuIHc7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy52aWV3LmFkZCguLi50aGlzLndhbGxzKTtcclxuICAgICAgdGhpcy53YWxscy5mb3JFYWNoKHcgPT4gdy5zZW5kVG9CYWNrKCkpO1xyXG4gICAgICB0aGlzLlJPT01fU0laRSA9IHsgd2lkdGg6IFJCLnggLSBMVC54LCBoZWlnaHQ6IFJCLnkgLSBMVC55IH07XHJcblxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2NhdGVEVyhkdzogZmFicmljLkdyb3VwLCB3YWxsOiBmYWJyaWMuTGluZSwgeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGRXYWxsID0gdGhpcy5kaXJlY3Rpb25PZldhbGwod2FsbCk7XHJcbiAgICBjb25zdCBkRFcgPSBkdy5hbmdsZSAlIDE4MCA9PT0gMCA/IEhPUklaT05UQUwgOiBWRVJUSUNBTDtcclxuXHJcbiAgICBpZiAoZFdhbGwgIT0gZERXKSB7XHJcbiAgICAgIGR3LmFuZ2xlID0gKGR3LmFuZ2xlICsgOTApICUgMzYwO1xyXG4gICAgfVxyXG5cclxuICAgIGR3LnRvcCA9IHksIGR3LmxlZnQgPSB4O1xyXG4gICAgY29uc3QgY2VudGVyID0gZHcuZ2V0Q2VudGVyUG9pbnQoKTtcclxuXHJcbiAgICBpZiAoZFdhbGwgPT09IEhPUklaT05UQUwpXHJcbiAgICAgIGNlbnRlci55IDwgZHcudG9wID8gZHcudG9wICs9IE9GRlNFVCA6IGR3LnRvcCAtPSBPRkZTRVQ7XHJcbiAgICBlbHNlXHJcbiAgICAgIGNlbnRlci54IDwgZHcubGVmdCA/IGR3LmxlZnQgKz0gT0ZGU0VUIDogZHcubGVmdCAtPSBPRkZTRVQ7XHJcblxyXG4gICAgcmV0dXJuIGR3O1xyXG4gIH1cclxuXHJcbiAgc2V0RFdPcmlnaW4oZHc6IGZhYnJpYy5Hcm91cCkge1xyXG4gICAgaWYgKCFkdy5mbGlwWCAmJiAhZHcuZmxpcFkpXHJcbiAgICAgIGR3Lm9yaWdpblggPSAnbGVmdCcsIGR3Lm9yaWdpblkgPSAndG9wJztcclxuICAgIGVsc2UgaWYgKGR3LmZsaXBYICYmICFkdy5mbGlwWSlcclxuICAgICAgZHcub3JpZ2luWCA9ICdyaWdodCcsIGR3Lm9yaWdpblkgPSAndG9wJztcclxuICAgIGVsc2UgaWYgKCFkdy5mbGlwWCAmJiBkdy5mbGlwWSlcclxuICAgICAgZHcub3JpZ2luWCA9ICdsZWZ0JywgZHcub3JpZ2luWSA9ICdib3R0b20nO1xyXG4gICAgZWxzZSBpZiAoZHcuZmxpcFggJiYgZHcuZmxpcFkpXHJcbiAgICAgIGR3Lm9yaWdpblggPSAncmlnaHQnLCBkdy5vcmlnaW5ZID0gJ2JvdHRvbSc7XHJcbiAgICByZXR1cm4gZHc7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICBlZGl0Um9vbSgpIHtcclxuICAgIGlmICh0aGlzLnZpZXcuZ2V0T2JqZWN0cygpKSB7XHJcbiAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy52aWV3LmdldE9iamVjdHMoKVxyXG4gICAgICAgIGl0ZW1zLmZvckVhY2gociA9PiB7XHJcbiAgICAgICAgICAgIGlmICgociA9PT0gbnVsbCB8fCByID09PSB2b2lkIDAgPyB2b2lkIDAgOiByPy5uYW1lPy5pbmRleE9mKCdXQUxMJykpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgci5zZWxlY3RhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByLmV2ZW50ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFwcC51c2VyTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHIuc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHIuZXZlbnRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYXBwLnVzZXJNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgci5zZWxlY3RhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICByLmV2ZW50ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgfVxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0U3RhdGVzLmxlbmd0aCA9PT0gMClcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBjYW5jZWxSb29tRWRpdGlvbigpIHtcclxuXHJcbiAgICB0aGlzLnZpZXcuZ2V0T2JqZWN0cygpLmZvckVhY2gociA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKHIubmFtZS5pbmRleE9mKCdXQUxMJykgIT09IC0xIHx8IHIubmFtZS5pbmRleE9mKCdDT1JORVInKSAhPT0gLTEpIHtcclxuICAgICAgICAgIHIuc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgci5ldmVudGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHIuc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICAgICAgICByLmV2ZW50ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0SXRlbVN0YXR1cyh0eXBlOiBzdHJpbmcsIG9iamVjdDogYW55KSB7XHJcblxyXG4gICAgaWYgKG9iamVjdCAmJiB0eXBlKSAge1xyXG4gICAgICBpZiAodHlwZSA9PT0gJ3RhYmxlJykge1xyXG4gICAgICAgIGlmIChvYmplY3QubmFtZSAhPSAnJykge1xyXG4gICAgICAgICAgY29uc3QgaXRlbXMgPSBvYmplY3Quc3BsaXQoJzsnKVxyXG5cclxuICAgICAgICAgIC8vdHlwZVxyXG4gICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+PSAwICYmIGl0ZW1zWzBdKSB7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy9pZFxyXG4gICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+PSAxICYmIGl0ZW1zWzFdKSB7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy9vcmRlclxyXG4gICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+PSAyICYmIGl0ZW1zWzJdKSB7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy9zdGF0dXNcXFxyXG4gICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+PSAyICYmIGl0ZW1zWzNdKSB7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPT0gMyAmJiBpdGVtc1szXSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0dXMgPSBpdGVtc1szXVxyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgb2JqZWN0LmZpbGwgPSAncHVycGxlJ1xyXG4gICAgICAgICAgICAgIG9iamVjdC5zdHJva2UgPSAnd2hpdGUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAnMScpIHtcclxuICAgICAgICAgICAgICBvYmplY3QuZmlsbCA9ICdncmVlbidcclxuICAgICAgICAgICAgICBvYmplY3Quc3Ryb2tlID0gJ3doaXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gJzInKSB7XHJcbiAgICAgICAgICAgICAgb2JqZWN0LmZpbGwgPSAneWVsbG93J1xyXG4gICAgICAgICAgICAgIG9iamVjdC5zdHJva2UgPSAnd2hpdGUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAnMycpIHtcclxuICAgICAgICAgICAgICBvYmplY3QuZmlsbCA9ICdyZWQnXHJcbiAgICAgICAgICAgICAgb2JqZWN0LnN0cm9rZSA9ICd3aGl0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gb2JqZWN0XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVPYmplY3RJbnNlcnRpb24oeyB0eXBlLCBvYmplY3QgfSkge1xyXG5cclxuICAgIGlmICh0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIGlmICh0eXBlID09PSAnUk9PTScpIHtcclxuICAgICAgICB0aGlzLnNldFJvb20ob2JqZWN0KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZSA9PT0gJ1JPT00nIHx8IHR5cGUgPT09ICdET09SJyB8fCB0eXBlID09PSAnV0lORE9XJykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2JqZWN0ID0gIHRoaXMuc2V0SXRlbVN0YXR1cyh0eXBlLCBvYmplY3QpO1xyXG4gICAgbGV0IGdyb3VwXHJcbiAgICBpZiAodHlwZSA9PT0gJ3RhYmxlJykge1xyXG4gICAgICBjb25zdCBjaGFpciA9IHt9IGFzIGFueVxyXG4gICAgICBncm91cCA9IF8uY3JlYXRlVGFibGUodHlwZSwgb2JqZWN0LCBjaGFpcik7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZSAhPSAndGFibGUnKSB7XHJcbiAgICAgIGdyb3VwID0gXy5jcmVhdGVGdXJuaXR1cmUodHlwZSwgb2JqZWN0LCB0aGlzLkRFRkFVTFRfQ0hBSVIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKGdyb3VwKTtcclxuXHJcbiAgICBpZiAodHlwZSA9PT0gJ0RPT1InIHx8IHR5cGUgPT09ICdXSU5ET1cnKSB7XHJcbiAgICAgIGdyb3VwLm9yaWdpblggPSAnY2VudGVyJztcclxuICAgICAgZ3JvdXAub3JpZ2luWSA9ICd0b3AnO1xyXG5cclxuICAgICAgY29uc3QgZHdzID0gdGhpcy5maWx0ZXJPYmplY3RzKFsnRE9PUicsICdXSU5ET1cnXSk7XHJcbiAgICAgIGNvbnN0IGR3ID0gZHdzLmxlbmd0aCA/IGR3c1tkd3MubGVuZ3RoIC0gMV0gOiBudWxsO1xyXG5cclxuICAgICAgbGV0IHdhbGwsIHgsIHk7XHJcbiAgICAgIGlmICghZHcpIHtcclxuICAgICAgICB3YWxsID0gdGhpcy53YWxsc1swXTtcclxuICAgICAgICB4ID0gTGVmdCh3YWxsKSArIFJMX0FJU0xFR0FQO1xyXG4gICAgICAgIHkgPSBUb3Aod2FsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgb2QgPSBkdy5hbmdsZSAlIDE4MCA9PT0gMCA/IEhPUklaT05UQUwgOiBWRVJUSUNBTDtcclxuXHJcbiAgICAgICAgbGV0IHBsYWNlT25OZXh0V2FsbCA9IGZhbHNlO1xyXG4gICAgICAgIHdhbGwgPSB0aGlzLndhbGxPZkRXKGR3KTtcclxuXHJcbiAgICAgICAgaWYgKG9kID09PSBIT1JJWk9OVEFMKSB7XHJcbiAgICAgICAgICB4ID0gZHcubGVmdCArIGR3LndpZHRoICsgUkxfQUlTTEVHQVA7XHJcbiAgICAgICAgICB5ID0gVG9wKHdhbGwpO1xyXG4gICAgICAgICAgaWYgKHggKyBncm91cC53aWR0aCA+IFJpZ2h0KHdhbGwpKSB7XHJcbiAgICAgICAgICAgIHBsYWNlT25OZXh0V2FsbCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHkgPSBkdy50b3AgKyBkdy53aWR0aCArIFJMX0FJU0xFR0FQO1xyXG4gICAgICAgICAgeCA9IExlZnQod2FsbCk7XHJcbiAgICAgICAgICBpZiAoeSArIGdyb3VwLndpZHRoID4gQm90dG9tKHdhbGwpKSB7XHJcbiAgICAgICAgICAgIHBsYWNlT25OZXh0V2FsbCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxhY2VPbk5leHRXYWxsKSB7XHJcbiAgICAgICAgICB3YWxsID0gdGhpcy53YWxsc1soTnVtYmVyKHdhbGwubmFtZS5zcGxpdCgnOicpWzFdKSArIDEpICUgdGhpcy53YWxscy5sZW5ndGhdO1xyXG4gICAgICAgICAgY29uc3QgbmQgPSB0aGlzLmRpcmVjdGlvbk9mV2FsbCh3YWxsKTtcclxuXHJcbiAgICAgICAgICBpZiAobmQgPT09IEhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgeCA9IExlZnQod2FsbCkgKyBSTF9BSVNMRUdBUCwgeSA9IFRvcCh3YWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHggPSBMZWZ0KHdhbGwpLCB5ID0gVG9wKHdhbGwpICsgUkxfQUlTTEVHQVA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmxvY2F0ZURXKGdyb3VwLCB3YWxsLCB4LCB5KTtcclxuICAgICAgZ3JvdXAuaGFzQm9yZGVycyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnZpZXcuYWRkKGdyb3VwKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHJpZXZlIHNwYWNpbmcgZnJvbSBvYmplY3QsIHVzZSBybEFpc2xlR2FwIGlmIG5vdCBzcGVjaWZpZWRcclxuICAgIGNvbnN0IG5ld0xSID0gb2JqZWN0LmxyU3BhY2luZyB8fCBSTF9BSVNMRUdBUDtcclxuICAgIGNvbnN0IG5ld1RCID0gb2JqZWN0LnRiU3BhY2luZyB8fCBSTF9BSVNMRUdBUDtcclxuXHJcbiAgICAvLyBvYmplY3QgZ3JvdXBzIHVzZSBjZW50ZXIgYXMgb3JpZ2luLCBzbyBhZGQgaGFsZiB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZWlyIHJlcG9ydGVkXHJcbiAgICAvLyB3aWR0aCBhbmQgc2l6ZTsgbm90ZSB0aGF0IHRoaXMgd2lsbCBub3QgYWNjb3VudCBmb3IgY2hhaXJzIGFyb3VuZCB0YWJsZXMsIHdoaWNoIGlzXHJcbiAgICAvLyBpbnRlbnRpb25hbDsgdGhleSBnbyBpbiB0aGUgc3BlY2lmaWVkIGdhcHNcclxuICAgIGdyb3VwLmxlZnQgPSBuZXdMUiArIChncm91cC53aWR0aCAvIDIpICsgdGhpcy5yb29tX29yaWdpbjtcclxuICAgIGdyb3VwLnRvcCA9IG5ld1RCICsgKGdyb3VwLmhlaWdodCAvIDIpICsgdGhpcy5yb29tX29yaWdpbjtcclxuXHJcbiAgICBpZiAodGhpcy5sYXN0T2JqZWN0KSB7XHJcbiAgICAgIC8vIHJldHJpZXZlIHNwYWNpbmcgZnJvbSBvYmplY3QsIHVzZSBybEFpc2xlR2FwIGlmIG5vdCBzcGVjaWZpZWRcclxuICAgICAgY29uc3QgbGFzdExSID0gdGhpcy5sYXN0T2JqZWN0RGVmaW5pdGlvbi5sclNwYWNpbmcgfHwgUkxfQUlTTEVHQVA7XHJcbiAgICAgIGNvbnN0IGxhc3RUQiA9IHRoaXMubGFzdE9iamVjdERlZmluaXRpb24udGJTcGFjaW5nIHx8IFJMX0FJU0xFR0FQO1xyXG5cclxuICAgICAgLy8gY2FsY3VsYXRlIG1heGltdW0gZ2FwIHJlcXVpcmVkIGJ5IGxhc3QgYW5kIHRoaXMgb2JqZWN0XHJcbiAgICAgIC8vIE5vdGU6IHRoaXMgaXNuJ3Qgc21hcnQgZW5vdWdoIHRvIGdldCBuZXcgcm93IGdhcCByaWdodCB3aGVuXHJcbiAgICAgIC8vIG9iamVjdCBhYm92ZSBoYWQgYSBtdWNoIGJpZ2dlciBnYXAsIGV0Yy4gV2UgYXJlbid0IGZpdHRpbmcgeWV0LlxyXG4gICAgICBjb25zdCB1c2VMUiA9IE1hdGgubWF4KG5ld0xSLCBsYXN0TFIpLCB1c2VUQiA9IE1hdGgubWF4KG5ld1RCLCBsYXN0VEIpO1xyXG5cclxuICAgICAgLy8gdXNpbmcgbGVmdC90b3Agdm9jYWIsIHRob3VnaCBhbGwgb2JqZWN0cyBhcmUgbm93IGNlbnRlcmVkXHJcbiAgICAgIGNvbnN0IGxhc3RXaWR0aCA9IHRoaXMubGFzdE9iamVjdERlZmluaXRpb24ud2lkdGggfHwgMTAwO1xyXG4gICAgICBjb25zdCBsYXN0SGVpZ2h0ID0gdGhpcy5sYXN0T2JqZWN0RGVmaW5pdGlvbi5oZWlnaHQgfHwgNDA7XHJcblxyXG4gICAgICBsZXQgbmV3TGVmdCA9IHRoaXMubGFzdE9iamVjdC5sZWZ0ICsgbGFzdFdpZHRoICsgdXNlTFI7XHJcbiAgICAgIGxldCBuZXdUb3AgPSB0aGlzLmxhc3RPYmplY3QudG9wO1xyXG5cclxuICAgICAgLy8gbWFrZSBzdXJlIHdlIGZpdCBsZWZ0IHRvIHJpZ2h0LCBpbmNsdWRpbmcgb3VyIHJlcXVpcmVkIHJpZ2h0IHNwYWNpbmdcclxuICAgICAgaWYgKG5ld0xlZnQgKyBncm91cC53aWR0aCArIG5ld0xSID4gdGhpcy5ST09NX1NJWkUud2lkdGgpIHtcclxuICAgICAgICBuZXdMZWZ0ID0gbmV3TFIgKyAoZ3JvdXAud2lkdGggLyAyKTtcclxuICAgICAgICBuZXdUb3AgKz0gbGFzdEhlaWdodCArIHVzZVRCO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBncm91cC5sZWZ0ID0gbmV3TGVmdDtcclxuICAgICAgZ3JvdXAudG9wID0gbmV3VG9wO1xyXG5cclxuICAgICAgaWYgKChncm91cC5sZWZ0IC0gZ3JvdXAud2lkdGggLyAyKSA8IHRoaXMucm9vbV9vcmlnaW4pIHsgZ3JvdXAubGVmdCArPSB0aGlzLnJvb21fb3JpZ2luOyB9XHJcbiAgICAgIGlmICgoZ3JvdXAudG9wIC0gZ3JvdXAuaGVpZ2h0IC8gMikgPCB0aGlzLnJvb21fb3JpZ2luKSB7IGdyb3VwLnRvcCArPSB0aGlzLnJvb21fb3JpZ2luOyB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3JvdXAuZmlsbCA9ICdibHVlJ1xyXG5cclxuICAgIHRoaXMudmlldy5hZGQoZ3JvdXApO1xyXG4gICAgdGhpcy52aWV3LnNldEFjdGl2ZU9iamVjdChncm91cCk7XHJcblxyXG4gICAgdGhpcy5sYXN0T2JqZWN0ID0gZ3JvdXA7XHJcbiAgICB0aGlzLmxhc3RPYmplY3REZWZpbml0aW9uID0gb2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgLyoqIFNhdmUgY3VycmVudCBzdGF0ZSAqL1xyXG4gIHNhdmVTdGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLmFwcC51c2VyTW9kZSkge1xyXG4gICAgICBjb25zdCBzdGF0ZSA9IHRoaXMudmlldy50b0RhdGFsZXNzSlNPTihbJ25hbWUnLCAnaGFzQ29udHJvbHMnLCAnc2VsZWN0YWJsZScsXHJcbiAgICAgICdoYXNCb3JkZXJzJywgJ2V2ZW50ZWQnLCAnaG92ZXJDdXJzb3InXSk7XHJcbiAgICAgIHRoaXMuYXBwLnNhdmVTdGF0ZS5uZXh0KEpTT04uc3RyaW5naWZ5KHN0YXRlKSk7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLnZpZXcudG9EYXRhbGVzc0pTT04oWyduYW1lJywgJ2hhc0NvbnRyb2xzJywgJ3NlbGVjdGFibGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoYXNCb3JkZXJzJywgJ2V2ZW50ZWQnLCAnaG92ZXJDdXJzb3InLCAnbW92ZUN1cnNvciddKTtcclxuICAgIHRoaXMuYXBwLnNhdmVTdGF0ZS5uZXh0KEpTT04uc3RyaW5naWZ5KHN0YXRlKSk7XHJcbiAgfVxyXG5cclxuICB1bmRvKCkge1xyXG4gICAgbGV0IGN1cnJlbnQgPSBudWxsO1xyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuYXBwLnJvb21FZGl0U3RhdGVzLnBvcCgpO1xyXG4gICAgICB0aGlzLmFwcC5yb29tRWRpdFJlZG9TdGF0ZXMucHVzaChzdGF0ZSk7XHJcbiAgICAgIGN1cnJlbnQgPSB0aGlzLmFwcC5yb29tRWRpdFN0YXRlc1t0aGlzLmFwcC5yb29tRWRpdFN0YXRlcy5sZW5ndGggLSAxXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5hcHAuc3RhdGVzLnBvcCgpO1xyXG4gICAgICB0aGlzLmFwcC5yZWRvU3RhdGVzLnB1c2goc3RhdGUpO1xyXG4gICAgICBjdXJyZW50ID0gdGhpcy5hcHAuc3RhdGVzW3RoaXMuYXBwLnN0YXRlcy5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXcuY2xlYXIoKTtcclxuXHJcbiAgICB0aGlzLnZpZXcubG9hZEZyb21KU09OKGN1cnJlbnQsICgpID0+IHtcclxuICAgICAgdGhpcy52aWV3LnJlbmRlckFsbCgpO1xyXG4gICAgICB0aGlzLmNvcm5lcnMgPSB0aGlzLnZpZXcuZ2V0T2JqZWN0cygpLmZpbHRlcihvYmogPT4gb2JqLm5hbWUgPT09ICdDT1JORVInKTtcclxuICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqIFJlZG8gb3BlcmF0aW9uICovXHJcbiAgcmVkbygpIHtcclxuICAgIGxldCBjdXJyZW50ID0gbnVsbDtcclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgY3VycmVudCA9IHRoaXMuYXBwLnJvb21FZGl0UmVkb1N0YXRlcy5wb3AoKTtcclxuICAgICAgdGhpcy5hcHAucm9vbUVkaXRTdGF0ZXMucHVzaChjdXJyZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN1cnJlbnQgPSB0aGlzLmFwcC5yZWRvU3RhdGVzLnBvcCgpO1xyXG4gICAgICB0aGlzLmFwcC5zdGF0ZXMucHVzaChjdXJyZW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXcuY2xlYXIoKTtcclxuICAgIHRoaXMudmlldy5sb2FkRnJvbUpTT04oY3VycmVudCwgKCkgPT4ge1xyXG4gICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICAgIHRoaXMuY29ybmVycyA9IHRoaXMudmlldy5nZXRPYmplY3RzKCkuZmlsdGVyKG9iaiA9PiBvYmoubmFtZSA9PT0gJ0NPUk5FUicpO1xyXG4gICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKiBDb3B5IG9wZXJhdGlvbiAqL1xyXG4gIGNvcHkoKSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgaWYgKCFhY3RpdmUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYWN0aXZlLmNsb25lKGNsb25lZCA9PiB0aGlzLmFwcC5jb3BpZWQgPSBjbG9uZWQsIFsncG9pbnRuYW1lJywnbmFtZScsICdoYXNDb250cm9scyddKTtcclxuICB9XHJcblxyXG4gIC8qKiBQYXN0ZSBvcGVyYXRpb24gKi9cclxuICBwYXN0ZSgpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5hcHAuY29waWVkIHx8IHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFwcC5jb3BpZWQuY2xvbmUoKGNsb25lZCkgPT4ge1xyXG4gICAgICB0aGlzLnZpZXcuZGlzY2FyZEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgICBjbG9uZWQuc2V0KHtcclxuICAgICAgICBsZWZ0OiBjbG9uZWQubGVmdCArIFJMX0FJU0xFR0FQLFxyXG4gICAgICAgIHRvcDogY2xvbmVkLnRvcCArIFJMX0FJU0xFR0FQXHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoY2xvbmVkLnR5cGUgPT09ICdhY3RpdmVTZWxlY3Rpb24nKSB7XHJcbiAgICAgICAgY2xvbmVkLmNhbnZhcyA9IHRoaXMudmlldztcclxuICAgICAgICBjbG9uZWQuZm9yRWFjaE9iamVjdChvYmogPT4gdGhpcy52aWV3LmFkZChvYmopKTtcclxuICAgICAgICBjbG9uZWQuc2V0Q29vcmRzKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy52aWV3LmFkZChjbG9uZWQpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuYXBwLmNvcGllZC50b3AgKz0gUkxfQUlTTEVHQVA7XHJcbiAgICAgIHRoaXMuYXBwLmNvcGllZC5sZWZ0ICs9IFJMX0FJU0xFR0FQO1xyXG4gICAgICB0aGlzLnZpZXcuc2V0QWN0aXZlT2JqZWN0KGNsb25lZCk7XHJcbiAgICAgIHRoaXMudmlldy5yZXF1ZXN0UmVuZGVyQWxsKCk7XHJcbiAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7ICB9LCBbJ25hbWUnLCAnaGFzQ29udHJvbHMnXSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY2xlYXJMYXlvdXQoKSB7XHJcbiAgICB0aGlzLmFwcC5sb2FkSnNvbignJyk7XHJcbiAgICB0aGlzLmluaXRMYXlvdXQoKTtcclxuICB9XHJcblxyXG4gIC8qKiBEZWxldGUgb3BlcmF0aW9uICovXHJcbiAgZGVsZXRlKCkge1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuYXBwLnNlbGVjdGlvbnMpXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnbm8gaXRlbXMnKVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnNlbGVjdGlvbnMpIHtcclxuICAgICAgdGhpcy5hcHAuc2VsZWN0aW9ucy5mb3JFYWNoKHNlbGVjdGlvbiA9PiB0aGlzLnZpZXcucmVtb3ZlKHNlbGVjdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMudmlldy5kaXNjYXJkQWN0aXZlT2JqZWN0KCk7XHJcbiAgICAgIHRoaXMudmlldy5yZXF1ZXN0UmVuZGVyQWxsKCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlcnJvcilcclxuICAgIH1cclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKiogUm90YXRlIE9wZXJhdGlvbiAqL1xyXG4gIHJvdGF0ZShjbG9ja3dpc2UgPSB0cnVlKSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBhbmdsZSA9IHRoaXMuQ1RSTF9LRVlfRE9XTiA/IDkwIDogMTU7XHJcbiAgICBjb25zdCBvYmogPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcblxyXG4gICAgaWYgKCFvYmopIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgaWYgKChvYmoub3JpZ2luWCAhPT0gJ2NlbnRlcicgfHwgb2JqLm9yaWdpblkgIT09ICdjZW50ZXInKSAmJiBvYmouY2VudGVyZWRSb3RhdGlvbikge1xyXG4gICAgICBvYmoub3JpZ2luWCA9ICdjZW50ZXInO1xyXG4gICAgICBvYmoub3JpZ2luWSA9ICdjZW50ZXInO1xyXG4gICAgICBvYmoubGVmdCArPSBvYmoud2lkdGggLyAyO1xyXG4gICAgICBvYmoudG9wICs9IG9iai5oZWlnaHQgLyAyO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRFcob2JqKSkge1xyXG4gICAgICBhbmdsZSA9IG9iai5hbmdsZSArIChjbG9ja3dpc2UgPyAxODAgOiAtMTgwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFuZ2xlID0gb2JqLmFuZ2xlICsgKGNsb2Nrd2lzZSA/IGFuZ2xlIDogLWFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYW5nbGUgPiAzNjApIHsgYW5nbGUgLT0gMzYwOyB9IGVsc2UgaWYgKGFuZ2xlIDwgMCkgeyBhbmdsZSArPSAzNjA7IH1cclxuXHJcbiAgICBvYmouYW5nbGUgPSBhbmdsZTtcclxuICAgIHRoaXMudmlldy5yZXF1ZXN0UmVuZGVyQWxsKCk7XHJcbiAgfVxyXG5cclxuICAvKiogR3JvdXAgKi9cclxuICBncm91cCgpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgaWYgKCEodGhpcy5hcHAuc2VsZWN0aW9ucy5sZW5ndGggPiAxICYmIGFjdGl2ZSBpbnN0YW5jZW9mIGZhYnJpYy5BY3RpdmVTZWxlY3Rpb24pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmUudG9Hcm91cCgpO1xyXG4gICAgYWN0aXZlLmxvY2tTY2FsaW5nWCA9IHRydWUsIGFjdGl2ZS5sb2NrU2NhbGluZ1kgPSB0cnVlO1xyXG4gICAgdGhpcy5vblNlbGVjdGVkKCk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdW5ncm91cCgpIHtcclxuICAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgaWYgKCEoYWN0aXZlICYmIGFjdGl2ZSBpbnN0YW5jZW9mIGZhYnJpYy5Hcm91cCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2ZS50b0FjdGl2ZVNlbGVjdGlvbigpO1xyXG4gICAgYWN0aXZlLmxvY2tTY2FsaW5nWCA9IHRydWUsIGFjdGl2ZS5sb2NrU2NhbGluZ1kgPSB0cnVlO1xyXG4gICAgdGhpcy5vblNlbGVjdGVkKCk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgbW92ZShkaXJlY3Rpb24sIGluY3JlYW1lbnQgPSA2KSB7XHJcblxyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuICAgIGlmICghYWN0aXZlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICBjYXNlICdMRUZUJzpcclxuICAgICAgICBhY3RpdmUubGVmdCAtPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdVUCc6XHJcbiAgICAgICAgYWN0aXZlLnRvcCAtPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdSSUdIVCc6XHJcbiAgICAgICAgYWN0aXZlLmxlZnQgKz0gaW5jcmVhbWVudDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnRE9XTic6XHJcbiAgICAgICAgYWN0aXZlLnRvcCArPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdGhpcy52aWV3LnJlcXVlc3RSZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBzZXRab29tKCkge1xyXG4gICAgdGhpcy52aWV3LnNldFpvb20odGhpcy5hcHAuem9vbSAvIDEwMCk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgfVxyXG5cclxuICBzZXRTY2FsaW5nWm9vbSgpIHtcclxuICAgIC8vIHRoaXMudmlldy5zZXREaW1lbnNpb25zKHsgd2lkdGg6IHRoaXMudmlldy5nZXRXaWR0aCgpICogdGhpcy5hcHAuc2NhbGVSYXRpbyxcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnZpZXcuZ2V0SGVpZ2h0KCkgKiB0aGlzLmFwcC5zY2FsZVJhdGlvIH0pO1xyXG4gIH1cclxuXHJcbiAgcGxhY2VJbkNlbnRlcihkaXJlY3Rpb24pIHtcclxuICAgIGlmICggdGhpcy51c2VyTW9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcblxyXG4gICAgaWYgKCFhY3RpdmUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdIT1JJWk9OVEFMJykge1xyXG4gICAgICBhY3RpdmUubGVmdCA9IHRoaXMuUk9PTV9TSVpFLndpZHRoIC8gMiAtIChhY3RpdmUub3JpZ2luWCA9PT0gJ2NlbnRlcicgPyAwIDogYWN0aXZlLndpZHRoIC8gMik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhY3RpdmUudG9wID0gdGhpcy5ST09NX1NJWkUuaGVpZ2h0IC8gMiAtIChhY3RpdmUub3JpZ2luWCA9PT0gJ2NlbnRlcicgPyAwIDogYWN0aXZlLmhlaWdodCAvIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2ZS5zZXRDb29yZHMoKTtcclxuICAgIHRoaXMudmlldy5yZXF1ZXN0UmVuZGVyQWxsKCk7XHJcbiAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgYXJyYW5nZShhY3Rpb246IHN0cmluZykge1xyXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuZ2V0Qm91bmRpbmdSZWN0KHRoaXMuYXBwLnNlbGVjdGlvbnMpO1xyXG4gICAgYWN0aW9uID0gYWN0aW9uLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB0aGlzLmFwcC5zZWxlY3Rpb25zLmZvckVhY2gocyA9PiB7XHJcbiAgICAgIGlmIChhY3Rpb24gPT09ICdsZWZ0JyB8fCBhY3Rpb24gPT09ICdyaWdodCcgfHwgYWN0aW9uID09PSAnY2VudGVyJykge1xyXG4gICAgICAgIHMubGVmdCA9IHJlY3RbYWN0aW9uXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzLnRvcCA9IHJlY3RbYWN0aW9uXTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgZmlsdGVyT2JqZWN0cyhuYW1lczogc3RyaW5nW10pIHtcclxuICAgIHJldHVybiB0aGlzLnZpZXcuZ2V0T2JqZWN0cygpLmZpbHRlcihvYmogPT4gbmFtZXMuc29tZShuID0+IG9iai5uYW1lLmluZGV4T2YobikgPiAtMSkpO1xyXG4gIH1cclxuXHJcbiAgd2FsbE9mRFcoZHc6IGZhYnJpYy5Hcm91cCB8IGZhYnJpYy5PYmplY3QpIHtcclxuICAgIGNvbnN0IGQgPSBkdy5hbmdsZSAlIDE4MCA9PT0gMCA/IEhPUklaT05UQUwgOiBWRVJUSUNBTDtcclxuICAgIHJldHVybiB0aGlzLndhbGxzLmZpbmQodyA9PiBNYXRoLmFicyhkID09PSBIT1JJWk9OVEFMID8gdy50b3AgLSBkdy50b3AgOiB3LmxlZnQgLSBkdy5sZWZ0KSA9PT0gT0ZGU0VUKTtcclxuICB9XHJcblxyXG4gIGRpcmVjdGlvbk9mV2FsbCh3YWxsOiBmYWJyaWMuTGluZSkge1xyXG4gICAgaWYgKHdhbGwueDEgPT09IHdhbGwueDIpIHtcclxuICAgICAgcmV0dXJuIFZFUlRJQ0FMO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIEhPUklaT05UQUw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc0RXKG9iamVjdCkge1xyXG4gICAgcmV0dXJuIG9iamVjdC5uYW1lLmluZGV4T2YoJ0RPT1InKSA+IC0xIHx8IG9iamVjdC5uYW1lLmluZGV4T2YoJ1dJTkRPVycpID4gLTE7XHJcbiAgfVxyXG5cclxuICBnZXRCb3VuZGluZ1JlY3Qob2JqZWN0czogYW55W10pIHtcclxuICAgIGxldCB0b3AgPSA5OTk5LCBsZWZ0ID0gOTk5OSwgcmlnaHQgPSAwLCBib3R0b20gPSAwO1xyXG4gICAgb2JqZWN0cy5mb3JFYWNoKG9iaiA9PiB7XHJcbiAgICAgIGlmIChvYmoubGVmdCA8IHRvcCkge1xyXG4gICAgICAgIHRvcCA9IG9iai50b3A7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG9iai5sZWZ0IDwgbGVmdCkge1xyXG4gICAgICAgIGxlZnQgPSBvYmoubGVmdDtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2JqLnRvcCA+IGJvdHRvbSkge1xyXG4gICAgICAgIGJvdHRvbSA9IG9iai50b3A7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG9iai5sZWZ0ID4gcmlnaHQpIHtcclxuICAgICAgICByaWdodCA9IG9iai5sZWZ0O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBjZW50ZXIgPSAobGVmdCArIHJpZ2h0KSAvIDI7XHJcbiAgICBjb25zdCBtaWRkbGUgPSAodG9wICsgYm90dG9tKSAvIDI7XHJcblxyXG4gICAgcmV0dXJuIHsgbGVmdCwgdG9wLCByaWdodCwgYm90dG9tLCBjZW50ZXIsIG1pZGRsZSB9O1xyXG4gIH1cclxuXHJcbiAgbG9hZEpTT04oKSB7XHJcbiAgICB0aGlzLmFwcC5qc29uVmFsdWUuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgICAgICB0aGlzLm1haW5jb250YWluZXJDbGFzcyA9ICdtYWluLWNvbnRhaW5lci11c2VybW9kZSdcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgICAgICB0aGlzLm1haW5jb250YWluZXJDbGFzcyA9ICdtYWluLWNvbnRhaW5lcidcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmICghZGF0YSB8fCBkYXRhID09IG51bGwgICYmIHRoaXMudmlldykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xlYXInKVxyXG4gICAgICAgICAgICB0aGlzLnZpZXcubG9hZEZyb21KU09OKG51bGwsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudmlldy5sb2FkRnJvbUpTT04oIGRhdGEsIHRoaXMudmlldy5yZW5kZXJBbGwuYmluZCh0aGlzLnZpZXcpIClcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicsIGVycm9yKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZpZXcubG9hZEZyb21KU09OKCBkYXRhLCB0aGlzLnZpZXcucmVuZGVyQWxsLmJpbmQodGhpcy52aWV3KSApXHJcbiAgICAgIH1cclxuICAgIClcclxuICB9XHJcblxyXG4gIHRvZ2dsZVNlbGVjdGlvbihzZWxlY3RhYmxlOiBib29sZWFuKXtcclxuICAgIHRoaXMudmlldy5nZXRPYmplY3RzKCkuZm9yRWFjaCgob2JqLCBpbmRleCkgPT4ge1xyXG4gICAgICBvYmouc2VsZWN0YWJsZSA9IHNlbGVjdGFibGU7XHJcbiAgICAgIG9iai5ldmVudGVkID0gdHJ1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpc0pzb25TdHJ1Y3R1cmUoc3RyKSB7XHJcbiAgICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiBmYWxzZTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IEpTT04ucGFyc2Uoc3RyKTtcclxuICAgICAgY29uc3QgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChyZXN1bHQpO1xyXG4gICAgICByZXR1cm4gdHlwZSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcclxuICAgICAgICAgICAgIHx8IHR5cGUgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhbHRlck9iamVjdENvbG9yKHV1SUQ6IHN0cmluZywgY29sb3I6IHN0cmluZykge1xyXG4gICAgY29uc3QgdmlldyA9IHRoaXMudmlldztcclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1dWlkJywgdXVJRCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHZpZXcuX29iamVjdHMpXHJcbiAgICAgIGlmICh2aWV3Ll9vYmplY3RzKSB7XHJcbiAgICAgICAgICB2aWV3Ll9vYmplY3RzLmZvckVhY2goZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGE/LnR5cGUgICYmIChkYXRhPy50eXBlID09PSAnZ3JvdXAnICkgKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgaXRlbVZhbHVlID0gZGF0YT8ubmFtZS5zcGxpdChcIjtcIilcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhPy5uYW1lLCB1dUlEKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaXRlbVZhbHVlJywgaXRlbVZhbHVlKVxyXG4gICAgICAgICAgICAgIGlmIChpdGVtVmFsdWUubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbVVVSUQgPSBpdGVtVmFsdWVbMF07XHJcbiAgICAgICAgICAgICAgICBpZiAodXVJRCA9PT0gaXRlbVVVSUQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaXRlbVZhbHVlIHVwZGF0ZSAnLCBpdGVtVmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgc3Ryb2tlID0gNVxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yID09PSAncmVkJyB8fCBjb2xvciA9PT0gICdyZ2IoMjAwLDEwLDEwKScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3Ryb2tlID0gOFxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ2dyZWVuJyB8fCBjb2xvciA9PT0gICdyZ2IoMTAsMTAsMjAwKScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3Ryb2tlID0gNVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ3llbGxvdycgfHwgY29sb3IgPT09ICAncmdiKDEwLDEwLDIwMCknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuYm9yZGVyQ29sb3IgPSAgY29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0cm9rZSA9IDVcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YT8uYmFja2dyb3VuZENvbG9yID09PSAncHVycGxlJyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE/LmJhY2tncm91bmRDb2xvciA9PT0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCduYW1lIHN1Y2Nlc3NmdWwgc2V0dGluZyBjb2xvcicsIG5hbWUsIGRhdGE/LmJhY2tncm91bmRDb2xvciwgY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJvcmRlckNvbG9yID0gIGNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlID0gY29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zdHJva2VXaWR0aCA9IHN0cm9rZVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdwdXJwbGUnIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT8uYmFja2dyb3VuZENvbG9yID09PSAncmdiYSgyNTUsMTAwLDE3MSwwLjI1KScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25hbWUgc3VjY2Vzc2Z1bCBzZXR0aW5nIGNvbG9yIDInLCBuYW1lLCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IsIGNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnN0cm9rZSA9IGNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlV2lkdGggPSBzdHJva2VcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFsdGVyQ29sb3IoY29sb3IsIGRhdGEsIHN0cm9rZSAtMyApXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgfVxyXG5cclxuICBhbHRlckNvbG9yKGNvbG9yLCBvYmosIHN0cm9rZSkge1xyXG4gICAgb2JqLmJvcmRlckNvbG9yID0gIGNvbG9yXHJcbiAgICBvYmouc3Ryb2tlID0gY29sb3JcclxuICAgIG9iai5zdHJva2VXaWR0aCA9IHN0cm9rZVxyXG4gICAgaWYgKG9iai5vYmplY3RzICYmIG9iai5vYmplY3RzLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgb2JqLm9iamVjdHMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgIHRoaXMuYWx0ZXJDb2xvcihjb2xvciwgaXRlbSwgc3Ryb2tlKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9ialxyXG4gIH1cclxuXHJcblxyXG59XHJcbiIsIjxkaXYgW2NsYXNzXT1cIm1haW5jb250YWluZXJDbGFzc1wiICA+XHJcbiAgPGNhbnZhcyAgaWQ9XCJtYWluXCI+PC9jYW52YXM+XHJcbjwvZGl2PlxyXG4iXX0=