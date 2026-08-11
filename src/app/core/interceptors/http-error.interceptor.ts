import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { SessionService } from '../services/session.service';
import { UserMessageService } from '../services/user.message.service';
import { PartialLoadingService } from '../components/partial-loading/partial-loading.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  /** Requests longer than this fail with a timeout error (downloads excluded). */
  private static readonly REQUEST_TIMEOUT_MS = 120_000;

  private isRedirecting = false;

  constructor(
    private session: SessionService,
    private router: Router,
    private translate: TranslateService,
    private userMessage: UserMessageService,
    private loading: PartialLoadingService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Static assets / i18n dictionaries shouldn't drive the app spinner or the
    // error pipeline — let them pass straight through.
    if (this.isAssetRequest(req) || this.isConnectivityCheck(req)) {
      return next.handle(req);
    }

    // Long-running transfers (file downloads/exports and uploads) must not be
    // killed by the request timeout.
    const isLongTransfer =
      req.responseType === 'blob' || req.body instanceof FormData;

    const drivesLoader = !this.isBackgroundRequest(req);

    if (drivesLoader) {
      this.loading.showloader();
    }

    let stream$ = next.handle(req);
    if (!isLongTransfer) {
      stream$ = stream$.pipe(
        timeout({ each: HttpErrorInterceptor.REQUEST_TIMEOUT_MS })
      );
    }

    return stream$.pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        if (drivesLoader) {
          this.loading.hideLoader();
        }
      })
    );
  }

  private isBackgroundRequest(req: HttpRequest<any>): boolean {
    const body = req.body as any;
    return !!body && typeof body === 'object' && body.countOnly === true;
  }

  private isAssetRequest(req: HttpRequest<any>): boolean {
    return req.url.includes('/assets/') || req.url.includes('./assets/');
  }

  private isConnectivityCheck(req: HttpRequest<any>): boolean {
    return req.url.includes('httpstat.us');
  }

  private get onLoginPage(): boolean {
    const path = this.router.url.split('?')[0];
    return path === '/' || path === '';
  }

  private handleError(error: any): void {
    if (error instanceof TimeoutError) {
      this.toast('NEDSS.COMMON.INTERNAL_SERVER_ERROR', 'error');
      return;
    }
    if (!(error instanceof HttpErrorResponse)) {
      return;
    }

    switch (true) {
      case error.status === 401:
        this.handleUnauthorized();
        break;
      case error.status === 0:
        if (!this.onLoginPage && !navigator.onLine) {
          this.toast('NEDSS.COMMON.NETWORK_ERROR', 'warn');
        }
        break;
      case error.status >= 500:
        this.toast('NEDSS.COMMON.INTERNAL_SERVER_ERROR', 'error');
        break;
      // 4xx (validation/forbidden/not-found) are surfaced by the calling
      // component, which knows the domain context — no generic toast here.
      default:
        break;
    }
  }

  private handleUnauthorized(): void {
    if (this.onLoginPage || this.isRedirecting) {
      return;
    }
    this.isRedirecting = true;
    const returnUrl = this.router.url;
    this.session.clearSession();
    this.toast('NEDSS.COMMON.SESSION_EXPIRED', 'warn');
    this.router
      .navigate(['/'], { queryParams: { returnUrl } })
      .finally(() => (this.isRedirecting = false));
  }

  private toast(key: string, kind: 'warn' | 'error'): void {
    this.translate.get(key).subscribe((msg: string) => {
      if (kind === 'error') {
        this.userMessage.error(msg);
      } else {
        this.userMessage.warn(msg);
      }
    });
  }
}
