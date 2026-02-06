import { Injectable } from '@angular/core';
import { ActiveUserEnabledData } from '../models/active-user-enabled-data.model';

@Injectable({
  providedIn: 'root'
})
export class ActiveUserService {


  private accessibleParts: ActiveUserEnabledData = new ActiveUserEnabledData();

  constructor() { }

  //should be called for every guarded route
  public setAccessibleParts() {
    this.accessibleParts = JSON.parse(localStorage.getItem("ls.authorizationData"))?.accessibleParts;
  }


  public get getAccessibleParts(): ActiveUserEnabledData {
    return this.accessibleParts
  }

}
