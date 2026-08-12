import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartialLoadingService {

  private activeRequests = 0;
  private generation = 0;
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  showloader(): number {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.isLoadingSubject.next(true);
    }
    return this.generation;
  }

  hideLoader(generation: number = this.generation) {
    if (generation !== this.generation) {
      return;
    }
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0) {
      this.isLoadingSubject.next(false);
    }
  }

  reset() {
    this.generation++;
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
