import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
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
    private userMsg:UserMessageService,private http : HttpClient) {

  }
  ngOnInit(): void {
    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
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
   return this.http.get(`${environment.baseApiUrl}OptionsHelp/GetById?id=${this.showHelpId.value}`).subscribe({
        next: (res : any)=>{console.log(res);this.specificHelp = res.data[0]},
        error:(err)=>{console.log(err);
        }
    })
  }




}
