import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { ActiveUserService } from '../services/active-user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,
    private activeUSerService: ActiveUserService) {
    this.activeUSerService.setAccessibleParts();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Observable<boolean> | Promise<boolean> {
    // if(JSON.parse(localStorage.getItem('ls.authorizationData'))?.emailId=="admin@admin.com")
    //   return true;
    let url = route.url;
    if (this.isUserLogged()) {
      return true;
    }
    this.router.navigateByUrl('/');
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Observable<boolean> | Promise<boolean> {
    return this.canActivate(route, state);
  }
  private getUserType() {
    return parseInt(JSON.parse(localStorage.getItem('ls.authorizationData')).userType);
  }
  private isUserLogged() {
    return (localStorage.getItem('ls.authorizationData') != undefined && localStorage.getItem('ls.authorizationData') != "undefined");
  }
}
