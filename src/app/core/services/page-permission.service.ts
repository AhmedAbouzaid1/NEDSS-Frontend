import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PagePermissionService {
  private readonly AUTH_KEY = 'ls.authorizationData';
  private readonly ADMIN_USERNAME = 'admin@admin.com';

  private getAuthData(): any {
    try {
      return JSON.parse(localStorage.getItem(this.AUTH_KEY)) || {};
    } catch {
      return {};
    }
  }

  isAdmin(): boolean {
    return this.getAuthData().userName === this.ADMIN_USERNAME;
  }

  private permittedPageIds(): Set<string> {
    const pages: any[] = this.getAuthData().pages || [];
    return new Set(pages.map((p) => String(p?.id)));
  }

  canAccessPage(pageId: number | string | Array<number | string>): boolean {
    if (this.isAdmin()) {
      return true;
    }
    const permitted = this.permittedPageIds();
    const ids = Array.isArray(pageId) ? pageId : [pageId];
    return ids.some((id) => permitted.has(String(id)));
  }
}
