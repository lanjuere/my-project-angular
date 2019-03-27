import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';

  constructor(private appService: AppService) { }

  callApi(number){
    var i = 0;
    for(i = 0; i< number; i++){
      this.appService.getValue().subscribe(function(result){
        console.log("résultat composant "+i+" :",result);
      })
    }
  }

  clearCache(){
    sessionStorage.clear();
  }
}
