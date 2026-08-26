import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { of } from 'rxjs';
import { InvestigationService } from 'src/app/features/home/investigation/services/investigation.service';

@Injectable({
  providedIn: 'root',
})
export class InvestigationPatientGuard implements CanActivate {
  constructor(
    private router: Router,
    private investigation: InvestigationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const routeId = route.paramMap.get('id');
    if (routeId) {
      this.investigation.currentid = routeId;
      const diseaseGroupId = route.paramMap.get('diseaseId');
      if (diseaseGroupId) {
        this.investigation.diseaseGroupID = Number(diseaseGroupId);
      }
      return of(true);
    }

    if (this.investigation.currentid != null) {
      return of(true);
    }

    this.router.navigateByUrl('/home/investigations');
    return of(false);
  }
}
