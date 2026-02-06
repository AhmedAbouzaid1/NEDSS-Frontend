import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientModel } from '../general-data/models/patient-model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
patientFilter:any;
patients:PatientModel[];
AllPatientSubsribe : Subscription
constructor() {


}
  ngOnInit(): void {
    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
  }
}
