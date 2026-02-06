import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {


  unitId = new BehaviorSubject<number>(0);
  constructor() { }

  getUnitId() {
    return this.unitId.asObservable();
  }
  setUnitId(value: number) {
    this.unitId.next(value);
  }
}
