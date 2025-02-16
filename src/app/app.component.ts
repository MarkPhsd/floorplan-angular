import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import {
//   faReply,
//   faShare,
//   faClone,
//   faTrash,
//   faUndo,
//   faRedo,
//   faObjectGroup,
//   faObjectUngroup,
//   faPlus,
//   faMinus
// } from '@fortawesome/free-solid-svg-icons';

import { FURNISHINGS } from './models/furnishings';
import { AppService, uuidList } from './app.service';
import { ChairsLayoutComponent } from './components/chairs-layout/chairs-layout.component';
import { Observable, Subject, Subscription } from 'rxjs';
import { delay, repeatWhen  } from 'rxjs/operators';
import * as uuid from 'uuid';
import { FakeDataService } from './fake-data.service';

// library.add(faReply, faShare, faClone, faTrash, faUndo, faRedo, faObjectGroup, faObjectUngroup, faMinus, faPlus);

// https://stackoverflow.com/questions/38974896/call-child-component-method-from-parent-class-angular
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
@Component({
  selector: 'pointless-room-layout-designer',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class RoomLayoutDesignerComponent implements OnInit, OnDestroy {

  @ViewChild('layoutObjects') layoutObjects: TemplateRef<any>;
  @ViewChild('roomLayout') roomLayout: TemplateRef<any>;

  @Input() isAdmin  = true;
  @Input() userMode: boolean = false;

  // @Input() isAdmin  = false;
  // @Input() userMode: boolean = true;
  @Input()  _zoom            : Subject<number>;
  @Input() _userMode         : Subject<boolean>;
  @Input() _clearNextSelectedTable: Subject<boolean>;
  @Input() changeObjectColor: Subject<any>;
  @Input() floorPlan         : IFloorPlan;
  @Input() _floorPlan        : Subject<IFloorPlan>;
  @Input() _setTableInfo     : Subject<any>;
  @Input() _newOrder         : Subject<any>;
  @Input() orderID           : string;
  @Input() _performOperations: Subject<any>;
  @Input() _setOrder         : Subject<any>; // {uuid: string, orderID: string, name: string, status: string}

  template  : string;
  //sends the current  object
  @Output() saveFloorPlan     = new EventEmitter();
  @Output() newFloorPlan      = new EventEmitter();
  @Input() toggleButtonHidden : boolean;

  @Output() setFloorPlanAndTable   = new EventEmitter() // { id:
  @Output() getFloorPlan           = new EventEmitter() // { id:
  @Output() setTable               = new EventEmitter(); // {uuid:
  @Output() outPutJSON             = new EventEmitter(); // {uuid:

  title = 'room-layout';
  init = false;
  furnishings = FURNISHINGS;
  defaultChairIndex = 0;
  textForm: FormGroup;
  previewItem = null;
  previewType = null;

  // // icons
  // faReply = faReply;
  // faShare = faShare;
  // faClone = faClone;
  // faTrash = faTrash;
  // faUndo  = faUndo;
  // faRedo  = faRedo;
  // faObjectGroup = faObjectGroup;
  // faObjectUngroup = faObjectUngroup;
  // faPlus  = faPlus;
  // faMinus = faMinus;

  constructor(public app: AppService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {

    const defaultChair = FURNISHINGS.chairs[0];
    setTimeout(() => {
      this.app.defaultChair.next(defaultChair);
      this.init = true;
    }, 100);
    this._setTableSelectedColor();
    this.setZoom()
    this.initTextForm();
    this.intTemplateSubscriber();
    this.initCurrentFloorPlan();
    this.clearTableSubscriber();
    this.initUserModeSubscriber();
    this._setTable();
    this.setOrder();
    this.performOperations();
    this.app.userMode = this.userMode;
    this._outPutJSON();

  }

  //subscribe to the client's object.
  //it can receive then update info about the table
  //using the name field.
  //and also set other features like the color.

  ngOnDestroy(): void {
    // if (this.app.jsonValue) {
    //   this.app.jsonValue.unsubscribe();
    // }

    // if (this.app.performOperation) {
    //   this.app.performOperation.unsubscribe();
    // }

    // if (this.app.saveState) {
    //   this.app.saveState.unsubscribe();
    // }
  }

  _outPutJSON() {
    this.app.jsonValue.subscribe(data => {
      this.outPutJSON.emit(data)
    })
  }

  setTableInfo() {
    this._setTableInfo.subscribe(data => {
      this.app.selectededObject.next(data);
    })
  }

  setZoom() {
    this._zoom.subscribe(data => {
      this.app.zoom = data;
      this.app.performOperation.next('ZOOM');
    })

  }

  getItemName(selected) {
    if ( !selected?.name.split(';')[2]  || selected?.name.split(';')[2] === 'itemName') {
      return ''
    }
    return selected?.name.split(';')[2]
  }

  getOrderName(selected) {
    if ( !selected?.name.split(';')[1]  || selected?.name.split(';')[1] == 'orderID' || selected?.name.split(';')[1] == 'orderid') {
      return ''
    }
    return selected?.name.split(';')[1]
  }

  _setTableSelectedColor() {
    if (!this.changeObjectColor) {
      console.log('no changeObjectColor')
      return;
    }

    this.changeObjectColor.subscribe(list => {
      console.log(list, this.floorPlan)
      if ( list && list.length>0 ) {
          list.forEach(order => {
            const item = {uuID: order?.tableUUID, color: 'red'};
            console.log(item)
            this.app.setSelectedObjectColor.next(item)
          }
        )
      }
    })
  }

  setOrder() {
    try {
      this._newOrder.subscribe(data => {
        const item = data;
        this.app.orderID = item.orderID;
        this.app.tableStatus = item.status;
        this.app.setOrder(item.orderID);
      })
    } catch (error) {
    }
  }

  get isRoomLayoutSelector() {
    if (this.floorPlan){
      return this.roomLayout
    }
    return null;
  }

  get islayoutObjects() {
    if (this.floorPlan){
      return this.layoutObjects
    }
    return null;
  }

  initCurrentFloorPlan() {
    try {
      if (this._floorPlan) {
        this._floorPlan.subscribe(data => {
          if (data) {
            this.floorPlan = data;
            this.app.loadJson(data.template);
            this.changeBackGroundImage();
          }
        })
      }
    } catch (error) {
      console.log('initCurrentFloorPlan', error)
    }
  }

  changeBackGroundImage() {
    this.app.selectedBackGroundImage.next(this.floorPlan.image)
  }

  _saveFloorPlan() {
    this.app.performOperation.next('save');
  }

  intTemplateSubscriber() {
    try {
        this.app.saveState.subscribe(data =>  {
          this.setFloorPlanTemplate(data)
          return;
        }
      )
    } catch (error) {
      console.log('init intTemplateSubscriber', error)
    }
  }

  setFloorPlanTemplate(data) {
    if (data && this.floorPlan) {
      if (data) {
        data = JSON.stringify(data);
        data = data.replace(/(^"|"$)/g, '');
        data = data.replaceAll('\\', '');
      }
      this.floorPlan.template =  data
      this.saveFloorPlan.emit(this.floorPlan)
    }
  }

  loadTemplate() {
    if (!this.floorPlan) {
      this.floorPlan = this.exampleFloor()
    }
    try {
      if (this.floorPlan) {
        let data = this.floorPlan.template as any;
        this.floorPlan.template = data.replaceAll('\\', '');
        this.floorPlan.template =  this.floorPlan.template
        this.app.loadJson(this.floorPlan.template);
      }
     } catch (error) {
      console.log('loadTemplate', error)
    }
  }

  clearTable() {
    this.floorPlan.template = null;
    this.app.saveState.next(null);
    this.app.performOperation.next('InitLayout');
  }

  getFloorPlanData() {
    this.getFloorPlan.emit(this.floorPlan);
  }

  toggleUserMode() {
    this.userMode = !this.userMode;
    this.toggleMode(this.userMode);
  }

  initUserModeSubscriber() {
    if (!this._userMode) { return };
    this._userMode.subscribe(v => {
      this.toggleMode(v);
    });
  }

  clearTableSubscriber() {
    try {
      if (this._clearNextSelectedTable) {
        this._clearNextSelectedTable.subscribe(data => {
          if (data) {
            this.app.clearNextSelectedTable = data;
            if (data) {
              this.app.setOrder('')
              return;
            }
          }
          if (data) {
            this.app.setOrder('');
            this.app.clearNextSelectedTable = false;
          }
        })
      }
    } catch (error) {
      // console.log('init _clearNextSelectedTable', error)
    }
  }

  _setTable() {
    this.app.selectededObject.subscribe(data => {
      this.setTable.emit(data);
    })
  }

  clearLayout() {
    this.app.performOperation.next('InitLayout');
  }

  isJsonStructure(str) {
    if (typeof str !== 'string') return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]'
              || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }

  onZoom(value) {
    this.app.zoom = value;
    this.app.performOperation.next('ZOOM');
  }

  toggleMode(option: boolean) {
    this.userMode = option;
    this.app.userMode = option;
    if (option) {
      this.app.editRoom()
    }
    if (!option) {
      this.app.endEditRoom()
    }
  }

  performOperations() {
    if (!this._performOperations) { return}
    this._performOperations.next(data => {
      const result = data.split(';')
      if (result[0] === 'setTableID') {
        this.app.orderID = result[0];
        this.app.setOrder(result[0]);
        this.saveFloorPlan.emit(data);
        return
      }
      this.app.performOperation.next(data);
    })
  }

  outPutSetTable() {
    //this emits a request for a new orderID
    //the orderID will be received
    //the perform operation will be called and the delimiter with orderid will be position 2
    //the orderID will be set
    //the floorplan will be emitted.
  }

  enableLayout() {
    this.app.performOperation.next('enableSelection');
  }

  displayLayout(item) {
    this.app.performOperation.next('InitLayout');
    this.getFloorPlan.emit(item);
     if (this.userMode && !this.isAdmin) {
      if (item) {
        if (item.id) {
          this.app.disableSelection();
        }
      }
    }
  }

  refreshObservable(item$: Observable<any>) {
    if (!this.userMode) { return }
    item$.pipe(
      repeatWhen(x => x.pipe(delay(3500)))).subscribe(data => {
      // this.orderService.updateOrderSubscription(data)
    })
  }

  insert(object: any, type: string) {
    if (this.app.roomEdit) { return; }
    const id = uuid.v4()
    object.name = id
    this.app.insertObject.next({ type, object });
  }

  defaultChairChanged(index: number) {
    this.defaultChairIndex = index;
    this.app.defaultChair.next(FURNISHINGS.chairs[index]);
  }

  initTextForm() {
    this.textForm =  this.fb.group({
      text: ['New Text'],
      font_size: [16],
      direction: ['HORIZONTAL']
    });
  }

  insertNewText() {
    this.insert({ ...this.textForm.value, name: 'TEXT:Text' }, 'TEXT');
  }

  layoutChairs() {
    const ref = this.dialog.open(ChairsLayoutComponent);
    ref.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.insert(res, 'LAYOUT');
    });
  }

  exampleFloor() {

    this.floorPlan = {} as IFloorPlan;
    this.floorPlan.name = 'hello there';
    this.floorPlan.enabled = true;
    this.floorPlan.template = '{"version":"5.2.1","objects":[{"type":"line","version":"5.2.1","originX":"center","originY":"center","left":48,"top":288,"width":0,"height":480,"fill":"rgb(0,0,0)","stroke":"#000","strokeWidth":4,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"WALL:3","x1":0,"x2":0,"y1":240,"y2":-240},{"type":"line","version":"5.2.1","originX":"center","originY":"center","left":528,"top":528,"width":960,"height":0,"fill":"rgb(0,0,0)","stroke":"#000","strokeWidth":4,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"WALL:2","x1":480,"x2":-480,"y1":0,"y2":0},{"type":"line","version":"5.2.1","originX":"center","originY":"center","left":1008,"top":288,"width":0,"height":480,"fill":"rgb(0,0,0)","stroke":"#000","strokeWidth":4,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"WALL:1","x1":0,"x2":0,"y1":-240,"y2":240},{"type":"line","version":"5.2.1","originX":"center","originY":"center","left":528,"top":48,"width":960,"height":0,"fill":"rgb(0,0,0)","stroke":"#000","strokeWidth":4,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"WALL:0","x1":-480,"x2":480,"y1":0,"y2":0},{"type":"rect","version":"5.2.1","originX":"center","originY":"center","left":48,"top":48,"width":4,"height":4,"fill":"#000","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"name":"CORNER"},{"type":"rect","version":"5.2.1","originX":"center","originY":"center","left":1008,"top":48,"width":4,"height":4,"fill":"#000","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"name":"CORNER"},{"type":"rect","version":"5.2.1","originX":"center","originY":"center","left":1008,"top":528,"width":4,"height":4,"fill":"#000","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"name":"CORNER"},{"type":"rect","version":"5.2.1","originX":"center","originY":"center","left":48,"top":528,"width":4,"height":4,"fill":"#000","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"name":"CORNER"},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":426.5,"top":132.5,"width":73,"height":73,"fill":"blue","stroke":"purple","strokeWidth":10,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"purple","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"f5fa4b51-984a-4606-88e5-b4e7793548f6;orderid;itemName;","objects":[{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":-26,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":26,"top":0,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":270,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":26,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":360,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":-26,"top":0,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"circle","version":"5.2.1","originX":"center","originY":"center","left":0,"top":0,"width":44,"height":44,"fill":"skyBlue","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":22,"startAngle":0,"endAngle":360,"name":"f5fa4b51-984a-4606-88e5-b4e7793548f6;orderid;itemName;"}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":500.42,"top":402.29,"width":81.38,"height":83,"fill":"blue","stroke":"purple","strokeWidth":10,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"purple","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"df32785b-4ec5-463e-863c-874e66c2b48c;orderid;itemName;","objects":[{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":-31,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":26.85,"top":-15.5,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":240,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":26.85,"top":15.5,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":300,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":31,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":360,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":-26.85,"top":15.5,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":60,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":-26.85,"top":-15.5,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":120,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"circle","version":"5.2.1","originX":"center","originY":"center","left":0,"top":0,"width":54,"height":54,"fill":"skyBlue","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":27,"startAngle":0,"endAngle":360,"name":"df32785b-4ec5-463e-863c-874e66c2b48c;orderid;itemName;"}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":565.5,"top":192.5,"width":73,"height":73,"fill":"blue","stroke":"purple","strokeWidth":10,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"purple","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"8393a512-7b3d-4e1b-8b68-3c6a4c123eac;orderid;itemName;","objects":[{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":-26,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":26,"top":0,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":270,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":26,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":360,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":-26,"top":0,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"circle","version":"5.2.1","originX":"center","originY":"center","left":0,"top":0,"width":44,"height":44,"fill":"skyBlue","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":22,"startAngle":0,"endAngle":360,"name":"8393a512-7b3d-4e1b-8b68-3c6a4c123eac;orderid;itemName;"}]},{"type":"text","version":"5.2.1","originX":"left","originY":"top","left":48,"top":564,"width":2,"height":13.56,"fill":"#999","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Arial","fontWeight":"normal","fontSize":12,"text":"","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":{},"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline"},{"type":"text","version":"5.2.1","originX":"left","originY":"top","left":48,"top":564,"width":2,"height":13.56,"fill":"#999","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Arial","fontWeight":"normal","fontSize":12,"text":"","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":{},"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline"}]}'
    this.floorPlan.id = 1;
    return this.floorPlan
  }

}

