import { Component, OnInit } from '@angular/core';
import * as AMapLoader from '@amap/amap-jsapi-loader';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService, LandBlock } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  AMap: any;
  map: any;
  polyEditor: any;

  selected: LandBlock | null = null;
  selectedList: LandBlock[] = [];

  get landBlockList() {
    return this.data.landBlockList
  }

  constructor(
    private message: NzMessageService,
    private data: DataService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    AMapLoader.load({
      "key": "6f02b1056c81d1638ecf21c8469f7b61",
      "version": "2.0",
      "plugins": ['AMap.PolygonEditor'],
    }).then((AMap: any) => {
      this.AMap = AMap;
      this.map = new AMap.Map('container', {
        center: [104.066301, 30.572961],
        zoom: 16
      });
      this.polyEditor = new AMap.PolygonEditor(this.map);
      this.loadLandBlockList()
    }).catch((e: any) => {
      console.log(e);
    })


  }

  loadLandBlockList() {
    let polygonList: any[] = []
    this.data.landBlockList.forEach(landBlock => {
      let polygon = new this.AMap.Polygon({
        path: landBlock.path
      })
      polygon.on('click', () => {
        this.polyEditor.setTarget(polygon);
        this.polyEditor.open();
        this.selected = landBlock;
      })
      polygonList.push(polygon)
    })
    this.map.add(polygonList);
    this.polyEditor.addAdsorbPolygons(polygonList);
  }

  selectLandBlock(landBlock: LandBlock) {

  }

  createPolygon() {
    this.polyEditor.close();
    this.polyEditor.setTarget();
    this.polyEditor.open();
    this.message.info('点击地图上任意位置，开始绘制地块<br>双击结束绘制<br>右键撤销绘制');
    this.polyEditor.on('add', async (data: any) => {
      console.log(data);
      let polygon = data.target;
      let landBlock: LandBlock = {
        id: "11",
        name: '新建地块',
        addr: '',
        creator: 'clz',
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
        path: polygon.getPath().map((p: any) => [p.lng, p.lat]),
      }
      landBlock.name = await this.data.getAddress(landBlock.path)

      if (this.landBlockList.length == 0 ||
        JSON.stringify(this.landBlockList[this.landBlockList.length - 1].path) != JSON.stringify(landBlock.path)) {
        this.data.addLandBlock(landBlock)
        this.selected = landBlock;
        this.polyEditor.addAdsorbPolygons(polygon);
        polygon.on('click', () => {
          console.log('选中块：', landBlock.name);
          this.polyEditor.setTarget(polygon);
          this.polyEditor.open();
          this.selected = landBlock;
        })
      }
    })
  }

  showSearch() {

  }

  importFile() {

  }

  exportFile() {

  }

}
