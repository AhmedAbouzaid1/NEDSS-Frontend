import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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

  canActivate() {
    if (this.investigation.currentid == null) {
      this.router.navigateByUrl('/home/investigations');
      return of(false);
    }
    return of(true);
  }
}
