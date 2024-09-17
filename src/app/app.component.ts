import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { icons} from '../app/shared/icons/icon-list'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sparrow-auto-finance';


  notificationOptions = {
    timeOut: 3900,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    // animate: 'fromRight',
  };


  constructor( private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer ){
    for (const key in icons) {
      iconRegistry.addSvgIconLiteral(
        key,
        sanitizer.bypassSecurityTrustHtml(icons[key as keyof typeof icons])
      );
    }
  }

  ngOnInit(){

  }
}
