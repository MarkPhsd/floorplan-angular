import { Component, Input } from '@angular/core';
import { fabric } from 'fabric';
import * as uuid from 'uuid';
import { RL_PREVIEW_HEIGHT, RL_PREVIEW_WIDTH, createFurniture } from '../../helpers';
import * as i0 from "@angular/core";
import * as i1 from "../../app.service";
let RL_DEFAULT_CHAIR = null;
export class PreviewFurnitureComponent {
    constructor(app) {
        this.app = app;
    }
    ngOnInit() {
        this.id = uuid.v4();
        this.app.defaultChair.subscribe(res => {
            this.canvas.clear();
            RL_DEFAULT_CHAIR = res;
            const type = this.type, object = this.furniture;
            this.handleObjectInsertion({ type, object });
            this.canvas.renderAll();
        });
    }
    ngAfterViewInit() {
        const canvas = new fabric.Canvas(this.id);
        canvas.setWidth(RL_PREVIEW_WIDTH);
        canvas.setHeight(RL_PREVIEW_HEIGHT);
        this.canvas = canvas;
    }
    handleObjectInsertion({ type, object }) {
        const group = createFurniture(type, object, RL_DEFAULT_CHAIR);
        group.left = RL_PREVIEW_WIDTH / 2;
        group.top = RL_PREVIEW_HEIGHT / 2;
        group.selectable = false;
        group.hoverCursor = 'pointer';
        console.log('group add', group);
        this.canvas.add(group);
    }
}
PreviewFurnitureComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: PreviewFurnitureComponent, deps: [{ token: i1.AppService }], target: i0.ɵɵFactoryTarget.Component });
PreviewFurnitureComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.4", type: PreviewFurnitureComponent, selector: "pointless-preview-furniture", inputs: { type: "type", furniture: "furniture" }, ngImport: i0, template: "<div>\r\n  <canvas [id]=\"id\"></canvas>\r\n</div>\r\n", styles: ["canvas{border:1px solid #ececec}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: PreviewFurnitureComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pointless-preview-furniture', template: "<div>\r\n  <canvas [id]=\"id\"></canvas>\r\n</div>\r\n", styles: ["canvas{border:1px solid #ececec}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.AppService }]; }, propDecorators: { type: [{
                type: Input
            }], furniture: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldmlldy1mdXJuaXR1cmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3ByZXZpZXctZnVybml0dXJlL3ByZXZpZXctZnVybml0dXJlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9wcmV2aWV3LWZ1cm5pdHVyZS9wcmV2aWV3LWZ1cm5pdHVyZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNoQyxPQUFPLEtBQUssSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUU3QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFHckYsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFPNUIsTUFBTSxPQUFPLHlCQUF5QjtJQVdwQyxZQUFtQixHQUFlO1FBQWYsUUFBRyxHQUFILEdBQUcsQ0FBWTtJQUFJLENBQUM7SUFFdkMsUUFBUTtRQUNOLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BCLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztZQUN2QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2hELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZUFBZTtRQUNiLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQscUJBQXFCLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1FBQ3BDLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsS0FBSyxDQUFDLElBQUksR0FBRyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDbEMsS0FBSyxDQUFDLEdBQUcsR0FBRyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDbEMsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDekIsS0FBSyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7UUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekIsQ0FBQzs7c0hBdkNVLHlCQUF5QjswR0FBekIseUJBQXlCLHFIQ2R0Qyx3REFHQTsyRkRXYSx5QkFBeUI7a0JBTHJDLFNBQVM7K0JBQ0UsNkJBQTZCO2lHQVV2QyxJQUFJO3NCQURILEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGZhYnJpYyB9IGZyb20gJ2ZhYnJpYyc7XHJcbmltcG9ydCAqIGFzIHV1aWQgZnJvbSAndXVpZCc7XHJcblxyXG5pbXBvcnQgeyBSTF9QUkVWSUVXX0hFSUdIVCwgUkxfUFJFVklFV19XSURUSCwgY3JlYXRlRnVybml0dXJlIH0gZnJvbSAnLi4vLi4vaGVscGVycyc7XHJcbmltcG9ydCB7IEFwcFNlcnZpY2UgfSBmcm9tICcuLi8uLi9hcHAuc2VydmljZSc7XHJcblxyXG5sZXQgUkxfREVGQVVMVF9DSEFJUiA9IG51bGw7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3BvaW50bGVzcy1wcmV2aWV3LWZ1cm5pdHVyZScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3ByZXZpZXctZnVybml0dXJlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9wcmV2aWV3LWZ1cm5pdHVyZS5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQcmV2aWV3RnVybml0dXJlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcclxuXHJcbiAgaWQ6IGFueTtcclxuICBjYW52YXM6IGZhYnJpYy5DYW52YXM7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdHlwZTogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGZ1cm5pdHVyZTogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHBTZXJ2aWNlKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmlkID0gdXVpZC52NCgpO1xyXG4gICAgdGhpcy5hcHAuZGVmYXVsdENoYWlyLnN1YnNjcmliZShyZXMgPT4ge1xyXG4gICAgICB0aGlzLmNhbnZhcy5jbGVhcigpO1xyXG4gICAgICBSTF9ERUZBVUxUX0NIQUlSID0gcmVzO1xyXG4gICAgICBjb25zdCB0eXBlID0gdGhpcy50eXBlLCBvYmplY3QgPSB0aGlzLmZ1cm5pdHVyZTtcclxuICAgICAgdGhpcy5oYW5kbGVPYmplY3RJbnNlcnRpb24oe3R5cGUsIG9iamVjdH0pO1xyXG4gICAgICB0aGlzLmNhbnZhcy5yZW5kZXJBbGwoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgY29uc3QgY2FudmFzID0gbmV3IGZhYnJpYy5DYW52YXModGhpcy5pZCk7XHJcbiAgICBjYW52YXMuc2V0V2lkdGgoUkxfUFJFVklFV19XSURUSCk7XHJcbiAgICBjYW52YXMuc2V0SGVpZ2h0KFJMX1BSRVZJRVdfSEVJR0hUKTtcclxuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlT2JqZWN0SW5zZXJ0aW9uKHsgdHlwZSwgb2JqZWN0IH0pIHtcclxuICAgIGNvbnN0IGdyb3VwID0gY3JlYXRlRnVybml0dXJlKHR5cGUsIG9iamVjdCwgUkxfREVGQVVMVF9DSEFJUik7XHJcbiAgICBncm91cC5sZWZ0ID0gUkxfUFJFVklFV19XSURUSCAvIDI7XHJcbiAgICBncm91cC50b3AgPSBSTF9QUkVWSUVXX0hFSUdIVCAvIDI7XHJcbiAgICBncm91cC5zZWxlY3RhYmxlID0gZmFsc2U7XHJcbiAgICBncm91cC5ob3ZlckN1cnNvciA9ICdwb2ludGVyJztcclxuICAgIGNvbnNvbGUubG9nKCdncm91cCBhZGQnLCBncm91cClcclxuICAgIHRoaXMuY2FudmFzLmFkZChncm91cCk7XHJcbiAgfVxyXG59XHJcbiIsIjxkaXY+XHJcbiAgPGNhbnZhcyBbaWRdPVwiaWRcIj48L2NhbnZhcz5cclxuPC9kaXY+XHJcbiJdfQ==