import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router } from '@angular/router';
import { of } from 'rxjs';
import { InvestigationService } from 'src/app/features/home/investigation/services/investigation.service';
import { PagePermissionService } from '../services/page-permission.service';
import { UserMessageService } from '../services/user.message.service';

@Injectable({
  providedIn: 'root',
})
export class InvestigationPatientGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private investigation: InvestigationService,
    private pagePermission: PagePermissionService,
    private userMsg: UserMessageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const routeId = route.paramMap.get('id');
    if (routeId) {
      this.investigation.currentid = routeId;
      const diseaseGroupId = route.paramMap.get('diseaseId');
      if (diseaseGroupId) {
        this.investigation.diseaseGroupID = Number(diseaseGroupId);
        if (!this.pagePermission.canAccessInvestigationForm(diseaseGroupId)) {
          this.userMsg.error('انت ليس لديك صلاحية الدخول لنموذج التقصي لهذا المرض');
          this.router.navigateByUrl('/home/investigations');
          return of(false);
        }
      }
      return of(true);
    }

    if (this.investigation.currentid != null) {
      return of(true);
    }

    this.router.navigateByUrl('/home/investigations');
    return of(false);
  }

  canActivateChild() {
    if (this.pagePermission.canAccessInvestigationForm(this.investigation.diseaseGroupID)) {
      return of(true);
    }
    this.userMsg.error('انت ليس لديك صلاحية الدخول لنموذج التقصي لهذا المرض');
    return of(this.router.parseUrl('/home/investigations/compelete-investigation'));
  }
}
