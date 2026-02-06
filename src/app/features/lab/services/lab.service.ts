import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LabService {
  private controllerURL: string = environment.baseApiUrl + 'Patient/';
  private PatientLabCheckControllerURL: string =
    environment.baseApiUrl + 'PatientLabCheck/';

  constructor(private APIs: BaseAPIService) {}

  addLabPatient(patient: any): Observable<any> {
    return this.APIs.post(
      this.controllerURL + 'AddPatientWithLabChecks',
      patient
    );
  }
  getAll(patientFilter: any) {
    return this.APIs.create(this.controllerURL + 'GetPage', patientFilter);
  }

  getPatientsDashboard(patientFilter: any) {
    return this.APIs.create(
      this.controllerURL + 'GetLabPatientsPageDashboard',
      patientFilter
    );
  }
  getPatients(patientFilter: any) {
    return this.APIs.create(
      this.controllerURL + 'GetLabPatientsPage',
      patientFilter
    );
  }
  getPatientsFromLab(patientFilter: any) {
    return this.APIs.create(
      this.controllerURL + 'GetPatientsAddedFromLab',
      patientFilter
    );
  }
  getBy(id: number) {
    return this.APIs.get(this.controllerURL + 'GetPatientForLabById?id=' + id);
  }
  addLabChecks(patient: any) {
    return this.APIs.post(this.controllerURL + 'Add', patient);
  }

  ///#region
  getPagePatientLabChecks(PatientLabCheckFilter: any) {
    return this.APIs.create(
      this.PatientLabCheckControllerURL + 'GetPage',
      PatientLabCheckFilter
    );
  }
  deletePatientLabCheck(id: number) {
    return this.APIs.delete(
      this.PatientLabCheckControllerURL + 'Delete?id=' + id
    );
  }
  getPatientLabCheckById(id: number) {
    return this.APIs.get(
      this.PatientLabCheckControllerURL + 'GetById?id=' + id
    );
  }
  updatePatientLabCheck(PatientLabCheck: any) {
    return this.APIs.update(
      this.PatientLabCheckControllerURL + 'Update',
      PatientLabCheck
    );
  }
  addPatientLabCheck(PatientLabCheck: any) {
    return this.APIs.post(
      this.PatientLabCheckControllerURL + 'Add',
      PatientLabCheck
    );
  }
  ///#endregion
}
