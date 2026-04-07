import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartialLoadingService {

  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  showloader() {
    this.isLoadingSubject.next(true);
  }
  hideLoader() {
    this.isLoadingSubject.next(false);
  }

  public get isCurrentlyLoading$() {
    return this.isLoadingSubject.asObservable();
  }

  public get isCurrentlyLoading(): boolean {
    return this.isLoadingSubject.value;
  }

}
