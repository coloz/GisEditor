import { Component, Input, OnInit } from '@angular/core';
import { GisItem } from 'src/app/interfaces/item.interface';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {

  @Input() data: GisItem;

  constructor() { }

  ngOnInit(): void {
  }

}
