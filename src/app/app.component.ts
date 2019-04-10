import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
  results = [];
  timeout = 0;
  TIMEOUT_KEY = "TIMEOUT_KEY";


  constructor(private appService: AppService) { }

  callApi(number){
    var i = 0;
    this.results = []
    for(i = 0; i< number; i++){
      this.appService.getValue().subscribe((result)=>{
        this.results.push(result);
      });
    }
  }

  changeTimeout(){
    sessionStorage.setItem(this.TIMEOUT_KEY,JSON.stringify(this.timeout));
  }

  clearCacheAndReload(){
    sessionStorage.clear();
    document.location.reload(true);
  }
}
