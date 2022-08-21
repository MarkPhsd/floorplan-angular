import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  orderID   = ''
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

  setSelectedObjectColor: Subject<any> = new Subject<any>();
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
  }

  endEditRoom() {
    this.roomEdit = false;
    this.roomEdition.next(false);
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

  setOrder(orderID) {
    if (!this.selections.length) { return; }
    this.orderID = orderID;
    this.performOperation.next('setOrderID');
  }

  delete() {
    if (!this.selections.length) { return; }
    this.performOperation.next('DELETE');
  }

  disableSeletion() {
    this.performOperation.next('disableSeletion');
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

  alterObjectColor(name: string, color: string, obj: any, view: any) {
    let json
    if (view) {
      json = view.toJSON(['name']);
      if (json.objects) {
        if (json.objects.length > 0) {
          json.objects.forEach(data => {
            console.log('alterObjectColor data?.backgroundColor', data?.backgroundColor)
            if (data?.name === name) {
              if (data?.backgroundColor === 'purple' || data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                data.backgroundColor = color;
                data.borderColor =  color
                data.stroke = color
                data.strokeWidth = 10
                // console.log('item color changed 1', data?.backgroundColor)
              }
              if (data?.backgroundColor === 'purple' || data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                data.backgroundColor = color;
                data.borderColor =  color
                data.stroke = color
                data.strokeWidth = 10
                // console.log('item color changed 1', data?.backgroundColor)
              }

              this.alterColor('red', data)
            }
          })
        }
      }

    }

    if (view && json) {
      console.log('loading json')
    }

    return json ;
  }


  // borderColor: 'purple',
  // backgroundColor: 'purple',
  // stroke: 'purple',
  // strokeWidth: 10,
  // fill: 'purple'
  setObjectColor(name: string, color: string, obj: any, view: any) {
    let json
    if (view) {
      // json = view.toJSON(['name']);
      this.alterColor(color, obj);

      if (obj.objects) {
        if (obj.objects.length > 0) {
            obj.objects.forEach(data => {
            console.log('alterObjectColor data?.backgroundColor', data?.backgroundColor)
            if (data?.name === name) {
              if (data?.backgroundColor === 'purple' || data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                data.backgroundColor = color;
                data.borderColor =  color
                data.stroke = color
                data.strokeWidth = 10
                // console.log('item color changed 1', data?.backgroundColor)
              }
              if (data?.backgroundColor === 'purple' || data?.backgroundColor === 'rgba(255,100,171,0.25)') {
                data.backgroundColor = color;
                data.borderColor =  color
                data.stroke = color
                data.strokeWidth = 10
                // console.log('item color changed 1', data?.backgroundColor)
              }
              this.alterColor('red', data)
            }
          })
        }
      }

    }

    if (view && obj) {
      console.log('loading json')
    }

    return obj ;
  }

  alterColor(color, obj) {

    // console.log('obj', obj, obj.length)
    // if (obj?.backgroundColor === 'purple' || obj?.backgroundColor === 'rgba(255,100,171,0.25)') {
      // obj.backgroundColor = color;
      obj.borderColor =  color
      obj.stroke = color
      obj.strokeWidth = 3
      // console.log('item color changed 2', obj.backgroundColor)
    // }

    if (obj.objects && obj.objects.length > 0 ) {
      obj.objects.forEach(item => {
        this.alterColor(color, item)
      })
    }
    return obj
  }

}
