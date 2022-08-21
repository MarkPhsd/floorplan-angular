import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup,  FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faReply,
  faShare,
  faClone,
  faTrash,
  faUndo,
  faRedo,
  faObjectGroup,
  faObjectUngroup,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';

import { FURNISHINGS } from './models/furnishings';
import { AppService } from './app.service';
import { ChairsLayoutComponent } from './components/chairs-layout/chairs-layout.component';
import { Observable, Subject, Subscription } from 'rxjs';
import { delay, repeatWhen  } from 'rxjs/operators';
import * as uuid from 'uuid';

library.add(faReply, faShare, faClone, faTrash, faUndo, faRedo, faObjectGroup, faObjectUngroup, faMinus, faPlus);

// https://stackoverflow.com/questions/38974896/call-child-component-method-from-parent-class-angular
@Component({
  selector: 'pointless-room-layout-designer',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class RoomLayoutDesignerComponent implements OnInit {

  //table list //  _userMode: Subscription;
  @Input() _userMode: Subject<boolean>;
  // @Input() _userMode: Subject<boolean>;

  @Input() userMode: boolean = false;
  @Input() _jsonTemplateLists: Subject<string[]>;
  jsonTemplateLists: any;
  @Input() jsonTemplate: string;
  @Input() orderID: string;

  @Output() outPutOrderSelected = new EventEmitter(); // {uuid: string, orderID: string, name: string}
  @Output() outPutTemplate = new EventEmitter();// {id: number, name: string, jsonTEmplate}
  @Output() outPutLayoutTable = new EventEmitter();

  // currentLayout : any;

  title = 'room-layout';
  _jsonValue : Subscription;
  jsonValue  : string;

  init = false;
  furnishings = FURNISHINGS;
  defaultChairIndex = 0;
  textForm: FormGroup;
  previewItem = null;
  previewType = null;

  // icons
  faReply = faReply;
  faShare = faShare;
  faClone = faClone;
  faTrash = faTrash;
  faUndo  = faUndo;
  faRedo  = faRedo;
  faObjectGroup = faObjectGroup;
  faObjectUngroup = faObjectUngroup;
  faPlus  = faPlus;
  faMinus = faMinus;

  constructor(public app: AppService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    const defaultChair = FURNISHINGS.chairs[0];
    setTimeout(() => {
      this.app.defaultChair.next(defaultChair);
      this.init = true;
    }, 100);

    this.initTextForm();
    this.intJSONTemplateSubscriber();
    this.initJSONTemplateList();
  }

  initJSONTemplateList() {
    this._jsonTemplateLists.subscribe(data => {
      this.jsonTemplateLists = data;
    })
  }


  intJSONTemplateSubscriber() {
    this._jsonValue = this.app.jsonValue.subscribe(data => {
      if (this.isJsonStructure(data)) {
        this.jsonValue = data;
        return;
      }
      this.jsonValue = JSON.stringify(data);
      return;
    })
  }

  initUserModeSubscriber() {
    this._userMode.subscribe(v => {
      this.toggleMode();
    });
  }

  initTaleLayoutList() {

  }

  selectItem(item) {
    this.outPutLayoutTable.emit(item)
  }
  selectOrder(item) {
    this.outPutOrderSelected.emit(item)
  }
  selectTableLayout(item) {
    this.outPutLayoutTable.emit(item)
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

  getCurrentFabricLayout() {
    this.app.performOperation.next('json');
  }

  setOrderID() {
    //assign the orderid to the current selected order.
    this.app.setOrder('131390')
  }



 loadJSON() {
    try {
      this.app.loadJson(this.jsonValue);
     } catch (error) {
      console.log(error)
    }
  }

  clearLayout() {
    this.app.clearLayout()
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

  toggleMode() {
    this.userMode = !this.userMode;
    this.app.userMode = this.userMode;
    this.app.roomEdit = !this.userMode;
    this.loadJSON()
  }

  disableLayout() {
    this.app.disableSeletion();
  }

  displayLayout(item) {
    if (!this.userMode) { return }
    if (item) {
      if (item.id) {
        this.app.disableSeletion();
        // this.currentLayout = item;
      }
    }
  }

  // refreshCurrentList() {
  //   //use the same feature as the current order refresh.
  //   if (!this.userMode) { return }
  //   if (this.currentLayout) {

  //   }
  // }

  refreshObservable(item$: Observable<any>) {
    if (!this.userMode) { return }
    item$.pipe(
      repeatWhen(x => x.pipe(delay(3500)))).subscribe(data => {
      // this.orderService.updateOrderSubscription(data)

    })
  }

}

// _jsonValue : Subscription;
// jsonValue  : string;
