import { Injectable } from '@angular/core';
import { Observable, finalize, of, tap } from 'rxjs';
// import { tap } from 'rxjs/internal/operators';
import { environment } from '../../../environments/environment';
import { PartialLoadingService } from '../components/partial-loading/partial-loading.service';

@Injectable({
    providedIn: 'root'
})
export class PendingRequestsService {

    constructor(
        private partialLoadingService: PartialLoadingService
    ) {

    }

    private pending = new Map<string, Observable<any>>();

    public intercept(url: string, body: any, request: Observable<any>): Observable<any> {
        this.partialLoadingService.showloader();
        let requestId = url;
        if (body) {
            requestId += JSON.stringify(body);
        }

        const pendingRequestObservable = this.pending.get(requestId);
        var response = {
            data: '', headers: {}, status: environment.DUPLICATED_REQUEST_STATUS_CODE
        };
        if (pendingRequestObservable) {
            console.info('Such request is already in progres, rejecting this one with: ', response);
            return of(response);
        }
        else
            return this.sendRequest(requestId, request);
    }

    public sendRequest(requestId: any, request: any): Observable<any> {
        this.pending.set(requestId, request);
        return request.pipe(
            finalize(() => this.partialLoadingService.hideLoader()),
            tap(() => {
                this.pending.delete(requestId);
            }, () => {
                this.pending.delete(requestId);
            })
        );
    }

}

