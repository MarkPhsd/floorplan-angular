import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/button";
import * as i2 from "@fortawesome/angular-fontawesome";
import * as i3 from "@angular/flex-layout/flex";
import * as i4 from "@angular/material/tooltip";
export class ZoomComponent {
    constructor() {
        this.zoom = 100;
        this.zoomChange = new EventEmitter();
        // icons
        this.faMinus = faMinus;
        this.faPlus = faPlus;
    }
    ngOnInit() {
    }
    zoomIn() {
        if (this.zoom >= 150) {
            return;
        }
        this.zoom += 5;
        this.zoomChange.emit(this.zoom);
    }
    zoomOut() {
        if (this.zoom <= 20) {
            return;
        }
        this.zoom -= 5;
        this.zoomChange.emit(this.zoom);
    }
}
ZoomComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: ZoomComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ZoomComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.4", type: ZoomComponent, selector: "app-zoom", inputs: { zoom: "zoom" }, outputs: { zoomChange: "zoomChange" }, ngImport: i0, template: "<div fxLayout fxLayoutAlign=\"center center\" class=\"zoom-widget\">\r\n  <button mat-icon-button matTooltip=\"Zoom Out\" (click)=\"zoomOut()\">\r\n    <fa-icon [icon]=\"faMinus\"></fa-icon>\r\n  </button>\r\n  <span style=\"padding: 0 10px; font-size: 16px\">{{ zoom }}%</span>\r\n  <button mat-icon-button matTooltip=\"Zoom In\" (click)=\"zoomIn()\">\r\n    <fa-icon [icon]=\"faPlus\"></fa-icon>\r\n  </button>\r\n</div>\r\n", styles: [".zoom-widget{border:1px solid #ddd;border-radius:8px}.zoom-widget fa-icon{font-size:9px}.zoom-widget button{line-height:30px}\n"], components: [{ type: i1.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { type: i2.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }], directives: [{ type: i3.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { type: i3.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }, { type: i4.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: ZoomComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-zoom', template: "<div fxLayout fxLayoutAlign=\"center center\" class=\"zoom-widget\">\r\n  <button mat-icon-button matTooltip=\"Zoom Out\" (click)=\"zoomOut()\">\r\n    <fa-icon [icon]=\"faMinus\"></fa-icon>\r\n  </button>\r\n  <span style=\"padding: 0 10px; font-size: 16px\">{{ zoom }}%</span>\r\n  <button mat-icon-button matTooltip=\"Zoom In\" (click)=\"zoomIn()\">\r\n    <fa-icon [icon]=\"faPlus\"></fa-icon>\r\n  </button>\r\n</div>\r\n", styles: [".zoom-widget{border:1px solid #ddd;border-radius:8px}.zoom-widget fa-icon{font-size:9px}.zoom-widget button{line-height:30px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { zoom: [{
                type: Input
            }], zoomChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3NoYXJlZC9jb21wb25lbnRzL3pvb20vem9vbS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3NoYXJlZC9jb21wb25lbnRzL3pvb20vem9vbS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7Ozs7OztBQU9wRSxNQUFNLE9BQU8sYUFBYTtJQVl4QjtRQVRBLFNBQUksR0FBRyxHQUFHLENBQUM7UUFHWCxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVoQyxRQUFRO1FBQ1IsWUFBTyxHQUFHLE9BQU8sQ0FBQztRQUNsQixXQUFNLEdBQUcsTUFBTSxDQUFDO0lBRUEsQ0FBQztJQUVqQixRQUFRO0lBQ1IsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFO1lBQ3BCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRTtZQUNuQixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDOzswR0EvQlUsYUFBYTs4RkFBYixhQUFhLGlIQ1IxQiw0YUFTQTsyRkREYSxhQUFhO2tCQUx6QixTQUFTOytCQUNFLFVBQVU7MEVBT3BCLElBQUk7c0JBREgsS0FBSztnQkFJTixVQUFVO3NCQURULE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGZhTWludXMsIGZhUGx1cyB9IGZyb20gJ0Bmb3J0YXdlc29tZS9mcmVlLXNvbGlkLXN2Zy1pY29ucyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC16b29tJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vem9vbS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vem9vbS5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBab29tQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgQElucHV0KClcclxuICB6b29tID0gMTAwO1xyXG5cclxuICBAT3V0cHV0KClcclxuICB6b29tQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvLyBpY29uc1xyXG4gIGZhTWludXMgPSBmYU1pbnVzO1xyXG4gIGZhUGx1cyA9IGZhUGx1cztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICB6b29tSW4oKSB7XHJcbiAgICBpZiAodGhpcy56b29tID49IDE1MCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnpvb20gKz0gNTtcclxuICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbSk7XHJcbiAgfVxyXG5cclxuICB6b29tT3V0KCkge1xyXG4gICAgaWYgKHRoaXMuem9vbSA8PSAyMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnpvb20gLT0gNTtcclxuICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCI8ZGl2IGZ4TGF5b3V0IGZ4TGF5b3V0QWxpZ249XCJjZW50ZXIgY2VudGVyXCIgY2xhc3M9XCJ6b29tLXdpZGdldFwiPlxyXG4gIDxidXR0b24gbWF0LWljb24tYnV0dG9uIG1hdFRvb2x0aXA9XCJab29tIE91dFwiIChjbGljayk9XCJ6b29tT3V0KClcIj5cclxuICAgIDxmYS1pY29uIFtpY29uXT1cImZhTWludXNcIj48L2ZhLWljb24+XHJcbiAgPC9idXR0b24+XHJcbiAgPHNwYW4gc3R5bGU9XCJwYWRkaW5nOiAwIDEwcHg7IGZvbnQtc2l6ZTogMTZweFwiPnt7IHpvb20gfX0lPC9zcGFuPlxyXG4gIDxidXR0b24gbWF0LWljb24tYnV0dG9uIG1hdFRvb2x0aXA9XCJab29tIEluXCIgKGNsaWNrKT1cInpvb21JbigpXCI+XHJcbiAgICA8ZmEtaWNvbiBbaWNvbl09XCJmYVBsdXNcIj48L2ZhLWljb24+XHJcbiAgPC9idXR0b24+XHJcbjwvZGl2PlxyXG4iXX0=