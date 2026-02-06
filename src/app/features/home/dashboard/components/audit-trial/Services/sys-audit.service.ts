import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SysAuditService {

  private UserUrl: string = environment.baseApiUrl + 'Account/';
    private PageUrl: string = environment.baseApiUrl + 'AppPage/';
    private SysAuditUrl: string = environment.baseApiUrl + 'SysAudit/';

  constructor(private APIs: BaseAPIService) {}

  getAllUsers(filter: any) {
    return this.APIs.create(this.UserUrl + 'GetPage', filter);
  }
  getAllPages() {
    return this.APIs.get(this.PageUrl + 'GetAll?hasHelp=' + false);
  }


  getPageSysAudits(filter: any) {
    return this.APIs.create(this.SysAuditUrl + 'GetPage', filter);
  }
}
