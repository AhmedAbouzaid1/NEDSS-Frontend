import { Component, HostListener, OnInit } from '@angular/core';
import { observeOn, asyncScheduler, combineLatest, map } from 'rxjs';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/services/auth.service';
import { CloseSeatioService } from './close-seatio.service';
import { PartialLoadingService } from './core/components/partial-loading/partial-loading.service';
import { UiLoadingService } from './core/services/ui-loading.service';

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
    private closeSeatioService: CloseSeatioService,
    private partialLoadingService: PartialLoadingService,
    private uiLoadingService: UiLoadingService
  ) {
    this.lang =
      localStorage.getItem('ls.currentLang') != undefined
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.translate.setDefaultLang(this.lang);
    translate.use(this.lang);

    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(300);
    // sets a timeout period of 300 seconds. after 10 seconds of inactivity, the user will be considered timed out.
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
      this.router.navigate(['/']);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.authService.getUserLoggedIn().subscribe((userLoggedIn) => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });
    this.onloadHandler();
  }

  ngOnInit() {
    //  وقت الإغلاق  5 دقيقة
    this.closeSeatioService.setLogoutTimeout(15);
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    localStorage['unloadTime'] = new Date().getTime();
  }

  onloadHandler() {
    const pageAccessedByReload =
      (window.performance.navigation &&
        window.performance.navigation.type === 1) ||
      window.performance
        .getEntriesByType('navigation')
        .map((nav) => nav.entryType)
        .includes('reload');
    if (pageAccessedByReload) {
      localStorage.removeItem('unloadTime');
      return;
    }
    let t0 = Number(localStorage['unloadTime']);
    if (isNaN(t0)) return;
    localStorage.removeItem('unloadTime');
    localStorage.removeItem('ls.authorizationData');
    this.router.navigateByUrl('');
  }

  resetLogoutTimeout() {
    this.closeSeatioService.clearLogoutTimeout();
    this.closeSeatioService.setLogoutTimeout(1500);
  }

  reset() {
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }

  logout() {
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
