import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface LandBlock {
  id: string,
  name: string,
  addr?: string,
  creator?: string,
  createTime: string,
  updateTime: string,
  path: any[],
  color?: string,
  type?: string,
  removeState?: number,
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  landBlockList: LandBlock[] = [
    // {
    //   id: "1",
    //   name: "北京",
    //   addr: "北京市海淀区",
    //   creator: "张三",
    //   createTime: "2020-01-01",
    //   updateTime: "2020-01-01",
    //   path: [[116.475334, 39.997534], [116.476627, 39.998315], [116.478603, 39.99879], [116.478529, 40.000296], [116.475082, 40.000151], [116.473421, 39.998717]]
    // },
    // {
    //   id: "1",
    //   name: "北京22",
    //   addr: "北京111",
    //   creator: "张三",
    //   createTime: "2020-01-01",
    //   updateTime: "2020-01-01",
    //   path: [[116.474595, 40.001321], [116.473526, 39.999865], [116.476284, 40.000917]]
    // },
  ]

  constructor(
    private http: HttpClient
  ) {
    let landBlockListStr = localStorage.getItem('landBlockList')
    if (landBlockListStr != null)
      this.landBlockList = JSON.parse(landBlockListStr)
    else
      this.landBlockList = []
  }


  addLandBlock(landBlock: LandBlock) {
    this.landBlockList.push(landBlock);
    this.saveLandBlock()
  }

  delLandBlock(landBlock: LandBlock) {
    let index = this.landBlockList.indexOf(landBlock)
    this.landBlockList.splice(index, 1)
    this.saveLandBlock()
  }

  saveLandBlock() {
    localStorage.setItem('landBlockList', JSON.stringify(this.landBlockList));
  }

  getAddress(path: any[]) {
    return new Promise<string>((resolve, reject) => {
      let center = this.getCenter(path);
      this.http.get('https://restapi.amap.com/v3/geocode/regeo', {
        params: {
          key: 'dac1234df58fc86479e99d0d7168bf1f',
          location: center[0] + ',' + center[1],
        }
      }).subscribe((data: any) => {
        // console.log(data.regeocode.formatted_address);
        // data.regeocode.addressComponent.building.name
        resolve(data.regeocode.formatted_address);
        // console.log(data);
        // resolve(data.regeocode.addressComponent.building.name);
      })
    })

  }

  getCenter(path: any[]) {
    var total = path.length;
    var X = 0,
      Y = 0,
      Z = 0;
    path.map((item) => {
      var lng = (item[0] * Math.PI) / 180;
      var lat = (item[1] * Math.PI) / 180;
      var x, y, z;
      x = Math.cos(lat) * Math.cos(lng);
      y = Math.cos(lat) * Math.sin(lng);
      z = Math.sin(lat);
      X += x;
      Y += y;
      Z += z;
    });
    X = X / total;
    Y = Y / total;
    Z = Z / total;
    var Lng = Math.atan2(Y, X);
    var Hyp = Math.sqrt(X * X + Y * Y);
    var Lat = Math.atan2(Z, Hyp);
    return [(Lng * 180) / Math.PI, (Lat * 180) / Math.PI];
  }

}
