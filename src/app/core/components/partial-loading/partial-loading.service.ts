import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartialLoadingService {

  private activeRequests = 0;
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  showloader() {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.isLoadingSubject.next(true);
    }
  }

  hideLoader() {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0) {
      this.isLoadingSubject.next(false);
    }
  }

  reset() {
    this.activeRequests = 0;
    this.isLoadingSubject.next(false);
  }

  public get isCurrentlyLoading$() {
    return this.isLoadingSubject.asObservable();
  }

  public get isCurrentlyLoading(): boolean {
    return this.isLoadingSubject.value;
  }

}
