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

  displayValue(){
    return this.appService.getValue().subscribe(function(result){
      console.log(result);
    })
  }
}
