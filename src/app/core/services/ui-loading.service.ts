import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class UiLoadingService {

  public isLoading:  boolean = false;

  constructor() { }

    load(name: string, isLoading: boolean) {
        this.isLoading = isLoading;
    }
}
