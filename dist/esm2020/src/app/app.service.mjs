import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class AppService {
    constructor() {
        this.orderID = '';
        this.roomEdit = false;
        this.states = [];
        this.redoStates = [];
        this.roomEditOperate = 'CORNER';
        this.roomEditStates = [];
        this.roomEditRedoStates = [];
        this.selections = [];
        this.ungroupable = false;
        this.setSelectedObjectColor = new Subject();
        this.performOperation = new Subject();
        this.insertObject = new Subject();
        this.defaultChair = new Subject();
        this.jsonValue = new Subject();
        this.roomEdition = new Subject();
        this.saveState = new Subject();
        this.zoom = 100;
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
    setObjectFillColor(color) {
        this.setSelectedObjectColor.next(color);
    }
    paste() {
        this.performOperation.next('PASTE');
    }
    setOrder(orderID) {
        if (!this.selections.length) {
            return;
        }
        this.orderID = orderID;
        this.performOperation.next('setOrderID');
    }
    delete() {
        if (!this.selections.length) {
            return;
        }
        this.performOperation.next('DELETE');
    }
    disableSeletion() {
        this.performOperation.next('disableSeletion');
    }
    loadJson(value) {
        this.jsonValue.next(value);
    }
    clearLayout() {
        this.jsonValue.next(null);
        this.performOperation.next('clearLayout');
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
    // borderColor: 'purple',
    // backgroundColor: 'purple',
    // stroke: 'purple',
    // strokeWidth: 10,
    // fill: 'purple'
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
AppService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: AppService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AppService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: AppService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: AppService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2FwcC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBbUIsTUFBTSxNQUFNLENBQUM7O0FBS2hELE1BQU0sT0FBTyxVQUFVO0lBMkJyQjtRQXpCQSxZQUFPLEdBQUssRUFBRSxDQUFBO1FBQ2QsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUdqQixXQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ1osZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUVoQixvQkFBZSxHQUFHLFFBQVEsQ0FBQztRQUMzQixtQkFBYyxHQUFHLEVBQUUsQ0FBQztRQUNwQix1QkFBa0IsR0FBRyxFQUFFLENBQUM7UUFFeEIsZUFBVSxHQUFVLEVBQUUsQ0FBQztRQUd2QixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUVwQiwyQkFBc0IsR0FBaUIsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUMxRCxxQkFBZ0IsR0FBaUIsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUNwRCxpQkFBWSxHQUFpQixJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ2hELGlCQUFZLEdBQWlCLElBQUksT0FBTyxFQUFPLENBQUM7UUFDaEQsY0FBUyxHQUF3QixJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ3BELGdCQUFXLEdBQXNCLElBQUksT0FBTyxFQUFXLENBQUM7UUFDeEQsY0FBUyxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFDL0IsU0FBSSxHQUFHLEdBQUcsQ0FBQztRQUdULElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7Z0JBQzdCLE9BQU87YUFDUjtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdkcsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0csT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSztRQUNsQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLElBQUksT0FBTyxFQUFFO1lBQ1gsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRCxjQUFjO0lBQ2Qsa0JBQWtCLENBQUMsS0FBYTtRQUM5QixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsUUFBUSxDQUFDLE9BQU87UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUFFLE9BQU87U0FBRTtRQUN4QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxRQUFRLENBQUMsS0FBYTtRQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVELG1CQUFtQjtRQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxhQUFhLENBQUMsU0FBUztRQUNyQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBSTtRQUNWLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFO1lBQ3BCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFO1lBQ25CLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELGdCQUFnQixDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsR0FBUSxFQUFFLElBQVM7UUFDL0QsSUFBSSxJQUFJLENBQUE7UUFDUixJQUFJLElBQUksRUFBRTtZQUNSLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUE7d0JBQzVFLElBQUksSUFBSSxFQUFFLElBQUksS0FBSyxJQUFJLEVBQUU7NEJBQ3ZCLElBQUksSUFBSSxFQUFFLGVBQWUsS0FBSyxRQUFRLElBQUksSUFBSSxFQUFFLGVBQWUsS0FBSyx3QkFBd0IsRUFBRTtnQ0FDNUYsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7Z0NBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUksS0FBSyxDQUFBO2dDQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtnQ0FDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUE7Z0NBQ3JCLDZEQUE2RDs2QkFDOUQ7NEJBQ0QsSUFBSSxJQUFJLEVBQUUsZUFBZSxLQUFLLFFBQVEsSUFBSSxJQUFJLEVBQUUsZUFBZSxLQUFLLHdCQUF3QixFQUFFO2dDQUM1RixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztnQ0FDN0IsSUFBSSxDQUFDLFdBQVcsR0FBSSxLQUFLLENBQUE7Z0NBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO2dDQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQTtnQ0FDckIsNkRBQTZEOzZCQUM5RDs0QkFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTt5QkFDN0I7b0JBQ0gsQ0FBQyxDQUFDLENBQUE7aUJBQ0g7YUFDRjtTQUVGO1FBRUQsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7U0FDNUI7UUFFRCxPQUFPLElBQUksQ0FBRTtJQUNmLENBQUM7SUFHRCx5QkFBeUI7SUFDekIsNkJBQTZCO0lBQzdCLG9CQUFvQjtJQUNwQixtQkFBbUI7SUFDbkIsaUJBQWlCO0lBQ2pCLGNBQWMsQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLEdBQVEsRUFBRSxJQUFTO1FBQzdELElBQUksSUFBSSxDQUFBO1FBQ1IsSUFBSSxJQUFJLEVBQUU7WUFDUixnQ0FBZ0M7WUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFNUIsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO2dCQUNmLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUN4QixHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUE7d0JBQzVFLElBQUksSUFBSSxFQUFFLElBQUksS0FBSyxJQUFJLEVBQUU7NEJBQ3ZCLElBQUksSUFBSSxFQUFFLGVBQWUsS0FBSyxRQUFRLElBQUksSUFBSSxFQUFFLGVBQWUsS0FBSyx3QkFBd0IsRUFBRTtnQ0FDNUYsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7Z0NBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUksS0FBSyxDQUFBO2dDQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtnQ0FDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUE7Z0NBQ3JCLDZEQUE2RDs2QkFDOUQ7NEJBQ0QsSUFBSSxJQUFJLEVBQUUsZUFBZSxLQUFLLFFBQVEsSUFBSSxJQUFJLEVBQUUsZUFBZSxLQUFLLHdCQUF3QixFQUFFO2dDQUM1RixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztnQ0FDN0IsSUFBSSxDQUFDLFdBQVcsR0FBSSxLQUFLLENBQUE7Z0NBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO2dDQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQTtnQ0FDckIsNkRBQTZEOzZCQUM5RDs0QkFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTt5QkFDN0I7b0JBQ0gsQ0FBQyxDQUFDLENBQUE7aUJBQ0g7YUFDRjtTQUVGO1FBRUQsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtTQUM1QjtRQUVELE9BQU8sR0FBRyxDQUFFO0lBQ2QsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUVuQixzQ0FBc0M7UUFDdEMsZ0dBQWdHO1FBQzlGLCtCQUErQjtRQUMvQixHQUFHLENBQUMsV0FBVyxHQUFJLEtBQUssQ0FBQTtRQUN4QixHQUFHLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtRQUNsQixHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQTtRQUNuQiwyREFBMkQ7UUFDN0QsSUFBSTtRQUVKLElBQUksR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUc7WUFDMUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBQzlCLENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7O3VHQXpQVSxVQUFVOzJHQUFWLFVBQVUsY0FGVCxNQUFNOzJGQUVQLFVBQVU7a0JBSHRCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcFNlcnZpY2Uge1xyXG5cclxuICBvcmRlcklEICAgPSAnJ1xyXG4gIHJvb21FZGl0ID0gZmFsc2U7XHJcbiAgdXNlck1vZGUgOiBib29sZWFuO1xyXG5cclxuICBzdGF0ZXMgPSBbXTtcclxuICByZWRvU3RhdGVzID0gW107XHJcblxyXG4gIHJvb21FZGl0T3BlcmF0ZSA9ICdDT1JORVInO1xyXG4gIHJvb21FZGl0U3RhdGVzID0gW107XHJcbiAgcm9vbUVkaXRSZWRvU3RhdGVzID0gW107XHJcblxyXG4gIHNlbGVjdGlvbnM6IGFueVtdID0gW107XHJcbiAgY29waWVkOiBhbnk7XHJcblxyXG4gIHVuZ3JvdXBhYmxlID0gZmFsc2U7XHJcblxyXG4gIHNldFNlbGVjdGVkT2JqZWN0Q29sb3I6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuICBwZXJmb3JtT3BlcmF0aW9uOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgaW5zZXJ0T2JqZWN0OiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgZGVmYXVsdENoYWlyOiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAganNvblZhbHVlOiBTdWJqZWN0PGFueT4gICAgICAgID0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gIHJvb21FZGl0aW9uOiBTdWJqZWN0PGJvb2xlYW4+ICA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XHJcbiAgc2F2ZVN0YXRlID0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gIHpvb20gPSAxMDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5zYXZlU3RhdGUuc3Vic2NyaWJlKHJlcyA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnJvb21FZGl0KSB7XHJcbiAgICAgICAgdGhpcy5yb29tRWRpdFN0YXRlcy5wdXNoKHJlcyk7XHJcbiAgICAgICAgdGhpcy5yb29tRWRpdFJlZG9TdGF0ZXMgPSBbXTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zdGF0ZXMucHVzaChyZXMpO1xyXG4gICAgICB0aGlzLnJlZG9TdGF0ZXMgPSBbXTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZWRpdFJvb20oKSB7XHJcbiAgICB0aGlzLnJvb21FZGl0ID0gdHJ1ZTtcclxuICAgIHRoaXMucm9vbUVkaXRpb24ubmV4dCh0cnVlKTtcclxuICB9XHJcblxyXG4gIGVuZEVkaXRSb29tKCkge1xyXG4gICAgdGhpcy5yb29tRWRpdCA9IGZhbHNlO1xyXG4gICAgdGhpcy5yb29tRWRpdGlvbi5uZXh0KGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHVuZG8oKSB7XHJcbiAgICBpZiAoKHRoaXMuc3RhdGVzLmxlbmd0aCA9PT0gMSAmJiAhdGhpcy5yb29tRWRpdCkgfHwgKHRoaXMucm9vbUVkaXRTdGF0ZXMubGVuZ3RoID09PSAxICYmIHRoaXMucm9vbUVkaXQpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5uZXh0KCdVTkRPJyk7XHJcbiAgfVxyXG5cclxuICByZWRvKCkge1xyXG4gICAgaWYgKCh0aGlzLnJlZG9TdGF0ZXMubGVuZ3RoID09PSAwICYmICF0aGlzLnJvb21FZGl0KSB8fCAodGhpcy5yb29tRWRpdFJlZG9TdGF0ZXMubGVuZ3RoID09PSAwICYmIHRoaXMucm9vbUVkaXQpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5uZXh0KCdSRURPJyk7XHJcbiAgfVxyXG5cclxuICBjbG9uZSgpIHtcclxuICAgIHRoaXMuY29weSh0cnVlKTtcclxuICB9XHJcblxyXG4gIGNvcHkoZG9DbG9uZSA9IGZhbHNlKSB7XHJcbiAgICB0aGlzLnBlcmZvcm1PcGVyYXRpb24ubmV4dCgnQ09QWScpO1xyXG4gICAgaWYgKGRvQ2xvbmUpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnBhc3RlKCksIDEwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL3NldEZpbGxDb2xvclxyXG4gIHNldE9iamVjdEZpbGxDb2xvcihjb2xvcjogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNldFNlbGVjdGVkT2JqZWN0Q29sb3IubmV4dChjb2xvcik7XHJcbiAgfVxyXG5cclxuICBwYXN0ZSgpIHtcclxuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5uZXh0KCdQQVNURScpO1xyXG4gIH1cclxuXHJcbiAgc2V0T3JkZXIob3JkZXJJRCkge1xyXG4gICAgaWYgKCF0aGlzLnNlbGVjdGlvbnMubGVuZ3RoKSB7IHJldHVybjsgfVxyXG4gICAgdGhpcy5vcmRlcklEID0gb3JkZXJJRDtcclxuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5uZXh0KCdzZXRPcmRlcklEJyk7XHJcbiAgfVxyXG5cclxuICBkZWxldGUoKSB7XHJcbiAgICBpZiAoIXRoaXMuc2VsZWN0aW9ucy5sZW5ndGgpIHsgcmV0dXJuOyB9XHJcbiAgICB0aGlzLnBlcmZvcm1PcGVyYXRpb24ubmV4dCgnREVMRVRFJyk7XHJcbiAgfVxyXG5cclxuICBkaXNhYmxlU2VsZXRpb24oKSB7XHJcbiAgICB0aGlzLnBlcmZvcm1PcGVyYXRpb24ubmV4dCgnZGlzYWJsZVNlbGV0aW9uJyk7XHJcbiAgfVxyXG5cclxuICBsb2FkSnNvbih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmpzb25WYWx1ZS5uZXh0KHZhbHVlKTtcclxuICB9XHJcblxyXG4gIGNsZWFyTGF5b3V0KCkge1xyXG4gICAgdGhpcy5qc29uVmFsdWUubmV4dChudWxsKTtcclxuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5uZXh0KCdjbGVhckxheW91dCcpXHJcbiAgfVxyXG5cclxuICByb3RhdGVBbnRpQ2xvY2tXaXNlKCkge1xyXG4gICAgdGhpcy5wZXJmb3JtT3BlcmF0aW9uLm5leHQoJ1JPVEFURV9BTlRJJyk7XHJcbiAgfVxyXG5cclxuICByb3RhdGVDbG9ja1dpc2UoKSB7XHJcbiAgICB0aGlzLnBlcmZvcm1PcGVyYXRpb24ubmV4dCgnUk9UQVRFJyk7XHJcbiAgfVxyXG5cclxuICBncm91cCgpIHtcclxuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5uZXh0KCdHUk9VUCcpO1xyXG4gIH1cclxuXHJcbiAgdW5ncm91cCgpIHtcclxuICAgIHRoaXMucGVyZm9ybU9wZXJhdGlvbi5uZXh0KCdVTkdST1VQJyk7XHJcbiAgfVxyXG5cclxuICBwbGFjZUluQ2VudGVyKGRpcmVjdGlvbikge1xyXG4gICAgdGhpcy5wZXJmb3JtT3BlcmF0aW9uLm5leHQoZGlyZWN0aW9uKTtcclxuICB9XHJcblxyXG4gIGFycmFuZ2Uoc2lkZSkge1xyXG4gICAgdGhpcy5wZXJmb3JtT3BlcmF0aW9uLm5leHQoc2lkZSk7XHJcbiAgfVxyXG5cclxuICB6b29tSW4oKSB7XHJcbiAgICBpZiAodGhpcy56b29tID49IDE1MCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnpvb20gKz0gMTA7XHJcbiAgICB0aGlzLnBlcmZvcm1PcGVyYXRpb24ubmV4dCgnWk9PTScpO1xyXG4gIH1cclxuXHJcbiAgem9vbU91dCgpIHtcclxuICAgIGlmICh0aGlzLnpvb20gPD0gMjApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy56b29tIC09IDEwO1xyXG4gICAgdGhpcy5wZXJmb3JtT3BlcmF0aW9uLm5leHQoJ1pPT00nKTtcclxuICB9XHJcblxyXG4gIGFsdGVyT2JqZWN0Q29sb3IobmFtZTogc3RyaW5nLCBjb2xvcjogc3RyaW5nLCBvYmo6IGFueSwgdmlldzogYW55KSB7XHJcbiAgICBsZXQganNvblxyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAganNvbiA9IHZpZXcudG9KU09OKFsnbmFtZSddKTtcclxuICAgICAgaWYgKGpzb24ub2JqZWN0cykge1xyXG4gICAgICAgIGlmIChqc29uLm9iamVjdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAganNvbi5vYmplY3RzLmZvckVhY2goZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhbHRlck9iamVjdENvbG9yIGRhdGE/LmJhY2tncm91bmRDb2xvcicsIGRhdGE/LmJhY2tncm91bmRDb2xvcilcclxuICAgICAgICAgICAgaWYgKGRhdGE/Lm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YT8uYmFja2dyb3VuZENvbG9yID09PSAncHVycGxlJyB8fCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdyZ2JhKDI1NSwxMDAsMTcxLDAuMjUpJykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgIGRhdGEuYm9yZGVyQ29sb3IgPSAgY29sb3JcclxuICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlID0gY29sb3JcclxuICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlV2lkdGggPSAxMFxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW0gY29sb3IgY2hhbmdlZCAxJywgZGF0YT8uYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAoZGF0YT8uYmFja2dyb3VuZENvbG9yID09PSAncHVycGxlJyB8fCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdyZ2JhKDI1NSwxMDAsMTcxLDAuMjUpJykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgIGRhdGEuYm9yZGVyQ29sb3IgPSAgY29sb3JcclxuICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlID0gY29sb3JcclxuICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlV2lkdGggPSAxMFxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW0gY29sb3IgY2hhbmdlZCAxJywgZGF0YT8uYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5hbHRlckNvbG9yKCdyZWQnLCBkYXRhKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpZiAodmlldyAmJiBqc29uKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdsb2FkaW5nIGpzb24nKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBqc29uIDtcclxuICB9XHJcblxyXG5cclxuICAvLyBib3JkZXJDb2xvcjogJ3B1cnBsZScsXHJcbiAgLy8gYmFja2dyb3VuZENvbG9yOiAncHVycGxlJyxcclxuICAvLyBzdHJva2U6ICdwdXJwbGUnLFxyXG4gIC8vIHN0cm9rZVdpZHRoOiAxMCxcclxuICAvLyBmaWxsOiAncHVycGxlJ1xyXG4gIHNldE9iamVjdENvbG9yKG5hbWU6IHN0cmluZywgY29sb3I6IHN0cmluZywgb2JqOiBhbnksIHZpZXc6IGFueSkge1xyXG4gICAgbGV0IGpzb25cclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIC8vIGpzb24gPSB2aWV3LnRvSlNPTihbJ25hbWUnXSk7XHJcbiAgICAgIHRoaXMuYWx0ZXJDb2xvcihjb2xvciwgb2JqKTtcclxuXHJcbiAgICAgIGlmIChvYmoub2JqZWN0cykge1xyXG4gICAgICAgIGlmIChvYmoub2JqZWN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIG9iai5vYmplY3RzLmZvckVhY2goZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhbHRlck9iamVjdENvbG9yIGRhdGE/LmJhY2tncm91bmRDb2xvcicsIGRhdGE/LmJhY2tncm91bmRDb2xvcilcclxuICAgICAgICAgICAgaWYgKGRhdGE/Lm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YT8uYmFja2dyb3VuZENvbG9yID09PSAncHVycGxlJyB8fCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdyZ2JhKDI1NSwxMDAsMTcxLDAuMjUpJykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgIGRhdGEuYm9yZGVyQ29sb3IgPSAgY29sb3JcclxuICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlID0gY29sb3JcclxuICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlV2lkdGggPSAxMFxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW0gY29sb3IgY2hhbmdlZCAxJywgZGF0YT8uYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAoZGF0YT8uYmFja2dyb3VuZENvbG9yID09PSAncHVycGxlJyB8fCBkYXRhPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdyZ2JhKDI1NSwxMDAsMTcxLDAuMjUpJykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5iYWNrZ3JvdW5kQ29sb3IgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgIGRhdGEuYm9yZGVyQ29sb3IgPSAgY29sb3JcclxuICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlID0gY29sb3JcclxuICAgICAgICAgICAgICAgIGRhdGEuc3Ryb2tlV2lkdGggPSAxMFxyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW0gY29sb3IgY2hhbmdlZCAxJywgZGF0YT8uYmFja2dyb3VuZENvbG9yKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB0aGlzLmFsdGVyQ29sb3IoJ3JlZCcsIGRhdGEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGlmICh2aWV3ICYmIG9iaikge1xyXG4gICAgICBjb25zb2xlLmxvZygnbG9hZGluZyBqc29uJylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb2JqIDtcclxuICB9XHJcblxyXG4gIGFsdGVyQ29sb3IoY29sb3IsIG9iaikge1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCdvYmonLCBvYmosIG9iai5sZW5ndGgpXHJcbiAgICAvLyBpZiAob2JqPy5iYWNrZ3JvdW5kQ29sb3IgPT09ICdwdXJwbGUnIHx8IG9iaj8uYmFja2dyb3VuZENvbG9yID09PSAncmdiYSgyNTUsMTAwLDE3MSwwLjI1KScpIHtcclxuICAgICAgLy8gb2JqLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xyXG4gICAgICBvYmouYm9yZGVyQ29sb3IgPSAgY29sb3JcclxuICAgICAgb2JqLnN0cm9rZSA9IGNvbG9yXHJcbiAgICAgIG9iai5zdHJva2VXaWR0aCA9IDNcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW0gY29sb3IgY2hhbmdlZCAyJywgb2JqLmJhY2tncm91bmRDb2xvcilcclxuICAgIC8vIH1cclxuXHJcbiAgICBpZiAob2JqLm9iamVjdHMgJiYgb2JqLm9iamVjdHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgb2JqLm9iamVjdHMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICB0aGlzLmFsdGVyQ29sb3IoY29sb3IsIGl0ZW0pXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=