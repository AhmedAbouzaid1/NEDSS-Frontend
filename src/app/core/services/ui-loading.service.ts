import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class UiLoadingService {

  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  public get isLoading$() {
    return this.isLoadingSubject.asObservable();
  }

  public get isLoading(): boolean {
    return this.isLoadingSubject.value;
  }

  public set isLoading(value: boolean) {
    this.isLoadingSubject.next(value);
  }

  load(name: string, isLoading: boolean) {
    this.isLoading = isLoading;
  }
}
