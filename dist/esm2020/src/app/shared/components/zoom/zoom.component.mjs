import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/button";
import * as i2 from "@angular/material/icon";
import * as i3 from "@angular/material/tooltip";
// import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
export class ZoomComponent {
    // icons
    // faMinus = faMinus;
    // faPlus = faPlus;
    constructor() {
        this.zoom = 100;
        this.zoomChange = new EventEmitter();
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
ZoomComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: ZoomComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ZoomComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: ZoomComponent, selector: "app-zoom", inputs: { zoom: "zoom" }, outputs: { zoomChange: "zoomChange" }, ngImport: i0, template: "<div fxLayout fxLayoutAlign=\"center center\" class=\"zoom-widget\">\r\n  <button mat-icon-button matTooltip=\"Zoom Out\" (click)=\"zoomOut()\">\r\n    <mat-icon>remove</mat-icon>\r\n  </button>\r\n  <span style=\"padding: 0 10px; font-size: 16px\">{{ zoom }}%</span>\r\n  <button mat-icon-button matTooltip=\"Zoom In\" (click)=\"zoomIn()\">\r\n    <mat-icon>add</mat-icon>\r\n  </button>\r\n</div>\r\n", styles: [".zoom-widget{border:1px solid #ddd;border-radius:8px}.zoom-widget fa-icon{font-size:9px}.zoom-widget button{line-height:30px}\n"], components: [{ type: i1.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }], directives: [{ type: i3.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: ZoomComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-zoom', template: "<div fxLayout fxLayoutAlign=\"center center\" class=\"zoom-widget\">\r\n  <button mat-icon-button matTooltip=\"Zoom Out\" (click)=\"zoomOut()\">\r\n    <mat-icon>remove</mat-icon>\r\n  </button>\r\n  <span style=\"padding: 0 10px; font-size: 16px\">{{ zoom }}%</span>\r\n  <button mat-icon-button matTooltip=\"Zoom In\" (click)=\"zoomIn()\">\r\n    <mat-icon>add</mat-icon>\r\n  </button>\r\n</div>\r\n", styles: [".zoom-widget{border:1px solid #ddd;border-radius:8px}.zoom-widget fa-icon{font-size:9px}.zoom-widget button{line-height:30px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { zoom: [{
                type: Input
            }], zoomChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3NoYXJlZC9jb21wb25lbnRzL3pvb20vem9vbS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3NoYXJlZC9jb21wb25lbnRzL3pvb20vem9vbS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQUMvRSx1RUFBdUU7QUFPdkUsTUFBTSxPQUFPLGFBQWE7SUFReEIsUUFBUTtJQUNSLHFCQUFxQjtJQUNyQixtQkFBbUI7SUFFbkI7UUFUQSxTQUFJLEdBQUcsR0FBRyxDQUFDO1FBR1gsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFNaEIsQ0FBQztJQUVqQixRQUFRO0lBQ1IsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFO1lBQ3BCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRTtZQUNuQixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDOzsyR0EvQlUsYUFBYTsrRkFBYixhQUFhLGlIQ1IxQixvWkFTQTs0RkREYSxhQUFhO2tCQUx6QixTQUFTOytCQUNFLFVBQVU7MEVBT3BCLElBQUk7c0JBREgsS0FBSztnQkFJTixVQUFVO3NCQURULE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbi8vIGltcG9ydCB7IGZhTWludXMsIGZhUGx1cyB9IGZyb20gJ0Bmb3J0YXdlc29tZS9mcmVlLXNvbGlkLXN2Zy1pY29ucyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC16b29tJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vem9vbS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vem9vbS5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBab29tQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgQElucHV0KClcclxuICB6b29tID0gMTAwO1xyXG5cclxuICBAT3V0cHV0KClcclxuICB6b29tQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvLyBpY29uc1xyXG4gIC8vIGZhTWludXMgPSBmYU1pbnVzO1xyXG4gIC8vIGZhUGx1cyA9IGZhUGx1cztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICB6b29tSW4oKSB7XHJcbiAgICBpZiAodGhpcy56b29tID49IDE1MCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnpvb20gKz0gNTtcclxuICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbSk7XHJcbiAgfVxyXG5cclxuICB6b29tT3V0KCkge1xyXG4gICAgaWYgKHRoaXMuem9vbSA8PSAyMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnpvb20gLT0gNTtcclxuICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCI8ZGl2IGZ4TGF5b3V0IGZ4TGF5b3V0QWxpZ249XCJjZW50ZXIgY2VudGVyXCIgY2xhc3M9XCJ6b29tLXdpZGdldFwiPlxyXG4gIDxidXR0b24gbWF0LWljb24tYnV0dG9uIG1hdFRvb2x0aXA9XCJab29tIE91dFwiIChjbGljayk9XCJ6b29tT3V0KClcIj5cclxuICAgIDxtYXQtaWNvbj5yZW1vdmU8L21hdC1pY29uPlxyXG4gIDwvYnV0dG9uPlxyXG4gIDxzcGFuIHN0eWxlPVwicGFkZGluZzogMCAxMHB4OyBmb250LXNpemU6IDE2cHhcIj57eyB6b29tIH19JTwvc3Bhbj5cclxuICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiBtYXRUb29sdGlwPVwiWm9vbSBJblwiIChjbGljayk9XCJ6b29tSW4oKVwiPlxyXG4gICAgPG1hdC1pY29uPmFkZDwvbWF0LWljb24+XHJcbiAgPC9idXR0b24+XHJcbjwvZGl2PlxyXG4iXX0=