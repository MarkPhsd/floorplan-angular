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
export class AppModule {
}
AppModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: AppModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AppModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: AppModule, declarations: [RoomLayoutDesignerComponent,
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
AppModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: AppModule, imports: [[
            BrowserModule,
            BrowserAnimationsModule,
            SharedModule,
            FormsModule,
            ReactiveFormsModule,
            FontAwesomeModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: AppModule, decorators: [{
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
                    // bootstrap: [RoomLayoutDesignerComponent],
                    // entryComponents: [RoomLayoutDesignerComponent,ChairsLayoutComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDL0UsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN2RyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMzRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7QUFDckUsdUVBQXVFO0FBMkJ2RSxNQUFNLE9BQU8sU0FBUzs7c0dBQVQsU0FBUzt1R0FBVCxTQUFTLGlCQXZCbEIsMkJBQTJCO1FBQzNCLGFBQWE7UUFDYix5QkFBeUI7UUFDekIscUJBQXFCLGFBR3JCLGFBQWE7UUFDYix1QkFBdUI7UUFDdkIsWUFBWTtRQUNaLFdBQVc7UUFDWCxtQkFBbUI7UUFDbkIsaUJBQWlCLGFBR2pCLDJCQUEyQjtRQUMzQixhQUFhO1FBQ2IseUJBQXlCO1FBQ3pCLHFCQUFxQjt1R0FNWixTQUFTLFlBbEJYO1lBQ1AsYUFBYTtZQUNiLHVCQUF1QjtZQUN2QixZQUFZO1lBQ1osV0FBVztZQUNYLG1CQUFtQjtZQUNuQixpQkFBaUI7U0FDbEI7MkZBV1UsU0FBUztrQkF6QnJCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLDJCQUEyQjt3QkFDM0IsYUFBYTt3QkFDYix5QkFBeUI7d0JBQ3pCLHFCQUFxQjtxQkFDdEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGFBQWE7d0JBQ2IsdUJBQXVCO3dCQUN2QixZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsbUJBQW1CO3dCQUNuQixpQkFBaUI7cUJBQ2xCO29CQUNELE9BQU8sRUFBRTt3QkFDUCwyQkFBMkI7d0JBQzNCLGFBQWE7d0JBQ2IseUJBQXlCO3dCQUN6QixxQkFBcUI7cUJBQ3RCO29CQUNELGlCQUFpQjtvQkFDakIsNENBQTRDO29CQUM1Qyx1RUFBdUU7aUJBQ3hFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tICcuL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcclxuaW1wb3J0IHsgUm9vbUxheW91dERlc2lnbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy92aWV3L3ZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUHJldmlld0Z1cm5pdHVyZUNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wcmV2aWV3LWZ1cm5pdHVyZS9wcmV2aWV3LWZ1cm5pdHVyZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDaGFpcnNMYXlvdXRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhaXJzLWxheW91dC9jaGFpcnMtbGF5b3V0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEZvbnRBd2Vzb21lTW9kdWxlIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUnO1xyXG4vLyBpbXBvcnQgeyBWaWV3SlNPTlNlcnZpY2VTZXJ2aWNlIH0gZnJvbSAnLi92aWV3LWpzb25zZXJ2aWNlLnNlcnZpY2UnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIFJvb21MYXlvdXREZXNpZ25lckNvbXBvbmVudCxcclxuICAgIFZpZXdDb21wb25lbnQsXHJcbiAgICBQcmV2aWV3RnVybml0dXJlQ29tcG9uZW50LFxyXG4gICAgQ2hhaXJzTGF5b3V0Q29tcG9uZW50XHJcbiAgXSxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBCcm93c2VyTW9kdWxlLFxyXG4gICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsXHJcbiAgICBTaGFyZWRNb2R1bGUsXHJcbiAgICBGb3Jtc01vZHVsZSxcclxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXHJcbiAgICBGb250QXdlc29tZU1vZHVsZVxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgUm9vbUxheW91dERlc2lnbmVyQ29tcG9uZW50LFxyXG4gICAgVmlld0NvbXBvbmVudCxcclxuICAgIFByZXZpZXdGdXJuaXR1cmVDb21wb25lbnQsXHJcbiAgICBDaGFpcnNMYXlvdXRDb21wb25lbnRcclxuICBdLFxyXG4gIC8vIHByb3ZpZGVyczogW10sXHJcbiAgLy8gYm9vdHN0cmFwOiBbUm9vbUxheW91dERlc2lnbmVyQ29tcG9uZW50XSxcclxuICAvLyBlbnRyeUNvbXBvbmVudHM6IFtSb29tTGF5b3V0RGVzaWduZXJDb21wb25lbnQsQ2hhaXJzTGF5b3V0Q29tcG9uZW50XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxyXG4iXX0=