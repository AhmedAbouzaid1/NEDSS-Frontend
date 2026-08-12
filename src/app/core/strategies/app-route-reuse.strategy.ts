import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

@Injectable()
export class AppRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: { [key: string]: DetachedRouteHandle } = {};

  private getKey(route: ActivatedRouteSnapshot): string {
    return route.routeConfig?.path ?? '';
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data?.['reuseComponent'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    const key = this.getKey(route);
    if (!key) return;
    if (handle) {
      this.handlers[key] = handle;
    } else {
      delete this.handlers[key];
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getKey(route);
    return (
      route.data?.['reuseComponent'] === true && !!key && !!this.handlers[key]
    );
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getKey(route);
    if (!key) return null;
    return this.handlers[key] ?? null;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
