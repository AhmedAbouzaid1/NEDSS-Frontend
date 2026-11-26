import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavDrawerService implements OnDestroy {
  private readonly mobileQuery = window.matchMedia('(max-width: 991.98px)');
  private readonly mobileOpenSubject = new BehaviorSubject<boolean>(false);
  readonly mobileOpen$ = this.mobileOpenSubject.asObservable();

  private readonly onBreakpointChange = (event: MediaQueryListEvent) => {
    this.zone.run(() => {
      if (event.matches) {
        this.setExpanded(false);
      } else {
        this.sync();
      }
    });
  };

  constructor(private zone: NgZone) {
    this.mobileQuery.addEventListener('change', this.onBreakpointChange);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.onBreakpointChange);
  }

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }

  toggle(): void {
    this.setExpanded(!this.isExpanded());
  }

  open(): void {
    this.setExpanded(true);
  }

  close(): void {
    this.setExpanded(false);
  }

  closeOnMobile(): void {
    if (this.isMobile()) {
      this.setExpanded(false);
    }
  }

  private container(): HTMLElement | null {
    return document.querySelector('.main-container');
  }

  private isExpanded(): boolean {
    const container = this.container();
    return !!container && !container.classList.contains('nav-collapsed');
  }

  private setExpanded(expanded: boolean): void {
    const container = this.container();
    if (!container) {
      return;
    }
    container.classList.toggle('nav-collapsed', !expanded);
    this.sync();
  }

  private sync(): void {
    const expanded = this.isExpanded();
    document
      .querySelectorAll('#menuToggle .bi')
      .forEach((icon) => icon.classList.toggle('bi-x-circle', expanded));
    const mobileOpen = expanded && this.isMobile();
    document.body.classList.toggle('nd-drawer-open', mobileOpen);
    if (this.mobileOpenSubject.value !== mobileOpen) {
      this.mobileOpenSubject.next(mobileOpen);
    }
  }
}
