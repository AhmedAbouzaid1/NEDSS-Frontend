import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Patient } from '../models/patient';



@Injectable({
  providedIn: 'root'
})
export class SearchSharedDataService {

  constructor() { }

  private patientObject = new BehaviorSubject<Patient>({});



  getPatientObject() {
    return this.patientObject.asObservable();
  }

  setPatientObject(value: Patient) {
    this.patientObject.next(value);
  }
}
