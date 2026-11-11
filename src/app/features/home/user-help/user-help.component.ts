import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';
import { HelpModel } from './helpModel';

@Component({
  selector: 'app-user-help',
  templateUrl: './user-help.component.html',
  styleUrls: ['./user-help.component.css']
})
export class UserHelpComponent implements OnInit {
  loadingPanel: boolean;
  AllAppPages: any;
  showHelpId = new FormControl ();
  specificHelp: HelpModel = new HelpModel;

  constructor(private lookupsService : LookupsGetterService ,private translateService:TranslateService,
    private userMsg:UserMessageService,private APIs : BaseAPIService) {

  }
  ngOnInit(): void {
    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink?.classList.remove('active');
    this.getMainBranch();
  }

  getMainBranch(){
    this.lookupsService.getAllAppPages().subscribe((result: any) => {
      if (result != null && result != undefined) {
          this.AllAppPages = result.data;
      }
      this.loadingPanel = false;
  }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
      });
  });
  }

  showHelp(){
   if (this.showHelpId.value == null) {
        return;
   }
   this.APIs.get(`${environment.baseApiUrl}OptionsHelp/GetById?id=${this.showHelpId.value}`).subscribe({
        next: (res : any)=>{this.specificHelp = res?.data?.[0] ?? new HelpModel()},
        error:(err)=>{console.log(err);
        }
    })
  }




}
