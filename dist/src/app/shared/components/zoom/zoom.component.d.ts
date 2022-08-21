import { OnInit, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ZoomComponent implements OnInit {
    zoom: number;
    zoomChange: EventEmitter<any>;
    faMinus: import("@fortawesome/fontawesome-common-types").IconDefinition;
    faPlus: import("@fortawesome/fontawesome-common-types").IconDefinition;
    constructor();
    ngOnInit(): void;
    zoomIn(): void;
    zoomOut(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ZoomComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ZoomComponent, "app-zoom", never, { "zoom": "zoom"; }, { "zoomChange": "zoomChange"; }, never, never>;
}
