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
// import { ViewJSONServiceService } from './view-jsonservice.service';

@NgModule({
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
})
export class AppModule { }
