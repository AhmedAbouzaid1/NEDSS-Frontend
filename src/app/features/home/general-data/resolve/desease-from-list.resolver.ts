import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
 import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
 import { SharedDataService } from '../services/shared-data.service';
 @Injectable({
  providedIn: 'root'
})
export class DemographicListResolver  implements Resolve  <any>
{

  constructor(
     protected router: Router,
     private sharedDataService: SharedDataService,


  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {


    return  this.sharedDataService.getPatientObject() ;

     }

}
