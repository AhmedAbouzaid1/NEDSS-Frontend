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
  private readonly idleSeconds = 4 * 60;
  private readonly timeoutWarningSeconds = 1 * 60;

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
  showSessionWarning = false;
  sessionCountdown = this.timeoutWarningSeconds;
  private warningSoundPlayed = false;

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

    idle.setIdle(this.idleSeconds);
    idle.setTimeout(this.timeoutWarningSeconds);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      this.hideSessionWarning();

      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.hideSessionWarning();
      this.finishLogout();
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      this.showSessionWarning = true;
      this.sessionCountdown = this.timeoutWarningSeconds;
      this.playSessionWarningSound();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      this.showSessionWarning = true;
      this.sessionCountdown = countdown;
      this.playSessionWarningSound();
    });

    this.ngZone.runOutsideAngular(() => {
      keepalive.interval(30);
      keepalive.onPing.subscribe(() => {
        this.lastPing = new Date();
        this.tryRefreshToken();
      });
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
    this.hideSessionWarning();
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }

  private refreshingToken = false;
  private readonly refreshThresholdMs = 2 * 60 * 1000;
  private tryRefreshToken() {
    if (this.refreshingToken) {
      return;
    }
    const msLeft = this.session.getMillisUntilExpiry();
    if (msLeft == null || msLeft > this.refreshThresholdMs || msLeft <= 0) {
      return;
    }
    this.refreshingToken = true;
    this.authService.refreshToken().subscribe({
      next: (res: any) => {
        const token = res?.data?.[0]?.token ?? res?.data?.token;
        if (token) {
          this.session.updateToken(token);
        }
        this.refreshingToken = false;
      },
      error: () => {
        this.refreshingToken = false;
      },
    });
  }

  logout() {
    this.finishLogout();
  }

  extendSession() {
    this.reset();
  }

  logoutFromSessionWarning() {
    this.finishLogout();
  }

  get sessionCountdownMinutes(): number {
    return Math.floor(this.sessionCountdown / 60);
  }

  get sessionCountdownSeconds(): string {
    return String(this.sessionCountdown % 60).padStart(2, '0');
  }

  private hideSessionWarning() {
    this.showSessionWarning = false;
    this.warningSoundPlayed = false;
  }

  private finishLogout() {
    this.hideSessionWarning();
    this.authService.logout().subscribe({ next: () => {}, error: () => {} });
    this.session.clear();
    this.authService.setUserLoggedIn(false);
    this.router.navigate(['/']);
  }

  private playSessionWarningSound() {
    if (this.warningSoundPlayed) {
      return;
    }

    this.warningSoundPlayed = true;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Session warning sound is unavailable because this browser does not support Web Audio.');
        return;
      }

      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.65);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.7);
    } catch (error) {
      console.warn('Session warning sound could not be played.', error);
    }
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
