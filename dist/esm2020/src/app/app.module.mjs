import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { RoomLayoutDesignerComponent } from './app.component';
import { ViewComponent } from './components/view/view.component';
import { PreviewFurnitureComponent } from './components/preview-furniture/preview-furniture.component';
import { ChairsLayoutComponent } from './components/chairs-layout/chairs-layout.component';
import * as i0 from "@angular/core";
// import { ViewJSONServiceService } from './view-jsonservice.service';
export class PointlessRoomLayoutModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDL0UsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN2RyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQzs7QUFDM0YsdUVBQXVFO0FBeUJ2RSxNQUFNLE9BQU8seUJBQXlCOzt1SEFBekIseUJBQXlCO3dIQUF6Qix5QkFBeUIsY0FGdEIsMkJBQTJCLGtCQW5CbkMsMkJBQTJCO1FBQzNCLGFBQWE7UUFDYix5QkFBeUI7UUFDekIscUJBQXFCLGFBR3JCLGFBQWE7UUFDYix1QkFBdUI7UUFDdkIsWUFBWTtRQUNaLFdBQVc7UUFDWCxtQkFBbUIsYUFHbkIsMkJBQTJCO1FBQzNCLGFBQWE7UUFDYix5QkFBeUI7UUFDekIscUJBQXFCO3dIQUtoQix5QkFBeUIsWUFoQnpCO1lBQ0wsYUFBYTtZQUNiLHVCQUF1QjtZQUN2QixZQUFZO1lBQ1osV0FBVztZQUNYLG1CQUFtQjtTQUN0Qjs0RkFVUSx5QkFBeUI7a0JBdkJyQyxRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDViwyQkFBMkI7d0JBQzNCLGFBQWE7d0JBQ2IseUJBQXlCO3dCQUN6QixxQkFBcUI7cUJBQ3hCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxhQUFhO3dCQUNiLHVCQUF1Qjt3QkFDdkIsWUFBWTt3QkFDWixXQUFXO3dCQUNYLG1CQUFtQjtxQkFDdEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLDJCQUEyQjt3QkFDM0IsYUFBYTt3QkFDYix5QkFBeUI7d0JBQ3pCLHFCQUFxQjtxQkFDeEI7b0JBQ0QsaUJBQWlCO29CQUNqQixTQUFTLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztpQkFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XHJcbmltcG9ydCB7IFNoYXJlZE1vZHVsZSB9IGZyb20gJy4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBSb29tTGF5b3V0RGVzaWduZXJDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ZpZXcvdmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQcmV2aWV3RnVybml0dXJlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByZXZpZXctZnVybml0dXJlL3ByZXZpZXctZnVybml0dXJlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENoYWlyc0xheW91dENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jaGFpcnMtbGF5b3V0L2NoYWlycy1sYXlvdXQuY29tcG9uZW50JztcclxuLy8gaW1wb3J0IHsgVmlld0pTT05TZXJ2aWNlU2VydmljZSB9IGZyb20gJy4vdmlldy1qc29uc2VydmljZS5zZXJ2aWNlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBkZWNsYXJhdGlvbnM6IFtcclxuICAgICAgICBSb29tTGF5b3V0RGVzaWduZXJDb21wb25lbnQsXHJcbiAgICAgICAgVmlld0NvbXBvbmVudCxcclxuICAgICAgICBQcmV2aWV3RnVybml0dXJlQ29tcG9uZW50LFxyXG4gICAgICAgIENoYWlyc0xheW91dENvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIGltcG9ydHM6IFtcclxuICAgICAgICBCcm93c2VyTW9kdWxlLFxyXG4gICAgICAgIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlLFxyXG4gICAgICAgIFNoYXJlZE1vZHVsZSxcclxuICAgICAgICBGb3Jtc01vZHVsZSxcclxuICAgICAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuICAgICAgICBSb29tTGF5b3V0RGVzaWduZXJDb21wb25lbnQsXHJcbiAgICAgICAgVmlld0NvbXBvbmVudCxcclxuICAgICAgICBQcmV2aWV3RnVybml0dXJlQ29tcG9uZW50LFxyXG4gICAgICAgIENoYWlyc0xheW91dENvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIC8vIHByb3ZpZGVyczogW10sXHJcbiAgICBib290c3RyYXA6IFtSb29tTGF5b3V0RGVzaWduZXJDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQb2ludGxlc3NSb29tTGF5b3V0TW9kdWxlIHsgfVxyXG4iXX0=