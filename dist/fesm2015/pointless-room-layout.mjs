import { BrowserModule } from '@angular/platform-browser';
import * as i0 from '@angular/core';
import { NgModule, EventEmitter, Component, Input, Output, Injectable, ViewChild } from '@angular/core';
import * as i8 from '@angular/forms';
import { FormGroup, FormControl, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import * as i1 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as i1$1 from '@angular/material/dialog';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as i8$1 from '@angular/material/divider';
import { MatDividerModule } from '@angular/material/divider';
import * as i6$1 from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import * as i2 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i10 from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import * as i7 from '@angular/material/list';
import { MatListModule } from '@angular/material/list';
import * as i16 from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';
import * as i6 from '@angular/material/core';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as i2$1 from '@angular/material/radio';
import { MatRadioModule } from '@angular/material/radio';
import * as i5 from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import * as i5$1 from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import * as i15 from '@angular/material/toolbar';
import { MatToolbarModule } from '@angular/material/toolbar';
import * as i3 from '@angular/material/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import * as i4 from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { fabric } from 'fabric';
import * as i9 from '@angular/common';
import { repeatWhen, delay } from 'rxjs/operators';
import * as uuid from 'uuid';
import { Subject } from 'rxjs';
import * as i21 from '@angular/cdk/text-field';

// import {ScrollingModule } from '@angular/cdk/scrolling';
// import { OverlayModule } from '@angular/cdk/overlay';
class MaterialModule {
}
MaterialModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: MaterialModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MaterialModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: MaterialModule, imports: [OverlayModule], exports: [DragDropModule,
        ScrollingModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        OverlayModule] });
MaterialModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: MaterialModule, providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
    ], imports: [[OverlayModule], DragDropModule,
        ScrollingModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        OverlayModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: MaterialModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [OverlayModule],
                    exports: [
                        DragDropModule,
                        ScrollingModule,
                        MatAutocompleteModule,
                        MatBadgeModule,
                        MatBottomSheetModule,
                        MatButtonModule,
                        MatButtonToggleModule,
                        MatCardModule,
                        MatCheckboxModule,
                        MatChipsModule,
                        MatStepperModule,
                        MatDatepickerModule,
                        MatDialogModule,
                        MatDividerModule,
                        MatExpansionModule,
                        MatFormFieldModule,
                        MatGridListModule,
                        MatIconModule,
                        MatInputModule,
                        MatListModule,
                        MatMenuModule,
                        MatMenuModule,
                        MatNativeDateModule,
                        MatPaginatorModule,
                        MatProgressBarModule,
                        MatProgressSpinnerModule,
                        MatRadioModule,
                        MatRippleModule,
                        MatSelectModule,
                        MatSidenavModule,
                        MatSliderModule,
                        MatSlideToggleModule,
                        MatSnackBarModule,
                        MatSortModule,
                        MatTableModule,
                        MatTabsModule,
                        MatToolbarModule,
                        MatTooltipModule,
                        MatTreeModule,
                        OverlayModule,
                    ],
                    providers: [
                        { provide: MatDialogRef, useValue: {} },
                        { provide: MAT_DIALOG_DATA, useValue: {} }
                    ]
                }]
        }] });

// import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
class ZoomComponent {
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

class SharedModule {
}
SharedModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: SharedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SharedModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: SharedModule, declarations: [ZoomComponent], imports: [MaterialModule], exports: [MaterialModule,
        ZoomComponent] });
SharedModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: SharedModule, providers: [], imports: [[
            MaterialModule,
        ], MaterialModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: SharedModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        MaterialModule,
                    ],
                    exports: [
                        MaterialModule,
                        ZoomComponent
                    ],
                    providers: [],
                    declarations: [ZoomComponent]
                }]
        }] });

const { Group, Rect, Line: Line$1, Circle, Ellipse, Path, Polygon, Polyline, Triangle } = fabric;
const RL_FILL = 'white', RL_STROKE = 'green', RL_STROKE_InUse = 'yello', RL_STROKE_NoReady = 'red', RL_PREVIEW_WIDTH = 140, RL_PREVIEW_HEIGHT = 120, RL_CHAIR_STROKE = 'white', RL_CHAIR_FILL = 'purple', RL_CHAIR_TUCK = 6, RL_VIEW_WIDTH$1 = 120, RL_VIEW_HEIGHT$1 = 56, RL_FOOT$1 = 12, RL_AISLEGAP$1 = 12 * 3, RL_ROOM_OUTER_SPACING$1 = 48, RL_ROOM_INNER_SPACING$1 = 4, RL_ROOM_STROKE$1 = '#000', RL_CORNER_FILL$1 = '#88f', RL_UNGROUPABLES$1 = ['CHAIR', 'MISCELLANEOUS', 'DOOR'], RL_CREDIT_TEXT$1 = '', RL_CREDIT_TEXT_PARAMS$1 = { fontSize: 12, fontFamily: 'Arial', fill: '#999', left: 12 };
const createText = (properties) => {
    let { text } = properties;
    if (properties.direction === 'VERTICAL') {
        const chars = [];
        for (const char of text) {
            chars.push(char);
        }
        text = chars.join('\n');
    }
    return new fabric.IText(text, {
        fontSize: properties.font_size,
        lineHeight: 0.8,
        name: properties.name,
        hasControls: false
    });
};
/** Create Basic Shape  */
const createBasicShape = (part, stroke = '#aaaaaa', fill = 'white') => {
    if (part.definition.fill == null)
        part.definition.fill = fill;
    if (part.definition.stroke == null)
        part.definition.stroke = stroke;
    else if (part.definition.stroke == 'chair')
        part.definition.stroke = RL_CHAIR_STROKE;
    let fObj;
    switch (part.type) {
        case 'circle':
            fObj = new Circle(part.definition);
            break;
        case 'ellipse':
            fObj = new Ellipse(part.definition);
            break;
        case 'line':
            fObj = new Line$1(part.line, part.definition);
            break;
        case 'path':
            fObj = new Path(part.path, part.definition);
            break;
        case 'polygon':
            fObj = new Polygon(part.definition);
            break;
        case 'polyline':
            fObj = new Polyline(part.definition);
            break;
        case 'rect':
            fObj = new Rect(part.definition);
            break;
        case 'triangle':
            fObj = new Triangle(part.definition);
            break;
    }
    return (fObj);
};
const createFurniture = (type, object, chair = {}) => {
    if (type === 'TABLE') {
        // console.log('chair', chair)
        // console.log('object', object)
        return createTable(object, chair);
    }
    else if (type === 'TEXT') {
        return createText(object);
    }
    else if (type === 'LAYOUT') {
        return object;
    }
    else {
        return createShape(object, RL_STROKE, RL_FILL, type);
    }
};
/** Adding Chairs */
const createShape = (object, stroke = RL_CHAIR_STROKE, fill = RL_CHAIR_FILL, type = 'CHAIR') => {
    const parts = object.parts.map(obj => createBasicShape(obj, stroke, fill));
    const group = new Group(parts, {
        name: `${type}`,
        hasControls: false,
        originX: 'center',
        originY: 'center'
    });
    return group;
};
// All Create[Name]Object() functions should return a group
const createTable = (def, RL_DEFAULT_CHAIR, type = 'TABLE') => {
    // tables with chairs have the chairs full-height around the table
    // create table name passing from def
    // console.log('createTable def', def?.name)
    // console.log('createTable def RL_DEFAULT_CHAIR', def?.name)
    const components = [];
    let index = 0;
    // Note that we're using the provided width and height for table placement
    // Issues may arise if rendered shape is larger/smaller, since it's positioned from center point
    const chairWidth = RL_DEFAULT_CHAIR.width;
    const chairHeight = RL_DEFAULT_CHAIR.height;
    const tableLeft = def.leftChairs > 0 ? (chairHeight - RL_CHAIR_TUCK) : 0;
    const tableTop = (chairHeight - RL_CHAIR_TUCK);
    if (def.shape == 'circle') {
        const origin_x = def.width / 2 + chairHeight - RL_CHAIR_TUCK;
        const origin_y = def.width / 2 + chairHeight - RL_CHAIR_TUCK;
        const x2 = origin_x;
        const y2 = 0 + chairHeight / 2;
        const rotation_origin = new fabric.Point(origin_x, origin_y);
        const tableRadius = def.width / 2;
        const radius = def.width / 2 + chairHeight; // outer radius of whole shape unit
        let angle = 0;
        const angleIncrement = 360 / (def.chairs > 0 ? def.chairs : 1);
        for (let x = 0; x < def.chairs; ++x) {
            // Note that width and height are the same for circle tables
            // width of whole area when done
            const width = def.width + chairHeight - (RL_CHAIR_TUCK * 2);
            components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);
            const angle_radians = fabric.util.degreesToRadians(angle);
            const end = fabric.util.rotatePoint(new fabric.Point(x2, y2), rotation_origin, angle_radians);
            components[index].left = end.x;
            components[index].top = end.y;
            components[index].angle = (angle + 180 > 360) ? (angle - 180) : (angle + 180);
            index++;
            angle += angleIncrement;
        }
        if (def.fill === '') {
            def.fill = RL_FILL;
            def.stroke = RL_STROKE;
        }
        const tableCircle = {
            left: origin_x,
            top: origin_y,
            radius: tableRadius,
            fill: def.fill,
            stroke: def.stroke,
            originX: 'center',
            originY: 'center',
            name: (def === null || def === void 0 ? void 0 : def.name) + ';orderid;itemName;'
        };
        components[index] = new fabric.Circle(tableCircle);
    }
    else if (def.shape == 'rect') {
        const tableRect = {
            width: def.width,
            height: def.height,
            fill: RL_FILL,
            stroke: RL_STROKE,
            name: (def === null || def === void 0 ? void 0 : def.name) + ';orderid;itemName;'
        };
        // calculate gap between chairs, with extra for gap to end of table
        let gap = 0, firstOffset = 0, leftOffset = 0, topOffset = 0;
        // top chair row
        // Note that chairs 'look up' by default, so the bottom row isn't rotated
        // and the top row is.
        gap = (def.width - (def.topChairs * chairWidth)) / (def.topChairs + 1);
        firstOffset = gap + tableLeft;
        leftOffset = firstOffset;
        topOffset = 0;
        for (let x = 0; x < def.topChairs; x++) {
            components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);
            components[index].angle = -180;
            components[index].left = leftOffset + chairWidth / 2;
            components[index].top = topOffset + chairHeight / 2;
            index++;
            leftOffset += (chairWidth + gap);
        }
        // bottom chair row
        gap = (def.width - (def.bottomChairs * chairWidth)) / (def.bottomChairs + 1);
        firstOffset = gap + tableLeft;
        leftOffset = firstOffset;
        topOffset = tableRect.height + chairHeight - (RL_CHAIR_TUCK * 2);
        for (let x = 0; x < def.bottomChairs; x++) {
            components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);
            components[index].left = leftOffset + chairWidth / 2;
            components[index].top = topOffset + chairWidth / 2;
            ++index;
            leftOffset += (chairWidth + gap);
        }
        // left chair row
        gap = (def.height - (def.leftChairs * chairWidth)) / (def.leftChairs + 1);
        leftOffset = chairWidth / 2;
        topOffset = tableTop + gap + chairWidth / 2; // top of table plus first gap, then to center
        for (let x = 0; x < def.leftChairs; x++) {
            components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);
            components[index].angle = 90;
            components[index].left = leftOffset;
            components[index].top = topOffset;
            ++index;
            topOffset += (chairWidth + gap);
        }
        // right chair row
        gap = (def.height - (def.rightChairs * chairWidth)) / (def.rightChairs + 1);
        leftOffset = tableRect.width + chairWidth / 2;
        topOffset = tableTop + gap + chairWidth / 2; // top of table plus first gap, then to center
        for (let x = 0; x < def.rightChairs; x++) {
            components[index] = createShape(RL_DEFAULT_CHAIR, RL_CHAIR_STROKE, RL_CHAIR_FILL);
            components[index].angle = -90;
            components[index].left = leftOffset + chairHeight - (RL_CHAIR_TUCK * 2);
            components[index].top = topOffset;
            ++index;
            topOffset += (chairWidth + gap);
        }
        // add table on top of chairs
        components[index] = new fabric.Rect(tableRect);
        components[index].left = tableLeft;
        components[index].top = tableTop;
    }
    const tableGroup = new fabric.Group(components, {
        left: 0,
        top: 0,
        hasControls: false,
        // set origin for all groups to center
        originX: 'center',
        originY: 'center',
        name: (def === null || def === void 0 ? void 0 : def.name) + ';orderid;itemName;',
        borderColor: 'purple',
        backgroundColor: 'purple',
        stroke: 'purple',
        strokeWidth: 10,
        fill: 'purple'
    });
    return tableGroup;
};

var _ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createBasicShape: createBasicShape,
    createTable: createTable,
    createShape: createShape,
    createText: createText,
    createFurniture: createFurniture,
    RL_FILL: RL_FILL,
    RL_STROKE: RL_STROKE,
    RL_CHAIR_STROKE: RL_CHAIR_STROKE,
    RL_CHAIR_FILL: RL_CHAIR_FILL,
    RL_CHAIR_TUCK: RL_CHAIR_TUCK,
    RL_PREVIEW_HEIGHT: RL_PREVIEW_HEIGHT,
    RL_PREVIEW_WIDTH: RL_PREVIEW_WIDTH,
    RL_VIEW_WIDTH: RL_VIEW_WIDTH$1,
    RL_VIEW_HEIGHT: RL_VIEW_HEIGHT$1,
    RL_FOOT: RL_FOOT$1,
    RL_AISLEGAP: RL_AISLEGAP$1,
    RL_ROOM_OUTER_SPACING: RL_ROOM_OUTER_SPACING$1,
    RL_ROOM_INNER_SPACING: RL_ROOM_INNER_SPACING$1,
    RL_ROOM_STROKE: RL_ROOM_STROKE$1,
    RL_CORNER_FILL: RL_CORNER_FILL$1,
    RL_UNGROUPABLES: RL_UNGROUPABLES$1,
    RL_CREDIT_TEXT: RL_CREDIT_TEXT$1,
    RL_CREDIT_TEXT_PARAMS: RL_CREDIT_TEXT_PARAMS$1
});

const FURNISHINGS = {
    'title': 'Faithlife Room Layout Furniture Library',
    'rooms': [
        {
            'title': '13\' x 17\' Small Conference Room',
            'width': 156,
            'height': 204
        },
        {
            'title': '15\' x 26\' Medium Conference Room',
            'width': 180,
            'height': 312
        },
        {
            'title': '18\' x 21\' Medium Conference Room',
            'width': 216,
            'height': 252
        },
        {
            'title': '20\' x 10\'',
            'width': 240,
            'height': 120
        },
        {
            'title': '16\' x 12\'',
            'width': 192,
            'height': 144
        },
        {
            'title': 'Gym (Regulation)',
            'width': 1320,
            'height': 720
        },
        {
            'title': 'Gym (High School)',
            'width': 1008,
            'height': 600
        },
        {
            'title': '40\' x 20\'',
            'width': 480,
            'height': 240
        }
    ],
    'tables': [
        {
            'title': '44" Round Folding',
            'width': 44,
            'height': 44,
            'lrSpacing': 44,
            'tbSpacing': 44,
            'shape': 'circle',
            'fill': "skyBlue",
            'selectionBackgroundColor': "skyBlue",
            'chairs': 4
        },
        {
            'title': '54" Round Folding',
            'width': 54,
            'height': 54,
            'lrSpacing': 54,
            'tbSpacing': 54,
            'shape': 'circle',
            'fill': "skyBlue",
            'chairs': 6
        },
        {
            'title': '60" Round Folding',
            'width': 60,
            'height': 60,
            'lrSpacing': 60,
            'tbSpacing': 60,
            'shape': 'circle',
            'fill': "skyBlue",
            'chairs': 8
        },
        {
            'title': '72" Round Folding',
            'width': 72,
            'height': 72,
            'lrSpacing': 72,
            'tbSpacing': 72,
            'shape': 'circle',
            'fill': "skyBlue",
            'chairs': 8
        },
        {
            'title': '6\' x 30" Folding',
            'width': 72,
            'height': 30,
            'lrSpacing': 24,
            'tbSpacing': 60,
            'shape': 'rect',
            'fill': "skyBlue",
            'topChairs': 3,
            'bottomChairs': 3,
            'leftChairs': 0,
            'rightChairs': 0
        },
        {
            'title': '8\' x 30" Folding',
            'width': 96,
            'height': 30,
            'lrSpacing': 24,
            'tbSpacing': 60,
            'fill': "skyBlue",
            'shape': 'rect',
            'topChairs': 4,
            'bottomChairs': 4,
            'leftChairs': 0,
            'rightChairs': 0
        },
        {
            'title': '8\' x 40" Family',
            'width': 96,
            'height': 40,
            'lrSpacing': 60,
            'tbSpacing': 60,
            'fill': "skyBlue",
            'shape': 'rect',
            'topChairs': 4,
            'bottomChairs': 3,
            'leftChairs': 1,
            'rightChairs': 1
        },
        {
            'title': '8\' x 18" Classroom',
            'width': 96,
            'height': 18,
            'lrSpacing': 24,
            'tbSpacing': 36,
            'fill': "skyBlue",
            'shape': 'rect',
            'topChairs': 0,
            'bottomChairs': 4,
            'leftChairs': 0,
            'rightChairs': 0
        },
        {
            'title': '6\' x 18" Classroom',
            'width': 72,
            'height': 18,
            'lrSpacing': 24,
            'tbSpacing': 36,
            'fill': "skyBlue",
            'shape': 'rect',
            'topChairs': 0,
            'bottomChairs': 3,
            'leftChairs': 0,
            'rightChairs': 0
        }
    ],
    'chairs': [
        {
            'title': 'Generic',
            'width': 18,
            'height': 20,
            'lrSpacing': 2,
            'tbSpacing': 12,
            'borderColor': 'purple',
            'strokeWidth': '4',
            'fill': 'purple',
            'stroke': 'purple',
            'parts': [
                { 'stroke': 'purple', 'borderColor': 'purple', 'strokeWidth': '4', 'fill': 'purple', 'type': 'rect', 'definition': { left: 0, top: 0, width: 18, height: 20 } },
                { 'stroke': 'purple', 'borderColor': 'purple', 'strokeWidth': '4', 'fill': 'purple', 'type': 'rect', 'definition': { left: 0, top: 18, width: 18, height: 2 } }
            ]
        },
        {
            'title': '14" Children\'s',
            'width': 14,
            'height': 14,
            'lrSpacing': 2,
            'tbSpacing': 12,
            'parts': [
                { 'type': 'circle', 'definition': { originX: 'center', originY: 'center', radius: 7 } },
                { 'type': 'circle', 'definition': { originX: 'center', originY: 'center', radius: 4 } }
            ]
        },
        {
            'title': '18" Folding',
            'width': 18,
            'height': 18,
            'lrSpacing': 2,
            'tbSpacing': 12,
            'parts': [
                { 'type': 'rect', 'definition': { left: 0, top: 0, width: 18, height: 18 } },
                { 'type': 'rect', 'definition': { left: 0, top: 16, width: 18, height: 2 } }
            ]
        },
        {
            'title': '18" Stacking',
            'width': 18.375,
            'height': 23.25,
            'lrSpacing': 2,
            'tbSpacing': 12.75,
            'parts': [
                { 'type': 'rect', 'definition': { width: 18.375, height: 23.25 } },
                { 'type': 'rect', 'definition': { width: 18.375, height: 4, top: 19.25 } },
                { 'type': 'rect', 'definition': { width: 18.375, height: 2, top: 21.25 } }
            ]
        },
        {
            'title': '20" Pew Stacker',
            'source': 'http://sanctuaryseating.com/church-chairs/impressions-series/model-7027/',
            'width': 20.25,
            'height': 26.3,
            'lrSpacing': 1,
            'tbSpacing': 12,
            'parts': [
                { 'type': 'rect', 'definition': { width: 20.25, height: 26.3 } },
                { 'type': 'rect', 'definition': { width: 20.25, height: 8, top: 18.3 } },
                { 'type': 'rect', 'definition': { width: 20.25, height: 6, top: 20.3 } }
            ]
        },
        {
            'title': '22" Pew Stacker',
            'source': 'http://sanctuaryseating.com/church-chairs/impressions-series/model-7227/',
            'width': 22,
            'height': 26.3,
            'lrSpacing': 1,
            'tbSpacing': 12,
            'parts': [
                { 'type': 'rect', 'definition': { width: 22, height: 26.3 } },
                { 'type': 'rect', 'definition': { width: 22, height: 8, top: 18.3 } },
                { 'type': 'rect', 'definition': { width: 22, height: 6, top: 20.3 } }
            ]
        },
        {
            'title': '22" Square',
            'width': 22,
            'height': 22,
            'lrSpacing': 2,
            'tbSpacing': 12,
            'parts': [
                { 'type': 'rect', 'definition': { width: 22, height: 22 } },
                { 'type': 'rect', 'definition': { width: 22, height: 6, top: 16 } }
            ]
        }
    ],
    'miscellaneous': [
        {
            'title': 'Rectangle',
            'width': 36,
            'height': 12,
            'flexible': true,
            'parts': [
                { 'type': 'rect', 'definition': { left: 0, top: 0, width: 36, height: 12 } }
            ]
        },
        {
            'title': '5\' x 23" Upright Piano',
            'width': 60,
            'height': 23,
            'parts': [
                { 'type': 'rect', 'definition': { left: 15, top: 16, width: 30, height: 14, stroke: 'chair' } },
                { 'type': 'rect', 'definition': { left: 0, top: 0, width: 60, height: 23 } },
                { 'type': 'rect', 'definition': { left: 0, top: 0, width: 6, height: 23 } },
                { 'type': 'rect', 'definition': { left: 54, top: 0, width: 6, height: 23 } },
                { 'type': 'rect', 'definition': { left: 0, top: 0, width: 60, height: 13 } } // top
            ]
        },
        {
            'title': '6\' Grand Piano',
            'width': 58,
            'height': 84,
            'parts': [
                { 'type': 'rect', 'definition': { left: 11, top: 77, width: 36, height: 14, stroke: 'chair' } },
                { 'type': 'path', 'path': 'M 0,84 L 0,36 C 0,2 42,2 42,32 S 58,50 58,72 L 58,84 z', 'definition': {} },
                { 'type': 'rect', 'definition': { left: 0, top: 74, width: 58, height: 10 } },
                { 'type': 'rect', 'definition': { left: 0, top: 74, width: 6, height: 10 } },
                { 'type': 'rect', 'definition': { left: 52, top: 74, width: 6, height: 10 } } // side pillar
            ]
        },
        {
            'title': '7\' Grand Piano',
            'width': 62,
            'height': 84,
            'parts': [
                // { "type": "rect", "definition": { left: 13, top: 77, width: 36, height: 14, stroke: "chair" } },  // bench
                { 'type': 'path', 'path': 'M 0,84 L 0,24 C 0,-10 46,-10 46,26 S 62,50 62,72 L 62,84 z', 'definition': {} },
                { 'type': 'rect', 'definition': { left: 0, top: 74, width: 62, height: 10 } }, // keyboard area
                // { "type": "rect", "definition": { left: 0, top: 74, width: 6, height: 10 } },   // side pillar
                // { "type": "rect", "definition": { left: 56, top: 74, width: 6, height: 10 } }   // side pillar
            ]
        },
        {
            'title': '8\' Grand Piano',
            'width': 62,
            'height': 94,
            'parts': [
                { 'type': 'rect', 'definition': { left: 13, top: 87, width: 36, height: 14, stroke: 'chair' } },
                { 'type': 'path', 'path': 'M 0,94 L 0,24 C 0,-10 46,-10 46,28 S 62,62 62,78 L 62,94 z', 'definition': {} },
                { 'type': 'rect', 'definition': { left: 0, top: 84, width: 62, height: 10 } },
                { 'type': 'rect', 'definition': { left: 0, top: 84, width: 6, height: 10 } },
                { 'type': 'rect', 'definition': { left: 56, top: 84, width: 6, height: 10 } } // side pillar
            ]
        },
        {
            'title': 'Awana Game Square',
            'width': 200,
            'height': 200,
            'parts': [
                { 'type': 'circle', 'definition': { left: 240, top: 240, strokeWidth: 2, stroke: '#aaaaaa', originX: 'center', originY: 'center', radius: 180 } },
                // blue
                { 'type': 'path', 'path': 'M329.8,82.32L340.41,71.71', 'definition': { strokeWidth: 2, stroke: '#aaaaaa' } },
                { 'type': 'path', 'path': 'M480,0L480,480M480,0L240,240M299.4,180.6L299.4,299.4M278.19,193.33L286.67,201.81M273.94,138.18L341.82,206.06M312.13,159.39L320.61,167.87M320.61,150.91L329.09,159.39M329.1,142.42L337.58,150.9M337.58,133.94L346.06,142.42M346.07,125.45L354.55,133.93', 'definition': { stroke: 'blue', strokeWidth: 2 } },
                // green
                { 'type': 'path', 'path': 'M408.29,340.41L397.68,329.8', 'definition': { strokeWidth: 2, stroke: '#aaaaaa' } },
                { 'type': 'path', 'path': 'M0,480L480,480M240,240L480,480M180.6,299.4L299.4,299.4M278.19,286.67L286.67,278.19M273.94,341.82L341.82,273.94M312.13,320.61L320.61,312.13M320.61,329.09L329.09,320.61M329.1,337.58L337.58,329.1M337.58,346.06L346.06,337.58M346.07,354.55L354.55,346.07', 'definition': { stroke: 'green', strokeWidth: 2 } },
                // yellow
                { 'type': 'path', 'path': 'M150.2,397.68L139.59,408.29', 'definition': { strokeWidth: 2, stroke: '#aaaaaa' } },
                { 'type': 'path', 'path': 'M0,480L0,0M0,480L240,240M180.6,299.4L180.6,180.6M201.81,286.67L193.33,278.19M206.06,341.82L138.18,273.94M167.87,320.61L159.39,312.13M159.39,329.09L150.91,320.61M150.9,337.58L142.42,329.1M142.42,346.06L133.94,337.58M133.93,354.55L125.45,346.07', 'definition': { stroke: 'yellow', strokeWidth: 2 } },
                // draw red last because it's stronger and on top, and it'll capture corners this way
                // red
                { 'type': 'path', 'path': 'M82.32,150.2L71.71,139.59', 'definition': { strokeWidth: 2, stroke: '#aaaaaa' } },
                { 'type': 'path', 'path': 'M0,0L480,0M0,0L240,240M180.6,180.6L299.4,180.6M193.33,201.81L201.81,193.33M138.18,206.06L206.06,138.18M159.39,167.87L167.87,159.39M150.91,159.39L159.39,150.91M142.42,150.9L150.9,142.42M133.94,142.42L142.42,133.94M125.45,133.93L133.93,125.45', 'definition': { stroke: 'red', strokeWidth: 2 } }
                // { "type": "line", "line": [ 0,0,100,0 ], "definition": { stroke: "#ffff00", strokeWidth: "2" } },
                // { "type": "line", "line": [ 0,0,100,100 ], "definition": { stroke: "#00ffff", strokeWidth: "2" } }
            ]
        }
    ],
    doors: [
        {
            title: 'Narrow Door (28" wide)',
            parts: [
                { type: 'rect', definition: { left: 0, width: 28, top: 0, height: RL_ROOM_INNER_SPACING$1, fill: 'white', strokeWidth: 0, originX: 'left', originY: 'top' } },
                { type: 'line', line: [0, 0, 0, `${RL_ROOM_INNER_SPACING$1 + 28}`], definition: { stroke: 'black', strokeWidth: 1 } },
                { type: 'path', path: `M 0 ${RL_ROOM_INNER_SPACING$1 + 28} Q 28, ${RL_ROOM_INNER_SPACING$1 + 28}, 28, ${RL_ROOM_INNER_SPACING$1}`, definition: { stroke: '#ddd', strokeWidth: 1, fill: 'transparent' } },
            ]
        }, {
            title: 'Normal Door (32" wide)',
            parts: [
                { type: 'rect', definition: { left: 0, width: 32, top: 0, height: RL_ROOM_INNER_SPACING$1, fill: 'white', strokeWidth: 0, originX: 'left', originY: 'top' } },
                { type: 'line', line: [0, 0, 0, `${RL_ROOM_INNER_SPACING$1 + 32}`], definition: { stroke: 'black', strokeWidth: 1 } },
                { type: 'path', path: `M 0 ${RL_ROOM_INNER_SPACING$1 + 32} Q 32, ${RL_ROOM_INNER_SPACING$1 + 32}, 32, ${RL_ROOM_INNER_SPACING$1}`, definition: { stroke: '#ddd', strokeWidth: 1, fill: 'transparent' } },
            ]
        }, {
            title: 'Wide Door (36" wide)',
            parts: [
                { type: 'rect', definition: { left: 0, width: 36, top: 0, height: RL_ROOM_INNER_SPACING$1, fill: 'white', strokeWidth: 0, originX: 'left', originY: 'top' } },
                { type: 'line', line: [0, 0, 0, `${RL_ROOM_INNER_SPACING$1 + 36}`], definition: { stroke: 'black', strokeWidth: 1 } },
                { type: 'path', path: `M 0 ${RL_ROOM_INNER_SPACING$1 + 36} Q 36, ${RL_ROOM_INNER_SPACING$1 + 36}, 36, ${RL_ROOM_INNER_SPACING$1}`, definition: { stroke: '#ddd', strokeWidth: 1, fill: 'transparent' } },
            ]
        }, {
            title: 'Double Doors (64" wide)',
            parts: [
                { type: 'rect', definition: { left: 0, width: 64, top: 0, height: RL_ROOM_INNER_SPACING$1, fill: 'white', strokeWidth: 0, originX: 'left', originY: 'top' } },
                { type: 'line', line: [0, 0, 0, `${RL_ROOM_INNER_SPACING$1 + 32}`], definition: { stroke: 'black', strokeWidth: 1 } },
                { type: 'path', path: `M 0 ${RL_ROOM_INNER_SPACING$1 + 32} Q 32, ${RL_ROOM_INNER_SPACING$1 + 32}, 32, ${RL_ROOM_INNER_SPACING$1}`, definition: { stroke: '#ddd', strokeWidth: 1, fill: 'transparent' } },
                { type: 'line', line: [64, 0, 64, `${RL_ROOM_INNER_SPACING$1 + 32}`], definition: { stroke: 'black', strokeWidth: 1 } },
                { type: 'path', path: `M 32 ${RL_ROOM_INNER_SPACING$1} Q 32, ${RL_ROOM_INNER_SPACING$1 + 32}, 64, ${RL_ROOM_INNER_SPACING$1 + 32}`, definition: { stroke: '#ddd', strokeWidth: 1, fill: 'transparent' } },
            ]
        }
    ],
    windows: [
        {
            title: '2’ Window (24” wide)',
            parts: [
                { type: 'rect', definition: { left: 0, width: 24, top: 0, height: RL_ROOM_INNER_SPACING$1 - 1, fill: 'white', strokeWidth: 1, originX: 'left', originY: 'top' } },
            ]
        },
        {
            title: '3’ Window (36” wide)',
            parts: [
                { type: 'rect', definition: { left: 0, width: 36, top: 0, height: RL_ROOM_INNER_SPACING$1 - 1, fill: 'white', strokeWidth: 1, originX: 'left', originY: 'top' } },
            ]
        },
        {
            title: '4’ Window (48” wide)',
            parts: [
                { type: 'rect', definition: { left: 0, width: 48, top: 0, height: RL_ROOM_INNER_SPACING$1 - 1, fill: 'white', strokeWidth: 1, originX: 'left', originY: 'top' } },
            ]
        },
        {
            title: '6’ Window (72” wide)',
            parts: [
                { type: 'rect', definition: { left: 0, width: 72, top: 0, height: RL_ROOM_INNER_SPACING$1 - 1, fill: 'white', strokeWidth: 1, originX: 'left', originY: 'top' } },
            ]
        }
    ]
};

const WIDTH = 1100, HEIGHT = 400;
class ChairsLayoutComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.layoutOption = 'NORMAL';
        this.chairs = [];
        this.zoom = 100;
    }
    ngOnInit() {
        this.chairs = FURNISHINGS.chairs;
        this.rectBlock = new FormGroup({
            chair: new FormControl(0),
            rows: new FormControl(1),
            sections: new FormControl(1),
            chairs: new FormControl(12),
            spacing_chair: new FormControl(0),
            spacing_row: new FormControl(22),
            spacing_sections: new FormControl([1, 2, 3, 4].map(() => new FormControl(5)))
        });
        const array = [];
        for (let i = 0; i < 20; i++) {
            array.push(i);
        }
        this.curvedBlock = new FormGroup({
            chair: new FormControl(0),
            radius: new FormControl(200),
            angle: new FormControl(180),
            rows: new FormControl(1),
            spacing_row: new FormControl(40),
            chairs: new FormArray(new Array(10).fill(new FormControl(10))),
        });
        console.log(this.curvedBlock);
        this.view = new fabric.Canvas('layout_chairs');
        this.view.setWidth(WIDTH);
        this.view.setHeight(HEIGHT);
        this.rectBlock.valueChanges.subscribe(() => this.changeLayout());
        this.curvedBlock.valueChanges.subscribe(() => this.changeLayout());
        this.changeLayout();
    }
    layoutOptionChanged(value) {
        this.layoutOption = value;
        this.changeLayout();
    }
    changeLayout() {
        const chrs = [];
        if (this.layoutOption === 'CURVED') {
            const { radius, angle, rows, chair, spacing_row, chairs } = this.curvedBlock.value;
            const start = -(angle / 2);
            for (let r = 0; r < rows; r++) {
                const N = chairs[r], A = angle / N;
                const rad = radius + r * spacing_row;
                for (let i = 0; i <= N; i += 1) {
                    const ca = start + i * A;
                    const chr = createShape(this.chairs[chair], RL_STROKE, RL_FILL);
                    chr.angle = ca;
                    const x = Math.sin(this.toRadians(ca)) * rad;
                    const y = Math.cos(this.toRadians(ca)) * rad;
                    chr.left = x;
                    chr.top = -y;
                    chr.angle += 180;
                    chrs.push(chr);
                }
            }
        }
        else {
            const { rows, sections, chairs, spacing_chair, spacing_row, chair } = this.rectBlock.value;
            const total = rows * chairs;
            const cps = Math.floor(chairs / sections); // Chairs per section
            let x = 0, y = 0;
            for (let i = 1; i <= total; i++) {
                const chr = createShape(this.chairs[chair], RL_STROKE, RL_FILL);
                chr.left = x, chr.top = y;
                if (i % chairs === 0) {
                    y += (spacing_row + chr.height);
                    x = 0;
                }
                else {
                    x += (chr.width + spacing_chair);
                    const s = Math.floor(i % chairs / cps);
                    if (i % chairs % cps === 0 && s + 1 <= this.sections) {
                        x += this.rectBlock.value.spacing_sections[s - 1];
                    }
                }
                chrs.push(chr);
            }
        }
        this.view.clear();
        this.layout = new fabric.Group(chrs, {
            originX: 'center',
            originY: 'center',
            left: WIDTH / 2,
            top: HEIGHT / 2,
            selectable: false,
            name: 'BLOCK:Chairs',
            hasControls: false,
        });
        this.layout.scale(this.zoom / 100);
        this.view.add(this.layout);
        this.view.renderAll();
    }
    onZoom(value) {
        this.zoom = value;
        this.layout.scale(value / 100);
        this.view.renderAll();
    }
    get spacing_sections() {
        const c = this.rectBlock.get('spacing_sections');
        return c.controls;
    }
    get sections() {
        return this.rectBlock.value.sections;
    }
    get curved_chairs() {
        const c = this.curvedBlock.get('chairs');
        return c.controls;
    }
    get curved_rows() {
        return this.curvedBlock.value.rows;
    }
    create() {
        this.layout.selectable = true;
        this.layout.scale(1);
        this.dialogRef.close(this.layout);
    }
    cancel() {
        this.dialogRef.close();
    }
    toRadians(angle) {
        return angle * (Math.PI / 180);
    }
    toDegrees(radian) {
        return radian * (180 / Math.PI);
    }
}
ChairsLayoutComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: ChairsLayoutComponent, deps: [{ token: i1$1.MatDialogRef }], target: i0.ɵɵFactoryTarget.Component });
ChairsLayoutComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: ChairsLayoutComponent, selector: "pointless-chairs-layout", ngImport: i0, template: "<div class=\"layout-chairs\">\r\n  <div>\r\n    <div class=\"layout-type flex-design\">\r\n      <mat-radio-group\r\n            aria-label=\"Select an layout\"\r\n            [ngModel]=\"layoutOption\"\r\n            (ngModelChange)=\"layoutOptionChanged($event)\">\r\n        <mat-radio-button value=\"NORMAL\">Normal</mat-radio-button>\r\n        <mat-radio-button value=\"CURVED\">Curved</mat-radio-button>\r\n      </mat-radio-group>\r\n      <app-zoom (zoomChange)=\"onZoom($event)\" [zoom]=\"zoom\"></app-zoom>\r\n    </div>\r\n    <form *ngIf=\"layoutOption === 'CURVED'\" [formGroup]=\"curvedBlock\" class=\"flex-design\">\r\n      <div>\r\n        <mat-form-field>\r\n          <mat-label>Select Chair</mat-label>\r\n          <mat-select formControlName=\"chair\">\r\n            <mat-option *ngFor=\"let chair of chairs; let i=index;\" [value]=\"i\">{{chair.title}}</mat-option>\r\n          </mat-select>\r\n        </mat-form-field>\r\n      </div>\r\n      <div class=\"flex-design\">\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"1\" max=\"5\" formControlName=\"rows\" matInput placeholder=\"Number of Rounds\">\r\n            <mat-label>Between 1 to 5</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"50\" max=\"500\" formControlName=\"radius\" matInput placeholder=\"Radius(px)\">\r\n            <mat-label>Between 50 to 500</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"10\" max=\"360\" formControlName=\"angle\" matInput placeholder=\"Angle\">\r\n            <mat-label>Between 10 to 360</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"10\" max=\"50\" formControlName=\"spacing_row\" matInput\r\n              placeholder=\"Spacing between Rounds\">\r\n            <mat-label>Between 10 to 50</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n      </div>\r\n      <div>\r\n        <p>Number of chairs in rows</p>\r\n        <form formArrayName=\"chairs\" >\r\n          <div class=\"layout-option\" *ngFor=\"let n of curved_chairs | slice:0:curved_rows; let i=index\">\r\n            <mat-form-field>\r\n              <input matInput [formControlName]=\"i\" type=\"number\">\r\n            </mat-form-field>\r\n          </div>\r\n        </form>\r\n      </div>\r\n    </form>\r\n    <form *ngIf=\"layoutOption === 'NORMAL'\" [formGroup]=\"rectBlock\" class='flex-design'>\r\n      <div>\r\n        <mat-form-field>\r\n          <mat-label>Select Chair</mat-label>\r\n          <mat-select formControlName=\"chair\">\r\n            <mat-option *ngFor=\"let chair of chairs; let i=index;\" [value]=\"i\">{{chair.title}}</mat-option>\r\n          </mat-select>\r\n        </mat-form-field>\r\n      </div>\r\n      <div >\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <mat-label>Sections</mat-label>\r\n            <mat-select formControlName=\"sections\">\r\n              <mat-option *ngFor=\"let opt of [1, 2, 3, 4]; let i=index;\" [value]=\"opt\">{{opt}}</mat-option>\r\n            </mat-select>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"1\" max=\"50\" formControlName=\"rows\" matInput placeholder=\"Rows\">\r\n            <mat-label>Between 1 to 50</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" formControlName=\"chairs\" min=\"1\" matInput placeholder=\"Chairs in a row\">\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"0\" max=\"6\" formControlName=\"spacing_chair\" matInput\r\n              placeholder=\"Spacing between chairs(px)\">\r\n            <mat-label>Between 0 to 6</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div>\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"0\" formControlName=\"spacing_row\" matInput placeholder=\"Spacing between rows(px)\">\r\n          </mat-form-field>\r\n        </div>\r\n      </div>\r\n      <div *ngIf=\"sections > 1\">\r\n        <p>Spacing between sections</p>\r\n        <form formArrayName=\"spacing_sections\" fxLayout fxLayoutGap=\"20px\">\r\n          <div class=\"layout-option\" *ngFor=\"let sec of spacing_sections | slice:0:sections-1; let i=index\">\r\n            <mat-form-field>\r\n              <input type=\"number\" matInput [formControlName]=\"i\" >\r\n            </mat-form-field>\r\n          </div>\r\n        </form>\r\n      </div>\r\n    </form>\r\n  </div>\r\n\r\n  <div>\r\n    <canvas id=\"layout_chairs\"></canvas>\r\n  </div>\r\n\r\n  <div style=\"margin-top: 1rem\">\r\n    <button mat-raised-button color=\"primary\" (click)=\"create()\">Create</button>\r\n    <button style=\"margin-left: 1rem\" mat-button color=\"primary\" (click)=\"cancel()\">Cancel</button>\r\n  </div>\r\n\r\n  <div *ngIf=\"curvedBlock\">\r\n    {{curvedBlock.value}}\r\n  </div>\r\n  <div *ngIf=\"rectBlock\">\r\n    {{rectBlock.value}}\r\n  </div>\r\n</div>\r\n", styles: [".layout-chairs .layout-type{padding:24px 0}.layout-chairs .layout-type mat-radio-button{margin-right:24px}.layout-chairs label{display:block;margin-bottom:5px;font-size:16px}.layout-chairs span{display:block;font-size:12px;color:#555}.layout-chairs .layout-option{margin-bottom:1rem}.layout-chairs canvas{border:1px solid #ececec;border-radius:3px}.layout-chairs p{margin-bottom:0}.flex-design{display:flex;flex-direction:column;align-content:space-between;gap:10px}\n"], components: [{ type: i2$1.MatRadioButton, selector: "mat-radio-button", inputs: ["disableRipple", "tabIndex"], exportAs: ["matRadioButton"] }, { type: ZoomComponent, selector: "app-zoom", inputs: ["zoom"], outputs: ["zoomChange"] }, { type: i4.MatFormField, selector: "mat-form-field", inputs: ["color", "appearance", "hideRequiredMarker", "hintLabel", "floatLabel"], exportAs: ["matFormField"] }, { type: i5.MatSelect, selector: "mat-select", inputs: ["disabled", "disableRipple", "tabIndex"], exportAs: ["matSelect"] }, { type: i6.MatOption, selector: "mat-option", exportAs: ["matOption"] }, { type: i1.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], directives: [{ type: i2$1.MatRadioGroup, selector: "mat-radio-group", exportAs: ["matRadioGroup"] }, { type: i8.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i8.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i9.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i8.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { type: i8.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { type: i8.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { type: i4.MatLabel, selector: "mat-label" }, { type: i8.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { type: i9.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i8.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { type: i8.MaxValidator, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: ["max"] }, { type: i8.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { type: i8.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i10.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { type: i8.NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { type: i8.FormArrayName, selector: "[formArrayName]", inputs: ["formArrayName"] }], pipes: { "slice": i9.SlicePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: ChairsLayoutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pointless-chairs-layout', template: "<div class=\"layout-chairs\">\r\n  <div>\r\n    <div class=\"layout-type flex-design\">\r\n      <mat-radio-group\r\n            aria-label=\"Select an layout\"\r\n            [ngModel]=\"layoutOption\"\r\n            (ngModelChange)=\"layoutOptionChanged($event)\">\r\n        <mat-radio-button value=\"NORMAL\">Normal</mat-radio-button>\r\n        <mat-radio-button value=\"CURVED\">Curved</mat-radio-button>\r\n      </mat-radio-group>\r\n      <app-zoom (zoomChange)=\"onZoom($event)\" [zoom]=\"zoom\"></app-zoom>\r\n    </div>\r\n    <form *ngIf=\"layoutOption === 'CURVED'\" [formGroup]=\"curvedBlock\" class=\"flex-design\">\r\n      <div>\r\n        <mat-form-field>\r\n          <mat-label>Select Chair</mat-label>\r\n          <mat-select formControlName=\"chair\">\r\n            <mat-option *ngFor=\"let chair of chairs; let i=index;\" [value]=\"i\">{{chair.title}}</mat-option>\r\n          </mat-select>\r\n        </mat-form-field>\r\n      </div>\r\n      <div class=\"flex-design\">\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"1\" max=\"5\" formControlName=\"rows\" matInput placeholder=\"Number of Rounds\">\r\n            <mat-label>Between 1 to 5</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"50\" max=\"500\" formControlName=\"radius\" matInput placeholder=\"Radius(px)\">\r\n            <mat-label>Between 50 to 500</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"10\" max=\"360\" formControlName=\"angle\" matInput placeholder=\"Angle\">\r\n            <mat-label>Between 10 to 360</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"10\" max=\"50\" formControlName=\"spacing_row\" matInput\r\n              placeholder=\"Spacing between Rounds\">\r\n            <mat-label>Between 10 to 50</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n      </div>\r\n      <div>\r\n        <p>Number of chairs in rows</p>\r\n        <form formArrayName=\"chairs\" >\r\n          <div class=\"layout-option\" *ngFor=\"let n of curved_chairs | slice:0:curved_rows; let i=index\">\r\n            <mat-form-field>\r\n              <input matInput [formControlName]=\"i\" type=\"number\">\r\n            </mat-form-field>\r\n          </div>\r\n        </form>\r\n      </div>\r\n    </form>\r\n    <form *ngIf=\"layoutOption === 'NORMAL'\" [formGroup]=\"rectBlock\" class='flex-design'>\r\n      <div>\r\n        <mat-form-field>\r\n          <mat-label>Select Chair</mat-label>\r\n          <mat-select formControlName=\"chair\">\r\n            <mat-option *ngFor=\"let chair of chairs; let i=index;\" [value]=\"i\">{{chair.title}}</mat-option>\r\n          </mat-select>\r\n        </mat-form-field>\r\n      </div>\r\n      <div >\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <mat-label>Sections</mat-label>\r\n            <mat-select formControlName=\"sections\">\r\n              <mat-option *ngFor=\"let opt of [1, 2, 3, 4]; let i=index;\" [value]=\"opt\">{{opt}}</mat-option>\r\n            </mat-select>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"1\" max=\"50\" formControlName=\"rows\" matInput placeholder=\"Rows\">\r\n            <mat-label>Between 1 to 50</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" formControlName=\"chairs\" min=\"1\" matInput placeholder=\"Chairs in a row\">\r\n          </mat-form-field>\r\n        </div>\r\n        <div class=\"layout-option\">\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"0\" max=\"6\" formControlName=\"spacing_chair\" matInput\r\n              placeholder=\"Spacing between chairs(px)\">\r\n            <mat-label>Between 0 to 6</mat-label>\r\n          </mat-form-field>\r\n        </div>\r\n        <div>\r\n          <mat-form-field>\r\n            <input type=\"number\" min=\"0\" formControlName=\"spacing_row\" matInput placeholder=\"Spacing between rows(px)\">\r\n          </mat-form-field>\r\n        </div>\r\n      </div>\r\n      <div *ngIf=\"sections > 1\">\r\n        <p>Spacing between sections</p>\r\n        <form formArrayName=\"spacing_sections\" fxLayout fxLayoutGap=\"20px\">\r\n          <div class=\"layout-option\" *ngFor=\"let sec of spacing_sections | slice:0:sections-1; let i=index\">\r\n            <mat-form-field>\r\n              <input type=\"number\" matInput [formControlName]=\"i\" >\r\n            </mat-form-field>\r\n          </div>\r\n        </form>\r\n      </div>\r\n    </form>\r\n  </div>\r\n\r\n  <div>\r\n    <canvas id=\"layout_chairs\"></canvas>\r\n  </div>\r\n\r\n  <div style=\"margin-top: 1rem\">\r\n    <button mat-raised-button color=\"primary\" (click)=\"create()\">Create</button>\r\n    <button style=\"margin-left: 1rem\" mat-button color=\"primary\" (click)=\"cancel()\">Cancel</button>\r\n  </div>\r\n\r\n  <div *ngIf=\"curvedBlock\">\r\n    {{curvedBlock.value}}\r\n  </div>\r\n  <div *ngIf=\"rectBlock\">\r\n    {{rectBlock.value}}\r\n  </div>\r\n</div>\r\n", styles: [".layout-chairs .layout-type{padding:24px 0}.layout-chairs .layout-type mat-radio-button{margin-right:24px}.layout-chairs label{display:block;margin-bottom:5px;font-size:16px}.layout-chairs span{display:block;font-size:12px;color:#555}.layout-chairs .layout-option{margin-bottom:1rem}.layout-chairs canvas{border:1px solid #ececec;border-radius:3px}.layout-chairs p{margin-bottom:0}.flex-design{display:flex;flex-direction:column;align-content:space-between;gap:10px}\n"] }]
        }], ctorParameters: function () { return [{ type: i1$1.MatDialogRef }]; } });

class AppService {
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
        this.selectededObject = new Subject();
        this.setSelectedObjectColor = new Subject();
        this.selectedBackGroundImage = new Subject();
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
        });
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
    setOrder(item) {
        if (!this.selections.length) {
            return;
        }
        if (item.trim() === '') {
            this.clearNextSelectedTable = true;
        }
        if (!item) {
            this.orderID = '';
        }
        this.orderID = item;
        this.performOperation.next('setOrderID');
    }
    setTable(tableName) {
        if (!this.selections.length) {
            return;
        }
        this.performOperation.next('setTableName');
    }
    delete() {
        if (!this.selections.length) {
            return;
        }
        this.performOperation.next('DELETE');
    }
    disableSelection() {
        this.performOperation.next('disableSelection');
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
}
AppService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: AppService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AppService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: AppService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: AppService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

let RL_DEFAULT_CHAIR = null;
class PreviewFurnitureComponent {
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
PreviewFurnitureComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: PreviewFurnitureComponent, deps: [{ token: AppService }], target: i0.ɵɵFactoryTarget.Component });
PreviewFurnitureComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: PreviewFurnitureComponent, selector: "pointless-preview-furniture", inputs: { type: "type", furniture: "furniture" }, ngImport: i0, template: "<div>\r\n  <canvas [id]=\"id\"></canvas>\r\n</div>\r\n", styles: ["canvas{border:1px solid #ececec}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: PreviewFurnitureComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pointless-preview-furniture', template: "<div>\r\n  <canvas [id]=\"id\"></canvas>\r\n</div>\r\n", styles: ["canvas{border:1px solid #ececec}\n"] }]
        }], ctorParameters: function () { return [{ type: AppService }]; }, propDecorators: { type: [{
                type: Input
            }], furniture: [{
                type: Input
            }] } });

// import { faListSquares } from '@fortawesome/free-solid-svg-icons';
// import { json } from 'stream/consumers';
// import { ViewJSONServiceService } from 'src/app/view-jsonservice.service';
const { RL_VIEW_WIDTH, RL_VIEW_HEIGHT, RL_FOOT, RL_AISLEGAP, RL_ROOM_OUTER_SPACING, RL_ROOM_INNER_SPACING, RL_ROOM_STROKE, RL_CORNER_FILL, RL_UNGROUPABLES, RL_CREDIT_TEXT, RL_CREDIT_TEXT_PARAMS } = _;
const { Line, Point } = fabric;
const HORIZONTAL = 'HORIZONTAL', VERTICAL = 'VERTICAL', OFFSET = RL_ROOM_INNER_SPACING / 2;
const Left = (wall) => wall.x1 < wall.x2 ? wall.x1 : wall.x2;
const Top = (wall) => wall.y1 < wall.y2 ? wall.y1 : wall.y2;
const Right = (wall) => wall.x1 > wall.x2 ? wall.x1 : wall.x2;
const Bottom = (wall) => wall.y1 > wall.y2 ? wall.y1 : wall.y2;
class ViewComponent {
    constructor(app) {
        this.app = app;
        this.outPutSelectedItem = new EventEmitter();
        this.corners = [];
        this.walls = [];
        this.lastObjectDefinition = null;
        this.lastObject = null;
        this.CTRL_KEY_DOWN = false;
        this.MOVE_WALL_ID = -1;
        this.ROOM_SIZE = { width: 960, height: 480 };
        this.DEFAULT_CHAIR = null;
        this.REMOVE_DW = false;
        this.maincontainerClass = 'main-container';
    }
    ngOnInit() {
        this.loadJSON();
        try {
            this.app.setSelectedObjectColor.subscribe(data => {
                this.alterObjectColor(data.uuid, data.color);
                console.log('alter object color');
            });
            this.view.renderAll();
        }
        catch (error) {
        }
        try {
            this.app.roomEdition.subscribe(doEdit => {
                this.corners.forEach(c => this.setCornerStyle(c));
                this.drawRoom();
                if (doEdit) {
                    this.editRoom();
                }
                else {
                    this.cancelRoomEdition();
                }
            });
        }
        catch (error) {
        }
        try {
            this.app.insertObject.subscribe(res => {
                this.handleObjectInsertion(res);
                this.saveState();
            });
        }
        catch (error) {
        }
        this.app.defaultChair.subscribe(res => this.DEFAULT_CHAIR = res);
        try {
            this.app.selectedBackGroundImage.subscribe(data => {
                this.setBackgroundImage(data);
            });
        }
        catch (error) {
        }
        this.app.performOperation.subscribe(operation => {
            switch (operation) {
                case 'UNDO':
                    this.undo();
                    break;
                case 'REDO':
                    this.redo();
                    break;
                case 'COPY':
                    this.copy();
                    break;
                case 'PASTE':
                    this.paste();
                    break;
                case 'DELETE':
                    this.delete();
                    break;
                case 'ROTATE':
                    this.rotate();
                    break;
                case 'ROTATE_ANTI':
                    this.rotate(false);
                    break;
                case 'setTableName':
                    this.setTableName(this.app.tableName);
                    break;
                case 'setOrderID':
                    if (this.app.clearNextSelectedTable) {
                        this.setObjectOrderID('');
                        this.app.clearNextSelectedTable = false;
                        return;
                    }
                    this.setObjectOrderID(this.app.orderID);
                    break;
                case 'clearLayout':
                    this.clearLayout();
                    break;
                case 'GROUP':
                    this.group();
                    break;
                case 'UNGROUP':
                    this.ungroup();
                    break;
                case 'HORIZONTAL':
                case 'VERTICAL':
                    this.placeInCenter(operation);
                    break;
                case 'ROOM_OPERATION':
                    // this.drawRoom();
                    break;
                case 'PNG':
                    break;
                case 'loadjson':
                    this.loadJSON();
                    break;
                case 'save':
                    this.saveState();
                    break;
                case 'json':
                    this.saveState();
                    break;
                case 'saveFullJson':
                    this.app.jsonValue.next(JSON.stringify(this.view.toJSON(['name'])));
                    break;
                case 'ZOOM':
                    this.setZoom();
                    break;
                case 'InitLayout':
                    this.initLayout();
                    break;
                case 'disableSelection':
                    this.toggleSelection(false);
                    break;
                case 'disableSelection':
                    this.toggleSelection(true);
                    break;
                case 'LEFT':
                case 'CENTER':
                case 'RIGHT':
                case 'TOP':
                case 'MIDDLE':
                case 'BOTTOM':
                    this.arrange(operation);
                    break;
            }
        });
    }
    ngAfterViewInit() {
        /** Initialize canvas */
        this.initLayout();
    }
    initLayout() {
        this.app.saveState.next(JSON.stringify(null));
        this.setCanvasView();
        /** Add room */
        this.setRoom(this.ROOM_SIZE);
        this.saveState();
    }
    get room_origin() {
        return RL_ROOM_OUTER_SPACING + RL_ROOM_INNER_SPACING;
    }
    onKeyDown(event) {
        const code = event.key || event.keyCode;
        // Ctrl Key is down
        if (event.ctrlKey) {
            this.CTRL_KEY_DOWN = true;
            // Ctrl + Shift + Z
            if (event.shiftKey && code === 90)
                this.app.redo();
            else if (code === 90)
                this.app.undo();
            else if (code === 67)
                this.app.copy();
            else if (code === 86)
                this.paste();
            else if (code === 37)
                this.rotate();
            else if (code === 39)
                this.rotate(false);
            else if (code === 71)
                this.group();
        }
        else if (code === 46)
            this.delete();
        else if (code === 37)
            this.move('LEFT');
        else if (code === 38)
            this.move('UP');
        else if (code === 39)
            this.move('RIGHT');
        else if (code === 40)
            this.move('DOWN');
    }
    onKeyUp(event) {
        if (event.key === 'Control') {
            this.CTRL_KEY_DOWN = false;
        }
    }
    onScroll(event) { }
    setGroupableState() {
        if (this.app.selections.length > 1) {
            this.app.ungroupable = false;
            return;
        }
        const obj = this.view.getActiveObject();
        try {
            const type = obj.name ? obj.name.split(':')[0] : '';
            if (RL_UNGROUPABLES.indexOf(type) > -1) {
                this.app.ungroupable = false;
            }
            else {
                this.app.ungroupable = true;
            }
        }
        catch (error) {
        }
    }
    setObjectSettings(object, key, color) {
        fabric.Group.prototype.selectionBackgroundColor = 'rgba(255,100,171,0.25)';
        fabric.Group.prototype.backgroundColor = 'rgba(255,100,171,0.25)';
        fabric.Group.prototype.fill = 'rgba(255,100,171,0.25)';
        fabric.Group.prototype.strokeWidth = 3;
    }
    onSelected() {
        if (!this.view) {
            console.log('view is undefined');
            return;
        }
        const active = this.view.getActiveObject();
        if (!this.view || !active) {
            console.log('active is undefined');
            return;
        }
        // this.setObjectSettings(active, 'fill', 'red')
        // // active._renderFill('purple', () => { });
        // return;
        try {
            active.lockScalingX = true, active.lockScalingY = true;
            if (!active.name) {
                active.name = 'GROUP';
            }
        }
        catch (error) {
        }
        this.app.selections = this.view.getActiveObjects();
        this.setGroupableState();
    }
    setSelectedObjectColor(item, color, saveState) {
        // const item = this.view.getActiveObject();
        if (!item) {
            return;
        }
        if (item.name) {
            const uid = item.name.split(';')[0];
            // const json = this.alterObjectColor(item.name, color);
            this.drawRoom();
            this.saveState();
            // this.view.loadFromJSON(json, function() { });
        }
        return;
    }
    setBackgroundImage(image) {
        if (!image || image === '') {
            return;
        }
        this.view.setBackgroundImage(image, this.view.renderAll.bind(this.view), {});
    }
    setObjectOrderID(orderID) {
        var _a;
        if (this.selectedObject) {
            const item = (_a = this.selectedObject) === null || _a === void 0 ? void 0 : _a.name;
            if (item) {
                const uid = item.split(';')[0];
                const name = item.split(';')[2];
                let status = item.split(';')[3];
                status = this.getStatusDescription(orderID);
                if (!orderID || orderID == undefined || orderID == 'null' || orderID == null) {
                    orderID = '';
                    status = 'inactive';
                }
                this.app.orderID = orderID;
                const newItem = `${uid};${orderID};${name};${status}`;
                this.selectedObject.name = newItem;
            }
        }
    }
    getStatusDescription(orderID) {
        let status;
        if (orderID) {
            if (status) {
                status = 'active';
            }
        }
        if (!orderID || orderID == '') {
            if (!status) {
                status = 'inactive';
            }
        }
        return status;
    }
    setTableName(name) {
        var _a;
        if (this.selectedObject) {
            let order;
            let status;
            let uuid;
            const item = (_a = this.selectedObject) === null || _a === void 0 ? void 0 : _a.name;
            if (item && (item.split(';').length > 0 || item.split(';').length == 0)) {
                uuid = item.split(';')[0];
            }
            // if (item && (item.split(';').length>1 || item.split(';').length == 1) ){
            //    uid   = item.split(';')[1];
            // }
            // if (item && (item.split(';').length>2 || item.split(';').length == 2) ){
            //    name   = item.split(';')[2];
            // }
            // if (item && (item.split(';').length>3 || item.split(';').length == 3) ){
            //    status   = item.split(';')[3];
            // }
            status = 'inactive';
            const newItem = `${uuid};${order};${name};${status}`;
            console.log('newItem', newItem);
            this.selectedObject.name = newItem;
            this.saveState();
            this.app.tableName = '';
        }
    }
    setTableStatus(status) {
        var _a;
        if (this.selectedObject) {
            const item = (_a = this.selectedObject) === null || _a === void 0 ? void 0 : _a.name;
            const uid = item.split(';')[0];
            const order = item.split(';')[1];
            const name = item.split(';')[2];
            const newItem = `${uid};${order};${name};${status}`;
            this.selectedObject.name = newItem;
            this.saveState();
            this.app.tableStatus = '';
        }
    }
    /**********************************************************************************************************
     * init the canvas view & bind events
     * -------------------------------------------------------------------------------------------------------
     */
    setCanvasView() {
        const canvas = new fabric.Canvas('main');
        canvas.setWidth(RL_VIEW_WIDTH * RL_FOOT);
        canvas.setHeight(RL_VIEW_HEIGHT * RL_FOOT);
        this.view = canvas;
        const cornersOfWall = (obj) => {
            const id = Number(obj.name.split(':')[1]);
            const v1Id = id;
            const v1 = this.corners[v1Id];
            const v2Id = (id + 1) % this.walls.length;
            const v2 = this.corners[v2Id];
            return { v1, v1Id, v2, v2Id };
        };
        this.view.on('selection:created', (e) => {
            if (this.app.roomEdit) {
                return;
            }
            this.onSelected();
            // console.log('selection:created', this.app.roomEdit)
        });
        this.view.on('selection:updated', (e) => {
            if (this.app.roomEdit) {
                return;
            }
            this.onSelected();
            // console.log('selection:updated', this.app.roomEdit)
        });
        this.view.on('selection:cleared', (e) => {
            if (this.app.roomEdit) {
                return;
            }
            this.app.selections = [];
            this.app.ungroupable = false;
        });
        this.view.on('object:moved', () => {
            // console.log('object:moved', this.app.roomEdit)
            if (this.MOVE_WALL_ID !== -1) {
                this.MOVE_WALL_ID = -1;
            }
            this.saveState();
        });
        this.view.on('object:rotated', () => this.saveState());
        this.view.on('mouse:down:before', (e) => {
            this.app.selections = [];
            const obj = e.target;
            this.selectedObject = obj;
            this.app.selections.push(obj);
            this.app.selectededObject.next(obj);
            if (this.app.roomEdit && obj && (obj === null || obj === void 0 ? void 0 : obj.name.indexOf('WALL')) > -1 && obj instanceof Line) {
                let { v1, v2, v1Id, v2Id } = cornersOfWall(obj);
                const v0Id = (v1Id === 0) ? this.corners.length - 1 : v1Id - 1;
                const v3Id = (v2Id === this.corners.length - 1) ? 0 : v2Id + 1;
                const v0 = this.corners[v0Id];
                const v3 = this.corners[v3Id];
                this.MOVE_WALL_ID = v1Id;
                if ((v0.top === v1.top && v1.top === v2.top) || (v0.left === v1.left && v1.left === v2.left)) {
                    this.corners.splice(v1Id, 0, this.drawCorner(new Point(v1.left, v1.top)));
                    this.MOVE_WALL_ID = v1Id + 1;
                    v2Id += 1;
                }
                if ((v1.top === v2.top && v2.top === v3.top) || (v1.left === v2.left && v2.left === v3.left)) {
                    this.corners.splice(v2Id + 1, 0, this.drawCorner(new Point(v2.left, v2.top)));
                }
                this.drawRoom();
                this.saveState();
            }
            ;
        });
        this.view.on('object:moving', (e) => {
            // console.log('object:moving', this.app.roomEdit)
            if (this.MOVE_WALL_ID !== -1) {
                const p = e['pointer'];
                const v1 = this.corners[this.MOVE_WALL_ID];
                const v2 = this.corners[(this.MOVE_WALL_ID + 1) % this.corners.length];
                const direction = v1.left === v2.left ? 'HORIZONTAL' : 'VERTICAL';
                if (p.y < RL_ROOM_OUTER_SPACING) {
                    p.y = RL_ROOM_OUTER_SPACING;
                }
                if (p.x < RL_ROOM_OUTER_SPACING) {
                    p.x = RL_ROOM_OUTER_SPACING;
                }
                if (direction === 'VERTICAL') {
                    v1.top = v2.top = p.y;
                }
                else {
                    v1.left = v2.left = p.x;
                }
                this.drawRoom();
            }
            const obj = e.target;
            const point = e['pointer'];
            if (obj && this.isDW(obj) && obj instanceof fabric.Group) {
                let wall, distance = 999;
                const dist2 = (v, w) => (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
                const point_to_line = (p, v, w) => Math.sqrt(distToSegmentSquared(p, v, w));
                const distToSegmentSquared = (p, v, w) => {
                    const l2 = dist2(v, w);
                    if (l2 == 0)
                        return dist2(p, v);
                    const t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
                    if (t < 0)
                        return dist2(p, v);
                    if (t > 1)
                        return dist2(p, w);
                    return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
                };
                this.walls.forEach(w => {
                    const d = point_to_line(point, { x: w.x1, y: w.y1 }, { x: w.x2, y: w.y2 });
                    if (d < distance) {
                        distance = d, wall = w;
                    }
                });
                if (distance > 20) {
                    this.REMOVE_DW = true;
                }
                else {
                    this.REMOVE_DW = false;
                    const direction = this.directionOfWall(wall);
                    if (direction === HORIZONTAL) {
                        this.locateDW(obj, wall, point.x, Top(wall));
                    }
                    else {
                        this.locateDW(obj, wall, Left(wall), point.y);
                    }
                }
            }
        });
        this.view.on('mouse:up', (e) => {
            const obj = e.target;
            if (this.REMOVE_DW) {
                this.view.remove(obj);
                this.REMOVE_DW = false;
            }
        });
        this.view.on('mouse:dblclick', (e) => {
            const obj = e.target;
            if (this.app.roomEdit && this.app.roomEditOperate === 'CORNER' && obj && obj.name.indexOf('WALL') > -1 && obj instanceof Line) {
                const p = e['pointer'];
                const { v1, v1Id, v2, v2Id } = cornersOfWall(obj);
                const ind = v1Id < v2Id ? v1Id : v2Id;
                if (v1.left === v2.left) {
                    p.x = v1.left;
                }
                else if (v1.top === v2.top) {
                    p.y = v1.top;
                }
                const newCorner = this.drawCorner(new Point(p.x, p.y));
                if (Math.abs(v1Id - v2Id) != 1) {
                    this.corners.push(newCorner);
                }
                else {
                    this.corners.splice(ind + 1, 0, newCorner);
                }
                this.drawRoom();
                this.saveState();
            }
        });
    }
    /**********************************************************************************************************
     * draw Rooms defined in Model
     * -------------------------------------------------------------------------------------------------------
     */
    setRoom({ width, height }) {
        if (this.walls.length) {
            this.view.remove(...this.walls);
            this.view.renderAll();
        }
        const LT = new Point(RL_ROOM_OUTER_SPACING, RL_ROOM_OUTER_SPACING);
        const RT = new Point(LT.x + width, LT.y);
        const LB = new Point(LT.x, LT.y + height);
        const RB = new Point(RT.x, LB.y);
        this.corners = [LT, RT, RB, LB].map(p => this.drawCorner(p));
        this.drawRoom();
    }
    /**********************************************************************************************************
     * set corner according to current edition status
     * -------------------------------------------------------------------------------------------------------
     */
    setCornerStyle(c) {
        c.moveCursor = this.view.freeDrawingCursor;
        c.hoverCursor = this.view.freeDrawingCursor;
        c.selectable = false;
        c.evented = false;
        c.width = c.height = (RL_ROOM_INNER_SPACING / (this.app.roomEdit ? 1.5 : 2)) * 2;
        c.set('fill', this.app.roomEdit ? RL_CORNER_FILL : RL_ROOM_STROKE);
    }
    /**********************************************************************************************************
     * draw corner
     * -------------------------------------------------------------------------------------------------------
     */
    drawCorner(p) {
        const c = new fabric.Rect({
            left: p.x,
            top: p.y,
            strokeWidth: 0,
            hasControls: false,
            originX: 'center',
            originY: 'center',
            name: 'CORNER'
        });
        this.setCornerStyle(c);
        return c;
    }
    /**********************************************************************************************************
     * draw room
     * -------------------------------------------------------------------------------------------------------
     */
    drawRoom() {
        let exists;
        try {
            exists = this.view.getObjects().filter(obj => obj.name.indexOf('WALL') > -1 || obj.name === 'CORNER');
        }
        catch (error) {
        }
        try {
            this.view.remove(...exists);
            this.view.add(...this.corners);
            const wall = (coords, index) => new Line(coords, {
                stroke: RL_ROOM_STROKE,
                strokeWidth: RL_ROOM_INNER_SPACING,
                name: `WALL:${index}`,
                originX: 'center',
                originY: 'center',
                hoverCursor: this.app.roomEdit ? this.view.moveCursor : this.view.defaultCursor,
                hasControls: false,
                hasBorders: false,
                selectable: this.app.roomEdit,
                evented: this.app.roomEdit,
                cornerStyle: 'rect'
            });
            let LT = new Point(9999, 9999), RB = new Point(0, 0);
            this.walls = this.corners.map((corner, i) => {
                const start = corner;
                const end = (i === this.corners.length - 1) ? this.corners[0] : this.corners[i + 1];
                if (corner.top < LT.x && corner.left < LT.y)
                    LT = new Point(corner.left, corner.top);
                if (corner.top > RB.y && corner.left > RB.y)
                    RB = new Point(corner.left, corner.top);
                const w = wall([start.left, start.top, end.left, end.top], i);
                return w;
            });
            this.view.add(...this.walls);
            this.walls.forEach(w => w.sendToBack());
            this.ROOM_SIZE = { width: RB.x - LT.x, height: RB.y - LT.y };
        }
        catch (error) {
        }
    }
    locateDW(dw, wall, x, y) {
        const dWall = this.directionOfWall(wall);
        const dDW = dw.angle % 180 === 0 ? HORIZONTAL : VERTICAL;
        if (dWall != dDW) {
            dw.angle = (dw.angle + 90) % 360;
        }
        dw.top = y, dw.left = x;
        const center = dw.getCenterPoint();
        if (dWall === HORIZONTAL)
            center.y < dw.top ? dw.top += OFFSET : dw.top -= OFFSET;
        else
            center.x < dw.left ? dw.left += OFFSET : dw.left -= OFFSET;
        return dw;
    }
    setDWOrigin(dw) {
        if (!dw.flipX && !dw.flipY)
            dw.originX = 'left', dw.originY = 'top';
        else if (dw.flipX && !dw.flipY)
            dw.originX = 'right', dw.originY = 'top';
        else if (!dw.flipX && dw.flipY)
            dw.originX = 'left', dw.originY = 'bottom';
        else if (dw.flipX && dw.flipY)
            dw.originX = 'right', dw.originY = 'bottom';
        return dw;
    }
    /**********************************************************************************************************/
    editRoom() {
        if (!this.view) {
            console.log('no view');
            return;
        }
        if (this.view.getObjects()) {
            let items = this.view.getObjects();
            items.forEach(r => {
                var _a;
                if ((r === null || r === void 0 ? void 0 : (_a = r === null || r === void 0 ? void 0 : r.name) === null || _a === void 0 ? void 0 : _a.indexOf('WALL')) !== -1) {
                    r.selectable = false;
                    r.evented = false;
                }
                else {
                    if (this.app.userMode) {
                        r.selectable = false;
                        r.evented = true;
                    }
                    if (!this.app.userMode) {
                        r.selectable = true;
                        r.evented = true;
                    }
                }
            });
        }
        if (this.app.roomEditStates.length === 0)
            this.saveState();
    }
    cancelRoomEdition() {
        if (!this.view) {
            console.log('no view');
            return;
        }
        this.view.getObjects().forEach(r => {
            try {
                if (r.name.indexOf('WALL') !== -1 || r.name.indexOf('CORNER') !== -1) {
                    r.selectable = false;
                    r.evented = false;
                }
                else {
                    r.selectable = true;
                    r.evented = true;
                }
            }
            catch (error) {
            }
        });
    }
    setItemStatus(type, object) {
        if (object && type) {
            if (type === 'table') {
                if (object.name != '') {
                    const items = object.split(';');
                    //type
                    if (items.length >= 0 && items[0]) {
                    }
                    //id
                    if (items.length >= 1 && items[1]) {
                    }
                    //order
                    if (items.length >= 2 && items[2]) {
                    }
                    //status\
                    if (items.length >= 2 && items[3]) {
                    }
                    if (items.length == 3 && items[3]) {
                        const status = items[3];
                        if (status == '') {
                            object.fill = 'purple';
                            object.stroke = 'white';
                        }
                        if (status == '1') {
                            object.fill = 'green';
                            object.stroke = 'white';
                        }
                        if (status == '2') {
                            object.fill = 'yellow';
                            object.stroke = 'white';
                        }
                        if (status == '3') {
                            object.fill = 'red';
                            object.stroke = 'white';
                        }
                    }
                }
            }
            return object;
        }
    }
    handleObjectInsertion({ type, object }) {
        if (this.userMode) {
            if (type === 'ROOM') {
                this.setRoom(object);
                return;
            }
        }
        if (type === 'ROOM' || type === 'DOOR' || type === 'WINDOW') {
            return;
        }
        object = this.setItemStatus(type, object);
        let group;
        if (type === 'table') {
            const chair = {};
            group = createTable(type, object, chair);
        }
        if (type != 'table') {
            group = createFurniture(type, object, this.DEFAULT_CHAIR);
        }
        // console.log(group);
        if (type === 'DOOR' || type === 'WINDOW') {
            group.originX = 'center';
            group.originY = 'top';
            const dws = this.filterObjects(['DOOR', 'WINDOW']);
            const dw = dws.length ? dws[dws.length - 1] : null;
            let wall, x, y;
            if (!dw) {
                wall = this.walls[0];
                x = Left(wall) + RL_AISLEGAP;
                y = Top(wall);
            }
            else {
                const od = dw.angle % 180 === 0 ? HORIZONTAL : VERTICAL;
                let placeOnNextWall = false;
                wall = this.wallOfDW(dw);
                if (od === HORIZONTAL) {
                    x = dw.left + dw.width + RL_AISLEGAP;
                    y = Top(wall);
                    if (x + group.width > Right(wall)) {
                        placeOnNextWall = true;
                    }
                }
                else {
                    y = dw.top + dw.width + RL_AISLEGAP;
                    x = Left(wall);
                    if (y + group.width > Bottom(wall)) {
                        placeOnNextWall = true;
                    }
                }
                if (placeOnNextWall) {
                    wall = this.walls[(Number(wall.name.split(':')[1]) + 1) % this.walls.length];
                    const nd = this.directionOfWall(wall);
                    if (nd === HORIZONTAL) {
                        x = Left(wall) + RL_AISLEGAP, y = Top(wall);
                    }
                    else {
                        x = Left(wall), y = Top(wall) + RL_AISLEGAP;
                    }
                }
            }
            this.locateDW(group, wall, x, y);
            group.hasBorders = false;
            this.view.add(group);
            return;
        }
        // retrieve spacing from object, use rlAisleGap if not specified
        const newLR = object.lrSpacing || RL_AISLEGAP;
        const newTB = object.tbSpacing || RL_AISLEGAP;
        // object groups use center as origin, so add half width and height of their reported
        // width and size; note that this will not account for chairs around tables, which is
        // intentional; they go in the specified gaps
        group.left = newLR + (group.width / 2) + this.room_origin;
        group.top = newTB + (group.height / 2) + this.room_origin;
        if (this.lastObject) {
            // retrieve spacing from object, use rlAisleGap if not specified
            const lastLR = this.lastObjectDefinition.lrSpacing || RL_AISLEGAP;
            const lastTB = this.lastObjectDefinition.tbSpacing || RL_AISLEGAP;
            // calculate maximum gap required by last and this object
            // Note: this isn't smart enough to get new row gap right when
            // object above had a much bigger gap, etc. We aren't fitting yet.
            const useLR = Math.max(newLR, lastLR), useTB = Math.max(newTB, lastTB);
            // using left/top vocab, though all objects are now centered
            const lastWidth = this.lastObjectDefinition.width || 100;
            const lastHeight = this.lastObjectDefinition.height || 40;
            let newLeft = this.lastObject.left + lastWidth + useLR;
            let newTop = this.lastObject.top;
            // make sure we fit left to right, including our required right spacing
            if (newLeft + group.width + newLR > this.ROOM_SIZE.width) {
                newLeft = newLR + (group.width / 2);
                newTop += lastHeight + useTB;
            }
            group.left = newLeft;
            group.top = newTop;
            if ((group.left - group.width / 2) < this.room_origin) {
                group.left += this.room_origin;
            }
            if ((group.top - group.height / 2) < this.room_origin) {
                group.top += this.room_origin;
            }
        }
        group.fill = 'blue';
        this.view.add(group);
        this.view.setActiveObject(group);
        this.lastObject = group;
        this.lastObjectDefinition = object;
    }
    /** Save current state */
    saveState() {
        if (this.app.userMode) {
            const state = this.view.toDatalessJSON(['name', 'hasControls', 'selectable',
                'hasBorders', 'evented', 'hoverCursor']);
            this.app.saveState.next(JSON.stringify(state));
            return;
        }
        const state = this.view.toDatalessJSON(['name', 'hasControls', 'selectable',
            'hasBorders', 'evented', 'hoverCursor', 'moveCursor']);
        this.app.saveState.next(JSON.stringify(state));
    }
    undo() {
        let current = null;
        if (this.app.roomEdit) {
            const state = this.app.roomEditStates.pop();
            this.app.roomEditRedoStates.push(state);
            current = this.app.roomEditStates[this.app.roomEditStates.length - 1];
        }
        else {
            const state = this.app.states.pop();
            this.app.redoStates.push(state);
            current = this.app.states[this.app.states.length - 1];
        }
        this.view.clear();
        this.view.loadFromJSON(current, () => {
            this.view.renderAll();
            this.corners = this.view.getObjects().filter(obj => obj.name === 'CORNER');
            this.drawRoom();
        });
    }
    /** Redo operation */
    redo() {
        let current = null;
        if (this.app.roomEdit) {
            current = this.app.roomEditRedoStates.pop();
            this.app.roomEditStates.push(current);
        }
        else {
            current = this.app.redoStates.pop();
            this.app.states.push(current);
        }
        this.view.clear();
        this.view.loadFromJSON(current, () => {
            this.view.renderAll();
            this.corners = this.view.getObjects().filter(obj => obj.name === 'CORNER');
            this.drawRoom();
        });
    }
    /** Copy operation */
    copy() {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!active) {
            return;
        }
        active.clone(cloned => this.app.copied = cloned, ['pointname', 'name', 'hasControls']);
    }
    /** Paste operation */
    paste() {
        if (this.userMode) {
            return;
        }
        if (!this.app.copied || this.app.roomEdit) {
            return;
        }
        this.app.copied.clone((cloned) => {
            this.view.discardActiveObject();
            cloned.set({
                left: cloned.left + RL_AISLEGAP,
                top: cloned.top + RL_AISLEGAP
            });
            if (cloned.type === 'activeSelection') {
                cloned.canvas = this.view;
                cloned.forEachObject(obj => this.view.add(obj));
                cloned.setCoords();
            }
            else {
                this.view.add(cloned);
            }
            this.app.copied.top += RL_AISLEGAP;
            this.app.copied.left += RL_AISLEGAP;
            this.view.setActiveObject(cloned);
            this.view.requestRenderAll();
            this.saveState();
        }, ['name', 'hasControls']);
    }
    clearLayout() {
        this.app.loadJson('');
        this.initLayout();
    }
    /** Delete operation */
    delete() {
        // console.log(this.app.selections)
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            console.log('no items');
            return;
        }
        if (this.app.selections) {
            this.app.selections.forEach(selection => this.view.remove(selection));
        }
        try {
            this.view.discardActiveObject();
            this.view.requestRenderAll();
        }
        catch (error) {
            console.log('error', error);
        }
        this.saveState();
    }
    /** Rotate Operation */
    rotate(clockwise = true) {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        let angle = this.CTRL_KEY_DOWN ? 90 : 15;
        const obj = this.view.getActiveObject();
        if (!obj) {
            return;
        }
        if ((obj.originX !== 'center' || obj.originY !== 'center') && obj.centeredRotation) {
            obj.originX = 'center';
            obj.originY = 'center';
            obj.left += obj.width / 2;
            obj.top += obj.height / 2;
        }
        if (this.isDW(obj)) {
            angle = obj.angle + (clockwise ? 180 : -180);
        }
        else {
            angle = obj.angle + (clockwise ? angle : -angle);
        }
        if (angle > 360) {
            angle -= 360;
        }
        else if (angle < 0) {
            angle += 360;
        }
        obj.angle = angle;
        this.view.requestRenderAll();
    }
    /** Group */
    group() {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!(this.app.selections.length > 1 && active instanceof fabric.ActiveSelection)) {
            return;
        }
        active.toGroup();
        active.lockScalingX = true, active.lockScalingY = true;
        this.onSelected();
        this.view.renderAll();
        this.saveState();
    }
    ungroup() {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!(active && active instanceof fabric.Group)) {
            return;
        }
        active.toActiveSelection();
        active.lockScalingX = true, active.lockScalingY = true;
        this.onSelected();
        this.view.renderAll();
        this.saveState();
    }
    move(direction, increament = 6) {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!active) {
            return;
        }
        switch (direction) {
            case 'LEFT':
                active.left -= increament;
                break;
            case 'UP':
                active.top -= increament;
                break;
            case 'RIGHT':
                active.left += increament;
                break;
            case 'DOWN':
                active.top += increament;
                break;
        }
        this.view.requestRenderAll();
        this.saveState();
    }
    setZoom() {
        this.view.setZoom(this.app.zoom / 100);
        this.view.renderAll();
    }
    setScalingZoom() {
        // this.view.setDimensions({ width: this.view.getWidth() * this.app.scaleRatio,
        //                        height: this.view.getHeight() * this.app.scaleRatio });
    }
    placeInCenter(direction) {
        if (this.userMode) {
            return;
        }
        if (this.app.roomEdit) {
            return;
        }
        const active = this.view.getActiveObject();
        if (!active) {
            return;
        }
        if (direction === 'HORIZONTAL') {
            active.left = this.ROOM_SIZE.width / 2 - (active.originX === 'center' ? 0 : active.width / 2);
        }
        else {
            active.top = this.ROOM_SIZE.height / 2 - (active.originX === 'center' ? 0 : active.height / 2);
        }
        active.setCoords();
        this.view.requestRenderAll();
        this.saveState();
    }
    arrange(action) {
        const rect = this.getBoundingRect(this.app.selections);
        action = action.toLowerCase();
        this.app.selections.forEach(s => {
            if (action === 'left' || action === 'right' || action === 'center') {
                s.left = rect[action];
            }
            else {
                s.top = rect[action];
            }
        });
        this.view.renderAll();
        this.saveState();
    }
    filterObjects(names) {
        return this.view.getObjects().filter(obj => names.some(n => obj.name.indexOf(n) > -1));
    }
    wallOfDW(dw) {
        const d = dw.angle % 180 === 0 ? HORIZONTAL : VERTICAL;
        return this.walls.find(w => Math.abs(d === HORIZONTAL ? w.top - dw.top : w.left - dw.left) === OFFSET);
    }
    directionOfWall(wall) {
        if (wall.x1 === wall.x2) {
            return VERTICAL;
        }
        else {
            return HORIZONTAL;
        }
    }
    isDW(object) {
        return object.name.indexOf('DOOR') > -1 || object.name.indexOf('WINDOW') > -1;
    }
    getBoundingRect(objects) {
        let top = 9999, left = 9999, right = 0, bottom = 0;
        objects.forEach(obj => {
            if (obj.left < top) {
                top = obj.top;
            }
            if (obj.left < left) {
                left = obj.left;
            }
            if (obj.top > bottom) {
                bottom = obj.top;
            }
            if (obj.left > right) {
                right = obj.left;
            }
        });
        const center = (left + right) / 2;
        const middle = (top + bottom) / 2;
        return { left, top, right, bottom, center, middle };
    }
    loadJSON() {
        this.app.jsonValue.subscribe(data => {
            if (this.userMode) {
                this.maincontainerClass = 'main-container-usermode';
            }
            if (!this.userMode) {
                this.maincontainerClass = 'main-container';
            }
            try {
                if (!data || data == null && this.view) {
                    console.log('clear');
                    this.view.loadFromJSON(null, function () {
                        this.view.renderAll();
                    });
                    this.view.loadFromJSON(data, this.view.renderAll.bind(this.view));
                    return;
                }
            }
            catch (error) {
                console.log('error', error);
            }
            this.view.loadFromJSON(data, this.view.renderAll.bind(this.view));
        });
    }
    toggleSelection(selectable) {
        this.view.getObjects().forEach((obj, index) => {
            obj.selectable = selectable;
            obj.evented = true;
        });
    }
    isJsonStructure(str) {
        if (typeof str !== 'string')
            return false;
        try {
            const result = JSON.parse(str);
            const type = Object.prototype.toString.call(result);
            return type === '[object Object]'
                || type === '[object Array]';
        }
        catch (err) {
            return false;
        }
    }
    alterObjectColor(uuID, color) {
        const view = this.view;
        if (view) {
            console.log('uuid', uuID);
            console.log(view._objects);
            if (view._objects) {
                view._objects.forEach(data => {
                    if (data && (data === null || data === void 0 ? void 0 : data.type) && ((data === null || data === void 0 ? void 0 : data.type) === 'group')) {
                        const itemValue = data === null || data === void 0 ? void 0 : data.name.split(";");
                        console.log(data === null || data === void 0 ? void 0 : data.name, uuID);
                        console.log('itemValue', itemValue);
                        if (itemValue.length > 0) {
                            const itemUUID = itemValue[0];
                            if (uuID === itemUUID) {
                                console.log('itemValue update ', itemValue);
                                let stroke = 5;
                                if (color === 'red' || color === 'rgb(200,10,10)') {
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    let stroke = 8;
                                }
                                if (color === 'green' || color === 'rgb(10,10,200)') {
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    let stroke = 5;
                                }
                                if (color === 'yellow' || color === 'rgb(10,10,200)') {
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    let stroke = 5;
                                }
                                if ((data === null || data === void 0 ? void 0 : data.backgroundColor) === 'purple' ||
                                    (data === null || data === void 0 ? void 0 : data.backgroundColor) === 'rgba(255,100,171,0.25)') {
                                    // console.log('name successful setting color', name, data?.backgroundColor, color);
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    data.stroke = color;
                                    data.strokeWidth = stroke;
                                }
                                if ((data === null || data === void 0 ? void 0 : data.backgroundColor) === 'purple' ||
                                    (data === null || data === void 0 ? void 0 : data.backgroundColor) === 'rgba(255,100,171,0.25)') {
                                    // console.log('name successful setting color 2', name, data?.backgroundColor, color);
                                    data.backgroundColor = color;
                                    data.borderColor = color;
                                    data.stroke = color;
                                    data.strokeWidth = stroke;
                                }
                                this.alterColor(color, data, stroke - 3);
                                //   }
                                // }
                            }
                            ;
                        }
                    }
                });
            }
        }
        return view;
    }
    alterColor(color, obj, stroke) {
        obj.borderColor = color;
        obj.stroke = color;
        obj.strokeWidth = stroke;
        if (obj.objects && obj.objects.length > 0) {
            obj.objects.forEach(item => {
                this.alterColor(color, item, stroke);
            });
        }
        return obj;
    }
}
ViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: ViewComponent, deps: [{ token: AppService }], target: i0.ɵɵFactoryTarget.Component });
ViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: ViewComponent, selector: "pointless-room-layout-view", inputs: { userMode: "userMode" }, outputs: { outPutSelectedItem: "outPutSelectedItem" }, host: { listeners: { "document:keydown": "onKeyDown($event)", "document:keyup": "onKeyUp($event)" } }, ngImport: i0, template: "<div [class]=\"maincontainerClass\"  >\r\n  <canvas  id=\"main\"></canvas>\r\n</div>\r\n", styles: [".main-container{padding:24px;overflow:auto;height:calc(100% - 199px)}.main-container-usermode{padding:15px;overflow:auto;height:calc(100% - 100px)}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: ViewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pointless-room-layout-view', host: {
                        '(document:keydown)': 'onKeyDown($event)',
                        '(document:keyup)': 'onKeyUp($event)'
                    }, template: "<div [class]=\"maincontainerClass\"  >\r\n  <canvas  id=\"main\"></canvas>\r\n</div>\r\n", styles: [".main-container{padding:24px;overflow:auto;height:calc(100% - 199px)}.main-container-usermode{padding:15px;overflow:auto;height:calc(100% - 100px)}\n"] }]
        }], ctorParameters: function () { return [{ type: AppService }]; }, propDecorators: { userMode: [{
                type: Input
            }], outPutSelectedItem: [{
                type: Output
            }] } });

class RoomLayoutDesignerComponent {
    // // icons
    // faReply = faReply;
    // faShare = faShare;
    // faClone = faClone;
    // faTrash = faTrash;
    // faUndo  = faUndo;
    // faRedo  = faRedo;
    // faObjectGroup = faObjectGroup;
    // faObjectUngroup = faObjectUngroup;
    // faPlus  = faPlus;
    // faMinus = faMinus;
    constructor(app, fb, dialog) {
        this.app = app;
        this.fb = fb;
        this.dialog = dialog;
        this.isAdmin = true;
        this.userMode = false;
        //sends the current  object
        this.saveFloorPlan = new EventEmitter();
        this.newFloorPlan = new EventEmitter();
        this.setFloorPlanAndTable = new EventEmitter(); // { id:
        this.getFloorPlan = new EventEmitter(); // { id:
        this.setTable = new EventEmitter(); // {uuid:
        this.outPutJSON = new EventEmitter(); // {uuid:
        this.title = 'room-layout';
        this.init = false;
        this.furnishings = FURNISHINGS;
        this.defaultChairIndex = 0;
        this.previewItem = null;
        this.previewType = null;
    }
    ngOnInit() {
        const defaultChair = FURNISHINGS.chairs[0];
        setTimeout(() => {
            this.app.defaultChair.next(defaultChair);
            this.init = true;
        }, 100);
        this._setTableSelectedColor();
        this.setZoom();
        this.initTextForm();
        this.intTemplateSubscriber();
        this.initCurrentFloorPlan();
        this.clearTableSubscriber();
        this.initUserModeSubscriber();
        this._setTable();
        this.setOrder();
        this.performOperations();
        this.app.userMode = this.userMode;
        this._outPutJSON();
    }
    //subscribe to the client's object.
    //it can receive then update info about the table
    //using the name field.
    //and also set other features like the color.
    ngOnDestroy() {
        // if (this.app.jsonValue) {
        //   this.app.jsonValue.unsubscribe();
        // }
        // if (this.app.performOperation) {
        //   this.app.performOperation.unsubscribe();
        // }
        // if (this.app.saveState) {
        //   this.app.saveState.unsubscribe();
        // }
    }
    _outPutJSON() {
        this.app.jsonValue.subscribe(data => {
            this.outPutJSON.emit(data);
        });
    }
    setTableInfo() {
        this._setTableInfo.subscribe(data => {
            this.app.selectededObject.next(data);
        });
    }
    setZoom() {
        this._zoom.subscribe(data => {
            this.app.zoom = data;
            this.app.performOperation.next('ZOOM');
        });
    }
    getItemName(selected) {
        if (!(selected === null || selected === void 0 ? void 0 : selected.name.split(';')[2]) || (selected === null || selected === void 0 ? void 0 : selected.name.split(';')[2]) === 'itemName') {
            return '';
        }
        return selected === null || selected === void 0 ? void 0 : selected.name.split(';')[2];
    }
    getOrderName(selected) {
        if (!(selected === null || selected === void 0 ? void 0 : selected.name.split(';')[1]) || (selected === null || selected === void 0 ? void 0 : selected.name.split(';')[1]) == 'orderID' || (selected === null || selected === void 0 ? void 0 : selected.name.split(';')[1]) == 'orderid') {
            return '';
        }
        return selected === null || selected === void 0 ? void 0 : selected.name.split(';')[1];
    }
    _setTableSelectedColor() {
        if (!this.changeObjectColor) {
            console.log('no changeObjectColor');
            return;
        }
        this.changeObjectColor.subscribe(list => {
            console.log(list, this.floorPlan);
            if (list && list.length > 0) {
                list.forEach(order => {
                    const item = { uuID: order === null || order === void 0 ? void 0 : order.tableUUID, color: 'red' };
                    console.log(item);
                    this.app.setSelectedObjectColor.next(item);
                });
            }
        });
    }
    setOrder() {
        try {
            this._newOrder.subscribe(data => {
                const item = data;
                this.app.orderID = item.orderID;
                this.app.tableStatus = item.status;
                this.app.setOrder(item.orderID);
            });
        }
        catch (error) {
        }
    }
    get isRoomLayoutSelector() {
        if (this.floorPlan) {
            return this.roomLayout;
        }
        return null;
    }
    get islayoutObjects() {
        if (this.floorPlan) {
            return this.layoutObjects;
        }
        return null;
    }
    initCurrentFloorPlan() {
        try {
            if (this._floorPlan) {
                this._floorPlan.subscribe(data => {
                    if (data) {
                        this.floorPlan = data;
                        this.app.loadJson(data.template);
                        this.changeBackGroundImage();
                    }
                });
            }
        }
        catch (error) {
            console.log('initCurrentFloorPlan', error);
        }
    }
    changeBackGroundImage() {
        this.app.selectedBackGroundImage.next(this.floorPlan.image);
    }
    _saveFloorPlan() {
        this.app.performOperation.next('save');
    }
    intTemplateSubscriber() {
        try {
            this.app.saveState.subscribe(data => {
                this.setFloorPlanTemplate(data);
                return;
            });
        }
        catch (error) {
            console.log('init intTemplateSubscriber', error);
        }
    }
    setFloorPlanTemplate(data) {
        if (data && this.floorPlan) {
            if (data) {
                data = JSON.stringify(data);
                data = data.replace(/(^"|"$)/g, '');
                data = data.replaceAll('\\', '');
            }
            this.floorPlan.template = data;
            this.saveFloorPlan.emit(this.floorPlan);
        }
    }
    loadTemplate() {
        if (!this.floorPlan) {
            this.floorPlan = this.exampleFloor();
        }
        try {
            if (this.floorPlan) {
                let data = this.floorPlan.template;
                this.floorPlan.template = data.replaceAll('\\', '');
                this.floorPlan.template = this.floorPlan.template;
                this.app.loadJson(this.floorPlan.template);
            }
        }
        catch (error) {
            console.log('loadTemplate', error);
        }
    }
    clearTable() {
        this.floorPlan.template = null;
        this.app.saveState.next(null);
        this.app.performOperation.next('InitLayout');
    }
    getFloorPlanData() {
        this.getFloorPlan.emit(this.floorPlan);
    }
    toggleUserMode() {
        this.userMode = !this.userMode;
        this.toggleMode(this.userMode);
    }
    initUserModeSubscriber() {
        if (!this._userMode) {
            return;
        }
        ;
        this._userMode.subscribe(v => {
            this.toggleMode(v);
        });
    }
    clearTableSubscriber() {
        try {
            if (this._clearNextSelectedTable) {
                this._clearNextSelectedTable.subscribe(data => {
                    if (data) {
                        this.app.clearNextSelectedTable = data;
                        if (data) {
                            this.app.setOrder('');
                            return;
                        }
                    }
                    if (data) {
                        this.app.setOrder('');
                        this.app.clearNextSelectedTable = false;
                    }
                });
            }
        }
        catch (error) {
            // console.log('init _clearNextSelectedTable', error)
        }
    }
    _setTable() {
        this.app.selectededObject.subscribe(data => {
            this.setTable.emit(data);
        });
    }
    clearLayout() {
        this.app.performOperation.next('InitLayout');
    }
    isJsonStructure(str) {
        if (typeof str !== 'string')
            return false;
        try {
            const result = JSON.parse(str);
            const type = Object.prototype.toString.call(result);
            return type === '[object Object]'
                || type === '[object Array]';
        }
        catch (err) {
            return false;
        }
    }
    onZoom(value) {
        this.app.zoom = value;
        this.app.performOperation.next('ZOOM');
    }
    toggleMode(option) {
        this.userMode = option;
        this.app.userMode = option;
        if (option) {
            this.app.editRoom();
        }
        if (!option) {
            this.app.endEditRoom();
        }
    }
    performOperations() {
        if (!this._performOperations) {
            return;
        }
        this._performOperations.next(data => {
            const result = data.split(';');
            if (result[0] === 'setTableID') {
                this.app.orderID = result[0];
                this.app.setOrder(result[0]);
                this.saveFloorPlan.emit(data);
                return;
            }
            this.app.performOperation.next(data);
        });
    }
    outPutSetTable() {
        //this emits a request for a new orderID
        //the orderID will be received
        //the perform operation will be called and the delimiter with orderid will be position 2
        //the orderID will be set
        //the floorplan will be emitted.
    }
    enableLayout() {
        this.app.performOperation.next('enableSelection');
    }
    displayLayout(item) {
        this.app.performOperation.next('InitLayout');
        this.getFloorPlan.emit(item);
        if (this.userMode && !this.isAdmin) {
            if (item) {
                if (item.id) {
                    this.app.disableSelection();
                }
            }
        }
    }
    refreshObservable(item$) {
        if (!this.userMode) {
            return;
        }
        item$.pipe(repeatWhen(x => x.pipe(delay(3500)))).subscribe(data => {
            // this.orderService.updateOrderSubscription(data)
        });
    }
    insert(object, type) {
        if (this.app.roomEdit) {
            return;
        }
        const id = uuid.v4();
        object.name = id;
        this.app.insertObject.next({ type, object });
    }
    defaultChairChanged(index) {
        this.defaultChairIndex = index;
        this.app.defaultChair.next(FURNISHINGS.chairs[index]);
    }
    initTextForm() {
        this.textForm = this.fb.group({
            text: ['New Text'],
            font_size: [16],
            direction: ['HORIZONTAL']
        });
    }
    insertNewText() {
        this.insert(Object.assign(Object.assign({}, this.textForm.value), { name: 'TEXT:Text' }), 'TEXT');
    }
    layoutChairs() {
        const ref = this.dialog.open(ChairsLayoutComponent);
        ref.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.insert(res, 'LAYOUT');
        });
    }
    exampleFloor() {
        this.floorPlan = {};
        this.floorPlan.name = 'hello there';
        this.floorPlan.enabled = true;
        this.floorPlan.template = '{"version":"5.2.1","objects":[{"type":"line","version":"5.2.1","originX":"center","originY":"center","left":48,"top":288,"width":0,"height":480,"fill":"rgb(0,0,0)","stroke":"#000","strokeWidth":4,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"WALL:3","x1":0,"x2":0,"y1":240,"y2":-240},{"type":"line","version":"5.2.1","originX":"center","originY":"center","left":528,"top":528,"width":960,"height":0,"fill":"rgb(0,0,0)","stroke":"#000","strokeWidth":4,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"WALL:2","x1":480,"x2":-480,"y1":0,"y2":0},{"type":"line","version":"5.2.1","originX":"center","originY":"center","left":1008,"top":288,"width":0,"height":480,"fill":"rgb(0,0,0)","stroke":"#000","strokeWidth":4,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"WALL:1","x1":0,"x2":0,"y1":-240,"y2":240},{"type":"line","version":"5.2.1","originX":"center","originY":"center","left":528,"top":48,"width":960,"height":0,"fill":"rgb(0,0,0)","stroke":"#000","strokeWidth":4,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"WALL:0","x1":-480,"x2":480,"y1":0,"y2":0},{"type":"rect","version":"5.2.1","originX":"center","originY":"center","left":48,"top":48,"width":4,"height":4,"fill":"#000","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"name":"CORNER"},{"type":"rect","version":"5.2.1","originX":"center","originY":"center","left":1008,"top":48,"width":4,"height":4,"fill":"#000","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"name":"CORNER"},{"type":"rect","version":"5.2.1","originX":"center","originY":"center","left":1008,"top":528,"width":4,"height":4,"fill":"#000","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"name":"CORNER"},{"type":"rect","version":"5.2.1","originX":"center","originY":"center","left":48,"top":528,"width":4,"height":4,"fill":"#000","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"name":"CORNER"},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":426.5,"top":132.5,"width":73,"height":73,"fill":"blue","stroke":"purple","strokeWidth":10,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"purple","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"f5fa4b51-984a-4606-88e5-b4e7793548f6;orderid;itemName;","objects":[{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":-26,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":26,"top":0,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":270,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":26,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":360,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":-26,"top":0,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"circle","version":"5.2.1","originX":"center","originY":"center","left":0,"top":0,"width":44,"height":44,"fill":"skyBlue","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":22,"startAngle":0,"endAngle":360,"name":"f5fa4b51-984a-4606-88e5-b4e7793548f6;orderid;itemName;"}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":500.42,"top":402.29,"width":81.38,"height":83,"fill":"blue","stroke":"purple","strokeWidth":10,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"purple","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"df32785b-4ec5-463e-863c-874e66c2b48c;orderid;itemName;","objects":[{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":-31,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":26.85,"top":-15.5,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":240,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":26.85,"top":15.5,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":300,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":31,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":360,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":-26.85,"top":15.5,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":60,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":-26.85,"top":-15.5,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":120,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"circle","version":"5.2.1","originX":"center","originY":"center","left":0,"top":0,"width":54,"height":54,"fill":"skyBlue","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":27,"startAngle":0,"endAngle":360,"name":"df32785b-4ec5-463e-863c-874e66c2b48c;orderid;itemName;"}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":565.5,"top":192.5,"width":73,"height":73,"fill":"blue","stroke":"purple","strokeWidth":10,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"purple","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"8393a512-7b3d-4e1b-8b68-3c6a4c123eac;orderid;itemName;","objects":[{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":-26,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":26,"top":0,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":270,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":0,"top":26,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":360,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"group","version":"5.2.1","originX":"center","originY":"center","left":-26,"top":0,"width":19,"height":21,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"name":"CHAIR:Generic","objects":[{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":-10.5,"width":18,"height":20,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"5.2.1","originX":"left","originY":"top","left":-9.5,"top":7.5,"width":18,"height":2,"fill":"purple","stroke":"white","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]},{"type":"circle","version":"5.2.1","originX":"center","originY":"center","left":0,"top":0,"width":44,"height":44,"fill":"skyBlue","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":22,"startAngle":0,"endAngle":360,"name":"8393a512-7b3d-4e1b-8b68-3c6a4c123eac;orderid;itemName;"}]},{"type":"text","version":"5.2.1","originX":"left","originY":"top","left":48,"top":564,"width":2,"height":13.56,"fill":"#999","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Arial","fontWeight":"normal","fontSize":12,"text":"","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":{},"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline"},{"type":"text","version":"5.2.1","originX":"left","originY":"top","left":48,"top":564,"width":2,"height":13.56,"fill":"#999","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"fontFamily":"Arial","fontWeight":"normal","fontSize":12,"text":"","underline":false,"overline":false,"linethrough":false,"textAlign":"left","fontStyle":"normal","lineHeight":1.16,"textBackgroundColor":"","charSpacing":0,"styles":{},"direction":"ltr","path":null,"pathStartOffset":0,"pathSide":"left","pathAlign":"baseline"}]}';
        this.floorPlan.id = 1;
        return this.floorPlan;
    }
}
RoomLayoutDesignerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: RoomLayoutDesignerComponent, deps: [{ token: AppService }, { token: i8.FormBuilder }, { token: i1$1.MatDialog }], target: i0.ɵɵFactoryTarget.Component });
RoomLayoutDesignerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.12", type: RoomLayoutDesignerComponent, selector: "pointless-room-layout-designer", inputs: { isAdmin: "isAdmin", userMode: "userMode", _zoom: "_zoom", _userMode: "_userMode", _clearNextSelectedTable: "_clearNextSelectedTable", changeObjectColor: "changeObjectColor", floorPlan: "floorPlan", _floorPlan: "_floorPlan", _setTableInfo: "_setTableInfo", _newOrder: "_newOrder", orderID: "orderID", _performOperations: "_performOperations", _setOrder: "_setOrder", toggleButtonHidden: "toggleButtonHidden" }, outputs: { saveFloorPlan: "saveFloorPlan", newFloorPlan: "newFloorPlan", setFloorPlanAndTable: "setFloorPlanAndTable", getFloorPlan: "getFloorPlan", setTable: "setTable", outPutJSON: "outPutJSON" }, viewQueries: [{ propertyName: "layoutObjects", first: true, predicate: ["layoutObjects"], descendants: true }, { propertyName: "roomLayout", first: true, predicate: ["roomLayout"], descendants: true }], ngImport: i0, template: "<button *ngIf=\"!toggleButtonHidden\" mat-raised-button (click)=\"toggleUserMode()\">toggle</button>\r\n\r\n<mat-drawer-container hasBackdrop=\"false\">\r\n\r\n  <mat-drawer *ngIf=\"!userMode\" #drawer mode=\"side\" opened>\r\n    <mat-accordion class=\"rl-object-options\">\r\n      <span [hidden]=\"!floorPlan\">\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Rooms\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-list>\r\n            <mat-divider></mat-divider>\r\n            <ng-container *ngFor=\"let room of furnishings.rooms\">\r\n              <mat-list-item (click)=\"insert(room, 'ROOM')\">\r\n                {{room.title}}\r\n              </mat-list-item>\r\n              <mat-divider></mat-divider>\r\n            </ng-container>\r\n          </mat-list>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Doors\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let door of furnishings.doors\">\r\n              <div (click)=\"insert(door, 'DOOR')\">\r\n                <pointless-preview-furniture [type]=\"'DOOR'\" [furniture]=\"door\"></pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{door.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Windows\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let window of furnishings.windows\">\r\n              <div (click)=\"insert(window, 'WINDOW')\">\r\n                  <pointless-preview-furniture\r\n                      [type]=\"'WINDOW'\"\r\n                      [furniture]=\"window\">\r\n                  </pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{window.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Tables\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <mat-form-field>\r\n            <mat-label>Default Chair</mat-label>\r\n            <mat-select [value]=\"defaultChairIndex\"\r\n                        (valueChange)=\"defaultChairChanged($event)\">\r\n              <mat-option *ngFor=\"let chair of furnishings.chairs; let i=index;\"\r\n                          [value]=\"i\">\r\n                  {{chair.title}}\r\n              </mat-option>\r\n            </mat-select>\r\n          </mat-form-field>\r\n\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let table of furnishings.tables\">\r\n              <div (click)=\"insert(table, 'TABLE')\">\r\n                <pointless-preview-furniture\r\n                    [type]=\"'TABLE'\"\r\n                    [furniture]=\"table\">\r\n                </pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{table.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Chairs\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let chair of furnishings.chairs\">\r\n              <div (click)=\"insert(chair, 'CHAIR')\">\r\n                <pointless-preview-furniture\r\n                    [type]=\"'CHAIR'\"\r\n                    [furniture]=\"chair\">\r\n                </pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{chair.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Miscellaneous\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let m of furnishings.miscellaneous\">\r\n              <div (click)=\"insert(m, 'MISCELLANEOUS')\">\r\n                <pointless-preview-furniture\r\n                    [type]=\"'MISCELLANEOUS'\"\r\n                    [furniture]=\"m\">\r\n                </pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{m.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Text\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <form [formGroup]=\"textForm\"\r\n                class=\"new-text\"\r\n                (ngSubmit)=\"insertNewText()\">\r\n            <mat-form-field>\r\n              <input matInput placeholder=\"Input text\" formControlName=\"text\">\r\n            </mat-form-field>\r\n            <mat-form-field>\r\n              <input matInput type=\"number\"\r\n                    placeholder=\"Font Size\"\r\n                    min=\"1\"\r\n                    max=\"200\"\r\n                    formControlName=\"font_size\">\r\n            </mat-form-field>\r\n            <div style=\"margin: 1rem 0\">\r\n              <mat-radio-group formControlName=\"direction\">\r\n                <mat-radio-button value=\"HORIZONTAL\">Horizontal</mat-radio-button>\r\n                <mat-radio-button value=\"VERTICAL\">Vertical</mat-radio-button>\r\n              </mat-radio-group>\r\n            </div>\r\n            <div style=\"margin: 2rem 12px\">\r\n              <button mat-raised-button color=\"primary\" type=\"submit\">Add text</button>\r\n            </div>\r\n          </form>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Advanced\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div style=\"padding: 2rem\">\r\n            <button mat-raised-button\r\n                    color=\"primary\"\r\n                    style=\"width: 100%\"\r\n                    (click)=\"layoutChairs()\">\r\n              Layout chairs\r\n            </button>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n      </span>\r\n\r\n      <h3>Layout</h3>\r\n      <div class=\"grid-buttons\">\r\n        <div>\r\n          <button class=\"buttons\" mat-raised-button color=\"primary\"\r\n                  (click)=\"_saveFloorPlan()\">\r\n            <mat-icon>save</mat-icon>Save </button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                 (click)=\"loadTemplate()\">\r\n            <mat-icon>refresh</mat-icon>Refresh </button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                  (click)=\"app.setOrder('131390')\">\r\n            Set Order #</button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                 (click)=\"clearTable()\">\r\n           Clear Table</button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                  (click)=\"app.setObjectFillColor('red')\">\r\n            Set Red</button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                 (click)=\"app.setObjectFillColor('green')\">\r\n            Set  Green</button>\r\n        </div>\r\n      </div>\r\n\r\n      <div *ngIf=\"floorPlan && isAdmin\">\r\n        <div>\r\n              <mat-form-field appearance=\"outline\">\r\n              <mat-label >Name</mat-label>\r\n              <input matInput\r\n                    type=\"text\"\r\n                    [(ngModel)]=\"floorPlan.name\"\r\n                    class=\"form-control\" >\r\n              </mat-form-field>\r\n          </div>\r\n\r\n          <div>\r\n            <mat-form-field appearance=\"outline\">\r\n            <mat-label >Height</mat-label>\r\n            <input matInput\r\n                  type=\"text\"\r\n                  [(ngModel)]=\"floorPlan.height\"\r\n                  class=\"form-control\" >\r\n            </mat-form-field>\r\n          </div>\r\n          <div>\r\n              <mat-form-field appearance=\"outline\">\r\n              <mat-label >Width</mat-label>\r\n              <input matInput\r\n                    type=\"text\"\r\n                    [(ngModel)]=\"floorPlan.width\"\r\n                    class=\"form-control\" >\r\n              </mat-form-field>\r\n          </div>\r\n          <div>\r\n            <mat-form-field appearance=\"outline\">\r\n            <mat-label >OrderID</mat-label>\r\n            <input matInput\r\n                  type=\"text\"\r\n                  [(ngModel)]=\"app.orderID\"\r\n                  class=\"form-control\" >\r\n            </mat-form-field>\r\n          </div>\r\n          <div>\r\n            <mat-form-field appearance=\"outline\">\r\n            <mat-label >Image</mat-label>\r\n            <input matInput\r\n                  type=\"text\"\r\n                  (change)=\"changeBackGroundImage()\"\r\n                  [(ngModel)]=\"floorPlan.image\"\r\n                  class=\"form-control\" >\r\n            </mat-form-field>\r\n          </div>\r\n\r\n          <div class=\"example-full-width\">\r\n            <mat-form-field  appearance=\"fill\" >\r\n              <mat-label>Floor Plan Result</mat-label>\r\n              <textarea  cdkTextareaAutosize\r\n                        matInput\r\n                        rows = 5\r\n                        class=\"floor-plan-json\"\r\n                        [(ngModel)]=\"floorPlan.template\"\r\n                        placeholder=\"Floor plan Result\"></textarea>\r\n            </mat-form-field>\r\n          </div>\r\n\r\n      </div>\r\n\r\n    </mat-accordion>\r\n  </mat-drawer>\r\n\r\n  <mat-drawer-content>\r\n    <mat-toolbar  *ngIf=\"!userMode && floorPlan\" >\r\n      <mat-toolbar-row>\r\n        <!-- <ng-container *ngIf=\"!app.roomEdit\"> -->\r\n          <!-- <div *ngIf=\"init && !app.roomEdit\" class=\"grid-items\"> -->\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Undo (Ctrl + Z)\" (click)=\"app.undo()\"\r\n                  [disabled]=\"app.states.length === 1\">\r\n                  <mat-icon>reply</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Redo (Ctrl + Shift + Z)\"\r\n                        (click)=\"app.redo()\"\r\n                        [disabled]=\"app.redoStates.length === 0\">\r\n                  <mat-icon>share</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button\r\n                  [disabled]=\"app.selections.length === 0\"\r\n                  matTooltip=\"Delete (Delete)\"\r\n                  (click)=\"app.delete()\">\r\n                  <mat-icon>delete</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Rotate Anti-Clockwise (Ctrl + Left Arrow)\"\r\n                  [disabled]=\"app.selections.length === 0\" (click)=\"app.rotateAntiClockWise()\">\r\n                  <mat-icon>undo</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Rotate Clockwise (Ctrl + Right Arrow)\"\r\n                  [disabled]=\"app.selections.length === 0\" (click)=\"app.rotateClockWise()\">\r\n                  <mat-icon>redo</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Group (Ctrl + G)\" [disabled]=\"app.selections.length < 2\"\r\n                  (click)=\"app.group()\">\r\n                  <mat-icon>redo</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Ungroup (Ctrl + E)\" [disabled]=\"!app.ungroupable\"\r\n                  (click)=\"app.ungroup()\">\r\n                  <mat-icon>table_view</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-button matTooltip=\"Arrange\" [matMenuTriggerFor]=\"arrange\">Arrange</button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-button matTooltip=\"Switch Edition Mode\" color=\"primary\"\r\n                        (click)=\"app.endEditRoom()\">Set Room</button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Undo (Ctrl + Z)\" (click)=\"app.undo()\"\r\n                  [disabled]=\"app.roomEditStates.length === 1\">\r\n                  <mat-icon>repluy</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Redo (Ctrl + Shift + Z)\" (click)=\"app.redo()\"\r\n                  [disabled]=\"app.roomEditRedoStates.length === 0\">\r\n                  <mat-icon>share</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-button matTooltip=\"Switch Edition Mode\" color=\"primary\"\r\n                  (click)=\"app.endEditRoom()\">Edit Room</button>\r\n              </div>\r\n\r\n              <div>\r\n                <div  *ngIf=\"!userMode && isAdmin\" >\r\n                  <div *ngFor=\"let selected of app.selections\">\r\n                    <span *ngIf=\"selected && selected?.name\">\r\n                      <mat-form-field appearance=\"outline\">\r\n                      <mat-label >OrderID {{ getOrderName(selected) }} </mat-label>\r\n                      <input matInput\r\n                            type=\"text\"\r\n                            [(ngModel)]=\"app.orderID\"\r\n                            (change)=\"app.setOrder(app.orderID)\"\r\n                            class=\"form-control\" >\r\n                      </mat-form-field>\r\n                      <span>\r\n                        <button mat-raised-button (click)=\"app.setOrder('')\">Clear</button>\r\n                      </span>\r\n                    </span>\r\n                    <span *ngIf=\"selected && selected?.name\">\r\n                      <mat-form-field appearance=\"outline\">\r\n                      <mat-label >Name: {{ getItemName(selected) }}</mat-label>\r\n                      <input matInput\r\n                            type=\"text\"\r\n                            [(ngModel)]=\"app.tableName\"\r\n                            (change)=\"app.setTable(app.tableName)\"\r\n                            class=\"form-control\" >\r\n                      </mat-form-field>\r\n                      <span>\r\n                        <button mat-raised-button (click)=\"app.setTable('')\">Clear</button>\r\n                      </span>\r\n                    </span>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n          <mat-menu #arrange=\"matMenu\">\r\n            <ng-template matMenuContent>\r\n              <button mat-menu-item (click)=\"app.arrange('LEFT')\" [disabled]=\"app.selections.length < 2\">Arrange Left</button>\r\n              <button mat-menu-item (click)=\"app.arrange('CENTER')\" [disabled]=\"app.selections.length < 2\">Arrange Center</button>\r\n              <button mat-menu-item (click)=\"app.arrange('RIGHT')\" [disabled]=\"app.selections.length < 2\">Arrange Right</button>\r\n              <button mat-menu-item (click)=\"app.arrange('TOP')\" [disabled]=\"app.selections.length < 2\">Arrange Top</button>\r\n              <button mat-menu-item (click)=\"app.arrange('MIDDLE')\" [disabled]=\"app.selections.length < 2\">Arrange Middle</button>\r\n              <button mat-menu-item (click)=\"app.arrange('BOTTOM')\" [disabled]=\"app.selections.length < 2\">Arrange Bottom</button>\r\n              <button mat-menu-item (click)=\"app.placeInCenter('HORIZONTAL')\">Center Horizontally</button>\r\n              <button mat-menu-item (click)=\"app.placeInCenter('VERTICAL')\">Center Vertically</button>\r\n            </ng-template>\r\n          </mat-menu>\r\n        <app-zoom (zoomChange)=\"onZoom($event)\" [zoom]=\"app.zoom\"></app-zoom>\r\n      </mat-toolbar-row>\r\n    </mat-toolbar>\r\n\r\n    <pointless-room-layout-view\r\n        [userMode]=\"userMode\">\r\n    </pointless-room-layout-view>\r\n\r\n    </mat-drawer-content>\r\n  </mat-drawer-container>\r\n\r\n", styles: ["mat-drawer{width:350px}mat-drawer-container{height:calc(100% - 64px)}.h3{margin:5px}mat-form-field{margin-top:5px;font-size:small}.grid-items{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));grid-gap:10px;gap:10px}.preview-layout{display:flex;flex-wrap:wrap;justify-content:space-between;padding:8px}.preview-layout .preview-item{padding:8px;cursor:pointer}.preview-layout .preview-item:hover{box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f}.preview-layout .preview-title{margin-top:8px;text-align:center}.status-bar{min-height:79px;width:100%}.status-bar .status-bar-item td{padding:10px}.status-bar .status-bar-item span{margin-right:15px}.new-text mat-radio-group{padding-left:12px}.new-text mat-radio-group mat-radio-button{margin-right:16px}.layout-options-grid{display:flex;flex-direction:row;margin:10px}mat-toolbar-row{justify-content:space-between}button{margin:10px}.example-full-width{max-height:210px;overflow-y:hidden;overflow-x:hidden}.floor-plan-json{max-height:75px;overflow-y:auto;overflow-x:hidden}.buttons{width:120px}.grid-buttons{display:grid;grid-gap:5px;gap:5px;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));overflow-y:visible;max-width:260px}\n"], components: [{ type: i1.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { type: i5$1.MatDrawerContainer, selector: "mat-drawer-container", inputs: ["autosize", "hasBackdrop"], outputs: ["backdropClick"], exportAs: ["matDrawerContainer"] }, { type: i5$1.MatDrawer, selector: "mat-drawer", inputs: ["position", "mode", "disableClose", "autoFocus", "opened"], outputs: ["openedChange", "opened", "openedStart", "closed", "closedStart", "positionChanged"], exportAs: ["matDrawer"] }, { type: i6$1.MatExpansionPanel, selector: "mat-expansion-panel", inputs: ["disabled", "expanded", "hideToggle", "togglePosition"], outputs: ["opened", "closed", "expandedChange", "afterExpand", "afterCollapse"], exportAs: ["matExpansionPanel"] }, { type: i6$1.MatExpansionPanelHeader, selector: "mat-expansion-panel-header", inputs: ["tabIndex", "expandedHeight", "collapsedHeight"] }, { type: i7.MatList, selector: "mat-list, mat-action-list", inputs: ["disableRipple", "disabled"], exportAs: ["matList"] }, { type: i8$1.MatDivider, selector: "mat-divider", inputs: ["vertical", "inset"] }, { type: i7.MatListItem, selector: "mat-list-item, a[mat-list-item], button[mat-list-item]", inputs: ["disableRipple", "disabled"], exportAs: ["matListItem"] }, { type: PreviewFurnitureComponent, selector: "pointless-preview-furniture", inputs: ["type", "furniture"] }, { type: i4.MatFormField, selector: "mat-form-field", inputs: ["color", "appearance", "hideRequiredMarker", "hintLabel", "floatLabel"], exportAs: ["matFormField"] }, { type: i5.MatSelect, selector: "mat-select", inputs: ["disabled", "disableRipple", "tabIndex"], exportAs: ["matSelect"] }, { type: i6.MatOption, selector: "mat-option", exportAs: ["matOption"] }, { type: i2$1.MatRadioButton, selector: "mat-radio-button", inputs: ["disableRipple", "tabIndex"], exportAs: ["matRadioButton"] }, { type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { type: i5$1.MatDrawerContent, selector: "mat-drawer-content" }, { type: i15.MatToolbar, selector: "mat-toolbar", inputs: ["color"], exportAs: ["matToolbar"] }, { type: i16.MatMenu, selector: "mat-menu", exportAs: ["matMenu"] }, { type: i16.MatMenuItem, selector: "[mat-menu-item]", inputs: ["disabled", "disableRipple", "role"], exportAs: ["matMenuItem"] }, { type: ZoomComponent, selector: "app-zoom", inputs: ["zoom"], outputs: ["zoomChange"] }, { type: ViewComponent, selector: "pointless-room-layout-view", inputs: ["userMode"], outputs: ["outPutSelectedItem"] }], directives: [{ type: i9.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i6$1.MatAccordion, selector: "mat-accordion", inputs: ["multi", "hideToggle", "displayMode", "togglePosition"], exportAs: ["matAccordion"] }, { type: i6$1.MatExpansionPanelTitle, selector: "mat-panel-title" }, { type: i9.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i4.MatLabel, selector: "mat-label" }, { type: i8.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { type: i8.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { type: i8.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { type: i10.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { type: i8.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i8.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i8.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { type: i8.MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: ["min"] }, { type: i8.MaxValidator, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: ["max"] }, { type: i8.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { type: i2$1.MatRadioGroup, selector: "mat-radio-group", exportAs: ["matRadioGroup"] }, { type: i8.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i21.CdkTextareaAutosize, selector: "textarea[cdkTextareaAutosize]", inputs: ["cdkAutosizeMinRows", "cdkAutosizeMaxRows", "cdkTextareaAutosize", "placeholder"], exportAs: ["cdkTextareaAutosize"] }, { type: i15.MatToolbarRow, selector: "mat-toolbar-row", exportAs: ["matToolbarRow"] }, { type: i3.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }, { type: i16.MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", exportAs: ["matMenuTrigger"] }, { type: i16.MatMenuContent, selector: "ng-template[matMenuContent]" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: RoomLayoutDesignerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pointless-room-layout-designer', template: "<button *ngIf=\"!toggleButtonHidden\" mat-raised-button (click)=\"toggleUserMode()\">toggle</button>\r\n\r\n<mat-drawer-container hasBackdrop=\"false\">\r\n\r\n  <mat-drawer *ngIf=\"!userMode\" #drawer mode=\"side\" opened>\r\n    <mat-accordion class=\"rl-object-options\">\r\n      <span [hidden]=\"!floorPlan\">\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Rooms\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-list>\r\n            <mat-divider></mat-divider>\r\n            <ng-container *ngFor=\"let room of furnishings.rooms\">\r\n              <mat-list-item (click)=\"insert(room, 'ROOM')\">\r\n                {{room.title}}\r\n              </mat-list-item>\r\n              <mat-divider></mat-divider>\r\n            </ng-container>\r\n          </mat-list>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Doors\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let door of furnishings.doors\">\r\n              <div (click)=\"insert(door, 'DOOR')\">\r\n                <pointless-preview-furniture [type]=\"'DOOR'\" [furniture]=\"door\"></pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{door.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Windows\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let window of furnishings.windows\">\r\n              <div (click)=\"insert(window, 'WINDOW')\">\r\n                  <pointless-preview-furniture\r\n                      [type]=\"'WINDOW'\"\r\n                      [furniture]=\"window\">\r\n                  </pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{window.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Tables\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <mat-form-field>\r\n            <mat-label>Default Chair</mat-label>\r\n            <mat-select [value]=\"defaultChairIndex\"\r\n                        (valueChange)=\"defaultChairChanged($event)\">\r\n              <mat-option *ngFor=\"let chair of furnishings.chairs; let i=index;\"\r\n                          [value]=\"i\">\r\n                  {{chair.title}}\r\n              </mat-option>\r\n            </mat-select>\r\n          </mat-form-field>\r\n\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let table of furnishings.tables\">\r\n              <div (click)=\"insert(table, 'TABLE')\">\r\n                <pointless-preview-furniture\r\n                    [type]=\"'TABLE'\"\r\n                    [furniture]=\"table\">\r\n                </pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{table.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Chairs\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let chair of furnishings.chairs\">\r\n              <div (click)=\"insert(chair, 'CHAIR')\">\r\n                <pointless-preview-furniture\r\n                    [type]=\"'CHAIR'\"\r\n                    [furniture]=\"chair\">\r\n                </pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{chair.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Miscellaneous\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div class=\"preview-layout\">\r\n            <div class=\"preview-item\" *ngFor=\"let m of furnishings.miscellaneous\">\r\n              <div (click)=\"insert(m, 'MISCELLANEOUS')\">\r\n                <pointless-preview-furniture\r\n                    [type]=\"'MISCELLANEOUS'\"\r\n                    [furniture]=\"m\">\r\n                </pointless-preview-furniture>\r\n                <div class=\"preview-title\">{{m.title}}</div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Text\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <form [formGroup]=\"textForm\"\r\n                class=\"new-text\"\r\n                (ngSubmit)=\"insertNewText()\">\r\n            <mat-form-field>\r\n              <input matInput placeholder=\"Input text\" formControlName=\"text\">\r\n            </mat-form-field>\r\n            <mat-form-field>\r\n              <input matInput type=\"number\"\r\n                    placeholder=\"Font Size\"\r\n                    min=\"1\"\r\n                    max=\"200\"\r\n                    formControlName=\"font_size\">\r\n            </mat-form-field>\r\n            <div style=\"margin: 1rem 0\">\r\n              <mat-radio-group formControlName=\"direction\">\r\n                <mat-radio-button value=\"HORIZONTAL\">Horizontal</mat-radio-button>\r\n                <mat-radio-button value=\"VERTICAL\">Vertical</mat-radio-button>\r\n              </mat-radio-group>\r\n            </div>\r\n            <div style=\"margin: 2rem 12px\">\r\n              <button mat-raised-button color=\"primary\" type=\"submit\">Add text</button>\r\n            </div>\r\n          </form>\r\n        </mat-expansion-panel>\r\n\r\n        <mat-expansion-panel>\r\n          <mat-expansion-panel-header>\r\n            <mat-panel-title>\r\n              Advanced\r\n            </mat-panel-title>\r\n          </mat-expansion-panel-header>\r\n          <mat-divider></mat-divider>\r\n          <div style=\"padding: 2rem\">\r\n            <button mat-raised-button\r\n                    color=\"primary\"\r\n                    style=\"width: 100%\"\r\n                    (click)=\"layoutChairs()\">\r\n              Layout chairs\r\n            </button>\r\n          </div>\r\n        </mat-expansion-panel>\r\n\r\n      </span>\r\n\r\n      <h3>Layout</h3>\r\n      <div class=\"grid-buttons\">\r\n        <div>\r\n          <button class=\"buttons\" mat-raised-button color=\"primary\"\r\n                  (click)=\"_saveFloorPlan()\">\r\n            <mat-icon>save</mat-icon>Save </button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                 (click)=\"loadTemplate()\">\r\n            <mat-icon>refresh</mat-icon>Refresh </button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                  (click)=\"app.setOrder('131390')\">\r\n            Set Order #</button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                 (click)=\"clearTable()\">\r\n           Clear Table</button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                  (click)=\"app.setObjectFillColor('red')\">\r\n            Set Red</button>\r\n        </div>\r\n\r\n        <div>\r\n          <button class=\"buttons\"  mat-raised-button color=\"primary\"\r\n                 (click)=\"app.setObjectFillColor('green')\">\r\n            Set  Green</button>\r\n        </div>\r\n      </div>\r\n\r\n      <div *ngIf=\"floorPlan && isAdmin\">\r\n        <div>\r\n              <mat-form-field appearance=\"outline\">\r\n              <mat-label >Name</mat-label>\r\n              <input matInput\r\n                    type=\"text\"\r\n                    [(ngModel)]=\"floorPlan.name\"\r\n                    class=\"form-control\" >\r\n              </mat-form-field>\r\n          </div>\r\n\r\n          <div>\r\n            <mat-form-field appearance=\"outline\">\r\n            <mat-label >Height</mat-label>\r\n            <input matInput\r\n                  type=\"text\"\r\n                  [(ngModel)]=\"floorPlan.height\"\r\n                  class=\"form-control\" >\r\n            </mat-form-field>\r\n          </div>\r\n          <div>\r\n              <mat-form-field appearance=\"outline\">\r\n              <mat-label >Width</mat-label>\r\n              <input matInput\r\n                    type=\"text\"\r\n                    [(ngModel)]=\"floorPlan.width\"\r\n                    class=\"form-control\" >\r\n              </mat-form-field>\r\n          </div>\r\n          <div>\r\n            <mat-form-field appearance=\"outline\">\r\n            <mat-label >OrderID</mat-label>\r\n            <input matInput\r\n                  type=\"text\"\r\n                  [(ngModel)]=\"app.orderID\"\r\n                  class=\"form-control\" >\r\n            </mat-form-field>\r\n          </div>\r\n          <div>\r\n            <mat-form-field appearance=\"outline\">\r\n            <mat-label >Image</mat-label>\r\n            <input matInput\r\n                  type=\"text\"\r\n                  (change)=\"changeBackGroundImage()\"\r\n                  [(ngModel)]=\"floorPlan.image\"\r\n                  class=\"form-control\" >\r\n            </mat-form-field>\r\n          </div>\r\n\r\n          <div class=\"example-full-width\">\r\n            <mat-form-field  appearance=\"fill\" >\r\n              <mat-label>Floor Plan Result</mat-label>\r\n              <textarea  cdkTextareaAutosize\r\n                        matInput\r\n                        rows = 5\r\n                        class=\"floor-plan-json\"\r\n                        [(ngModel)]=\"floorPlan.template\"\r\n                        placeholder=\"Floor plan Result\"></textarea>\r\n            </mat-form-field>\r\n          </div>\r\n\r\n      </div>\r\n\r\n    </mat-accordion>\r\n  </mat-drawer>\r\n\r\n  <mat-drawer-content>\r\n    <mat-toolbar  *ngIf=\"!userMode && floorPlan\" >\r\n      <mat-toolbar-row>\r\n        <!-- <ng-container *ngIf=\"!app.roomEdit\"> -->\r\n          <!-- <div *ngIf=\"init && !app.roomEdit\" class=\"grid-items\"> -->\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Undo (Ctrl + Z)\" (click)=\"app.undo()\"\r\n                  [disabled]=\"app.states.length === 1\">\r\n                  <mat-icon>reply</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Redo (Ctrl + Shift + Z)\"\r\n                        (click)=\"app.redo()\"\r\n                        [disabled]=\"app.redoStates.length === 0\">\r\n                  <mat-icon>share</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button\r\n                  [disabled]=\"app.selections.length === 0\"\r\n                  matTooltip=\"Delete (Delete)\"\r\n                  (click)=\"app.delete()\">\r\n                  <mat-icon>delete</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Rotate Anti-Clockwise (Ctrl + Left Arrow)\"\r\n                  [disabled]=\"app.selections.length === 0\" (click)=\"app.rotateAntiClockWise()\">\r\n                  <mat-icon>undo</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Rotate Clockwise (Ctrl + Right Arrow)\"\r\n                  [disabled]=\"app.selections.length === 0\" (click)=\"app.rotateClockWise()\">\r\n                  <mat-icon>redo</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Group (Ctrl + G)\" [disabled]=\"app.selections.length < 2\"\r\n                  (click)=\"app.group()\">\r\n                  <mat-icon>redo</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Ungroup (Ctrl + E)\" [disabled]=\"!app.ungroupable\"\r\n                  (click)=\"app.ungroup()\">\r\n                  <mat-icon>table_view</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-button matTooltip=\"Arrange\" [matMenuTriggerFor]=\"arrange\">Arrange</button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-button matTooltip=\"Switch Edition Mode\" color=\"primary\"\r\n                        (click)=\"app.endEditRoom()\">Set Room</button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Undo (Ctrl + Z)\" (click)=\"app.undo()\"\r\n                  [disabled]=\"app.roomEditStates.length === 1\">\r\n                  <mat-icon>repluy</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-icon-button matTooltip=\"Redo (Ctrl + Shift + Z)\" (click)=\"app.redo()\"\r\n                  [disabled]=\"app.roomEditRedoStates.length === 0\">\r\n                  <mat-icon>share</mat-icon>\r\n                </button>\r\n              </div>\r\n\r\n              <div>\r\n                <button mat-button matTooltip=\"Switch Edition Mode\" color=\"primary\"\r\n                  (click)=\"app.endEditRoom()\">Edit Room</button>\r\n              </div>\r\n\r\n              <div>\r\n                <div  *ngIf=\"!userMode && isAdmin\" >\r\n                  <div *ngFor=\"let selected of app.selections\">\r\n                    <span *ngIf=\"selected && selected?.name\">\r\n                      <mat-form-field appearance=\"outline\">\r\n                      <mat-label >OrderID {{ getOrderName(selected) }} </mat-label>\r\n                      <input matInput\r\n                            type=\"text\"\r\n                            [(ngModel)]=\"app.orderID\"\r\n                            (change)=\"app.setOrder(app.orderID)\"\r\n                            class=\"form-control\" >\r\n                      </mat-form-field>\r\n                      <span>\r\n                        <button mat-raised-button (click)=\"app.setOrder('')\">Clear</button>\r\n                      </span>\r\n                    </span>\r\n                    <span *ngIf=\"selected && selected?.name\">\r\n                      <mat-form-field appearance=\"outline\">\r\n                      <mat-label >Name: {{ getItemName(selected) }}</mat-label>\r\n                      <input matInput\r\n                            type=\"text\"\r\n                            [(ngModel)]=\"app.tableName\"\r\n                            (change)=\"app.setTable(app.tableName)\"\r\n                            class=\"form-control\" >\r\n                      </mat-form-field>\r\n                      <span>\r\n                        <button mat-raised-button (click)=\"app.setTable('')\">Clear</button>\r\n                      </span>\r\n                    </span>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n\r\n          <mat-menu #arrange=\"matMenu\">\r\n            <ng-template matMenuContent>\r\n              <button mat-menu-item (click)=\"app.arrange('LEFT')\" [disabled]=\"app.selections.length < 2\">Arrange Left</button>\r\n              <button mat-menu-item (click)=\"app.arrange('CENTER')\" [disabled]=\"app.selections.length < 2\">Arrange Center</button>\r\n              <button mat-menu-item (click)=\"app.arrange('RIGHT')\" [disabled]=\"app.selections.length < 2\">Arrange Right</button>\r\n              <button mat-menu-item (click)=\"app.arrange('TOP')\" [disabled]=\"app.selections.length < 2\">Arrange Top</button>\r\n              <button mat-menu-item (click)=\"app.arrange('MIDDLE')\" [disabled]=\"app.selections.length < 2\">Arrange Middle</button>\r\n              <button mat-menu-item (click)=\"app.arrange('BOTTOM')\" [disabled]=\"app.selections.length < 2\">Arrange Bottom</button>\r\n              <button mat-menu-item (click)=\"app.placeInCenter('HORIZONTAL')\">Center Horizontally</button>\r\n              <button mat-menu-item (click)=\"app.placeInCenter('VERTICAL')\">Center Vertically</button>\r\n            </ng-template>\r\n          </mat-menu>\r\n        <app-zoom (zoomChange)=\"onZoom($event)\" [zoom]=\"app.zoom\"></app-zoom>\r\n      </mat-toolbar-row>\r\n    </mat-toolbar>\r\n\r\n    <pointless-room-layout-view\r\n        [userMode]=\"userMode\">\r\n    </pointless-room-layout-view>\r\n\r\n    </mat-drawer-content>\r\n  </mat-drawer-container>\r\n\r\n", styles: ["mat-drawer{width:350px}mat-drawer-container{height:calc(100% - 64px)}.h3{margin:5px}mat-form-field{margin-top:5px;font-size:small}.grid-items{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));grid-gap:10px;gap:10px}.preview-layout{display:flex;flex-wrap:wrap;justify-content:space-between;padding:8px}.preview-layout .preview-item{padding:8px;cursor:pointer}.preview-layout .preview-item:hover{box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f}.preview-layout .preview-title{margin-top:8px;text-align:center}.status-bar{min-height:79px;width:100%}.status-bar .status-bar-item td{padding:10px}.status-bar .status-bar-item span{margin-right:15px}.new-text mat-radio-group{padding-left:12px}.new-text mat-radio-group mat-radio-button{margin-right:16px}.layout-options-grid{display:flex;flex-direction:row;margin:10px}mat-toolbar-row{justify-content:space-between}button{margin:10px}.example-full-width{max-height:210px;overflow-y:hidden;overflow-x:hidden}.floor-plan-json{max-height:75px;overflow-y:auto;overflow-x:hidden}.buttons{width:120px}.grid-buttons{display:grid;grid-gap:5px;gap:5px;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));overflow-y:visible;max-width:260px}\n"] }]
        }], ctorParameters: function () { return [{ type: AppService }, { type: i8.FormBuilder }, { type: i1$1.MatDialog }]; }, propDecorators: { layoutObjects: [{
                type: ViewChild,
                args: ['layoutObjects']
            }], roomLayout: [{
                type: ViewChild,
                args: ['roomLayout']
            }], isAdmin: [{
                type: Input
            }], userMode: [{
                type: Input
            }], _zoom: [{
                type: Input
            }], _userMode: [{
                type: Input
            }], _clearNextSelectedTable: [{
                type: Input
            }], changeObjectColor: [{
                type: Input
            }], floorPlan: [{
                type: Input
            }], _floorPlan: [{
                type: Input
            }], _setTableInfo: [{
                type: Input
            }], _newOrder: [{
                type: Input
            }], orderID: [{
                type: Input
            }], _performOperations: [{
                type: Input
            }], _setOrder: [{
                type: Input
            }], saveFloorPlan: [{
                type: Output
            }], newFloorPlan: [{
                type: Output
            }], toggleButtonHidden: [{
                type: Input
            }], setFloorPlanAndTable: [{
                type: Output
            }], getFloorPlan: [{
                type: Output
            }], setTable: [{
                type: Output
            }], outPutJSON: [{
                type: Output
            }] } });

// import { ViewJSONServiceService } from './view-jsonservice.service';
class PointlessRoomLayoutModule {
}
PointlessRoomLayoutModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: PointlessRoomLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PointlessRoomLayoutModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: PointlessRoomLayoutModule, bootstrap: [RoomLayoutDesignerComponent], declarations: [RoomLayoutDesignerComponent,
        ViewComponent,
        PreviewFurnitureComponent,
        ChairsLayoutComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule], exports: [RoomLayoutDesignerComponent,
        ViewComponent,
        PreviewFurnitureComponent,
        ChairsLayoutComponent] });
PointlessRoomLayoutModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: PointlessRoomLayoutModule, imports: [[
            BrowserModule,
            BrowserAnimationsModule,
            SharedModule,
            FormsModule,
            ReactiveFormsModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: PointlessRoomLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        RoomLayoutDesignerComponent,
                        ViewComponent,
                        PreviewFurnitureComponent,
                        ChairsLayoutComponent
                    ],
                    imports: [
                        BrowserModule,
                        BrowserAnimationsModule,
                        SharedModule,
                        FormsModule,
                        ReactiveFormsModule,
                    ],
                    exports: [
                        RoomLayoutDesignerComponent,
                        ViewComponent,
                        PreviewFurnitureComponent,
                        ChairsLayoutComponent
                    ],
                    // providers: [],
                    bootstrap: [RoomLayoutDesignerComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { ChairsLayoutComponent, PointlessRoomLayoutModule, PreviewFurnitureComponent, RoomLayoutDesignerComponent, ViewComponent };
//# sourceMappingURL=pointless-room-layout.mjs.map
