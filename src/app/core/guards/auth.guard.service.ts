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
      //   let userType=this.getUserType();

      //   if (route.data.types.length>0 && route.data.types.indexOf(userType) === -1) {
      //     if(userType==1 || userType ==2)
      //     {
      //       this.router.navigate(['/lab']);
      //     }
      //     else{
      //       this.router.navigate(['/home']);
      //     }
      //     return false;
      // }

      // authorised so return true
      return true;
    }
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
