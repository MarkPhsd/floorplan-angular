import { NgModule } from '@angular/core';
// Modules
import { MaterialModule, DesignModule } from './modules';
// Components
import { ZoomComponent } from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as i0 from "@angular/core";
export class SharedModule {
}
SharedModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: SharedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SharedModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: SharedModule, declarations: [ZoomComponent], imports: [MaterialModule,
        DesignModule,
        FontAwesomeModule], exports: [MaterialModule,
        DesignModule,
        ZoomComponent] });
SharedModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: SharedModule, providers: [], imports: [[
            MaterialModule,
            DesignModule,
            FontAwesomeModule
        ], MaterialModule,
        DesignModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.4", ngImport: i0, type: SharedModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        MaterialModule,
                        DesignModule,
                        FontAwesomeModule
                    ],
                    exports: [
                        MaterialModule,
                        DesignModule,
                        ZoomComponent
                    ],
                    providers: [],
                    declarations: [ZoomComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvc2hhcmVkL3NoYXJlZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxVQUFVO0FBQ1YsT0FBTyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFekQsYUFBYTtBQUNiLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7O0FBZ0JyRSxNQUFNLE9BQU8sWUFBWTs7eUdBQVosWUFBWTswR0FBWixZQUFZLGlCQUZSLGFBQWEsYUFWMUIsY0FBYztRQUNkLFlBQVk7UUFDWixpQkFBaUIsYUFHakIsY0FBYztRQUNkLFlBQVk7UUFDWixhQUFhOzBHQUtKLFlBQVksYUFIWixFQUFFLFlBVko7WUFDUCxjQUFjO1lBQ2QsWUFBWTtZQUNaLGlCQUFpQjtTQUNsQixFQUVDLGNBQWM7UUFDZCxZQUFZOzJGQU1ILFlBQVk7a0JBZHhCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLGNBQWM7d0JBQ2QsWUFBWTt3QkFDWixpQkFBaUI7cUJBQ2xCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxjQUFjO3dCQUNkLFlBQVk7d0JBQ1osYUFBYTtxQkFDZDtvQkFDRCxTQUFTLEVBQUUsRUFBRTtvQkFDYixZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUM7aUJBQzlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbi8vIE1vZHVsZXNcclxuaW1wb3J0IHsgTWF0ZXJpYWxNb2R1bGUsIERlc2lnbk1vZHVsZSB9IGZyb20gJy4vbW9kdWxlcyc7XHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCB7IFpvb21Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMnO1xyXG5pbXBvcnQgeyBGb250QXdlc29tZU1vZHVsZSB9IGZyb20gJ0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgTWF0ZXJpYWxNb2R1bGUsXHJcbiAgICBEZXNpZ25Nb2R1bGUsXHJcbiAgICBGb250QXdlc29tZU1vZHVsZVxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgTWF0ZXJpYWxNb2R1bGUsXHJcbiAgICBEZXNpZ25Nb2R1bGUsXHJcbiAgICBab29tQ29tcG9uZW50XHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtdLFxyXG4gIGRlY2xhcmF0aW9uczogW1pvb21Db21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaGFyZWRNb2R1bGUgeyB9XHJcbiJdfQ==