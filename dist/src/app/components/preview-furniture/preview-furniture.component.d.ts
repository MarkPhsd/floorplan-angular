import { OnInit, AfterViewInit } from '@angular/core';
import { fabric } from 'fabric';
import { AppService } from '../../app.service';
import * as i0 from "@angular/core";
export declare class PreviewFurnitureComponent implements OnInit, AfterViewInit {
    app: AppService;
    id: any;
    canvas: fabric.Canvas;
    type: string;
    furniture: any;
    constructor(app: AppService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    handleObjectInsertion({ type, object }: {
        type: any;
        object: any;
    }): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PreviewFurnitureComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PreviewFurnitureComponent, "pointless-preview-furniture", never, { "type": "type"; "furniture": "furniture"; }, {}, never, never>;
}
