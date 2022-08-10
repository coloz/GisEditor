import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  keyword: string = '';

  searchText$ = new Subject<string>()
  result$: Observable<any> | null = null;
  resultList: any = []

  constructor(
    private data: DataService
  ) { }

  ngOnInit(): void {
    this.result$ = this.searchText$.pipe(
      debounceTime(1000), // 等待用户停止输入1000ms
      distinctUntilChanged(), // 等待搜索文本发生变化
      switchMap(data => { //将搜索请求发送到服务，
        return this.data.search(this.keyword);
      })
    );
    this.result$.subscribe(resp => {
      this.resultList = resp.tips.map((el: any) => {
        return {
          name: el.name,
          district: el.district,
          position: el.location.split(',')
        }
      });
    });
  }

  keywordChange() {
    if (this.keyword == '') {
      this.resultList = []
      return
    }
    this.searchText$.next(this.keyword);
  }

  gotoPosition(item: any) {
    this.data.map.setCenter(item.position)
  }

}
