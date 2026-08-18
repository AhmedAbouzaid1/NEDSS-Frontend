import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LookupsGetterService } from '../services/lookups-getter.service';

@Injectable({
  providedIn: 'root',
})
export class ChartsTabGuard implements CanActivate {
  constructor(
    private lookupsService: LookupsGetterService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.lookupsService.getChartsTabEnabled().pipe(
      map((result: any) => {
        const value = result != null ? result.data : null;
        const normalized =
          typeof value === 'string' ? value.toLowerCase() : value;
        const disabled = normalized === false || normalized === 'false';
        return disabled
          ? this.router.parseUrl('/home/chart-disabled')
          : (true as boolean | UrlTree);
      }),
      // If the setting can't be read, fail open (charts remain accessible).
      catchError(() => of(true as boolean | UrlTree))
    );
  }
}
