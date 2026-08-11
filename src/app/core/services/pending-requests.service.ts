import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingRequestsService {

  constructor() { }

  public intercept(_url: string, _body: any, request: Observable<any>): Observable<any> {
    return request;
  }

}
