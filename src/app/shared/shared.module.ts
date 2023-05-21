import { NgModule } from '@angular/core';

// Modules
import { MaterialModule } from './modules';

// Components
import { ZoomComponent } from './components';

@NgModule({
  imports: [
    MaterialModule,
  ],
  exports: [
    MaterialModule,
    ZoomComponent
  ],
  providers: [],
  declarations: [ZoomComponent]
})
export class SharedModule { }
