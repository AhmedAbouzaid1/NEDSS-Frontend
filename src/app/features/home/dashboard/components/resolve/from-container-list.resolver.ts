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
import { DiseaseFormService } from '../disease-special-symptoms/services/disease-form.service';
 @Injectable({
  providedIn: 'root'
})
export class FormContainerListResolver  implements Resolve  <any>
{

  constructor(
     protected router: Router,
     private diseaseFormService: DiseaseFormService,
     private userMsg: UserMessageService,
    private translateService:TranslateService,

  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
let id=route.paramMap.get('id');

    return  this.diseaseFormService.getByContainer(parseInt(id)).pipe(
              catchError(error => {
            return of(null);
              })
      )
     }

}
