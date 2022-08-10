import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBoxComponent } from './search-box/search-box.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { InfoBoxComponent } from './info-box/info-box.component';


@NgModule({
  declarations: [
    SearchBoxComponent,
    InfoBoxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule
  ],
  exports: [
    SearchBoxComponent,
    InfoBoxComponent
  ]
})
export class ComponentsModule { }
