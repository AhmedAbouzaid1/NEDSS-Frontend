import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, filter, finalize, timeout } from 'rxjs/operators';
import { SessionService } from '../services/session.service';
import { UserMessageService } from '../services/user.message.service';
import { PartialLoadingService } from '../components/partial-loading/partial-loading.service';
import { BACKGROUND_REQUEST } from './background-request';

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
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => this.loading.reset());
  }

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

    let loaderGeneration = -1;
    if (drivesLoader) {
      loaderGeneration = this.loading.showloader();
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
          this.loading.hideLoader(loaderGeneration);
        }
      })
    );
  }

  private isBackgroundRequest(req: HttpRequest<any>): boolean {
    if (req.context.get(BACKGROUND_REQUEST)) {
      return true;
    }
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
        if (!this.onLoginPage) {
          this.toast('NEDSS.COMMON.NETWORK_ERROR', 'warn');
        }
        break;
      case error.status >= 500:
        this.surfaceBackendMessage(error, 'NEDSS.COMMON.INTERNAL_SERVER_ERROR');
        break;
      case this.isFutureDateRejection(error):
        this.surfaceBackendMessage(error, 'NEDSS.COMMON.FutureDateNotAllowed');
        break;
      case this.isInvestigationSave(error):
        this.surfaceBackendMessage(error, 'NEDSS.COMMON.SENT_FAILD');
        break;
      // Other 4xx (validation/forbidden/not-found) are surfaced by the calling
      // component, which knows the domain context — no generic toast here.
      default:
        break;
    }
  }

  private isFutureDateRejection(error: HttpErrorResponse): boolean {
    return error.status === 400 && this.extractBackendMessage(error) === 'FutureDateNotAllowed';
  }

  private isInvestigationSave(error: HttpErrorResponse): boolean {
    return !!error.url && error.url.includes('InvistigationForms/');
  }

  private surfaceBackendMessage(
    error: HttpErrorResponse,
    fallbackKey: string
  ): void {
    const backend = this.extractBackendMessage(error);
    if (!backend) {
      this.toast(fallbackKey, 'error');
      return;
    }
    console.error(`[API ${error.status}] ${error.url ?? ''} — ${backend}`);

    const isCode = /^[A-Za-z0-9_.]+$/.test(backend);
    const candidate = isCode ? `NEDSS.COMMON.${backend}` : backend;
    this.translate.get(candidate).subscribe((translated: string) => {
      if (translated && translated !== candidate) {
        this.userMessage.error(translated);
      } else if (isCode) {
        this.userMessage.error(backend);
      } else {
        this.toast(fallbackKey, 'error');
      }
    });
  }

  private extractBackendMessage(error: HttpErrorResponse): string | null {
    const body: any = error.error;
    if (!body) {
      return null;
    }
    if (typeof body === 'string') {
      const text = body.trim();
      return text || null;
    }
    const messages = body.messages ?? body.Messages;
    if (Array.isArray(messages) && messages.length) {
      const first = `${messages[0] ?? ''}`.trim();
      return first || null;
    }
    const single = body.message ?? body.Message;
    if (typeof single === 'string' && single.trim()) {
      return single.trim();
    }
    return null;
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
