import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GisItem } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  landBlockList: GisItem[] = []
  polygonDict: any = {}

  map: any;

  constructor(
    private http: HttpClient
  ) {
    let landBlockListStr = localStorage.getItem('landBlockList')
    if (landBlockListStr != null)
      this.landBlockList = JSON.parse(landBlockListStr)
    else
      this.landBlockList = []
  }


  addLandBlock(landBlock: GisItem) {
    this.landBlockList.push(landBlock);
    this.saveLandBlock()
  }

  delLandBlock(landBlock: GisItem) {
    let index = this.landBlockList.indexOf(landBlock)
    this.landBlockList.splice(index, 1)
    this.map.remove(this.polygonDict[landBlock.id])
    // this.polygonDict[landBlock.id].destroy()
    delete this.polygonDict[landBlock.id]
    this.saveLandBlock()
  }

  saveLandBlock() {
    localStorage.setItem('landBlockList', JSON.stringify(this.landBlockList));
  }

  amapKey = 'dac1234df58fc86479e99d0d7168bf1f'

  getAddress(path: any[]) {
    return new Promise<string>((resolve, reject) => {
      let center = this.getCenter(path);
      this.http.get('https://restapi.amap.com/v3/geocode/regeo', {
        params: {
          key: this.amapKey,
          location: center[0] + ',' + center[1],
        }
      }).subscribe((data: any) => {
        let address = data.regeocode.formatted_address
          .replace(data.regeocode.addressComponent.province, '')
          .replace(data.regeocode.addressComponent.city, '')
          .replace(data.regeocode.addressComponent.district, '')
        resolve(address);
      })
    })
  }

  search(keyword: string) {
    return this.http.get('https://restapi.amap.com/v3/assistant/inputtips', {
      params: {
        key: this.amapKey,
        keywords: keyword,
      }
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

  gotoPosition(position: any) {
    this.map.setCenter(position)
  }


}
