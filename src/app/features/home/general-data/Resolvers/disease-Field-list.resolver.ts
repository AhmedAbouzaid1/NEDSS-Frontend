import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, map, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DiseaseSpecialSymptomsService } from '../../dashboard/components/disease-special-symptoms/services/disease-special-symptoms.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { SharedDataService } from '../services/shared-data.service';
import { PatientDiseseAnswerService } from '../../dashboard/components/disease-special-symptoms/services/patient-disease-answer.service';
@Injectable()
export class DiseaseFieldListResolver  implements Resolve  <any>
{

  constructor(
     protected router: Router,
     private diseaseSpecialSymptomsService: DiseaseSpecialSymptomsService,
    private userMsg: UserMessageService,
    private translateService:TranslateService,
    private sharedDataService: SharedDataService,
    private  patientDiseseAnswerService:PatientDiseseAnswerService

  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    // var userId=this.sharedDataService.patientId || 0;

    // let response1 = this.patientDiseseAnswerService.GetByPateintId(userId);
    // let response2 = this.sharedDataService.getPatientObject();
    // return    forkJoin([response1, response2]).pipe(
    //   map(res=>{
    //     return {
    //       anwsers:res[0],
    //       patient:res[1],
    //     }
    //   })
    // );

    return  this.sharedDataService.getPatientObject().pipe(
              catchError(error => {

                 return of(null);
              })
      )
     }

}


