import { Component, OnInit } from '@angular/core';
import * as AMapLoader from '@amap/amap-jsapi-loader';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../services/data.service';
import { GisItem } from '../interfaces/item.interface';

enum EditorState {
  Wait,
  Drawing,
  Selected
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  AMap: any;
  map: any;
  polyEditor: any;

  selected: GisItem | null = null;
  selectedList: GisItem[] = [];

  get polygonDict() {
    return this.data.polygonDict
  }

  tapPolygonTimer = false

  state = EditorState.Wait

  get landBlockList() {
    return this.data.landBlockList
  }

  resultList: any = []

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
      this.resultList = this.landBlockList

      this.map.on('click', (e: any) => {
        if (this.state == EditorState.Selected) {
          if (!this.tapPolygonTimer) {
            this.polyEditor.close();
            this.selected = null
            this.state = EditorState.Wait;
          }
        }
      })

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
        this.selectPolygon(landBlock, polygon)
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
      this.tapPolygon()
      this.polygonChange(data)
    })

    // 添加地块
    this.polyEditor.on('add', async (data: any) => {
      this.state = EditorState.Wait;
      console.log(data);
      let polygon = data.target;
      let landBlock: GisItem = {
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
        polygon.on('click', (e: any) => {
          this.selectPolygon(landBlock, polygon)
          // this.tapPolygon()
          // console.log('enter edit mode');
          // this.polyEditor.setTarget(polygon);
          // this.polyEditor.open();
          // this.selected = landBlock;
        })
      }
      this.polygonDict[landBlock.id] = polygon
      this.updateItemList()
      this.tapPolygonTimer = false
    })

    // this.polyEditor.on('end', () => {
    //   console.log('end:', 'endedn');
    //   setTimeout(() => {
    //     this.state = EditorState.Wait;
    //   }, 100);
    // })
  }

  polygonChange(data: any) {
    console.log('adjust:', data);
    let polygon = data.target;
    if (this.selected != null)
      this.selected.path = polygon.getPath().map((p: any) => [p.lng, p.lat])
    this.data.saveLandBlock()
  }

  selectItem(gisItem: GisItem) {
    console.log(gisItem);
    this.state = EditorState.Selected
    let polygon = this.polygonDict[gisItem.id]
    this.polyEditor.setTarget(polygon);
    this.polyEditor.open();
    this.selected = gisItem;
    if (gisItem.path.length != 0) {
      let center = this.data.getCenter(gisItem.path)
      this.data.gotoPosition(center);
    }

  }

  selectPolygon(gisItem: GisItem, polygon: any) {
    this.state = EditorState.Selected
    this.tapPolygon()
    this.polyEditor.setTarget(polygon);
    this.polyEditor.open();
    this.selected = gisItem;
  }

  createPonit() {

  }

  createLine() {

  }

  createPolygon() {
    this.state = EditorState.Drawing;
    console.log('enter new mode');
    this.tapPolygonTimer = true
    this.polyEditor.close();
    this.polyEditor.setTarget();
    this.polyEditor.open();
    this.message.info('点击地图上任意位置，开始绘制地块<br>双击结束绘制<br>右键撤销绘制');
    this.selected = null;
  }

  importFile() {

  }

  delLandBlock(landBlock: GisItem, e: any) {
    e.stopPropagation();
    landBlock['removeState'] = 1
    setTimeout(() => {
      landBlock['removeState'] = 2
      this.polyEditor.close()
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

  tapPolygon() {
    this.tapPolygonTimer = true
    setTimeout(() => {
      this.tapPolygonTimer = false
    }, 100);
  }


  keyword = ''
  keywordChange() {
    this.updateItemList()
  }

  updateItemList() {
    this.resultList = this.landBlockList.filter(item => item.addr.includes(this.keyword))
  }

  gotoGithub() {
    window.open("https://github.com/coloz/GisEditor", "_blank")
  }

  showSearch = false
  openSearchBar() {
    this.showSearch = !this.showSearch
  }

  showExport = false
  openExportBox() {
    this.showExport = !this.showExport
  }

}
