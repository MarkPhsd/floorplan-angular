import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { RoomLayoutDesignerComponent } from './app.component';
import { ViewComponent } from './components/view/view.component';
import { PreviewFurnitureComponent } from './components/preview-furniture/preview-furniture.component';
import { ChairsLayoutComponent } from './components/chairs-layout/chairs-layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as i0 from "@angular/core";
// import { ViewJSONServiceService } from './view-jsonservice.service';
export class PointlessRoomLayoutModule {
}
PointlessRoomLayoutModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: PointlessRoomLayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PointlessRoomLayoutModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: PointlessRoomLayoutModule, bootstrap: [RoomLayoutDesignerComponent], declarations: [RoomLayoutDesignerComponent,
        ViewComponent,
        PreviewFurnitureComponent,
        ChairsLayoutComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule], exports: [RoomLayoutDesignerComponent,
        ViewComponent,
        PreviewFurnitureComponent,
        ChairsLayoutComponent] });
PointlessRoomLayoutModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: PointlessRoomLayoutModule, imports: [[
            BrowserModule,
            BrowserAnimationsModule,
            SharedModule,
            FormsModule,
            ReactiveFormsModule,
            FontAwesomeModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: PointlessRoomLayoutModule, decorators: [{
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
                        FontAwesomeModule
                    ],
                    exports: [
                        RoomLayoutDesignerComponent,
                        ViewComponent,
                        PreviewFurnitureComponent,
                        ChairsLayoutComponent
                    ],
                    // providers: [],
                    bootstrap: [RoomLayoutDesignerComponent],
                    entryComponents: [RoomLayoutDesignerComponent, ChairsLayoutComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDL0UsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN2RyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMzRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7QUFDckUsdUVBQXVFO0FBMEJ2RSxNQUFNLE9BQU8seUJBQXlCOztzSEFBekIseUJBQXlCO3VIQUF6Qix5QkFBeUIsY0FIeEIsMkJBQTJCLGtCQXBCckMsMkJBQTJCO1FBQzNCLGFBQWE7UUFDYix5QkFBeUI7UUFDekIscUJBQXFCLGFBR3JCLGFBQWE7UUFDYix1QkFBdUI7UUFDdkIsWUFBWTtRQUNaLFdBQVc7UUFDWCxtQkFBbUI7UUFDbkIsaUJBQWlCLGFBR2pCLDJCQUEyQjtRQUMzQixhQUFhO1FBQ2IseUJBQXlCO1FBQ3pCLHFCQUFxQjt1SEFNWix5QkFBeUIsWUFsQjNCO1lBQ1AsYUFBYTtZQUNiLHVCQUF1QjtZQUN2QixZQUFZO1lBQ1osV0FBVztZQUNYLG1CQUFtQjtZQUNuQixpQkFBaUI7U0FDbEI7MkZBV1UseUJBQXlCO2tCQXpCckMsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osMkJBQTJCO3dCQUMzQixhQUFhO3dCQUNiLHlCQUF5Qjt3QkFDekIscUJBQXFCO3FCQUN0QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsYUFBYTt3QkFDYix1QkFBdUI7d0JBQ3ZCLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxtQkFBbUI7d0JBQ25CLGlCQUFpQjtxQkFDbEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLDJCQUEyQjt3QkFDM0IsYUFBYTt3QkFDYix5QkFBeUI7d0JBQ3pCLHFCQUFxQjtxQkFDdEI7b0JBQ0QsaUJBQWlCO29CQUNqQixTQUFTLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztvQkFDeEMsZUFBZSxFQUFFLENBQUMsMkJBQTJCLEVBQUMscUJBQXFCLENBQUM7aUJBQ3JFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tICcuL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcclxuaW1wb3J0IHsgUm9vbUxheW91dERlc2lnbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy92aWV3L3ZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUHJldmlld0Z1cm5pdHVyZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wcmV2aWV3LWZ1cm5pdHVyZS9wcmV2aWV3LWZ1cm5pdHVyZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDaGFpcnNMYXlvdXRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhaXJzLWxheW91dC9jaGFpcnMtbGF5b3V0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUnO1xyXG4vLyBpbXBvcnQgeyBWaWV3SlNPTlNlcnZpY2VTZXJ2aWNlIH0gZnJvbSAnLi92aWV3LWpzb25zZXJ2aWNlLnNlcnZpY2UnO1xyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgUm9vbUxheW91dERlc2lnbmVyQ29tcG9uZW50LFxyXG4gICAgVmlld0NvbXBvbmVudCxcclxuICAgIFByZXZpZXdGdXJuaXR1cmVDb21wb25lbnQsXHJcbiAgICBDaGFpcnNMYXlvdXRDb21wb25lbnRcclxuICBdLFxyXG4gIGltcG9ydHM6IFtcclxuICAgIEJyb3dzZXJNb2R1bGUsXHJcbiAgICBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSxcclxuICAgIFNoYXJlZE1vZHVsZSxcclxuICAgIEZvcm1zTW9kdWxlLFxyXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcclxuICAgIEZvbnRBd2Vzb21lTW9kdWxlXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBSb29tTGF5b3V0RGVzaWduZXJDb21wb25lbnQsXHJcbiAgICBWaWV3Q29tcG9uZW50LFxyXG4gICAgUHJldmlld0Z1cm5pdHVyZUNvbXBvbmVudCxcclxuICAgIENoYWlyc0xheW91dENvbXBvbmVudFxyXG4gIF0sXHJcbiAgLy8gcHJvdmlkZXJzOiBbXSxcclxuICBib290c3RyYXA6IFtSb29tTGF5b3V0RGVzaWduZXJDb21wb25lbnRdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1Jvb21MYXlvdXREZXNpZ25lckNvbXBvbmVudCxDaGFpcnNMYXlvdXRDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQb2ludGxlc3NSb29tTGF5b3V0TW9kdWxlIHsgfVxyXG4iXX0=