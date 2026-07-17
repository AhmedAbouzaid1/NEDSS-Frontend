import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError, share, takeWhile } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PendingRequestsService } from './pending-requests.service';
import { UserMessageService } from './user.message.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class BaseAPIService {
  private isRedirecting = false;

  constructor(
    private pendingService: PendingRequestsService,
    private http: HttpClient,
    private userMessage: UserMessageService,
    private translateService: TranslateService,
    private router: Router
  ) {}
  createCompleteRoute(route: string): string {
    // return `${window.location.origin}${"/"}${route}`
    return `${route}`;
  }
  setHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    if (
      localStorage.getItem('ls.currentLang') != null &&
      localStorage.getItem('ls.currentLang') != 'undefined'
    ) {
      var lang = localStorage.getItem('ls.currentLang');
      headers = headers.set('Accept-Language', lang);
    }
    // console.log(authData);
    if (
      localStorage.getItem('ls.authorizationData') != null &&
      localStorage.getItem('ls.authorizationData') != 'undefined'
    ) {
      var authData = JSON.parse(localStorage.getItem('ls.authorizationData'));
      headers = headers.set('Authorization', ` Bearer ${authData.token}`);
    }
    return headers;
  }
  public gets() {
    //return "";
    //return this.http.get("http://validationapi.somee.com/validation/validate?key=novel")
  }

  public get(route: string, responseType?: any, observeResponse?: boolean) {
    if (!this.checkUserIsOnline()) {
      return new Observable<any>();
    }
    let options = responseType
      ? { headers: this.setHeader(), responseType: responseType }
      : { headers: this.setHeader() };
    // if (observeResponse)
    //     options['observe'] = 'response';
    return this.pendingService
      .intercept(
        this.createCompleteRoute(route),
        undefined,
        this.http.get(this.createCompleteRoute(route), options)
      )
      .pipe(
        catchError((e: any) => {
          this.errorHandler(e);
          return throwError(e);
        }),
        takeWhile(
          (value) => value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
        )
      );
  }

  public update(route: string, body: any) {
    if (!this.checkUserIsOnline()) {
      return new Observable<any>();
    }
    return this.pendingService
      .intercept(
        this.createCompleteRoute(route),
        body,
        this.http.put(this.createCompleteRoute(route), body, {
          headers: this.setHeader(),
        })
      )
      .pipe(
        catchError((e: any) => {
          this.errorHandler(e);
          return throwError(e);
        }),
        takeWhile(
          (value) => value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
        )
      );
  }

  public create(route: string, body: any, responseType?: any) {
    if (!this.checkUserIsOnline()) {
      return new Observable<any>();
    }
    let headers = this.setHeader();
    if (responseType == undefined)
      return this.pendingService
        .intercept(
          this.createCompleteRoute(route),
          body,
          this.http.post(this.createCompleteRoute(route), body, {
            headers: this.setHeader(),
          })
        )
        .pipe(
          share(),
          catchError((e: any) => {
            this.errorHandler(e);
            return throwError(e);
          }),
          takeWhile(
            (value) =>
              value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
          )
        );
    else
      return this.pendingService
        .intercept(
          this.createCompleteRoute(route),
          body,
          this.http.post(this.createCompleteRoute(route), body, {
            headers: this.setHeader(),
            responseType: responseType,
          })
        )
        .pipe(
          share(),
          catchError((e: any) => {
            this.errorHandler(e);
            return throwError(e);
          }),
          takeWhile(
            (value) =>
              value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
          )
        );
  }

  public delete(route: string) {
    if (!this.checkUserIsOnline()) {
      return new Observable<any>();
    }
    let headers = this.setHeader();
    return this.pendingService
      .intercept(
        this.createCompleteRoute(route),
        undefined,
        this.http.delete(this.createCompleteRoute(route), { headers: headers })
      )
      .pipe(
        catchError((e: any) => {
          this.errorHandler(e);
          return throwError(e);
        }),
        takeWhile(
          (value) => value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
        )
      );
  }

  public deleteWithBody(route: string, body?: any) {
    if (!this.checkUserIsOnline()) {
        return new Observable<any>();
    }
    
    let headers = this.setHeader();
    
    // Use http.request to allow sending a body with DELETE
    return this.pendingService
        .intercept(
            this.createCompleteRoute(route),
            undefined,
            this.http.request('delete', this.createCompleteRoute(route), {
                headers: headers,
                body: body  // Include the body if provided
            })
        )
        .pipe(
            catchError((e: any) => {
                this.errorHandler(e);
                return throwError(e);
            }),
            takeWhile(
                (value) => value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
            )
        );
}
  // public deleteMultible(route: string, body: any,) {
  //   let headers = this.setHeader();
  //   return this.pendingService
  //     .intercept(
  //       this.createCompleteRoute(route),
  //       body,
  //       this.http.delete(this.createCompleteRoute(route), body)
  //     )
  //     .pipe(
  //       catchError((e: any) => {
  //         this.errorHandler(e);
  //         return throwError(e);
  //       }),
  //       takeWhile(
  //         (value) => value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
  //       )
  //     );
  // }

  errorHandler(error: HttpErrorResponse): void {
    if (this.isRedirecting) return;

    const onLoginPage = this.router.url === '/' || this.router.url === '';

    if (error.status === 401) {
      if (onLoginPage) return;
      this.isRedirecting = true;
      localStorage.removeItem('ls.authorizationData');
      this.translateService.get('NEDSS.COMMON.SESSION_EXPIRED').subscribe((msg) => {
        this.userMessage.warn(msg);
      });
      this.router.navigateByUrl('/').then(() => this.isRedirecting = false);
    }
    if (error.status === 0) {
      if (onLoginPage) return;
      this.isRedirecting = true;
      this.router.navigateByUrl('/').then(() => this.isRedirecting = false);
    }
  }

  public post(
    route: string,
    body: any,
    cancelDuplicatedRequest: boolean = true
  ) {
    if (!this.checkUserIsOnline()) {
      return new Observable<any>();
    }

    let headers = this.setHeader();
    // var authData = JSON.parse(localStorage.getItem('ls.authorizationData'));
    // if (authData != null)
    //     headers = headers.set('Authorization', ` Bearer ${authData.token}`);
    if (cancelDuplicatedRequest)
      return this.pendingService
        .intercept(
          this.createCompleteRoute(route),
          body,
          this.http.post(this.createCompleteRoute(route), body, {
            headers: headers,
          })
        )
        .pipe(
          catchError((e: any, obj: any) => {
            //alert("da elle bbaseh");
            //alert(JSON.stringify(obj));
            this.errorHandler(e);
            return throwError(e);
          }),
          takeWhile(
            (value) =>
              value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
          )
        );
    else
      return this.http
        .post(this.createCompleteRoute(route), body, { headers: headers })
        .pipe(
          catchError((e: any, obj: any) => {
            //alert("da elle bbaseh");
            //alert(JSON.stringify(obj));
            this.errorHandler(e);
            return throwError(e);
          })
        );
  }

  public postWithBlob(
    route: string,
    body: any,
    cancelDuplicatedRequest: boolean = true,
    options: any = {} // Add options parameter for additional configurations
  ) {
    if (!this.checkUserIsOnline()) {
      return new Observable<any>();
    }
  
    let headers = this.setHeader();
    
    const requestOptions = { ...options, headers }; // Merge headers with the passed options
  
    if (cancelDuplicatedRequest)
      return this.pendingService
        .intercept(
          this.createCompleteRoute(route),
          body,
          this.http.post(this.createCompleteRoute(route), body, requestOptions)
        )
        .pipe(
          catchError((e: any, obj: any) => {
            this.errorHandler(e);
            return throwError(e);
          }),
          takeWhile(
            (value) =>
              value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
          )
        );
    else
      return this.http
        .post(this.createCompleteRoute(route), body, requestOptions)
        .pipe(
          catchError((e: any, obj: any) => {
            this.errorHandler(e);
            return throwError(e);
          })
        );
  }

  public getBlob(route: string) {
    return this.pendingService
      .intercept(
        this.createCompleteRoute(route),
        undefined,
        this.http.get(this.createCompleteRoute(route), {
          headers: this.setHeader(),
          responseType: 'blob',
        })
      )
      .pipe(
        catchError((e: any) => {
          this.errorHandler(e);
          return throwError(e);
        }),
        takeWhile(
          (value) => value?.status != environment.DUPLICATED_REQUEST_STATUS_CODE
        )
      );
  }

  private checkUserIsOnline() {
    if (!navigator.onLine) {
      this.router.navigateByUrl('network-error');
      return false;
    }
    return true;
  }

  // constructor(private http:HttpClient) { }

  //  public post(url:string , body:{}):Observable<any>{
  //     return this.http.post(url,body ).pipe(catchError(this.handleError))
  //   }
  //   public get(url:string , header:{}):Observable<any>{
  //   return this.http.get(url , header).pipe(catchError(this.handleError))
  //  }
  //  public put(url:string , body:{}, header:{} ,):Observable<any>{
  //   return this.http.put(url , body,header).pipe(catchError(this.handleError))
  //  }
  //  public delete(url:string , header:{}):Observable<any>{
  //    return this.http.delete(url , header).pipe(catchError(this.handleError))
  //  }

  //   handleError(error:HttpErrorResponse){
  //     let errorMessage = ''
  //     if(error.error instanceof ErrorEvent){
  //      errorMessage = error.error.message
  //     }else{
  //      errorMessage = `Error Code : ${error.status}\n Message:${error.message}`
  //     }
  //     return throwError(errorMessage)
  //  }
}
