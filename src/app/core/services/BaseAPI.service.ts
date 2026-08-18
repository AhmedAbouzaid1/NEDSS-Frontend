import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError, share } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PendingRequestsService } from './pending-requests.service';
import { UserMessageService } from './user.message.service';
import { Router } from '@angular/router';
import { Subject } from '@microsoft/signalr';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class BaseAPIService {

  constructor(
    private pendingService: PendingRequestsService,
    private http: HttpClient,
    private userMessage: UserMessageService,
    private translateService: TranslateService,
    private router: Router,
    private session: SessionService
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
    const token = this.session.getToken();
    if (token) {
      headers = headers.set('Authorization', ` Bearer ${token}`);
    }
    return headers;
  }
  public gets() {
    //return "";
    //return this.http.get("http://validationapi.somee.com/validation/validate?key=novel")
  }

  public get(route: string, responseType?: any, observeResponse?: boolean) {
    if (!this.checkUserIsOnline()) {
      return throwError(() => new Error('OFFLINE'));
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
        })
      );
  }

  public update(route: string, body: any) {
    if (!this.checkUserIsOnline()) {
      return throwError(() => new Error('OFFLINE'));
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
        })
      );
  }

  public create(route: string, body: any, responseType?: any) {
    if (!this.checkUserIsOnline()) {
      return throwError(() => new Error('OFFLINE'));
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
          })
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
          })
        );
  }

  public delete(route: string) {
    if (!this.checkUserIsOnline()) {
      return throwError(() => new Error('OFFLINE'));
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
        })
      );
  }

  public deleteWithBody(route: string, body?: any) {
    if (!this.checkUserIsOnline()) {
        return throwError(() => new Error('OFFLINE'));
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
            })
        );
}

  errorHandler(_error: HttpErrorResponse): void {}

  public post(
    route: string,
    body: any,
    cancelDuplicatedRequest: boolean = true
  ) {
    if (!this.checkUserIsOnline()) {
      return throwError(() => new Error('OFFLINE'));
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
          })
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
      return throwError(() => new Error('OFFLINE'));
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
          })
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
        })
      );
  }

  private checkUserIsOnline() {
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
