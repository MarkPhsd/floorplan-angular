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
        // console.log('group add', group)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldmlldy1mdXJuaXR1cmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3ByZXZpZXctZnVybml0dXJlL3ByZXZpZXctZnVybml0dXJlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9wcmV2aWV3LWZ1cm5pdHVyZS9wcmV2aWV3LWZ1cm5pdHVyZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUNoQyxPQUFPLEtBQUssSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUU3QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFHckYsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFPNUIsTUFBTSxPQUFPLHlCQUF5QjtJQVdwQyxZQUFtQixHQUFlO1FBQWYsUUFBRyxHQUFILEdBQUcsQ0FBWTtJQUFJLENBQUM7SUFFdkMsUUFBUTtRQUNOLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BCLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztZQUN2QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2hELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZUFBZTtRQUNiLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQscUJBQXFCLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1FBQ3BDLE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsS0FBSyxDQUFDLElBQUksR0FBRyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDbEMsS0FBSyxDQUFDLEdBQUcsR0FBRyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDbEMsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDekIsS0FBSyxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7UUFDOUIsa0NBQWtDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7O3NIQXZDVSx5QkFBeUI7MEdBQXpCLHlCQUF5QixxSENkdEMsd0RBR0E7MkZEV2EseUJBQXlCO2tCQUxyQyxTQUFTOytCQUNFLDZCQUE2QjtpR0FVdkMsSUFBSTtzQkFESCxLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBmYWJyaWMgfSBmcm9tICdmYWJyaWMnO1xyXG5pbXBvcnQgKiBhcyB1dWlkIGZyb20gJ3V1aWQnO1xyXG5cclxuaW1wb3J0IHsgUkxfUFJFVklFV19IRUlHSFQsIFJMX1BSRVZJRVdfV0lEVEgsIGNyZWF0ZUZ1cm5pdHVyZSB9IGZyb20gJy4uLy4uL2hlbHBlcnMnO1xyXG5pbXBvcnQgeyBBcHBTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYXBwLnNlcnZpY2UnO1xyXG5cclxubGV0IFJMX0RFRkFVTFRfQ0hBSVIgPSBudWxsO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdwb2ludGxlc3MtcHJldmlldy1mdXJuaXR1cmUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9wcmV2aWV3LWZ1cm5pdHVyZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vcHJldmlldy1mdXJuaXR1cmUuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUHJldmlld0Z1cm5pdHVyZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gIGlkOiBhbnk7XHJcbiAgY2FudmFzOiBmYWJyaWMuQ2FudmFzO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHR5cGU6IHN0cmluZztcclxuXHJcbiAgQElucHV0KClcclxuICBmdXJuaXR1cmU6IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGFwcDogQXBwU2VydmljZSkgeyB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5pZCA9IHV1aWQudjQoKTtcclxuICAgIHRoaXMuYXBwLmRlZmF1bHRDaGFpci5zdWJzY3JpYmUocmVzID0+IHtcclxuICAgICAgdGhpcy5jYW52YXMuY2xlYXIoKTtcclxuICAgICAgUkxfREVGQVVMVF9DSEFJUiA9IHJlcztcclxuICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHlwZSwgb2JqZWN0ID0gdGhpcy5mdXJuaXR1cmU7XHJcbiAgICAgIHRoaXMuaGFuZGxlT2JqZWN0SW5zZXJ0aW9uKHt0eXBlLCBvYmplY3R9KTtcclxuICAgICAgdGhpcy5jYW52YXMucmVuZGVyQWxsKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IG5ldyBmYWJyaWMuQ2FudmFzKHRoaXMuaWQpO1xyXG4gICAgY2FudmFzLnNldFdpZHRoKFJMX1BSRVZJRVdfV0lEVEgpO1xyXG4gICAgY2FudmFzLnNldEhlaWdodChSTF9QUkVWSUVXX0hFSUdIVCk7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuICB9XHJcblxyXG4gIGhhbmRsZU9iamVjdEluc2VydGlvbih7IHR5cGUsIG9iamVjdCB9KSB7XHJcbiAgICBjb25zdCBncm91cCA9IGNyZWF0ZUZ1cm5pdHVyZSh0eXBlLCBvYmplY3QsIFJMX0RFRkFVTFRfQ0hBSVIpO1xyXG4gICAgZ3JvdXAubGVmdCA9IFJMX1BSRVZJRVdfV0lEVEggLyAyO1xyXG4gICAgZ3JvdXAudG9wID0gUkxfUFJFVklFV19IRUlHSFQgLyAyO1xyXG4gICAgZ3JvdXAuc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gICAgZ3JvdXAuaG92ZXJDdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZ3JvdXAgYWRkJywgZ3JvdXApXHJcbiAgICB0aGlzLmNhbnZhcy5hZGQoZ3JvdXApO1xyXG4gIH1cclxufVxyXG4iLCI8ZGl2PlxyXG4gIDxjYW52YXMgW2lkXT1cImlkXCI+PC9jYW52YXM+XHJcbjwvZGl2PlxyXG4iXX0=