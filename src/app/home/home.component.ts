import { Component, OnInit } from '@angular/core';
import * as AMapLoader from '@amap/amap-jsapi-loader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  map: any;
  polyEditor: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    AMapLoader.load({
      "key": "6f02b1056c81d1638ecf21c8469f7b61",
      "version": "2.0",
      "plugins": ['AMap.PolygonEditor'],
    }).then((AMap: any) => {
      this.map = new AMap.Map('container', {
        center: [104.066301, 30.572961],
        zoom: 16
      });

      var path1 = [[116.475334, 39.997534], [116.476627, 39.998315], [116.478603, 39.99879], [116.478529, 40.000296], [116.475082, 40.000151], [116.473421, 39.998717]]
      var path2 = [[116.474595, 40.001321], [116.473526, 39.999865], [116.476284, 40.000917]]
      var polygon1 = new AMap.Polygon({
        path: path1
      })
      var polygon2 = new AMap.Polygon({
        path: path2
      })

      this.map.add([polygon1, polygon2]);
      this.map.setFitView();
      this.polyEditor = new AMap.PolygonEditor(this.map);
      this.polyEditor.addAdsorbPolygons([polygon1, polygon2]);
      this.polyEditor.on('add', (data: any) => {
        console.log(data);
        var polygon = data.target;
        this.polyEditor.addAdsorbPolygons(polygon);
        polygon.on('dblclick', () => {
          this.polyEditor.setTarget(polygon);
          this.polyEditor.open();
        })
      })
      polygon1.on('dblclick', () => {
        this.polyEditor.setTarget(polygon1);
        this.polyEditor.open();
      })
      polygon2.on('dblclick', () => {
        this.polyEditor.setTarget(polygon2);
        this.polyEditor.open();
      })
      this.polyEditor.setTarget(polygon2);
      this.polyEditor.open();

    }).catch((e: any) => {
      console.log(e);
    })


  }

  createPolygon() {
    this.polyEditor.close();
    this.polyEditor.setTarget();
    this.polyEditor.open();
  }

}
