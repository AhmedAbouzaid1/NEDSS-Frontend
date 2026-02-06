import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-controlPanel',
  templateUrl: './controlPanel.component.html',
  styleUrls: ['./controlPanel.component.css']
})
export class ControlPanelComponent {
  lang:any;
  loadingPanel:boolean = false;
  constructor(private translate: TranslateService) {
  }
}
