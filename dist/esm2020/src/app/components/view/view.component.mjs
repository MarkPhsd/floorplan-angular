import { Component, EventEmitter, Output, Input } from '@angular/core';
import { fabric } from 'fabric';
import * as _ from '../../helpers';
import * as i0 from "@angular/core";
import * as i1 from "../../app.service";
// import { faListSquares } from '@fortawesome/free-solid-svg-icons';
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
                if (!orderID || orderID == undefined || orderID == 'null' || orderID == null) {
                    orderID = '';
                    status = 'inactive';
                }
                this.app.orderID = orderID;
                const newItem = `${uid};${orderID};${name};${status}`;
                this.selectedObject.name = newItem;
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
        if (!orderID || orderID == '') {
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
        if (!this.view) {
            console.log('no view');
            return;
        }
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
        if (!this.view) {
            console.log('no view');
            return;
        }
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
ViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: ViewComponent, deps: [{ token: i1.AppService }], target: i0.ɵɵFactoryTarget.Component });
ViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: ViewComponent, selector: "pointless-room-layout-view", inputs: { userMode: "userMode" }, outputs: { outPutSelectedItem: "outPutSelectedItem" }, host: { listeners: { "document:keydown": "onKeyDown($event)", "document:keyup": "onKeyUp($event)" } }, ngImport: i0, template: "<div [class]=\"maincontainerClass\"  >\r\n  <canvas  id=\"main\"></canvas>\r\n</div>\r\n", styles: [".main-container{padding:24px;overflow:auto;height:calc(100% - 199px)}.main-container-usermode{padding:15px;overflow:auto;height:calc(100% - 100px)}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: ViewComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvdmlldy92aWV3LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy92aWV3L3ZpZXcuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBeUIsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUYsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUdoQyxPQUFPLEtBQUssQ0FBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBQ25DLHFFQUFxRTtBQUNyRSwyQ0FBMkM7QUFDM0MsNkVBQTZFO0FBRTdFLE1BQU0sRUFDSixhQUFhLEVBQ2IsY0FBYyxFQUNkLE9BQU8sRUFDUCxXQUFXLEVBQ1gscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQixjQUFjLEVBQ2QsY0FBYyxFQUNkLGVBQWUsRUFDZixjQUFjLEVBQ2QscUJBQXFCLEVBQ3RCLEdBQUcsQ0FBQyxDQUFDO0FBRU4sTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLENBQUM7QUFDL0IsTUFDRSxVQUFVLEdBQUcsWUFBWSxFQUN6QixRQUFRLEdBQUcsVUFBVSxFQUNyQixNQUFNLEdBQUcscUJBQXFCLEdBQUcsQ0FBQyxDQUFDO0FBRXJDLE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDN0QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdB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R0FBRyxLQUFLLENBQUE7UUFDbEIsR0FBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUE7UUFDeEIsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRztZQUN4QyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQ3hDLENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7OzJHQTcyQ1UsYUFBYTsrRkFBYixhQUFhLGtRQzVDMUIsMEZBR0E7NEZEeUNhLGFBQWE7a0JBVHpCLFNBQVM7K0JBQ0UsNEJBQTRCLFFBR2hDO3dCQUNKLG9CQUFvQixFQUFFLG1CQUFtQjt3QkFDekMsa0JBQWtCLEVBQUUsaUJBQWlCO3FCQUN0QztpR0FNUyxRQUFRO3NCQUFqQixLQUFLO2dCQUNJLGtCQUFrQjtzQkFBM0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBBZnRlclZpZXdJbml0LCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZm9ybWF0RGF0ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IGZhYnJpYyB9IGZyb20gJ2ZhYnJpYyc7XHJcbmltcG9ydCB7IHNhdmVBcyB9IGZyb20gJ2ZpbGUtc2F2ZXInO1xyXG5pbXBvcnQgeyBBcHBTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYXBwLnNlcnZpY2UnO1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJy4uLy4uL2hlbHBlcnMnO1xyXG4vLyBpbXBvcnQgeyBmYUxpc3RTcXVhcmVzIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zJztcclxuLy8gaW1wb3J0IHsganNvbiB9IGZyb20gJ3N0cmVhbS9jb25zdW1lcnMnO1xyXG4vLyBpbXBvcnQgeyBWaWV3SlNPTlNlcnZpY2VTZXJ2aWNlIH0gZnJvbSAnc3JjL2FwcC92aWV3LWpzb25zZXJ2aWNlLnNlcnZpY2UnO1xyXG5cclxuY29uc3Qge1xyXG4gIFJMX1ZJRVdfV0lEVEgsXHJcbiAgUkxfVklFV19IRUlHSFQsXHJcbiAgUkxfRk9PVCxcclxuICBSTF9BSVNMRUdBUCxcclxuICBSTF9ST09NX09VVEVSX1NQQUNJTkcsXHJcbiAgUkxfUk9PTV9JTk5FUl9TUEFDSU5HLFxyXG4gIFJMX1JPT01fU1RST0tFLFxyXG4gIFJMX0NPUk5FUl9GSUxMLFxyXG4gIFJMX1VOR1JPVVBBQkxFUyxcclxuICBSTF9DUkVESVRfVEVYVCxcclxuICBSTF9DUkVESVRfVEVYVF9QQVJBTVNcclxufSA9IF87XHJcblxyXG5jb25zdCB7IExpbmUsIFBvaW50IH0gPSBmYWJyaWM7XHJcbmNvbnN0XHJcbiAgSE9SSVpPTlRBTCA9ICdIT1JJWk9OVEFMJyxcclxuICBWRVJUSUNBTCA9ICdWRVJUSUNBTCcsXHJcbiAgT0ZGU0VUID0gUkxfUk9PTV9JTk5FUl9TUEFDSU5HIC8gMjtcclxuXHJcbmNvbnN0IExlZnQgPSAod2FsbCkgPT4gd2FsbC54MSA8IHdhbGwueDIgPyB3YWxsLngxIDogd2FsbC54MjtcclxuY29uc3QgVG9wID0gKHdhbGwpID0+IHdhbGwueTEgPCB3YWxsLnkyID8gd2FsbC55MSA6IHdhbGwueTI7XHJcbmNvbnN0IFJpZ2h0ID0gKHdhbGwpID0+IHdhbGwueDEgPiB3YWxsLngyID8gd2FsbC54MSA6IHdhbGwueDI7XHJcbmNvbnN0IEJvdHRvbSA9ICh3YWxsKSA9PiB3YWxsLnkxID4gd2FsbC55MiA/IHdhbGwueTEgOiB3YWxsLnkyO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdwb2ludGxlc3Mtcm9vbS1sYXlvdXQtdmlldycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpZXcuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3ZpZXcuY29tcG9uZW50LnNjc3MnXSxcclxuICBob3N0OiB7XHJcbiAgICAnKGRvY3VtZW50OmtleWRvd24pJzogJ29uS2V5RG93bigkZXZlbnQpJyxcclxuICAgICcoZG9jdW1lbnQ6a2V5dXApJzogJ29uS2V5VXAoJGV2ZW50KSdcclxuICB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcclxuXHJcbiAgc2VsZWN0ZWRPYmplY3Q6IGFueTtcclxuXHJcbiAgQElucHV0KCkgIHVzZXJNb2RlOiBib29sZWFuO1xyXG4gIEBPdXRwdXQoKSBvdXRQdXRTZWxlY3RlZEl0ZW0gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHZpZXc6IGZhYnJpYy5DYW52YXM7XHJcbiAgcm9vbTogZmFicmljLkdyb3VwO1xyXG4gIHJvb21MYXllcjogZmFicmljLkdyb3VwIHwgZmFicmljLlJlY3Q7XHJcbiAgY29ybmVycyA9IFtdO1xyXG4gIHdhbGxzOiBmYWJyaWMuTGluZVtdID0gW107XHJcbiAgbGFzdE9iamVjdERlZmluaXRpb24gPSBudWxsO1xyXG4gIGxhc3RPYmplY3QgPSBudWxsO1xyXG5cclxuICBDVFJMX0tFWV9ET1dOID0gZmFsc2U7XHJcbiAgTU9WRV9XQUxMX0lEID0gLTE7XHJcbiAgUk9PTV9TSVpFID0geyB3aWR0aDogOTYwLCBoZWlnaHQ6IDQ4MCB9O1xyXG4gIERFRkFVTFRfQ0hBSVIgPSBudWxsO1xyXG4gIFJFTU9WRV9EVyA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvciggcHVibGljIGFwcDogQXBwU2VydmljZSApIHsgfVxyXG5cclxuICBtYWluY29udGFpbmVyQ2xhc3MgPSAnbWFpbi1jb250YWluZXInXHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG5cclxuICAgIHRoaXMubG9hZEpTT04oKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLmFwcC5zZXRTZWxlY3RlZE9iamVjdENvbG9yLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgdGhpcy5hbHRlck9iamVjdENvbG9yKGRhdGEudXVpZCwgZGF0YS5jb2xvcik7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdhbHRlciBvYmplY3QgY29sb3InKVxyXG4gICAgICB9KVxyXG4gICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuYXBwLnJvb21FZGl0aW9uLnN1YnNjcmliZShkb0VkaXQgPT4ge1xyXG4gICAgICAgIHRoaXMuY29ybmVycy5mb3JFYWNoKGMgPT4gdGhpcy5zZXRDb3JuZXJTdHlsZShjKSk7XHJcbiAgICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICAgIGlmIChkb0VkaXQpIHtcclxuICAgICAgICAgIHRoaXMuZWRpdFJvb20oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jYW5jZWxSb29tRWRpdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5hcHAuaW5zZXJ0T2JqZWN0LnN1YnNjcmliZShyZXMgPT4ge1xyXG4gICAgICAgICAgdGhpcy5oYW5kbGVPYmplY3RJbnNlcnRpb24ocmVzKTtcclxuICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBwLmRlZmF1bHRDaGFpci5zdWJzY3JpYmUocmVzID0+IHRoaXMuREVGQVVMVF9DSEFJUiA9IHJlcyk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5hcHAuc2VsZWN0ZWRCYWNrR3JvdW5kSW1hZ2Uuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0QmFja2dyb3VuZEltYWdlKGRhdGEpXHJcbiAgICAgIH0pXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB0aGlzLmFwcC5wZXJmb3JtT3BlcmF0aW9uLnN1YnNjcmliZShvcGVyYXRpb24gPT4ge1xyXG4gICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xyXG5cclxuICAgICAgICBjYXNlICdVTkRPJzpcclxuICAgICAgICAgIHRoaXMudW5kbygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ1JFRE8nOlxyXG4gICAgICAgICAgdGhpcy5yZWRvKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnQ09QWSc6XHJcbiAgICAgICAgICB0aGlzLmNvcHkoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdQQVNURSc6XHJcbiAgICAgICAgICB0aGlzLnBhc3RlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnREVMRVRFJzpcclxuICAgICAgICAgIHRoaXMuZGVsZXRlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnUk9UQVRFJzpcclxuICAgICAgICAgIHRoaXMucm90YXRlKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnUk9UQVRFX0FOVEknOlxyXG4gICAgICAgICAgdGhpcy5yb3RhdGUoZmFsc2UpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2V0VGFibGVOYW1lJzpcclxuICAgICAgICAgIHRoaXMuc2V0VGFibGVOYW1lKHRoaXMuYXBwLnRhYmxlTmFtZSk7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ3NldE9yZGVySUQnOlxyXG4gICAgICAgICAgaWYgKHRoaXMuYXBwLmNsZWFyTmV4dFNlbGVjdGVkVGFibGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRPYmplY3RPcmRlcklEKCcnKTtcclxuICAgICAgICAgICAgdGhpcy5hcHAuY2xlYXJOZXh0U2VsZWN0ZWRUYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuc2V0T2JqZWN0T3JkZXJJRCh0aGlzLmFwcC5vcmRlcklEKTtcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAnY2xlYXJMYXlvdXQnOlxyXG4gICAgICAgICAgdGhpcy5jbGVhckxheW91dCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnR1JPVVAnOlxyXG4gICAgICAgICAgdGhpcy5ncm91cCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ1VOR1JPVVAnOlxyXG4gICAgICAgICAgdGhpcy51bmdyb3VwKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnSE9SSVpPTlRBTCc6XHJcbiAgICAgICAgY2FzZSAnVkVSVElDQUwnOlxyXG4gICAgICAgICAgdGhpcy5wbGFjZUluQ2VudGVyKG9wZXJhdGlvbik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdST09NX09QRVJBVElPTic6XHJcbiAgICAgICAgICAvLyB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdQTkcnOlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbG9hZGpzb24nOlxyXG4gICAgICAgICAgdGhpcy5sb2FkSlNPTigpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2F2ZSc6XHJcbiAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnanNvbic6XHJcbiAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2F2ZUZ1bGxKc29uJzpcclxuICAgICAgICAgIHRoaXMuYXBwLmpzb25WYWx1ZS5uZXh0KCBKU09OLnN0cmluZ2lmeSh0aGlzLnZpZXcudG9KU09OKFsnbmFtZSddKSkgKVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnWk9PTSc6XHJcbiAgICAgICAgICB0aGlzLnNldFpvb20oKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0luaXRMYXlvdXQnOlxyXG4gICAgICAgICAgdGhpcy5pbml0TGF5b3V0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdkaXNhYmxlU2VsZWN0aW9uJzpcclxuICAgICAgICAgIHRoaXMudG9nZ2xlU2VsZWN0aW9uKGZhbHNlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2Rpc2FibGVTZWxlY3Rpb24nOlxyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVNlbGVjdGlvbih0cnVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnTEVGVCc6XHJcbiAgICAgICAgY2FzZSAnQ0VOVEVSJzpcclxuICAgICAgICBjYXNlICdSSUdIVCc6XHJcbiAgICAgICAgY2FzZSAnVE9QJzpcclxuICAgICAgICBjYXNlICdNSURETEUnOlxyXG4gICAgICAgIGNhc2UgJ0JPVFRPTSc6XHJcbiAgICAgICAgICB0aGlzLmFycmFuZ2Uob3BlcmF0aW9uKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICAvKiogSW5pdGlhbGl6ZSBjYW52YXMgKi9cclxuICAgIHRoaXMuaW5pdExheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgaW5pdExheW91dCgpIHtcclxuICAgIHRoaXMuYXBwLnNhdmVTdGF0ZS5uZXh0KEpTT04uc3RyaW5naWZ5KG51bGwpKTtcclxuICAgIHRoaXMuc2V0Q2FudmFzVmlldygpO1xyXG4gICAgLyoqIEFkZCByb29tICovXHJcbiAgICB0aGlzLnNldFJvb20odGhpcy5ST09NX1NJWkUpO1xyXG4gICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIGdldCByb29tX29yaWdpbigpIHtcclxuICAgIHJldHVybiBSTF9ST09NX09VVEVSX1NQQUNJTkcgKyBSTF9ST09NX0lOTkVSX1NQQUNJTkc7XHJcbiAgfVxyXG5cclxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIGNvbnN0IGNvZGUgPSBldmVudC5rZXkgfHwgZXZlbnQua2V5Q29kZTtcclxuICAgIC8vIEN0cmwgS2V5IGlzIGRvd25cclxuICAgIGlmIChldmVudC5jdHJsS2V5KSB7XHJcbiAgICAgIHRoaXMuQ1RSTF9LRVlfRE9XTiA9IHRydWU7XHJcbiAgICAgIC8vIEN0cmwgKyBTaGlmdCArIFpcclxuICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIGNvZGUgPT09IDkwKVxyXG4gICAgICAgIHRoaXMuYXBwLnJlZG8oKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gOTApXHJcbiAgICAgICAgdGhpcy5hcHAudW5kbygpO1xyXG4gICAgICBlbHNlIGlmIChjb2RlID09PSA2NylcclxuICAgICAgICB0aGlzLmFwcC5jb3B5KCk7XHJcbiAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDg2KVxyXG4gICAgICAgIHRoaXMucGFzdGUoKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMzcpXHJcbiAgICAgICAgdGhpcy5yb3RhdGUoKTtcclxuICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMzkpXHJcbiAgICAgICAgdGhpcy5yb3RhdGUoZmFsc2UpO1xyXG4gICAgICBlbHNlIGlmIChjb2RlID09PSA3MSlcclxuICAgICAgICB0aGlzLmdyb3VwKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjb2RlID09PSA0NilcclxuICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDM3KVxyXG4gICAgICB0aGlzLm1vdmUoJ0xFRlQnKTtcclxuICAgIGVsc2UgaWYgKGNvZGUgPT09IDM4KVxyXG4gICAgICB0aGlzLm1vdmUoJ1VQJyk7XHJcbiAgICBlbHNlIGlmIChjb2RlID09PSAzOSlcclxuICAgICAgdGhpcy5tb3ZlKCdSSUdIVCcpO1xyXG4gICAgZWxzZSBpZiAoY29kZSA9PT0gNDApXHJcbiAgICAgIHRoaXMubW92ZSgnRE9XTicpO1xyXG4gIH1cclxuXHJcbiAgb25LZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0NvbnRyb2wnKSB7XHJcbiAgICAgIHRoaXMuQ1RSTF9LRVlfRE9XTiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25TY3JvbGwoZXZlbnQpIHsgfVxyXG5cclxuICBzZXRHcm91cGFibGVTdGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLmFwcC5zZWxlY3Rpb25zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgdGhpcy5hcHAudW5ncm91cGFibGUgPSBmYWxzZTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG9iaiA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCB0eXBlID0gb2JqLm5hbWUgPyBvYmoubmFtZS5zcGxpdCgnOicpWzBdIDogJyc7XHJcbiAgICAgIGlmIChSTF9VTkdST1VQQUJMRVMuaW5kZXhPZih0eXBlKSA+IC0xKSB7XHJcbiAgICAgICAgdGhpcy5hcHAudW5ncm91cGFibGUgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmFwcC51bmdyb3VwYWJsZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0T2JqZWN0U2V0dGluZ3Mob2JqZWN0ICwga2V5LCAgY29sb3IpIHtcclxuICAgIGZhYnJpYy5Hcm91cC5wcm90b3R5cGUuc2VsZWN0aW9uQmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMjU1LDEwMCwxNzEsMC4yNSknO1xyXG4gICAgZmFicmljLkdyb3VwLnByb3RvdHlwZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgyNTUsMTAwLDE3MSwwLjI1KSc7XHJcbiAgICBmYWJyaWMuR3JvdXAucHJvdG90eXBlLmZpbGwgPSAncmdiYSgyNTUsMTAwLDE3MSwwLjI1KSc7XHJcbiAgICBmYWJyaWMuR3JvdXAucHJvdG90eXBlLnN0cm9rZVdpZHRoID0gMztcclxuICB9XHJcblxyXG4gIG9uU2VsZWN0ZWQoKSB7XHJcbiAgICBpZiAoIXRoaXMudmlldykge1xyXG4gICAgICBjb25zb2xlLmxvZygndmlldyBpcyB1bmRlZmluZWQnKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLnZpZXcgfHwgIWFjdGl2ZSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnYWN0aXZlIGlzIHVuZGVmaW5lZCcpO1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIC8vIHRoaXMuc2V0T2JqZWN0U2V0dGluZ3MoYWN0aXZlLCAnZmlsbCcsICdyZWQnKVxyXG4gICAgLy8gLy8gYWN0aXZlLl9yZW5kZXJGaWxsKCdwdXJwbGUnLCAoKSA9PiB7IH0pO1xyXG4gICAgLy8gcmV0dXJuO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGFjdGl2ZS5sb2NrU2NhbGluZ1ggPSB0cnVlLCBhY3RpdmUubG9ja1NjYWxpbmdZID0gdHJ1ZTtcclxuICAgICAgaWYgKCFhY3RpdmUubmFtZSkge1xyXG4gICAgICAgIGFjdGl2ZS5uYW1lID0gJ0dST1VQJztcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcHAuc2VsZWN0aW9ucyA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3RzKCk7XHJcbiAgICB0aGlzLnNldEdyb3VwYWJsZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBzZXRTZWxlY3RlZE9iamVjdENvbG9yKGl0ZW0sIGNvbG9yOiBzdHJpbmcsIHNhdmVTdGF0ZTogYm9vbGVhbikge1xyXG4gICAgLy8gY29uc3QgaXRlbSA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuICAgIGlmICghaXRlbSkgeyByZXR1cm4gfVxyXG4gICAgaWYgKGl0ZW0ubmFtZSkge1xyXG4gICAgICBjb25zdCB1aWQgID0gaXRlbS5uYW1lLnNwbGl0KCc7JylbMF07XHJcbiAgICAgIC8vIGNvbnN0IGpzb24gPSB0aGlzLmFsdGVyT2JqZWN0Q29sb3IoaXRlbS5uYW1lLCBjb2xvcik7XHJcbiAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgICAgLy8gdGhpcy52aWV3LmxvYWRGcm9tSlNPTihqc29uLCBmdW5jdGlvbigpIHsgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBzZXRCYWNrZ3JvdW5kSW1hZ2UoaW1hZ2U6IHN0cmluZykge1xyXG4gICAgaWYgKCFpbWFnZSB8fCBpbWFnZSA9PT0gJycpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICB0aGlzLnZpZXcuc2V0QmFja2dyb3VuZEltYWdlKGltYWdlLCB0aGlzLnZpZXcucmVuZGVyQWxsLmJpbmQodGhpcy52aWV3KSwge1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRPYmplY3RPcmRlcklEKG9yZGVySUQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkT2JqZWN0KSB7XHJcbiAgICBjb25zdCBpdGVtID0gdGhpcy5zZWxlY3RlZE9iamVjdD8ubmFtZVxyXG4gICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICBjb25zdCB1aWQgPSBpdGVtLnNwbGl0KCc7JylbMF07XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGl0ZW0uc3BsaXQoJzsnKVsyXTtcclxuICAgICAgICBsZXQgc3RhdHVzID0gaXRlbS5zcGxpdCgnOycpWzNdO1xyXG4gICAgICAgIHN0YXR1cyA9IHRoaXMuZ2V0U3RhdHVzRGVzY3JpcHRpb24ob3JkZXJJRCk7XHJcbiAgICAgICAgaWYgKCFvcmRlcklEIHx8IG9yZGVySUQgPT0gdW5kZWZpbmVkIHx8IG9yZGVySUQgPT0gJ251bGwnIHx8IG9yZGVySUQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgb3JkZXJJRCA9ICcnXHJcbiAgICAgICAgICBzdGF0dXMgID0gJ2luYWN0aXZlJ1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFwcC5vcmRlcklEID0gb3JkZXJJRDtcclxuICAgICAgICBjb25zdCBuZXdJdGVtID0gYCR7dWlkfTske29yZGVySUR9OyR7bmFtZX07JHtzdGF0dXN9YDtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0Lm5hbWUgPSBuZXdJdGVtO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRTdGF0dXNEZXNjcmlwdGlvbihvcmRlcklEKSB7XHJcbiAgICBsZXQgc3RhdHVzXHJcbiAgICBpZiAob3JkZXJJRCkge1xyXG4gICAgICBpZiAoc3RhdHVzKSB7XHJcbiAgICAgICAgc3RhdHVzID0gJ2FjdGl2ZSdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFvcmRlcklEIHx8IG9yZGVySUQgPT0gJycpIHtcclxuICAgICAgaWYgKCFzdGF0dXMpIHtcclxuICAgICAgICBzdGF0dXMgPSAnaW5hY3RpdmUnXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBzdGF0dXNcclxuICB9XHJcblxyXG4gIHNldFRhYmxlTmFtZShuYW1lOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkT2JqZWN0KSB7XHJcblxyXG4gICAgICBsZXQgb3JkZXI7XHJcbiAgICAgIGxldCBzdGF0dXM7XHJcbiAgICAgIGxldCB1dWlkO1xyXG4gICAgICBjb25zdCBpdGVtICA9IHRoaXMuc2VsZWN0ZWRPYmplY3Q/Lm5hbWU7XHJcbiAgICAgIGlmIChpdGVtICYmIChpdGVtLnNwbGl0KCc7JykubGVuZ3RoPjAgfHwgaXRlbS5zcGxpdCgnOycpLmxlbmd0aCA9PSAwKSApe1xyXG4gICAgICAgIHV1aWQgICA9IGl0ZW0uc3BsaXQoJzsnKVswXTtcclxuICAgICAgfVxyXG4gICAgICAvLyBpZiAoaXRlbSAmJiAoaXRlbS5zcGxpdCgnOycpLmxlbmd0aD4xIHx8IGl0ZW0uc3BsaXQoJzsnKS5sZW5ndGggPT0gMSkgKXtcclxuICAgICAgLy8gICAgdWlkICAgPSBpdGVtLnNwbGl0KCc7JylbMV07XHJcbiAgICAgIC8vIH1cclxuICAgICAgLy8gaWYgKGl0ZW0gJiYgKGl0ZW0uc3BsaXQoJzsnKS5sZW5ndGg+MiB8fCBpdGVtLnNwbGl0KCc7JykubGVuZ3RoID09IDIpICl7XHJcbiAgICAgIC8vICAgIG5hbWUgICA9IGl0ZW0uc3BsaXQoJzsnKVsyXTtcclxuICAgICAgLy8gfVxyXG4gICAgICAvLyBpZiAoaXRlbSAmJiAoaXRlbS5zcGxpdCgnOycpLmxlbmd0aD4zIHx8IGl0ZW0uc3BsaXQoJzsnKS5sZW5ndGggPT0gMykgKXtcclxuICAgICAgLy8gICAgc3RhdHVzICAgPSBpdGVtLnNwbGl0KCc7JylbM107XHJcbiAgICAgIC8vIH1cclxuXHJcbiAgICAgIHN0YXR1cyA9ICdpbmFjdGl2ZSdcclxuICAgICAgY29uc3QgbmV3SXRlbSA9IGAke3V1aWR9OyR7b3JkZXJ9OyR7bmFtZX07JHtzdGF0dXN9YDtcclxuICAgICAgY29uc29sZS5sb2coJ25ld0l0ZW0nLCBuZXdJdGVtKVxyXG4gICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0Lm5hbWUgPSBuZXdJdGVtO1xyXG4gICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgICB0aGlzLmFwcC50YWJsZU5hbWUgPSAnJ1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0VGFibGVTdGF0dXMoc3RhdHVzOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkT2JqZWN0KSB7XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnNlbGVjdGVkT2JqZWN0Py5uYW1lO1xyXG4gICAgICBjb25zdCB1aWQgPSBpdGVtLnNwbGl0KCc7JylbMF07XHJcbiAgICAgIGNvbnN0IG9yZGVyID0gaXRlbS5zcGxpdCgnOycpWzFdO1xyXG4gICAgICBjb25zdCBuYW1lID0gaXRlbS5zcGxpdCgnOycpWzJdO1xyXG4gICAgICBjb25zdCBuZXdJdGVtID0gYCR7dWlkfTske29yZGVyfTske25hbWV9OyR7c3RhdHVzfWA7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3QubmFtZSA9IG5ld0l0ZW07XHJcbiAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICAgIHRoaXMuYXBwLnRhYmxlU3RhdHVzID0gJydcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICogaW5pdCB0aGUgY2FudmFzIHZpZXcgJiBiaW5kIGV2ZW50c1xyXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKi9cclxuICBzZXRDYW52YXNWaWV3KCkge1xyXG4gICAgY29uc3QgY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXMoJ21haW4nKTtcclxuICAgIGNhbnZhcy5zZXRXaWR0aChSTF9WSUVXX1dJRFRIICogUkxfRk9PVCk7XHJcbiAgICBjYW52YXMuc2V0SGVpZ2h0KFJMX1ZJRVdfSEVJR0hUICogUkxfRk9PVCk7XHJcbiAgICB0aGlzLnZpZXcgPSBjYW52YXM7XHJcblxyXG4gICAgY29uc3QgY29ybmVyc09mV2FsbCA9IChvYmo6IGZhYnJpYy5MaW5lKSA9PiB7XHJcbiAgICAgIGNvbnN0IGlkID0gTnVtYmVyKG9iai5uYW1lLnNwbGl0KCc6JylbMV0pO1xyXG4gICAgICBjb25zdCB2MUlkID0gaWQ7XHJcbiAgICAgIGNvbnN0IHYxID0gdGhpcy5jb3JuZXJzW3YxSWRdO1xyXG4gICAgICBjb25zdCB2MklkID0gKGlkICsgMSkgJSB0aGlzLndhbGxzLmxlbmd0aDtcclxuICAgICAgY29uc3QgdjIgPSB0aGlzLmNvcm5lcnNbdjJJZF07XHJcbiAgICAgIHJldHVybiB7IHYxLCB2MUlkLCB2MiwgdjJJZCB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ3NlbGVjdGlvbjpjcmVhdGVkJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMub25TZWxlY3RlZCgpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnc2VsZWN0aW9uOmNyZWF0ZWQnLCB0aGlzLmFwcC5yb29tRWRpdClcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignc2VsZWN0aW9uOnVwZGF0ZWQnLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5vblNlbGVjdGVkKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzZWxlY3Rpb246dXBkYXRlZCcsIHRoaXMuYXBwLnJvb21FZGl0KVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignc2VsZWN0aW9uOmNsZWFyZWQnLCAoZTogZmFicmljLklFdmVudCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5hcHAuc2VsZWN0aW9ucyA9IFtdO1xyXG4gICAgICB0aGlzLmFwcC51bmdyb3VwYWJsZSA9IGZhbHNlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy52aWV3Lm9uKCdvYmplY3Q6bW92ZWQnLCAoKSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdvYmplY3Q6bW92ZWQnLCB0aGlzLmFwcC5yb29tRWRpdClcclxuICAgICAgaWYgKHRoaXMuTU9WRV9XQUxMX0lEICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuTU9WRV9XQUxMX0lEID0gLTE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignb2JqZWN0OnJvdGF0ZWQnLCAoKSA9PiB0aGlzLnNhdmVTdGF0ZSgpKTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ21vdXNlOmRvd246YmVmb3JlJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgdGhpcy5hcHAuc2VsZWN0aW9ucyA9IFtdO1xyXG4gICAgICBjb25zdCBvYmogPSBlLnRhcmdldDtcclxuICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdCA9IG9iajtcclxuICAgICAgdGhpcy5hcHAuc2VsZWN0aW9ucy5wdXNoKG9iaik7XHJcbiAgICAgIHRoaXMuYXBwLnNlbGVjdGVkZWRPYmplY3QubmV4dChvYmopO1xyXG5cclxuICAgICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0ICYmIG9iaiAmJiBvYmo/Lm5hbWUuaW5kZXhPZignV0FMTCcpID4gLTEgJiYgb2JqIGluc3RhbmNlb2YgTGluZSkge1xyXG4gICAgICAgIGxldCB7IHYxLCB2MiwgdjFJZCwgdjJJZCB9ID0gY29ybmVyc09mV2FsbChvYmopO1xyXG4gICAgICAgIGNvbnN0IHYwSWQgPSAodjFJZCA9PT0gMCkgPyB0aGlzLmNvcm5lcnMubGVuZ3RoIC0gMSA6IHYxSWQgLSAxO1xyXG4gICAgICAgIGNvbnN0IHYzSWQgPSAodjJJZCA9PT0gdGhpcy5jb3JuZXJzLmxlbmd0aCAtIDEpID8gMCA6IHYySWQgKyAxO1xyXG4gICAgICAgIGNvbnN0IHYwID0gdGhpcy5jb3JuZXJzW3YwSWRdO1xyXG4gICAgICAgIGNvbnN0IHYzID0gdGhpcy5jb3JuZXJzW3YzSWRdO1xyXG5cclxuICAgICAgICB0aGlzLk1PVkVfV0FMTF9JRCA9IHYxSWQ7XHJcblxyXG4gICAgICAgIGlmICgodjAudG9wID09PSB2MS50b3AgJiYgdjEudG9wID09PSB2Mi50b3ApIHx8ICh2MC5sZWZ0ID09PSB2MS5sZWZ0ICYmIHYxLmxlZnQgPT09IHYyLmxlZnQpKSB7XHJcbiAgICAgICAgICB0aGlzLmNvcm5lcnMuc3BsaWNlKHYxSWQsIDAsIHRoaXMuZHJhd0Nvcm5lcihuZXcgUG9pbnQodjEubGVmdCwgdjEudG9wKSkpO1xyXG4gICAgICAgICAgdGhpcy5NT1ZFX1dBTExfSUQgPSB2MUlkICsgMTtcclxuICAgICAgICAgIHYySWQgKz0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgodjEudG9wID09PSB2Mi50b3AgJiYgdjIudG9wID09PSB2My50b3ApIHx8ICh2MS5sZWZ0ID09PSB2Mi5sZWZ0ICYmIHYyLmxlZnQgPT09IHYzLmxlZnQpKSB7XHJcbiAgICAgICAgICB0aGlzLmNvcm5lcnMuc3BsaWNlKHYySWQgKyAxLCAwLCB0aGlzLmRyYXdDb3JuZXIobmV3IFBvaW50KHYyLmxlZnQsIHYyLnRvcCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMudmlldy5vbignb2JqZWN0Om1vdmluZycsIChlOiBmYWJyaWMuSUV2ZW50KSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdvYmplY3Q6bW92aW5nJywgdGhpcy5hcHAucm9vbUVkaXQpXHJcbiAgICAgIGlmICh0aGlzLk1PVkVfV0FMTF9JRCAhPT0gLTEpIHtcclxuICAgICAgICBjb25zdCBwID0gZVsncG9pbnRlciddO1xyXG4gICAgICAgIGNvbnN0IHYxID0gdGhpcy5jb3JuZXJzW3RoaXMuTU9WRV9XQUxMX0lEXTtcclxuICAgICAgICBjb25zdCB2MiA9IHRoaXMuY29ybmVyc1sodGhpcy5NT1ZFX1dBTExfSUQgKyAxKSAlIHRoaXMuY29ybmVycy5sZW5ndGhdO1xyXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHYxLmxlZnQgPT09IHYyLmxlZnQgPyAnSE9SSVpPTlRBTCcgOiAnVkVSVElDQUwnO1xyXG5cclxuICAgICAgICBpZiAocC55IDwgUkxfUk9PTV9PVVRFUl9TUEFDSU5HKSB7IHAueSA9IFJMX1JPT01fT1VURVJfU1BBQ0lORzsgfVxyXG4gICAgICAgIGlmIChwLnggPCBSTF9ST09NX09VVEVSX1NQQUNJTkcpIHsgcC54ID0gUkxfUk9PTV9PVVRFUl9TUEFDSU5HOyB9XHJcblxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdWRVJUSUNBTCcpIHtcclxuICAgICAgICAgIHYxLnRvcCA9IHYyLnRvcCA9IHAueTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdjEubGVmdCA9IHYyLmxlZnQgPSBwLng7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG9iaiA9IGUudGFyZ2V0O1xyXG4gICAgICBjb25zdCBwb2ludCA9IGVbJ3BvaW50ZXInXTtcclxuXHJcbiAgICAgIGlmIChvYmogJiYgdGhpcy5pc0RXKG9iaikgJiYgb2JqIGluc3RhbmNlb2YgZmFicmljLkdyb3VwKSB7XHJcbiAgICAgICAgbGV0IHdhbGwsIGRpc3RhbmNlID0gOTk5O1xyXG4gICAgICAgIGNvbnN0IGRpc3QyID0gKHYsIHcpID0+ICh2LnggLSB3LngpICogKHYueCAtIHcueCkgKyAodi55IC0gdy55KSAqICh2LnkgLSB3LnkpO1xyXG4gICAgICAgIGNvbnN0IHBvaW50X3RvX2xpbmUgPSAocCwgdiwgdykgPT4gTWF0aC5zcXJ0KGRpc3RUb1NlZ21lbnRTcXVhcmVkKHAsIHYsIHcpKTtcclxuICAgICAgICBjb25zdCBkaXN0VG9TZWdtZW50U3F1YXJlZCA9IChwLCB2LCB3KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBsMiA9IGRpc3QyKHYsIHcpO1xyXG5cclxuICAgICAgICAgIGlmIChsMiA9PSAwKVxyXG4gICAgICAgICAgICByZXR1cm4gZGlzdDIocCwgdik7XHJcblxyXG4gICAgICAgICAgY29uc3QgdCA9ICgocC54IC0gdi54KSAqICh3LnggLSB2LngpICsgKHAueSAtIHYueSkgKiAody55IC0gdi55KSkgLyBsMjtcclxuXHJcbiAgICAgICAgICBpZiAodCA8IDApXHJcbiAgICAgICAgICAgIHJldHVybiBkaXN0MihwLCB2KTtcclxuXHJcbiAgICAgICAgICBpZiAodCA+IDEpXHJcbiAgICAgICAgICAgIHJldHVybiBkaXN0MihwLCB3KTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gZGlzdDIocCwgeyB4OiB2LnggKyB0ICogKHcueCAtIHYueCksIHk6IHYueSArIHQgKiAody55IC0gdi55KSB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLndhbGxzLmZvckVhY2godyA9PiB7XHJcbiAgICAgICAgICBjb25zdCBkID0gcG9pbnRfdG9fbGluZShwb2ludCwgeyB4OiB3LngxLCB5OiB3LnkxIH0sIHsgeDogdy54MiwgeTogdy55MiB9KTtcclxuICAgICAgICAgIGlmIChkIDwgZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgZGlzdGFuY2UgPSBkLCB3YWxsID0gdztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGRpc3RhbmNlID4gMjApIHtcclxuICAgICAgICAgIHRoaXMuUkVNT1ZFX0RXID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5SRU1PVkVfRFcgPSBmYWxzZTtcclxuICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uT2ZXYWxsKHdhbGwpO1xyXG5cclxuICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IEhPUklaT05UQUwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2NhdGVEVyhvYmosIHdhbGwsIHBvaW50LngsIFRvcCh3YWxsKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvY2F0ZURXKG9iaiwgd2FsbCwgTGVmdCh3YWxsKSwgcG9pbnQueSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ21vdXNlOnVwJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgY29uc3Qgb2JqID0gZS50YXJnZXQ7XHJcbiAgICAgIGlmICh0aGlzLlJFTU9WRV9EVykge1xyXG4gICAgICAgIHRoaXMudmlldy5yZW1vdmUob2JqKTtcclxuICAgICAgICB0aGlzLlJFTU9WRV9EVyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcub24oJ21vdXNlOmRibGNsaWNrJywgKGU6IGZhYnJpYy5JRXZlbnQpID0+IHtcclxuICAgICAgY29uc3Qgb2JqID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQgJiYgdGhpcy5hcHAucm9vbUVkaXRPcGVyYXRlID09PSAnQ09STkVSJyAmJiBvYmogJiYgb2JqLm5hbWUuaW5kZXhPZignV0FMTCcpID4gLTEgJiYgb2JqIGluc3RhbmNlb2YgTGluZSkge1xyXG4gICAgICAgIGNvbnN0IHAgPSBlWydwb2ludGVyJ107XHJcbiAgICAgICAgY29uc3QgeyB2MSwgdjFJZCwgdjIsIHYySWQgfSA9IGNvcm5lcnNPZldhbGwob2JqKTtcclxuICAgICAgICBjb25zdCBpbmQgPSB2MUlkIDwgdjJJZCA/IHYxSWQgOiB2MklkO1xyXG5cclxuICAgICAgICBpZiAodjEubGVmdCA9PT0gdjIubGVmdCkge1xyXG4gICAgICAgICAgcC54ID0gdjEubGVmdDtcclxuICAgICAgICB9IGVsc2UgaWYgKHYxLnRvcCA9PT0gdjIudG9wKSB7XHJcbiAgICAgICAgICBwLnkgPSB2MS50b3A7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdDb3JuZXIgPSB0aGlzLmRyYXdDb3JuZXIobmV3IFBvaW50KHAueCwgcC55KSk7XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyh2MUlkIC0gdjJJZCkgIT0gMSkge1xyXG4gICAgICAgICAgdGhpcy5jb3JuZXJzLnB1c2gobmV3Q29ybmVyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb3JuZXJzLnNwbGljZShpbmQgKyAxLCAwLCBuZXdDb3JuZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3Um9vbSgpO1xyXG4gICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKiBkcmF3IFJvb21zIGRlZmluZWQgaW4gTW9kZWxcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcbiAgc2V0Um9vbSh7IHdpZHRoLCBoZWlnaHQgfSkge1xyXG4gICAgaWYgKHRoaXMud2FsbHMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMudmlldy5yZW1vdmUoLi4udGhpcy53YWxscyk7XHJcbiAgICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBMVCA9IG5ldyBQb2ludChSTF9ST09NX09VVEVSX1NQQUNJTkcsIFJMX1JPT01fT1VURVJfU1BBQ0lORyk7XHJcbiAgICBjb25zdCBSVCA9IG5ldyBQb2ludChMVC54ICsgd2lkdGgsIExULnkpO1xyXG4gICAgY29uc3QgTEIgPSBuZXcgUG9pbnQoTFQueCwgTFQueSArIGhlaWdodCk7XHJcbiAgICBjb25zdCBSQiA9IG5ldyBQb2ludChSVC54LCBMQi55KTtcclxuXHJcbiAgICB0aGlzLmNvcm5lcnMgPSBbTFQsIFJULCBSQiwgTEJdLm1hcChwID0+IHRoaXMuZHJhd0Nvcm5lcihwKSk7XHJcbiAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAqIHNldCBjb3JuZXIgYWNjb3JkaW5nIHRvIGN1cnJlbnQgZWRpdGlvbiBzdGF0dXNcclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcbiAgc2V0Q29ybmVyU3R5bGUoYzogZmFicmljLlJlY3QpIHtcclxuICAgIGMubW92ZUN1cnNvciA9IHRoaXMudmlldy5mcmVlRHJhd2luZ0N1cnNvcjtcclxuICAgIGMuaG92ZXJDdXJzb3IgPSB0aGlzLnZpZXcuZnJlZURyYXdpbmdDdXJzb3I7XHJcbiAgICBjLnNlbGVjdGFibGUgPSBmYWxzZTtcclxuICAgIGMuZXZlbnRlZCA9IGZhbHNlO1xyXG4gICAgYy53aWR0aCA9IGMuaGVpZ2h0ID0gKFJMX1JPT01fSU5ORVJfU1BBQ0lORyAvICh0aGlzLmFwcC5yb29tRWRpdCA/IDEuNSA6IDIpKSAqIDI7XHJcbiAgICBjLnNldCgnZmlsbCcsIHRoaXMuYXBwLnJvb21FZGl0ID8gUkxfQ09STkVSX0ZJTEwgOiBSTF9ST09NX1NUUk9LRSk7XHJcbiAgfVxyXG5cclxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAqIGRyYXcgY29ybmVyXHJcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqL1xyXG4gIGRyYXdDb3JuZXIocDogZmFicmljLlBvaW50KSB7XHJcblxyXG4gICAgY29uc3QgYyA9IG5ldyBmYWJyaWMuUmVjdCh7XHJcbiAgICAgIGxlZnQ6IHAueCxcclxuICAgICAgdG9wOiBwLnksXHJcbiAgICAgIHN0cm9rZVdpZHRoOiAwLFxyXG4gICAgICBoYXNDb250cm9sczogZmFsc2UsXHJcbiAgICAgIG9yaWdpblg6ICdjZW50ZXInLFxyXG4gICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcclxuICAgICAgbmFtZTogJ0NPUk5FUidcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zZXRDb3JuZXJTdHlsZShjKTtcclxuICAgIHJldHVybiBjO1xyXG4gIH1cclxuXHJcbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgKiBkcmF3IHJvb21cclxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICovXHJcbiAgZHJhd1Jvb20oKSB7XHJcbiAgICBsZXQgZXhpc3RzIDogYW55O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICBleGlzdHMgPSB0aGlzLnZpZXcuZ2V0T2JqZWN0cygpLmZpbHRlcihvYmogPT4gb2JqLm5hbWUuaW5kZXhPZignV0FMTCcpID4gLTEgfHwgb2JqLm5hbWUgPT09ICdDT1JORVInKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMudmlldy5yZW1vdmUoLi4uZXhpc3RzKTtcclxuXHJcbiAgICAgIHRoaXMudmlldy5hZGQoLi4udGhpcy5jb3JuZXJzKTtcclxuXHJcbiAgICAgIGNvbnN0IHdhbGwgPSAoY29vcmRzOiBudW1iZXJbXSwgaW5kZXg6IG51bWJlcikgPT4gbmV3IExpbmUoY29vcmRzLCB7XHJcbiAgICAgICAgc3Ryb2tlOiBSTF9ST09NX1NUUk9LRSxcclxuICAgICAgICBzdHJva2VXaWR0aDogUkxfUk9PTV9JTk5FUl9TUEFDSU5HLFxyXG4gICAgICAgIG5hbWU6IGBXQUxMOiR7aW5kZXh9YCxcclxuICAgICAgICBvcmlnaW5YOiAnY2VudGVyJyxcclxuICAgICAgICBvcmlnaW5ZOiAnY2VudGVyJyxcclxuICAgICAgICBob3ZlckN1cnNvcjogdGhpcy5hcHAucm9vbUVkaXQgPyB0aGlzLnZpZXcubW92ZUN1cnNvciA6IHRoaXMudmlldy5kZWZhdWx0Q3Vyc29yLFxyXG4gICAgICAgIGhhc0NvbnRyb2xzOiBmYWxzZSxcclxuICAgICAgICBoYXNCb3JkZXJzOiBmYWxzZSxcclxuICAgICAgICBzZWxlY3RhYmxlOiB0aGlzLmFwcC5yb29tRWRpdCxcclxuICAgICAgICBldmVudGVkOiB0aGlzLmFwcC5yb29tRWRpdCxcclxuICAgICAgICBjb3JuZXJTdHlsZTogJ3JlY3QnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgbGV0IExUID0gbmV3IFBvaW50KDk5OTksIDk5OTkpLCBSQiA9IG5ldyBQb2ludCgwLCAwKTtcclxuXHJcbiAgICAgIHRoaXMud2FsbHMgPSB0aGlzLmNvcm5lcnMubWFwKChjb3JuZXIsIGkpID0+IHtcclxuICAgICAgICBjb25zdCBzdGFydCA9IGNvcm5lcjtcclxuICAgICAgICBjb25zdCBlbmQgPSAoaSA9PT0gdGhpcy5jb3JuZXJzLmxlbmd0aCAtIDEpID8gdGhpcy5jb3JuZXJzWzBdIDogdGhpcy5jb3JuZXJzW2kgKyAxXTtcclxuXHJcbiAgICAgICAgaWYgKGNvcm5lci50b3AgPCBMVC54ICYmIGNvcm5lci5sZWZ0IDwgTFQueSlcclxuICAgICAgICAgIExUID0gbmV3IFBvaW50KGNvcm5lci5sZWZ0LCBjb3JuZXIudG9wKTtcclxuXHJcbiAgICAgICAgaWYgKGNvcm5lci50b3AgPiBSQi55ICYmIGNvcm5lci5sZWZ0ID4gUkIueSlcclxuICAgICAgICAgIFJCID0gbmV3IFBvaW50KGNvcm5lci5sZWZ0LCBjb3JuZXIudG9wKTtcclxuXHJcbiAgICAgICAgY29uc3QgdyA9IHdhbGwoW3N0YXJ0LmxlZnQsIHN0YXJ0LnRvcCwgZW5kLmxlZnQsIGVuZC50b3BdLCBpKTtcclxuICAgICAgICByZXR1cm4gdztcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnZpZXcuYWRkKC4uLnRoaXMud2FsbHMpO1xyXG4gICAgICB0aGlzLndhbGxzLmZvckVhY2godyA9PiB3LnNlbmRUb0JhY2soKSk7XHJcbiAgICAgIHRoaXMuUk9PTV9TSVpFID0geyB3aWR0aDogUkIueCAtIExULngsIGhlaWdodDogUkIueSAtIExULnkgfTtcclxuXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvY2F0ZURXKGR3OiBmYWJyaWMuR3JvdXAsIHdhbGw6IGZhYnJpYy5MaW5lLCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZFdhbGwgPSB0aGlzLmRpcmVjdGlvbk9mV2FsbCh3YWxsKTtcclxuICAgIGNvbnN0IGREVyA9IGR3LmFuZ2xlICUgMTgwID09PSAwID8gSE9SSVpPTlRBTCA6IFZFUlRJQ0FMO1xyXG5cclxuICAgIGlmIChkV2FsbCAhPSBkRFcpIHtcclxuICAgICAgZHcuYW5nbGUgPSAoZHcuYW5nbGUgKyA5MCkgJSAzNjA7XHJcbiAgICB9XHJcblxyXG4gICAgZHcudG9wID0geSwgZHcubGVmdCA9IHg7XHJcbiAgICBjb25zdCBjZW50ZXIgPSBkdy5nZXRDZW50ZXJQb2ludCgpO1xyXG5cclxuICAgIGlmIChkV2FsbCA9PT0gSE9SSVpPTlRBTClcclxuICAgICAgY2VudGVyLnkgPCBkdy50b3AgPyBkdy50b3AgKz0gT0ZGU0VUIDogZHcudG9wIC09IE9GRlNFVDtcclxuICAgIGVsc2VcclxuICAgICAgY2VudGVyLnggPCBkdy5sZWZ0ID8gZHcubGVmdCArPSBPRkZTRVQgOiBkdy5sZWZ0IC09IE9GRlNFVDtcclxuXHJcbiAgICByZXR1cm4gZHc7XHJcbiAgfVxyXG5cclxuICBzZXREV09yaWdpbihkdzogZmFicmljLkdyb3VwKSB7XHJcbiAgICBpZiAoIWR3LmZsaXBYICYmICFkdy5mbGlwWSlcclxuICAgICAgZHcub3JpZ2luWCA9ICdsZWZ0JywgZHcub3JpZ2luWSA9ICd0b3AnO1xyXG4gICAgZWxzZSBpZiAoZHcuZmxpcFggJiYgIWR3LmZsaXBZKVxyXG4gICAgICBkdy5vcmlnaW5YID0gJ3JpZ2h0JywgZHcub3JpZ2luWSA9ICd0b3AnO1xyXG4gICAgZWxzZSBpZiAoIWR3LmZsaXBYICYmIGR3LmZsaXBZKVxyXG4gICAgICBkdy5vcmlnaW5YID0gJ2xlZnQnLCBkdy5vcmlnaW5ZID0gJ2JvdHRvbSc7XHJcbiAgICBlbHNlIGlmIChkdy5mbGlwWCAmJiBkdy5mbGlwWSlcclxuICAgICAgZHcub3JpZ2luWCA9ICdyaWdodCcsIGR3Lm9yaWdpblkgPSAnYm90dG9tJztcclxuICAgIHJldHVybiBkdztcclxuICB9XHJcblxyXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gIGVkaXRSb29tKCkge1xyXG4gICAgaWYgKCF0aGlzLnZpZXcpIHtcclxuICAgICAgY29uc29sZS5sb2coJ25vIHZpZXcnKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3LmdldE9iamVjdHMoKSkge1xyXG4gICAgICAgIGxldCBpdGVtcyA9IHRoaXMudmlldy5nZXRPYmplY3RzKClcclxuICAgICAgICBpdGVtcy5mb3JFYWNoKHIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKHIgPT09IG51bGwgfHwgciA9PT0gdm9pZCAwID8gdm9pZCAwIDogcj8ubmFtZT8uaW5kZXhPZignV0FMTCcpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHIuc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgci5ldmVudGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hcHAudXNlck1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByLnNlbGVjdGFibGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICByLmV2ZW50ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFwcC51c2VyTW9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHIuc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgci5ldmVudGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgIH1cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdFN0YXRlcy5sZW5ndGggPT09IDApXHJcbiAgICB0aGlzLnNhdmVTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgY2FuY2VsUm9vbUVkaXRpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMudmlldykge1xyXG4gICAgICBjb25zb2xlLmxvZygnbm8gdmlldycpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5nZXRPYmplY3RzKCkuZm9yRWFjaChyID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoci5uYW1lLmluZGV4T2YoJ1dBTEwnKSAhPT0gLTEgfHwgci5uYW1lLmluZGV4T2YoJ0NPUk5FUicpICE9PSAtMSkge1xyXG4gICAgICAgICAgci5zZWxlY3RhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICByLmV2ZW50ZWQgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgci5zZWxlY3RhYmxlID0gdHJ1ZTtcclxuICAgICAgICAgIHIuZXZlbnRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRJdGVtU3RhdHVzKHR5cGU6IHN0cmluZywgb2JqZWN0OiBhbnkpIHtcclxuXHJcbiAgICBpZiAob2JqZWN0ICYmIHR5cGUpICB7XHJcbiAgICAgIGlmICh0eXBlID09PSAndGFibGUnKSB7XHJcbiAgICAgICAgaWYgKG9iamVjdC5uYW1lICE9ICcnKSB7XHJcbiAgICAgICAgICBjb25zdCBpdGVtcyA9IG9iamVjdC5zcGxpdCgnOycpXHJcblxyXG4gICAgICAgICAgLy90eXBlXHJcbiAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID49IDAgJiYgaXRlbXNbMF0pIHtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvL2lkXHJcbiAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID49IDEgJiYgaXRlbXNbMV0pIHtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvL29yZGVyXHJcbiAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID49IDIgJiYgaXRlbXNbMl0pIHtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvL3N0YXR1c1xcXHJcbiAgICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID49IDIgJiYgaXRlbXNbM10pIHtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA9PSAzICYmIGl0ZW1zWzNdKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGl0ZW1zWzNdXHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gJycpIHtcclxuICAgICAgICAgICAgICBvYmplY3QuZmlsbCA9ICdwdXJwbGUnXHJcbiAgICAgICAgICAgICAgb2JqZWN0LnN0cm9rZSA9ICd3aGl0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09ICcxJykge1xyXG4gICAgICAgICAgICAgIG9iamVjdC5maWxsID0gJ2dyZWVuJ1xyXG4gICAgICAgICAgICAgIG9iamVjdC5zdHJva2UgPSAnd2hpdGUnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAnMicpIHtcclxuICAgICAgICAgICAgICBvYmplY3QuZmlsbCA9ICd5ZWxsb3cnXHJcbiAgICAgICAgICAgICAgb2JqZWN0LnN0cm9rZSA9ICd3aGl0ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09ICczJykge1xyXG4gICAgICAgICAgICAgIG9iamVjdC5maWxsID0gJ3JlZCdcclxuICAgICAgICAgICAgICBvYmplY3Quc3Ryb2tlID0gJ3doaXRlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBvYmplY3RcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZU9iamVjdEluc2VydGlvbih7IHR5cGUsIG9iamVjdCB9KSB7XHJcblxyXG4gICAgaWYgKHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgaWYgKHR5cGUgPT09ICdST09NJykge1xyXG4gICAgICAgIHRoaXMuc2V0Um9vbShvYmplY3QpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlID09PSAnUk9PTScgfHwgdHlwZSA9PT0gJ0RPT1InIHx8IHR5cGUgPT09ICdXSU5ET1cnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBvYmplY3QgPSAgdGhpcy5zZXRJdGVtU3RhdHVzKHR5cGUsIG9iamVjdCk7XHJcbiAgICBsZXQgZ3JvdXBcclxuICAgIGlmICh0eXBlID09PSAndGFibGUnKSB7XHJcbiAgICAgIGNvbnN0IGNoYWlyID0ge30gYXMgYW55XHJcbiAgICAgIGdyb3VwID0gXy5jcmVhdGVUYWJsZSh0eXBlLCBvYmplY3QsIGNoYWlyKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlICE9ICd0YWJsZScpIHtcclxuICAgICAgZ3JvdXAgPSBfLmNyZWF0ZUZ1cm5pdHVyZSh0eXBlLCBvYmplY3QsIHRoaXMuREVGQVVMVF9DSEFJUik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coZ3JvdXApO1xyXG5cclxuICAgIGlmICh0eXBlID09PSAnRE9PUicgfHwgdHlwZSA9PT0gJ1dJTkRPVycpIHtcclxuICAgICAgZ3JvdXAub3JpZ2luWCA9ICdjZW50ZXInO1xyXG4gICAgICBncm91cC5vcmlnaW5ZID0gJ3RvcCc7XHJcblxyXG4gICAgICBjb25zdCBkd3MgPSB0aGlzLmZpbHRlck9iamVjdHMoWydET09SJywgJ1dJTkRPVyddKTtcclxuICAgICAgY29uc3QgZHcgPSBkd3MubGVuZ3RoID8gZHdzW2R3cy5sZW5ndGggLSAxXSA6IG51bGw7XHJcblxyXG4gICAgICBsZXQgd2FsbCwgeCwgeTtcclxuICAgICAgaWYgKCFkdykge1xyXG4gICAgICAgIHdhbGwgPSB0aGlzLndhbGxzWzBdO1xyXG4gICAgICAgIHggPSBMZWZ0KHdhbGwpICsgUkxfQUlTTEVHQVA7XHJcbiAgICAgICAgeSA9IFRvcCh3YWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBvZCA9IGR3LmFuZ2xlICUgMTgwID09PSAwID8gSE9SSVpPTlRBTCA6IFZFUlRJQ0FMO1xyXG5cclxuICAgICAgICBsZXQgcGxhY2VPbk5leHRXYWxsID0gZmFsc2U7XHJcbiAgICAgICAgd2FsbCA9IHRoaXMud2FsbE9mRFcoZHcpO1xyXG5cclxuICAgICAgICBpZiAob2QgPT09IEhPUklaT05UQUwpIHtcclxuICAgICAgICAgIHggPSBkdy5sZWZ0ICsgZHcud2lkdGggKyBSTF9BSVNMRUdBUDtcclxuICAgICAgICAgIHkgPSBUb3Aod2FsbCk7XHJcbiAgICAgICAgICBpZiAoeCArIGdyb3VwLndpZHRoID4gUmlnaHQod2FsbCkpIHtcclxuICAgICAgICAgICAgcGxhY2VPbk5leHRXYWxsID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgeSA9IGR3LnRvcCArIGR3LndpZHRoICsgUkxfQUlTTEVHQVA7XHJcbiAgICAgICAgICB4ID0gTGVmdCh3YWxsKTtcclxuICAgICAgICAgIGlmICh5ICsgZ3JvdXAud2lkdGggPiBCb3R0b20od2FsbCkpIHtcclxuICAgICAgICAgICAgcGxhY2VPbk5leHRXYWxsID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbGFjZU9uTmV4dFdhbGwpIHtcclxuICAgICAgICAgIHdhbGwgPSB0aGlzLndhbGxzWyhOdW1iZXIod2FsbC5uYW1lLnNwbGl0KCc6JylbMV0pICsgMSkgJSB0aGlzLndhbGxzLmxlbmd0aF07XHJcbiAgICAgICAgICBjb25zdCBuZCA9IHRoaXMuZGlyZWN0aW9uT2ZXYWxsKHdhbGwpO1xyXG5cclxuICAgICAgICAgIGlmIChuZCA9PT0gSE9SSVpPTlRBTCkge1xyXG4gICAgICAgICAgICB4ID0gTGVmdCh3YWxsKSArIFJMX0FJU0xFR0FQLCB5ID0gVG9wKHdhbGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeCA9IExlZnQod2FsbCksIHkgPSBUb3Aod2FsbCkgKyBSTF9BSVNMRUdBUDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMubG9jYXRlRFcoZ3JvdXAsIHdhbGwsIHgsIHkpO1xyXG4gICAgICBncm91cC5oYXNCb3JkZXJzID0gZmFsc2U7XHJcbiAgICAgIHRoaXMudmlldy5hZGQoZ3JvdXApO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmV0cmlldmUgc3BhY2luZyBmcm9tIG9iamVjdCwgdXNlIHJsQWlzbGVHYXAgaWYgbm90IHNwZWNpZmllZFxyXG4gICAgY29uc3QgbmV3TFIgPSBvYmplY3QubHJTcGFjaW5nIHx8IFJMX0FJU0xFR0FQO1xyXG4gICAgY29uc3QgbmV3VEIgPSBvYmplY3QudGJTcGFjaW5nIHx8IFJMX0FJU0xFR0FQO1xyXG5cclxuICAgIC8vIG9iamVjdCBncm91cHMgdXNlIGNlbnRlciBhcyBvcmlnaW4sIHNvIGFkZCBoYWxmIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlaXIgcmVwb3J0ZWRcclxuICAgIC8vIHdpZHRoIGFuZCBzaXplOyBub3RlIHRoYXQgdGhpcyB3aWxsIG5vdCBhY2NvdW50IGZvciBjaGFpcnMgYXJvdW5kIHRhYmxlcywgd2hpY2ggaXNcclxuICAgIC8vIGludGVudGlvbmFsOyB0aGV5IGdvIGluIHRoZSBzcGVjaWZpZWQgZ2Fwc1xyXG4gICAgZ3JvdXAubGVmdCA9IG5ld0xSICsgKGdyb3VwLndpZHRoIC8gMikgKyB0aGlzLnJvb21fb3JpZ2luO1xyXG4gICAgZ3JvdXAudG9wID0gbmV3VEIgKyAoZ3JvdXAuaGVpZ2h0IC8gMikgKyB0aGlzLnJvb21fb3JpZ2luO1xyXG5cclxuICAgIGlmICh0aGlzLmxhc3RPYmplY3QpIHtcclxuICAgICAgLy8gcmV0cmlldmUgc3BhY2luZyBmcm9tIG9iamVjdCwgdXNlIHJsQWlzbGVHYXAgaWYgbm90IHNwZWNpZmllZFxyXG4gICAgICBjb25zdCBsYXN0TFIgPSB0aGlzLmxhc3RPYmplY3REZWZpbml0aW9uLmxyU3BhY2luZyB8fCBSTF9BSVNMRUdBUDtcclxuICAgICAgY29uc3QgbGFzdFRCID0gdGhpcy5sYXN0T2JqZWN0RGVmaW5pdGlvbi50YlNwYWNpbmcgfHwgUkxfQUlTTEVHQVA7XHJcblxyXG4gICAgICAvLyBjYWxjdWxhdGUgbWF4aW11bSBnYXAgcmVxdWlyZWQgYnkgbGFzdCBhbmQgdGhpcyBvYmplY3RcclxuICAgICAgLy8gTm90ZTogdGhpcyBpc24ndCBzbWFydCBlbm91Z2ggdG8gZ2V0IG5ldyByb3cgZ2FwIHJpZ2h0IHdoZW5cclxuICAgICAgLy8gb2JqZWN0IGFib3ZlIGhhZCBhIG11Y2ggYmlnZ2VyIGdhcCwgZXRjLiBXZSBhcmVuJ3QgZml0dGluZyB5ZXQuXHJcbiAgICAgIGNvbnN0IHVzZUxSID0gTWF0aC5tYXgobmV3TFIsIGxhc3RMUiksIHVzZVRCID0gTWF0aC5tYXgobmV3VEIsIGxhc3RUQik7XHJcblxyXG4gICAgICAvLyB1c2luZyBsZWZ0L3RvcCB2b2NhYiwgdGhvdWdoIGFsbCBvYmplY3RzIGFyZSBub3cgY2VudGVyZWRcclxuICAgICAgY29uc3QgbGFzdFdpZHRoID0gdGhpcy5sYXN0T2JqZWN0RGVmaW5pdGlvbi53aWR0aCB8fCAxMDA7XHJcbiAgICAgIGNvbnN0IGxhc3RIZWlnaHQgPSB0aGlzLmxhc3RPYmplY3REZWZpbml0aW9uLmhlaWdodCB8fCA0MDtcclxuXHJcbiAgICAgIGxldCBuZXdMZWZ0ID0gdGhpcy5sYXN0T2JqZWN0LmxlZnQgKyBsYXN0V2lkdGggKyB1c2VMUjtcclxuICAgICAgbGV0IG5ld1RvcCA9IHRoaXMubGFzdE9iamVjdC50b3A7XHJcblxyXG4gICAgICAvLyBtYWtlIHN1cmUgd2UgZml0IGxlZnQgdG8gcmlnaHQsIGluY2x1ZGluZyBvdXIgcmVxdWlyZWQgcmlnaHQgc3BhY2luZ1xyXG4gICAgICBpZiAobmV3TGVmdCArIGdyb3VwLndpZHRoICsgbmV3TFIgPiB0aGlzLlJPT01fU0laRS53aWR0aCkge1xyXG4gICAgICAgIG5ld0xlZnQgPSBuZXdMUiArIChncm91cC53aWR0aCAvIDIpO1xyXG4gICAgICAgIG5ld1RvcCArPSBsYXN0SGVpZ2h0ICsgdXNlVEI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGdyb3VwLmxlZnQgPSBuZXdMZWZ0O1xyXG4gICAgICBncm91cC50b3AgPSBuZXdUb3A7XHJcblxyXG4gICAgICBpZiAoKGdyb3VwLmxlZnQgLSBncm91cC53aWR0aCAvIDIpIDwgdGhpcy5yb29tX29yaWdpbikgeyBncm91cC5sZWZ0ICs9IHRoaXMucm9vbV9vcmlnaW47IH1cclxuICAgICAgaWYgKChncm91cC50b3AgLSBncm91cC5oZWlnaHQgLyAyKSA8IHRoaXMucm9vbV9vcmlnaW4pIHsgZ3JvdXAudG9wICs9IHRoaXMucm9vbV9vcmlnaW47IH1cclxuICAgIH1cclxuXHJcbiAgICBncm91cC5maWxsID0gJ2JsdWUnXHJcblxyXG4gICAgdGhpcy52aWV3LmFkZChncm91cCk7XHJcbiAgICB0aGlzLnZpZXcuc2V0QWN0aXZlT2JqZWN0KGdyb3VwKTtcclxuXHJcbiAgICB0aGlzLmxhc3RPYmplY3QgPSBncm91cDtcclxuICAgIHRoaXMubGFzdE9iamVjdERlZmluaXRpb24gPSBvYmplY3Q7XHJcbiAgfVxyXG5cclxuICAvKiogU2F2ZSBjdXJyZW50IHN0YXRlICovXHJcbiAgc2F2ZVN0YXRlKCkge1xyXG4gICAgaWYgKHRoaXMuYXBwLnVzZXJNb2RlKSB7XHJcbiAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy52aWV3LnRvRGF0YWxlc3NKU09OKFsnbmFtZScsICdoYXNDb250cm9scycsICdzZWxlY3RhYmxlJyxcclxuICAgICAgJ2hhc0JvcmRlcnMnLCAnZXZlbnRlZCcsICdob3ZlckN1cnNvciddKTtcclxuICAgICAgdGhpcy5hcHAuc2F2ZVN0YXRlLm5leHQoSlNPTi5zdHJpbmdpZnkoc3RhdGUpKTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMudmlldy50b0RhdGFsZXNzSlNPTihbJ25hbWUnLCAnaGFzQ29udHJvbHMnLCAnc2VsZWN0YWJsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hhc0JvcmRlcnMnLCAnZXZlbnRlZCcsICdob3ZlckN1cnNvcicsICdtb3ZlQ3Vyc29yJ10pO1xyXG4gICAgdGhpcy5hcHAuc2F2ZVN0YXRlLm5leHQoSlNPTi5zdHJpbmdpZnkoc3RhdGUpKTtcclxuICB9XHJcblxyXG4gIHVuZG8oKSB7XHJcbiAgICBsZXQgY3VycmVudCA9IG51bGw7XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5hcHAucm9vbUVkaXRTdGF0ZXMucG9wKCk7XHJcbiAgICAgIHRoaXMuYXBwLnJvb21FZGl0UmVkb1N0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgY3VycmVudCA9IHRoaXMuYXBwLnJvb21FZGl0U3RhdGVzW3RoaXMuYXBwLnJvb21FZGl0U3RhdGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmFwcC5zdGF0ZXMucG9wKCk7XHJcbiAgICAgIHRoaXMuYXBwLnJlZG9TdGF0ZXMucHVzaChzdGF0ZSk7XHJcbiAgICAgIGN1cnJlbnQgPSB0aGlzLmFwcC5zdGF0ZXNbdGhpcy5hcHAuc3RhdGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5jbGVhcigpO1xyXG5cclxuICAgIHRoaXMudmlldy5sb2FkRnJvbUpTT04oY3VycmVudCwgKCkgPT4ge1xyXG4gICAgICB0aGlzLnZpZXcucmVuZGVyQWxsKCk7XHJcbiAgICAgIHRoaXMuY29ybmVycyA9IHRoaXMudmlldy5nZXRPYmplY3RzKCkuZmlsdGVyKG9iaiA9PiBvYmoubmFtZSA9PT0gJ0NPUk5FUicpO1xyXG4gICAgICB0aGlzLmRyYXdSb29tKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogUmVkbyBvcGVyYXRpb24gKi9cclxuICByZWRvKCkge1xyXG4gICAgbGV0IGN1cnJlbnQgPSBudWxsO1xyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICBjdXJyZW50ID0gdGhpcy5hcHAucm9vbUVkaXRSZWRvU3RhdGVzLnBvcCgpO1xyXG4gICAgICB0aGlzLmFwcC5yb29tRWRpdFN0YXRlcy5wdXNoKGN1cnJlbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VycmVudCA9IHRoaXMuYXBwLnJlZG9TdGF0ZXMucG9wKCk7XHJcbiAgICAgIHRoaXMuYXBwLnN0YXRlcy5wdXNoKGN1cnJlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlldy5jbGVhcigpO1xyXG4gICAgdGhpcy52aWV3LmxvYWRGcm9tSlNPTihjdXJyZW50LCAoKSA9PiB7XHJcbiAgICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgICAgdGhpcy5jb3JuZXJzID0gdGhpcy52aWV3LmdldE9iamVjdHMoKS5maWx0ZXIob2JqID0+IG9iai5uYW1lID09PSAnQ09STkVSJyk7XHJcbiAgICAgIHRoaXMuZHJhd1Jvb20oKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqIENvcHkgb3BlcmF0aW9uICovXHJcbiAgY29weSgpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcbiAgICBpZiAoIWFjdGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhY3RpdmUuY2xvbmUoY2xvbmVkID0+IHRoaXMuYXBwLmNvcGllZCA9IGNsb25lZCwgWydwb2ludG5hbWUnLCduYW1lJywgJ2hhc0NvbnRyb2xzJ10pO1xyXG4gIH1cclxuXHJcbiAgLyoqIFBhc3RlIG9wZXJhdGlvbiAqL1xyXG4gIHBhc3RlKCkge1xyXG5cclxuICAgIGlmICggdGhpcy51c2VyTW9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmFwcC5jb3BpZWQgfHwgdGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBwLmNvcGllZC5jbG9uZSgoY2xvbmVkKSA9PiB7XHJcbiAgICAgIHRoaXMudmlldy5kaXNjYXJkQWN0aXZlT2JqZWN0KCk7XHJcbiAgICAgIGNsb25lZC5zZXQoe1xyXG4gICAgICAgIGxlZnQ6IGNsb25lZC5sZWZ0ICsgUkxfQUlTTEVHQVAsXHJcbiAgICAgICAgdG9wOiBjbG9uZWQudG9wICsgUkxfQUlTTEVHQVBcclxuICAgICAgfSk7XHJcbiAgICAgIGlmIChjbG9uZWQudHlwZSA9PT0gJ2FjdGl2ZVNlbGVjdGlvbicpIHtcclxuICAgICAgICBjbG9uZWQuY2FudmFzID0gdGhpcy52aWV3O1xyXG4gICAgICAgIGNsb25lZC5mb3JFYWNoT2JqZWN0KG9iaiA9PiB0aGlzLnZpZXcuYWRkKG9iaikpO1xyXG4gICAgICAgIGNsb25lZC5zZXRDb29yZHMoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnZpZXcuYWRkKGNsb25lZCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5hcHAuY29waWVkLnRvcCArPSBSTF9BSVNMRUdBUDtcclxuICAgICAgdGhpcy5hcHAuY29waWVkLmxlZnQgKz0gUkxfQUlTTEVHQVA7XHJcbiAgICAgIHRoaXMudmlldy5zZXRBY3RpdmVPYmplY3QoY2xvbmVkKTtcclxuICAgICAgdGhpcy52aWV3LnJlcXVlc3RSZW5kZXJBbGwoKTtcclxuICAgICAgdGhpcy5zYXZlU3RhdGUoKTsgIH0sIFsnbmFtZScsICdoYXNDb250cm9scyddKTtcclxuXHJcbiAgfVxyXG5cclxuICBjbGVhckxheW91dCgpIHtcclxuICAgIHRoaXMuYXBwLmxvYWRKc29uKCcnKTtcclxuICAgIHRoaXMuaW5pdExheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqIERlbGV0ZSBvcGVyYXRpb24gKi9cclxuICBkZWxldGUoKSB7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5hcHAuc2VsZWN0aW9ucylcclxuICAgIGlmICggdGhpcy51c2VyTW9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdubyBpdGVtcycpXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAuc2VsZWN0aW9ucykge1xyXG4gICAgICB0aGlzLmFwcC5zZWxlY3Rpb25zLmZvckVhY2goc2VsZWN0aW9uID0+IHRoaXMudmlldy5yZW1vdmUoc2VsZWN0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy52aWV3LmRpc2NhcmRBY3RpdmVPYmplY3QoKTtcclxuICAgICAgdGhpcy52aWV3LnJlcXVlc3RSZW5kZXJBbGwoKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicsIGVycm9yKVxyXG4gICAgfVxyXG4gICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIC8qKiBSb3RhdGUgT3BlcmF0aW9uICovXHJcbiAgcm90YXRlKGNsb2Nrd2lzZSA9IHRydWUpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGFuZ2xlID0gdGhpcy5DVFJMX0tFWV9ET1dOID8gOTAgOiAxNTtcclxuICAgIGNvbnN0IG9iaiA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuXHJcbiAgICBpZiAoIW9iaikgeyByZXR1cm47IH1cclxuXHJcbiAgICBpZiAoKG9iai5vcmlnaW5YICE9PSAnY2VudGVyJyB8fCBvYmoub3JpZ2luWSAhPT0gJ2NlbnRlcicpICYmIG9iai5jZW50ZXJlZFJvdGF0aW9uKSB7XHJcbiAgICAgIG9iai5vcmlnaW5YID0gJ2NlbnRlcic7XHJcbiAgICAgIG9iai5vcmlnaW5ZID0gJ2NlbnRlcic7XHJcbiAgICAgIG9iai5sZWZ0ICs9IG9iai53aWR0aCAvIDI7XHJcbiAgICAgIG9iai50b3AgKz0gb2JqLmhlaWdodCAvIDI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNEVyhvYmopKSB7XHJcbiAgICAgIGFuZ2xlID0gb2JqLmFuZ2xlICsgKGNsb2Nrd2lzZSA/IDE4MCA6IC0xODApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYW5nbGUgPSBvYmouYW5nbGUgKyAoY2xvY2t3aXNlID8gYW5nbGUgOiAtYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhbmdsZSA+IDM2MCkgeyBhbmdsZSAtPSAzNjA7IH0gZWxzZSBpZiAoYW5nbGUgPCAwKSB7IGFuZ2xlICs9IDM2MDsgfVxyXG5cclxuICAgIG9iai5hbmdsZSA9IGFuZ2xlO1xyXG4gICAgdGhpcy52aWV3LnJlcXVlc3RSZW5kZXJBbGwoKTtcclxuICB9XHJcblxyXG4gIC8qKiBHcm91cCAqL1xyXG4gIGdyb3VwKCkge1xyXG5cclxuICAgIGlmICggdGhpcy51c2VyTW9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcbiAgICBpZiAoISh0aGlzLmFwcC5zZWxlY3Rpb25zLmxlbmd0aCA+IDEgJiYgYWN0aXZlIGluc3RhbmNlb2YgZmFicmljLkFjdGl2ZVNlbGVjdGlvbikpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2ZS50b0dyb3VwKCk7XHJcbiAgICBhY3RpdmUubG9ja1NjYWxpbmdYID0gdHJ1ZSwgYWN0aXZlLmxvY2tTY2FsaW5nWSA9IHRydWU7XHJcbiAgICB0aGlzLm9uU2VsZWN0ZWQoKTtcclxuICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICB1bmdyb3VwKCkge1xyXG4gICAgIGlmICggdGhpcy51c2VyTW9kZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXBwLnJvb21FZGl0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLnZpZXcuZ2V0QWN0aXZlT2JqZWN0KCk7XHJcbiAgICBpZiAoIShhY3RpdmUgJiYgYWN0aXZlIGluc3RhbmNlb2YgZmFicmljLkdyb3VwKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZlLnRvQWN0aXZlU2VsZWN0aW9uKCk7XHJcbiAgICBhY3RpdmUubG9ja1NjYWxpbmdYID0gdHJ1ZSwgYWN0aXZlLmxvY2tTY2FsaW5nWSA9IHRydWU7XHJcbiAgICB0aGlzLm9uU2VsZWN0ZWQoKTtcclxuICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBtb3ZlKGRpcmVjdGlvbiwgaW5jcmVhbWVudCA9IDYpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmFwcC5yb29tRWRpdCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aXZlID0gdGhpcy52aWV3LmdldEFjdGl2ZU9iamVjdCgpO1xyXG4gICAgaWYgKCFhY3RpdmUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcbiAgICAgIGNhc2UgJ0xFRlQnOlxyXG4gICAgICAgIGFjdGl2ZS5sZWZ0IC09IGluY3JlYW1lbnQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ1VQJzpcclxuICAgICAgICBhY3RpdmUudG9wIC09IGluY3JlYW1lbnQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ1JJR0hUJzpcclxuICAgICAgICBhY3RpdmUubGVmdCArPSBpbmNyZWFtZW50O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdET1dOJzpcclxuICAgICAgICBhY3RpdmUudG9wICs9IGluY3JlYW1lbnQ7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB0aGlzLnZpZXcucmVxdWVzdFJlbmRlckFsbCgpO1xyXG4gICAgdGhpcy5zYXZlU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIHNldFpvb20oKSB7XHJcbiAgICB0aGlzLnZpZXcuc2V0Wm9vbSh0aGlzLmFwcC56b29tIC8gMTAwKTtcclxuICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICB9XHJcblxyXG4gIHNldFNjYWxpbmdab29tKCkge1xyXG4gICAgLy8gdGhpcy52aWV3LnNldERpbWVuc2lvbnMoeyB3aWR0aDogdGhpcy52aWV3LmdldFdpZHRoKCkgKiB0aGlzLmFwcC5zY2FsZVJhdGlvLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMudmlldy5nZXRIZWlnaHQoKSAqIHRoaXMuYXBwLnNjYWxlUmF0aW8gfSk7XHJcbiAgfVxyXG5cclxuICBwbGFjZUluQ2VudGVyKGRpcmVjdGlvbikge1xyXG4gICAgaWYgKCB0aGlzLnVzZXJNb2RlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcHAucm9vbUVkaXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMudmlldy5nZXRBY3RpdmVPYmplY3QoKTtcclxuXHJcbiAgICBpZiAoIWFjdGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ0hPUklaT05UQUwnKSB7XHJcbiAgICAgIGFjdGl2ZS5sZWZ0ID0gdGhpcy5ST09NX1NJWkUud2lkdGggLyAyIC0gKGFjdGl2ZS5vcmlnaW5YID09PSAnY2VudGVyJyA/IDAgOiBhY3RpdmUud2lkdGggLyAyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFjdGl2ZS50b3AgPSB0aGlzLlJPT01fU0laRS5oZWlnaHQgLyAyIC0gKGFjdGl2ZS5vcmlnaW5YID09PSAnY2VudGVyJyA/IDAgOiBhY3RpdmUuaGVpZ2h0IC8gMik7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZlLnNldENvb3JkcygpO1xyXG4gICAgdGhpcy52aWV3LnJlcXVlc3RSZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBhcnJhbmdlKGFjdGlvbjogc3RyaW5nKSB7XHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy5nZXRCb3VuZGluZ1JlY3QodGhpcy5hcHAuc2VsZWN0aW9ucyk7XHJcbiAgICBhY3Rpb24gPSBhY3Rpb24udG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuYXBwLnNlbGVjdGlvbnMuZm9yRWFjaChzID0+IHtcclxuICAgICAgaWYgKGFjdGlvbiA9PT0gJ2xlZnQnIHx8IGFjdGlvbiA9PT0gJ3JpZ2h0JyB8fCBhY3Rpb24gPT09ICdjZW50ZXInKSB7XHJcbiAgICAgICAgcy5sZWZ0ID0gcmVjdFthY3Rpb25dO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHMudG9wID0gcmVjdFthY3Rpb25dO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMudmlldy5yZW5kZXJBbGwoKTtcclxuICAgIHRoaXMuc2F2ZVN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBmaWx0ZXJPYmplY3RzKG5hbWVzOiBzdHJpbmdbXSkge1xyXG4gICAgcmV0dXJuIHRoaXMudmlldy5nZXRPYmplY3RzKCkuZmlsdGVyKG9iaiA9PiBuYW1lcy5zb21lKG4gPT4gb2JqLm5hbWUuaW5kZXhPZihuKSA+IC0xKSk7XHJcbiAgfVxyXG5cclxuICB3YWxsT2ZEVyhkdzogZmFicmljLkdyb3VwIHwgZmFicmljLk9iamVjdCkge1xyXG4gICAgY29uc3QgZCA9IGR3LmFuZ2xlICUgMTgwID09PSAwID8gSE9SSVpPTlRBTCA6IFZFUlRJQ0FMO1xyXG4gICAgcmV0dXJuIHRoaXMud2FsbHMuZmluZCh3ID0+IE1hdGguYWJzKGQgPT09IEhPUklaT05UQUwgPyB3LnRvcCAtIGR3LnRvcCA6IHcubGVmdCAtIGR3LmxlZnQpID09PSBPRkZTRVQpO1xyXG4gIH1cclxuXHJcbiAgZGlyZWN0aW9uT2ZXYWxsKHdhbGw6IGZhYnJpYy5MaW5lKSB7XHJcbiAgICBpZiAod2FsbC54MSA9PT0gd2FsbC54Mikge1xyXG4gICAgICByZXR1cm4gVkVSVElDQUw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gSE9SSVpPTlRBTDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzRFcob2JqZWN0KSB7XHJcbiAgICByZXR1cm4gb2JqZWN0Lm5hbWUuaW5kZXhPZignRE9PUicpID4gLTEgfHwgb2JqZWN0Lm5hbWUuaW5kZXhPZignV0lORE9XJykgPiAtMTtcclxuICB9XHJcblxyXG4gIGdldEJvdW5kaW5nUmVjdChvYmplY3RzOiBhbnlbXSkge1xyXG4gICAgbGV0IHRvcCA9IDk5OTksIGxlZnQgPSA5OTk5LCByaWdodCA9IDAsIGJvdHRvbSA9IDA7XHJcbiAgICBvYmplY3RzLmZvckVhY2gob2JqID0+IHtcclxuICAgICAgaWYgKG9iai5sZWZ0IDwgdG9wKSB7XHJcbiAgICAgICAgdG9wID0gb2JqLnRvcDtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2JqLmxlZnQgPCBsZWZ0KSB7XHJcbiAgICAgICAgbGVmdCA9IG9iai5sZWZ0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChvYmoudG9wID4gYm90dG9tKSB7XHJcbiAgICAgICAgYm90dG9tID0gb2JqLnRvcDtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2JqLmxlZnQgPiByaWdodCkge1xyXG4gICAgICAgIHJpZ2h0ID0gb2JqLmxlZnQ7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGNlbnRlciA9IChsZWZ0ICsgcmlnaHQpIC8gMjtcclxuICAgIGNvbnN0IG1pZGRsZSA9ICh0b3AgKyBib3R0b20pIC8gMjtcclxuXHJcbiAgICByZXR1cm4geyBsZWZ0LCB0b3AsIHJpZ2h0LCBib3R0b20sIGNlbnRlciwgbWlkZGxlIH07XHJcbiAgfVxyXG5cclxuICBsb2FkSlNPTigpIHtcclxuICAgIHRoaXMuYXBwLmpzb25WYWx1ZS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlck1vZGUpIHtcclxuICAgICAgICAgIHRoaXMubWFpbmNvbnRhaW5lckNsYXNzID0gJ21haW4tY29udGFpbmVyLXVzZXJtb2RlJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMudXNlck1vZGUpIHtcclxuICAgICAgICAgIHRoaXMubWFpbmNvbnRhaW5lckNsYXNzID0gJ21haW4tY29udGFpbmVyJ1xyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKCFkYXRhIHx8IGRhdGEgPT0gbnVsbCAgJiYgdGhpcy52aWV3KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGVhcicpXHJcbiAgICAgICAgICAgIHRoaXMudmlldy5sb2FkRnJvbUpTT04obnVsbCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy52aWV3LnJlbmRlckFsbCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy52aWV3LmxvYWRGcm9tSlNPTiggZGF0YSwgdGhpcy52aWV3LnJlbmRlckFsbC5iaW5kKHRoaXMudmlldykgKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJywgZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmlldy5sb2FkRnJvbUpTT04oIGRhdGEsIHRoaXMudmlldy5yZW5kZXJBbGwuYmluZCh0aGlzLnZpZXcpIClcclxuICAgICAgfVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlU2VsZWN0aW9uKHNlbGVjdGFibGU6IGJvb2xlYW4pe1xyXG4gICAgdGhpcy52aWV3LmdldE9iamVjdHMoKS5mb3JFYWNoKChvYmosIGluZGV4KSA9PiB7XHJcbiAgICAgIG9iai5zZWxlY3RhYmxlID0gc2VsZWN0YWJsZTtcclxuICAgICAgb2JqLmV2ZW50ZWQgPSB0cnVlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlzSnNvblN0cnVjdHVyZShzdHIpIHtcclxuICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuIGZhbHNlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZShzdHIpO1xyXG4gICAgICBjb25zdCB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHJlc3VsdCk7XHJcbiAgICAgIHJldHVybiB0eXBlID09PSAnW29iamVjdCBPYmplY3RdJ1xyXG4gICAgICAgICAgICAgfHwgdHlwZSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFsdGVyT2JqZWN0Q29sb3IodXVJRDogc3RyaW5nLCBjb2xvcjogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy52aWV3O1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgY29uc29sZS5sb2coJ3V1aWQnLCB1dUlEKTtcclxuICAgICAgY29uc29sZS5sb2codmlldy5fb2JqZWN0cylcclxuICAgICAgaWYgKHZpZXcuX29iamVjdHMpIHtcclxuICAgICAgICAgIHZpZXcuX29iamVjdHMuZm9yRWFjaChkYXRhID0+IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YT8udHlwZSAgJiYgKGRhdGE/LnR5cGUgPT09ICdncm91cCcgKSApIHtcclxuICAgICAgICAgICAgICBjb25zdCBpdGVtVmFsdWUgPSBkYXRhPy5uYW1lLnNwbGl0KFwiO1wiKVxyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGE/Lm5hbWUsIHV1SUQpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpdGVtVmFsdWUnLCBpdGVtVmFsdWUpXHJcbiAgICAgICAgICAgICAgaWYgKGl0ZW1WYWx1ZS5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtVVVJRCA9IGl0ZW1WYWx1ZVswXTtcclxuICAgICAgICAgICAgICAgIGlmICh1dUlEID09PSBpdGVtVVVJRCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpdGVtVmFsdWUgdXBkYXRlICcsIGl0ZW1WYWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJva2UgPSA1XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3IgPT09ICdyZWQnIHx8IGNvbG9yID09PSAgJ3JnYigyMDAsMTAsMTApJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJvcmRlckNvbG9yID0gIGNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJva2UgPSA4XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yID09PSAnZ3JlZW4nIHx8IGNvbG9yID09PSAgJ3JnYigxMCwxMCwyMDApJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJvcmRlckNvbG9yID0gIGNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHJva2UgPSA1XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yID09PSAneWVsbG93JyB8fCBjb2xvciA9PT0gICdyZ2IoMTAsMTAsMjAwKScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5ib3JkZXJDb2xvciA9ICBjb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3Ryb2tlID0gNVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdwdXJwbGUnIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YT8uYmFja2dyb3VuZENvbG9yID09PSAncmdiYSgyNTUsMTAwLDE3MSwwLjI1KScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ25hbWUgc3VjY2Vzc2Z1bCBzZXR0aW5nIGNvbG9yJywgbmFtZSwgZGF0YT8uYmFja2dyb3VuZENvbG9yLCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuYmFja2dyb3VuZENvbG9yID0gY29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuYm9yZGVyQ29sb3IgPSAgY29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zdHJva2UgPSBjb2xvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnN0cm9rZVdpZHRoID0gc3Ryb2tlXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGE/LmJhY2tncm91bmRDb2xvciA9PT0gJ3B1cnBsZScgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdyZ2JhKDI1NSwxMDAsMTcxLDAuMjUpJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbmFtZSBzdWNjZXNzZnVsIHNldHRpbmcgY29sb3IgMicsIG5hbWUsIGRhdGE/LmJhY2tncm91bmRDb2xvciwgY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJvcmRlckNvbG9yID0gIGNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlID0gY29sb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zdHJva2VXaWR0aCA9IHN0cm9rZVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWx0ZXJDb2xvcihjb2xvciwgZGF0YSwgc3Ryb2tlIC0zIClcclxuICAgICAgICAgICAgICAgICAgLy8gICB9XHJcbiAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmlldztcclxuICB9XHJcblxyXG4gIGFsdGVyQ29sb3IoY29sb3IsIG9iaiwgc3Ryb2tlKSB7XHJcbiAgICBvYmouYm9yZGVyQ29sb3IgPSAgY29sb3JcclxuICAgIG9iai5zdHJva2UgPSBjb2xvclxyXG4gICAgb2JqLnN0cm9rZVdpZHRoID0gc3Ryb2tlXHJcbiAgICBpZiAob2JqLm9iamVjdHMgJiYgb2JqLm9iamVjdHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICBvYmoub2JqZWN0cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgdGhpcy5hbHRlckNvbG9yKGNvbG9yLCBpdGVtLCBzdHJva2UpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqXHJcbiAgfVxyXG5cclxuXHJcbn1cclxuIiwiPGRpdiBbY2xhc3NdPVwibWFpbmNvbnRhaW5lckNsYXNzXCIgID5cclxuICA8Y2FudmFzICBpZD1cIm1haW5cIj48L2NhbnZhcz5cclxuPC9kaXY+XHJcbiJdfQ==