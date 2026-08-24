import { Component, NgZone, OnInit } from '@angular/core';
import { observeOn, asyncScheduler, combineLatest, map } from 'rxjs';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { PartialLoadingService } from './core/components/partial-loading/partial-loading.service';
import { UiLoadingService } from './core/services/ui-loading.service';
import { PwaUpdateService } from './core/services/pwa-update.service';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app-structure';
  lang: any;
  // Hide the request banner while the full-page infinity loader is active.
  showTopLoader$ = combineLatest([
    this.partialLoadingService.isCurrentlyLoading$,
    this.uiLoadingService.isLoading$
  ]).pipe(
    map(([isRequestLoading, isPageLoading]) => isRequestLoading && !isPageLoading),
    observeOn(asyncScheduler)
  );

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(
    private translate: TranslateService,
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private authService: AuthService,
    private partialLoadingService: PartialLoadingService,
    private uiLoadingService: UiLoadingService,
    private pwaUpdateService: PwaUpdateService,
    private session: SessionService,
    private ngZone: NgZone
  ) {
    this.pwaUpdateService.init();
    this.lang =
      localStorage.getItem('ls.currentLang') != undefined
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.translate.setDefaultLang(this.lang);
    translate.use(this.lang);

    // @ng-idle is the single auto-logout mechanism (the CloseSeatio timer was
    // removed). Consider the user idle after 300s (5 min) of no interaction,
    idle.setIdle(300);
    idle.setTimeout(300);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';

      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.authService.logout().subscribe({ next: () => {}, error: () => {} });
      this.session.clear();
      this.authService.setUserLoggedIn(false);
      this.router.navigateByUrl('/');
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
    });

    this.ngZone.runOutsideAngular(() => {
      keepalive.interval(15);
      keepalive.onPing.subscribe(() => (this.lastPing = new Date()));
    });

    this.authService.getUserLoggedIn().subscribe((userLoggedIn) => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });

    if (this.session.isValid()) {
      this.authService.setUserLoggedIn(true);
    } else {
      this.session.clearSession();
    }

  }

  reset() {
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }

  logout() {
    this.session.clear();
    this.authService.setUserLoggedIn(false);
    this.router.navigate(['/']);
  }

  dark: boolean = true;

  toggleDarkLight() {
    var body = document.getElementById('body');
    var currentClass = body.className;
    body.className = currentClass == 'dark-mode' ? 'light-mode' : 'dark-mode';

    this.dark = !this.dark;
    // if (this.dark) {
    //   this.dark = false;
    // }
    // else {
    //   this.dark = true;
    // }
  }
  darked() {
    var navStyle;
    if (this.dark) {
      this.dark = false;
      navStyle = 'font-size: 1.2rem; color: white;';
    } else {
      this.dark = true;
      navStyle = 'font-size: 1.2rem; color: black;';
    }
  }
}
