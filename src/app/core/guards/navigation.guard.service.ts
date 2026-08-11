import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  CanActivateChild,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserMessageService } from '../services/user.message.service';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationGuard {
  AllRouts = [
    { Comingroute: 'chart', id: 1 },
    { Comingroute: 'general-data', id: 2 },
    { Comingroute: 'search', id: 3 },
    { Comingroute: 'general-data-completion', id: 4 },
    { Comingroute: 'repeated-records', id: 5 },
    { Comingroute: 'zero-notification', id: 6 },
    { Comingroute: 'immediate-notification', id: 7 },
    { Comingroute: 'lab-cases', id: 8 },
    { Comingroute: 'events', id: 9 },
    { Comingroute: 'investigations', id: 10 },
    { Comingroute: 'investigation-detailes', id: 10 },
    { Comingroute: 'compelete-investigation', id: 10 },
    { Comingroute: 'h5n1', id: 10 },
    { Comingroute: 'brucella', id: 10 },
    { Comingroute: 'meningeal', id: 10 },
    { Comingroute: 'monkeypox', id: 10 },
    { Comingroute: 'rabies', id: 10 },
    { Comingroute: 'plague', id: 10 },
    { Comingroute: 'fever-rash', id: 10 },
    { Comingroute: 'rift-valley', id: 10 },
    { Comingroute: 'tetanus', id: 10 },
    { Comingroute: 'whooping-cough', id: 10 },
    { Comingroute: 'diphtheria', id: 10 },
    { Comingroute: 'hemorrhagic-fevers', id: 10 },
    { Comingroute: 'malaria', id: 10 },
    { Comingroute: 'schistosomiasis', id: 10 },
    { Comingroute: 'fasciola', id: 10 },
    { Comingroute: 'selected-locations-questions', id: 11 },
    { Comingroute: 'not-inferring', id: 12 },
    { Comingroute: 'population-data', id: 13 },
    { Comingroute: 'add-population-data', id: 13 },
    { Comingroute: 'populationExpectation', id: 13 },
    { Comingroute: 'increase-coeffiecnt', id: 13 },
    { Comingroute: 'upload-excel-file.html', id: 13 },
    { Comingroute: 'increase-coeffiecnt', id: 14 },
    { Comingroute: 'preparations', id: 15 },
    { Comingroute: 'users', id: 16 },
    { Comingroute: 'connected-users', id: 16 },
    { Comingroute: 'add-user', id: 16 },
    { Comingroute: 'edit-user', id: 16 },
    { Comingroute: 'reports', id: 17 },
    { Comingroute: 'announcements', id: 18 },
    { Comingroute: 'help', id: 19 },
    { Comingroute: 'codes', id: 24 },
    { Comingroute: 'organization', id: 24 },
    { Comingroute: 'government', id: 24 },
    { Comingroute: 'dependency', id: 24 },
    { Comingroute: 'health-administration', id: 24 },
    { Comingroute: 'incident-source', id: 24 },
    { Comingroute: 'city', id: 24 },
    { Comingroute: 'principality', id: 24 },
    { Comingroute: 'diseases', id: 24 },
    { Comingroute: 'disease-checks', id: 24 },
    { Comingroute: 'patient-job-category', id: 24 },
    { Comingroute: 'patient-job', id: 24 },
    { Comingroute: 'device-type', id: 24 },
    { Comingroute: 'device-category', id: 24 },
    { Comingroute: 'disease-category', id: 24 },
    { Comingroute: 'disease-group', id: 24 },
    { Comingroute: 'disease-lab-checks', id: 24 },
    { Comingroute: 'disease-lab-checks-result', id: 24 },
    { Comingroute: 'lab-places', id: 24 },
    { Comingroute: 'unit-responsibility-level', id: 24 },
    { Comingroute: 'user-group', id: 24 },
    { Comingroute: 'department', id: 24 },
    { Comingroute: 'nationality', id: 24 },
    { Comingroute: 'health-office', id: 24 },
    { Comingroute: 'final-result', id: 24 },
    { Comingroute: 'case-result-category', id: 24 },
    { Comingroute: 'incident-source-type', id: 24 },
    { Comingroute: 'dashBoardControlers', id: 24 },
    { Comingroute: 'permissions', id: 25 },
    { Comingroute: 'add-roles', id: 25 },
    { Comingroute: 'disease-rules', id: 26 },
    { Comingroute: 'audit-trial', id: 27 },
    { Comingroute: 'disease-symptoms', id: 28 },
    { Comingroute: 'dynamic-forms', id: 29 },
    { Comingroute: 'user-manual', id: 30 },
    { Comingroute: 'evaluation-questions', id: 31 },
    { Comingroute: 'system-settings', id: 31 },
    { Comingroute: 'control-panel', id: 50 },
    { Comingroute: 'patient-checks', id: 51 },
    { Comingroute: 'add-checks', id: 51 },
    { Comingroute: 'add-patient', id: 52 },
    { Comingroute: 'chat', id: 1 },
    { Comingroute: 'Notifications', id: 1 },
    { Comingroute: 'un-completed-inv', id: 53 },
    { Comingroute: 'reported-cases', id: 54 },
    { Comingroute: 'times-difference', id: 55 },
    { Comingroute: 'full-data', id: 56 },
    { Comingroute: 'non-inferring', id: 57 },
    { Comingroute: 'examine-cases', id: 58 },
    { Comingroute: 'ari', id: 59 },
    { Comingroute: 'brucella', id: 60 },
    { Comingroute: 'meningeal', id: 61 },
    { Comingroute: 'monkeypox', id: 62 },
    { Comingroute: 'rabies', id: 63 },
    { Comingroute: 'plague', id: 64 },
    { Comingroute: 'fever-rash', id: 65 },
    { Comingroute: 'rift-valley', id: 66 },
    { Comingroute: 'tetanus', id: 67 },
    { Comingroute: 'whooping-cough', id: 68 },
    { Comingroute: 'whoopdiphtheriaing', id: 69 },
    { Comingroute: 'hemorrhagic-fevers', id: 70 },
    { Comingroute: 'malaria', id: 71 },
    { Comingroute: 'schistosomiasis', id: 72 },
    { Comingroute: 'fasciola', id: 72 },
    { Comingroute: 'hepatitisViruses', id: 73 },
    { Comingroute: 'typhoid', id: 74 },
    { Comingroute: 'cholera', id: 75 },
    { Comingroute: 'NfalseChickenpoxULL', id: 76 },
    { Comingroute: 'severeFoodPoisoning', id: 77 },
    { Comingroute: 'bloodyDiarrhea', id: 78 },
    { Comingroute: 'filariasis', id: 79 },
    { Comingroute: 'trachoma', id: 95 },
    { Comingroute: 'leishmania', id: 80 },
    { Comingroute: 'tuberculosis', id: 81 },
    { Comingroute: 'diarrhea', id: 82 },
    { Comingroute: 'falseChickenpox', id: 83 },
    { Comingroute: 'hepatitisViruses', id: 84 },
    { Comingroute: 'leper', id: 85 },
    { Comingroute: 'mumbariPoisoning', id: 86 },
    { Comingroute: 'mumps', id: 87 },
    { Comingroute: 'severeFoodPoisoning', id: 88 },
    { Comingroute: 'typhoid', id: 89 },
    { Comingroute: 'hiv', id: 90 },
    { Comingroute: 'mers', id: 91 },
    { Comingroute: 'acute', id: 92 },
    { Comingroute: 'system-settings', id: 93 },
    { Comingroute: 'qustion-form', id: 94 },
  ];
  filterdData: any;
  constructor(
    private router: Router,
    private userMsg: UserMessageService,
    private session: SessionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.session.isValid()) {
      this.session.clearSession();
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return of(false);
    }
    const authData = this.session.getSession();
    if (authData.emailId == 'admin@admin.com')
      return of(true);
    let userPremitedPages: any[] = authData.pages;
    let userPremitedPagesIds = [];
    userPremitedPages.forEach((element) => {
      userPremitedPagesIds.push(element.id);
    });
    this.filterdData = this.AllRouts.filter(
      (m) => m.Comingroute == (route.url[0] != null ? route.url[0].path : '')
    );
    if (
      !userPremitedPagesIds.includes(
        this.filterdData[0] != null ? this.filterdData[0].id : 0
      )
    ) {
      this.userMsg.error('انت ليس لديك صلاحية الدخول');
      this.router.navigateByUrl('/home/chart');
      return of(false);
    }
    return of(true);
  }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  // boolean | Observable<boolean> | Promise<boolean> {
  //   return this.canActivate(route, state);
  // }
  // private getUserType(){
  //     return parseInt(JSON.parse(localStorage.getItem('ls.authorizationData')).userType);
  // }
  // private isUserLogged()
  // {
  //   return (localStorage.getItem('ls.authorizationData') != undefined && localStorage.getItem('ls.authorizationData')!="undefined");
  // }
}
