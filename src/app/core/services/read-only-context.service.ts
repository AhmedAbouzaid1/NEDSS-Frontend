import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { InvestigationService } from 'src/app/features/home/investigation/services/investigation.service';
import { NavigationGuard } from '../guards/navigation.guard.service';
import {
  ENTOMOLOGICAL_FORM_PAGE_OFFSET,
  INVESTIGATION_FORM_PAGE_OFFSET,
  PagePermissionService,
} from './page-permission.service';

export const INVESTIGATION_READ_ONLY_SCOPE = 'investigation';

interface ReadOnlyRouteState {
  pageId: number | null;
  investigationForm: boolean;
}

@Injectable({ providedIn: 'root' })
export class ReadOnlyContextService {
  private readonly state$ = new BehaviorSubject<ReadOnlyRouteState>({ pageId: null, investigationForm: false });

  readonly readOnly$: Observable<boolean> = this.state$.pipe(
    map((s) => this.isPageReadOnly(s.pageId)),
    distinctUntilChanged()
  );

  readonly investigationReadOnly$: Observable<boolean> = this.state$.pipe(
    map((s) => s.investigationForm && this.isPageReadOnly(s.pageId)),
    distinctUntilChanged()
  );

  constructor(
    private router: Router,
    private navigationGuard: NavigationGuard,
    private pagePermission: PagePermissionService,
    private investigation: InvestigationService
  ) {
    this.state$.next(this.resolve(router.url));
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => this.state$.next(this.resolve(e.urlAfterRedirects)));
  }

  get currentPageId(): number | null {
    return this.state$.value.pageId;
  }

  get isReadOnly(): boolean {
    return this.isPageReadOnly(this.state$.value.pageId);
  }

  refresh(): void {
    this.state$.next(this.resolve(this.router.url));
  }

  isPageReadOnly(pageId: number | string | Array<number | string> | null | undefined): boolean {
    if (pageId == null || pageId === '' || (Array.isArray(pageId) && pageId.length === 0)) {
      return false;
    }
    return this.pagePermission.isReadOnlyPage(pageId);
  }

  private resolve(url: string): ReadOnlyRouteState {
    const segments = (url ?? '').split('?')[0].split('#')[0].split('/').filter(Boolean);

    const diseaseIdIndex = segments.indexOf('diseaseId');
    if (diseaseIdIndex >= 0 && Number(segments[diseaseIdIndex + 1]) > 0) {
      return {
        pageId: INVESTIGATION_FORM_PAGE_OFFSET + Number(segments[diseaseIdIndex + 1]),
        investigationForm: true,
      };
    }

    const shellIndex = segments.indexOf('compelete-investigation');
    const formSegment = shellIndex >= 0 ? segments[shellIndex + 1] : undefined;
    const diseaseGroupId = Number(this.investigation.diseaseGroupID);
    if (formSegment && diseaseGroupId > 0) {
      const offset = formSegment.startsWith('entomological')
        ? ENTOMOLOGICAL_FORM_PAGE_OFFSET
        : INVESTIGATION_FORM_PAGE_OFFSET;
      return { pageId: offset + diseaseGroupId, investigationForm: true };
    }

    for (let i = segments.length - 1; i >= 0; i--) {
      const match = this.navigationGuard.AllRouts.find((r) => r.Comingroute === segments[i]);
      if (match) {
        return { pageId: match.id, investigationForm: false };
      }
    }
    return { pageId: null, investigationForm: false };
  }
}
