import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // selectLandBlock(landBlock: GisItem) {
  //   let polygon = this.polygonDict[landBlock.id]
  //   this.polyEditor.setTarget(polygon);
  //   this.polyEditor.open();
  //   this.selected = landBlock;
  // }

}
