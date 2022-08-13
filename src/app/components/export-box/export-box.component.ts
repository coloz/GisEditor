import { Component, OnInit } from '@angular/core';
import gcoord from 'gcoord';
import { CRSTypes } from 'gcoord/dist/types/crs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from 'src/app/services/data.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-export-box',
  templateUrl: './export-box.component.html',
  styleUrls: ['./export-box.component.scss']
})
export class ExportBoxComponent implements OnInit {
  coord: any = 'GCJ02';

  types = [
    { name: 'BD-09 (百度地图)', value: 'BD09' },
    { name: 'GCJ-02 (高德地图)', value: 'GCJ02' },
    { name: 'WGS-84 (Google地图)', value: 'WGS84' },
  ]

  get landBlockList() {
    return this.data.landBlockList
  }

  constructor(
    private data: DataService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  transform(position: any) {
    // let target: any;
    // switch (this.coord) {
    //   case 'BD09':
    //     target = gcoord.BD09
    //     break;
    //   case 'GCJ02':
    //     target = gcoord.GCJ02
    //     break;
    //   case 'WGS84':
    //     target = gcoord.WGS84
    //     break;
    // }
    let result = gcoord.transform(
      position,
      gcoord.GCJ02,
      this.coord
    );
    return result
  }


  exportFile() {
    if (this.landBlockList.length == 0) {
      this.message.error('未创建任何地块');
      return
    }
    let data = this.landBlockList.map(item => {
      return {
        name: item.name,
        addr: item.addr,
        path: item.path.map(p => {
          return this.transform(p)
        })
      }
    })
    try {
      let file = new File([JSON.stringify(data)], `landblock.json`, { type: "text/plain;charset=utf-8" });
      saveAs(file);
    } catch (error) {
      this.message.error('导出失败')
    }
  }

}
