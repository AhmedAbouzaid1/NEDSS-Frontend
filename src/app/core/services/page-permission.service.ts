import { Injectable } from '@angular/core';

export const INVESTIGATION_FORM_PAGE_OFFSET = 500;
export const ENTOMOLOGICAL_FORM_PAGE_OFFSET = 1000;

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
    const auth = this.getAuthData();
    return auth.emailId === this.ADMIN_USERNAME || auth.userName === this.ADMIN_USERNAME;
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

  hasExplicitPage(pageId: number | string | Array<number | string>): boolean {
    const permitted = this.permittedPageIds();
    const ids = Array.isArray(pageId) ? pageId : [pageId];
    return ids.some((id) => permitted.has(String(id)));
  }

  private editablePageIds(): Set<string> {
    const pages: any[] = this.getAuthData().pages || [];
    return new Set(pages.filter((p) => !p?.isReadOnly).map((p) => String(p?.id)));
  }

  canEditPage(pageId: number | string | Array<number | string>): boolean {
    if (this.isAdmin()) {
      return true;
    }
    const editable = this.editablePageIds();
    const ids = Array.isArray(pageId) ? pageId : [pageId];
    return ids.some((id) => editable.has(String(id)));
  }

  isReadOnlyPage(pageId: number | string | Array<number | string>): boolean {
    return this.canAccessPage(pageId) && !this.canEditPage(pageId);
  }

  canEditInvestigationForm(diseaseGroupId: number | string): boolean {
    const id = Number(diseaseGroupId);
    return !!id && this.canEditPage(INVESTIGATION_FORM_PAGE_OFFSET + id);
  }

  canEditEntomologicalForm(diseaseGroupId: number | string): boolean {
    const id = Number(diseaseGroupId);
    return !!id && this.canEditPage(ENTOMOLOGICAL_FORM_PAGE_OFFSET + id);
  }

  canAccessInvestigationForm(diseaseGroupId: number | string): boolean {
    const id = Number(diseaseGroupId);
    if (!id) {
      return false;
    }
    return this.canAccessPage(INVESTIGATION_FORM_PAGE_OFFSET + id);
  }

  canAccessEntomologicalForm(diseaseGroupId: number | string): boolean {
    const id = Number(diseaseGroupId);
    if (!id) {
      return false;
    }
    return this.canAccessPage(ENTOMOLOGICAL_FORM_PAGE_OFFSET + id);
  }
}
