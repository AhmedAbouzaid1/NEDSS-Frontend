import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PartialLoadingService {

  private isLoading: boolean;

  constructor() { }

  showloader() {
    this.isLoading = true;
  }
  hideLoader() {
    this.isLoading = false;
  }

  public get isCurrentlyLoading(): boolean {
    return this.isLoading;
  }

}
