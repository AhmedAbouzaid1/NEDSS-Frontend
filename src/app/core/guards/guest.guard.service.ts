import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router, private session: SessionService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.session.isValid()) {
      return true;
    }
    const returnUrl = route.queryParamMap.get('returnUrl');
    const target =
      returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//') && returnUrl !== '/'
        ? returnUrl
        : '/home/welcome';
    return this.router.parseUrl(target);
  }
}
