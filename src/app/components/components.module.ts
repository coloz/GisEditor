import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBoxComponent } from './search-box/search-box.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { InfoBoxComponent } from './info-box/info-box.component';
import { ItemListComponent } from './item-list/item-list.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


@NgModule({
  declarations: [
    SearchBoxComponent,
    InfoBoxComponent,
    ItemListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    PerfectScrollbarModule
  ],
  exports: [
    SearchBoxComponent,
    InfoBoxComponent
  ]
})
export class ComponentsModule { }
