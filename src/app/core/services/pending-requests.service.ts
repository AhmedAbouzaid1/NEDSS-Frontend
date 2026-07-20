import { Injectable } from '@angular/core';
import { Observable, finalize, of, tap, shareReplay } from 'rxjs';
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
        if (pendingRequestObservable) {
            return pendingRequestObservable;
        }
        return this.sendRequest(requestId, request);
    }

    public sendRequest(requestId: any, request: any): Observable<any> {
        const shared = request.pipe(
            shareReplay(1),
            finalize(() => {
                this.partialLoadingService.hideLoader();
                this.pending.delete(requestId);
            })
        );
        this.pending.set(requestId, shared);
        return shared;
    }

}

