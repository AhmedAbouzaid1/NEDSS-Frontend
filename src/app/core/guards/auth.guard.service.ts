import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { ActiveUserService } from '../services/active-user.service';
import { SessionService } from '../services/session.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,
    private session: SessionService,
    private activeUSerService: ActiveUserService) {
    this.activeUSerService.setAccessibleParts();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Observable<boolean> | Promise<boolean> {
    if (this.session.isValid()) {
      return true;
    }
    this.session.clearSession();
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(route, state);
  }
}
