import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PwaUpdateService {
  constructor(private swUpdate: SwUpdate, private appRef: ApplicationRef) {}

  init(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    // A broken/unrecoverable SW state is exactly the "spins forever" symptom.
    // Reload once to fetch a fresh index.html and bundles from the server.
    this.swUpdate.unrecoverable.subscribe(() => {
      document.location.reload();
    });

    // A new version was downloaded and is ready to activate.
    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        // Don't yank the page out from under a signed-in user; apply on the
        // login screen where there is nothing to lose.
        const hasSession =
          !!localStorage.getItem('ls.authorizationData') &&
          localStorage.getItem('ls.authorizationData') !== 'undefined';
        if (!hasSession) {
          this.swUpdate
            .activateUpdate()
            .then(() => document.location.reload())
            .catch(() => {});
        }
      });

    // Poll for updates once the app is stable, then every 6 hours, so a new
    // deploy is picked up without depending on a full browser restart.
    const appIsStable$ = this.appRef.isStable.pipe(
      first((isStable) => isStable === true)
    );
    concat(appIsStable$, interval(6 * 60 * 60 * 1000)).subscribe(() => {
      this.swUpdate.checkForUpdate().catch(() => {});
    });
  }
}
