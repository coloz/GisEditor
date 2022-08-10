import { Component, OnInit } from '@angular/core';
import * as AMapLoader from '@amap/amap-jsapi-loader';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService, LandBlock } from '../services/data.service';
import { saveAs } from 'file-saver';

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

  polygonDict: any = {}

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
      this.data.map = this.map
      this.polyEditor = new AMap.PolygonEditor(this.map);
      this.loadLandBlockList()
      // this.map.on('click', (e: any) => {
      //   console.log(e.target);
      //   console.log(JSON.stringify(e.target));
        
      //   this.polyEditor.close();
      // })
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
      polygon.on('click', (e: any) => {
        console.log(e);

        this.polyEditor.setTarget(polygon);
        this.polyEditor.open();
        this.selected = landBlock;
      })
      this.polygonDict[landBlock.id] = polygon
      polygonList.push(polygon)
    })
    this.map.add(polygonList);
    this.polyEditor.addAdsorbPolygons(polygonList);

    // 调整地块
    this.polyEditor.on('adjust', (data: any) => {
      this.polygonChange(data)
    })
    this.polyEditor.on('addnode', (data: any) => {
      this.polygonChange(data)
    })
    this.polyEditor.on('removenode', (data: any) => {
      this.polygonChange(data)
    })

    // 添加地块
    this.polyEditor.on('add', async (data: any) => {
      console.log(data);
      let polygon = data.target;
      let landBlock: LandBlock = {
        id: this.randomString(16),
        name: '新的地块' + this.randomString(2),
        addr: '',
        creator: 'clz',
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
        path: polygon.getPath().map((p: any) => [p.lng, p.lat]),
      }
      landBlock.addr = await this.data.getAddress(landBlock.path)

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
      this.polygonDict[landBlock.id] = polygon
    })
  }

  polygonChange(data: any) {
    console.log('adjust:', data);
    let polygon = data.target;
    if (this.selected != null)
      this.selected.path = polygon.getPath().map((p: any) => [p.lng, p.lat])
    this.data.saveLandBlock()
    console.log(this.selected);
  }

  selectLandBlock(landBlock: LandBlock) {
    let polygon = this.polygonDict[landBlock.id]
    this.polyEditor.setTarget(polygon);
    this.polyEditor.open();
    this.selected = landBlock;
  }

  createPonit() {

  }

  createLine() {

  }

  createPolygon() {
    this.polyEditor.close();
    this.polyEditor.setTarget();
    this.polyEditor.open();
    this.message.info('点击地图上任意位置，开始绘制地块<br>双击结束绘制<br>右键撤销绘制');
  }

  showSearch = false
  openSearchBar() {
    this.showSearch = !this.showSearch
  }

  importFile() {

  }

  exportFile() {
    if (this.landBlockList.length == 0) {
      this.message.error('未创建任何地块');
      return
    }
    let data = this.landBlockList
    try {
      let file = new File([JSON.stringify(data)], `landblock.json`, { type: "text/plain;charset=utf-8" });
      saveAs(file);
    } catch (error) {
      this.message.error('导出失败')
    }
  }

  delLandBlock(landBlock: LandBlock) {
    landBlock['removeState'] = 1
    setTimeout(() => {
      landBlock['removeState'] = 2
    }, 400);
    setTimeout(() => {
      landBlock['removeState'] = 3
    }, 500);
    setTimeout(() => {
      this.data.delLandBlock(landBlock)
    }, 1000);
  }

  randomString(length: number = 32) {
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789",
      a = t.length,
      str = "";
    for (let i = 0; i < length; i++) str += t.charAt(Math.floor(Math.random() * a));
    return str
  }

}
