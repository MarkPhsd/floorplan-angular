import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export interface uuidList {
  uuID: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  //if true when table is selected, it's cleared', and submitted back to
  //the appcomponent to be saved.
  clearNextSelectedTable: boolean;

  orderID   = ''
  tableName: string;

  tableStatus: string;
  roomEdit = false;
  userMode : boolean;

  states = [];
  redoStates = [];

  roomEditOperate = 'CORNER';
  roomEditStates = [];
  roomEditRedoStates = [];

  selections: any[] = [];
  copied: any;

  ungroupable = false;
  currenObject : any;
  selectededObject: Subject<any> = new Subject<any>();
  setSelectedObjectColor: Subject<any> = new Subject<any>();
  selectedBackGroundImage: Subject<any> = new Subject<any>();
  performOperation: Subject<any> = new Subject<any>();
  insertObject: Subject<any> = new Subject<any>();
  defaultChair: Subject<any> = new Subject<any>();
  jsonValue: Subject<any>        = new Subject<any>();
  roomEdition: Subject<boolean>  = new Subject<boolean>();
  saveState = new Subject<any>();
  zoom = 100;

  constructor() {
    this.saveState.subscribe(res => {
      if (this.roomEdit) {
        this.roomEditStates.push(res);
        this.roomEditRedoStates = [];
        return;
      }
      this.states.push(res);
      this.redoStates = [];
    });
  }

  editRoom() {
    this.roomEdit = true;
    this.roomEdition.next(true);
    this.performOperation.next('enableSelection');
  }

  endEditRoom() {
    this.roomEdit = false;
    this.roomEdition.next(false);
    this.performOperation.next('disableSelection');
  }

  updateCurrentObjet() {
    this.selectededObject.subscribe(data => {
      this.currenObject = data;
    })
  }

  undo() {
    if ((this.states.length === 1 && !this.roomEdit) || (this.roomEditStates.length === 1 && this.roomEdit)) {
      return;
    }
    this.performOperation.next('UNDO');
  }

  redo() {
    if ((this.redoStates.length === 0 && !this.roomEdit) || (this.roomEditRedoStates.length === 0 && this.roomEdit)) {
      return;
    }
    this.performOperation.next('REDO');
  }

  clone() {
    this.copy(true);
  }

  copy(doClone = false) {
    this.performOperation.next('COPY');
    if (doClone) {
      setTimeout(() => this.paste(), 100);
    }
  }

  //setFillColor
  setObjectFillColor(color: string) {
    this.setSelectedObjectColor.next(color);
  }

  paste() {
    this.performOperation.next('PASTE');
  }

  setOrder(item) {
    if (!this.selections.length) { return; }
    this.orderID = item ;
    this.performOperation.next('setOrderID');
  }

  setTable(tableName) {
    console.log(tableName, this.selections.length)
    if (!this.selections.length) { return; }
    this.performOperation.next('setTableName');
  }

  delete() {
    if (!this.selections.length) { return; }
    this.performOperation.next('DELETE');
  }

  disableSelection() {
    this.performOperation.next('disableSelection');
  }

  loadJson(value: string) {
    this.jsonValue.next(value);
  }

  clearLayout() {
    this.jsonValue.next(null);
    this.performOperation.next('clearLayout')
  }

  rotateAntiClockWise() {
    this.performOperation.next('ROTATE_ANTI');
  }

  rotateClockWise() {
    this.performOperation.next('ROTATE');
  }

  group() {
    this.performOperation.next('GROUP');
  }

  ungroup() {
    this.performOperation.next('UNGROUP');
  }

  placeInCenter(direction) {
    this.performOperation.next(direction);
  }

  arrange(side) {
    this.performOperation.next(side);
  }

  zoomIn() {
    if (this.zoom >= 150) {
      return;
    }
    this.zoom += 10;
    this.performOperation.next('ZOOM');
  }

  zoomOut() {
    if (this.zoom <= 20) {
      return;
    }
    this.zoom -= 10;
    this.performOperation.next('ZOOM');
  }



}
