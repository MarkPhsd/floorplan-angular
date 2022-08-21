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
        this.zoom += 10;
        this.zoomChange.emit(this.zoom);
    }
    zoomOut() {
        if (this.zoom <= 20) {
            return;
        }
        this.zoom -= 10;
        this.zoomChange.emit(this.zoom);
    }
}
ZoomComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: ZoomComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ZoomComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.4", type: ZoomComponent, selector: "app-zoom", inputs: { zoom: "zoom" }, outputs: { zoomChange: "zoomChange" }, ngImport: i0, template: "<div fxLayout fxLayoutAlign=\"center center\" class=\"zoom-widget\">\r\n  <button mat-icon-button matTooltip=\"Zoom Out\" (click)=\"zoomOut()\">\r\n    <fa-icon [icon]=\"faMinus\"></fa-icon>\r\n  </button>\r\n  <span style=\"padding: 0 10px; font-size: 16px\">{{ zoom }}%</span>\r\n  <button mat-icon-button matTooltip=\"Zoom In\" (click)=\"zoomIn()\">\r\n    <fa-icon [icon]=\"faPlus\"></fa-icon>\r\n  </button>\r\n</div>\r\n", styles: [".zoom-widget{border:1px solid #ddd;background:white;border-radius:8px}.zoom-widget fa-icon{font-size:9px}.zoom-widget button{line-height:30px}\n"], components: [{ type: i1.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { type: i2.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }], directives: [{ type: i3.DefaultLayoutDirective, selector: "  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],  [fxLayout.gt-md], [fxLayout.gt-lg]", inputs: ["fxLayout", "fxLayout.xs", "fxLayout.sm", "fxLayout.md", "fxLayout.lg", "fxLayout.xl", "fxLayout.lt-sm", "fxLayout.lt-md", "fxLayout.lt-lg", "fxLayout.lt-xl", "fxLayout.gt-xs", "fxLayout.gt-sm", "fxLayout.gt-md", "fxLayout.gt-lg"] }, { type: i3.DefaultLayoutAlignDirective, selector: "  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]", inputs: ["fxLayoutAlign", "fxLayoutAlign.xs", "fxLayoutAlign.sm", "fxLayoutAlign.md", "fxLayoutAlign.lg", "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg"] }, { type: i4.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: ZoomComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-zoom', template: "<div fxLayout fxLayoutAlign=\"center center\" class=\"zoom-widget\">\r\n  <button mat-icon-button matTooltip=\"Zoom Out\" (click)=\"zoomOut()\">\r\n    <fa-icon [icon]=\"faMinus\"></fa-icon>\r\n  </button>\r\n  <span style=\"padding: 0 10px; font-size: 16px\">{{ zoom }}%</span>\r\n  <button mat-icon-button matTooltip=\"Zoom In\" (click)=\"zoomIn()\">\r\n    <fa-icon [icon]=\"faPlus\"></fa-icon>\r\n  </button>\r\n</div>\r\n", styles: [".zoom-widget{border:1px solid #ddd;background:white;border-radius:8px}.zoom-widget fa-icon{font-size:9px}.zoom-widget button{line-height:30px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { zoom: [{
                type: Input
            }], zoomChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3NoYXJlZC9jb21wb25lbnRzL3pvb20vem9vbS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3NoYXJlZC9jb21wb25lbnRzL3pvb20vem9vbS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7Ozs7OztBQU9wRSxNQUFNLE9BQU8sYUFBYTtJQVl4QjtRQVRBLFNBQUksR0FBRyxHQUFHLENBQUM7UUFHWCxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVoQyxRQUFRO1FBQ1IsWUFBTyxHQUFHLE9BQU8sQ0FBQztRQUNsQixXQUFNLEdBQUcsTUFBTSxDQUFDO0lBRUEsQ0FBQztJQUVqQixRQUFRO0lBQ1IsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFO1lBQ3BCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUU7WUFDbkIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7OzBHQS9CVSxhQUFhOzhGQUFiLGFBQWEsaUhDUjFCLDRhQVNBOzJGRERhLGFBQWE7a0JBTHpCLFNBQVM7K0JBQ0UsVUFBVTswRUFPcEIsSUFBSTtzQkFESCxLQUFLO2dCQUlOLFVBQVU7c0JBRFQsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZmFNaW51cywgZmFQbHVzIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXpvb20nLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi96b29tLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi96b29tLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFpvb21Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHpvb20gPSAxMDA7XHJcblxyXG4gIEBPdXRwdXQoKVxyXG4gIHpvb21DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIC8vIGljb25zXHJcbiAgZmFNaW51cyA9IGZhTWludXM7XHJcbiAgZmFQbHVzID0gZmFQbHVzO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIHpvb21JbigpIHtcclxuICAgIGlmICh0aGlzLnpvb20gPj0gMTUwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuem9vbSArPSAxMDtcclxuICAgIHRoaXMuem9vbUNoYW5nZS5lbWl0KHRoaXMuem9vbSk7XHJcbiAgfVxyXG5cclxuICB6b29tT3V0KCkge1xyXG4gICAgaWYgKHRoaXMuem9vbSA8PSAyMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnpvb20gLT0gMTA7XHJcbiAgICB0aGlzLnpvb21DaGFuZ2UuZW1pdCh0aGlzLnpvb20pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiPGRpdiBmeExheW91dCBmeExheW91dEFsaWduPVwiY2VudGVyIGNlbnRlclwiIGNsYXNzPVwiem9vbS13aWRnZXRcIj5cclxuICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiBtYXRUb29sdGlwPVwiWm9vbSBPdXRcIiAoY2xpY2spPVwiem9vbU91dCgpXCI+XHJcbiAgICA8ZmEtaWNvbiBbaWNvbl09XCJmYU1pbnVzXCI+PC9mYS1pY29uPlxyXG4gIDwvYnV0dG9uPlxyXG4gIDxzcGFuIHN0eWxlPVwicGFkZGluZzogMCAxMHB4OyBmb250LXNpemU6IDE2cHhcIj57eyB6b29tIH19JTwvc3Bhbj5cclxuICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiBtYXRUb29sdGlwPVwiWm9vbSBJblwiIChjbGljayk9XCJ6b29tSW4oKVwiPlxyXG4gICAgPGZhLWljb24gW2ljb25dPVwiZmFQbHVzXCI+PC9mYS1pY29uPlxyXG4gIDwvYnV0dG9uPlxyXG48L2Rpdj5cclxuIl19