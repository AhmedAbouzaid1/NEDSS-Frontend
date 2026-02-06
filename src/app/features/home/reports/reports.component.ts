import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

constructor() {

}

  ngOnInit(): void {
    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
}

}
