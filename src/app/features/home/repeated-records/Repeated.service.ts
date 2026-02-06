import { Injectable } from '@angular/core';

import { Observable, map, pipe } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RepeatedService {

  confilctsToSolve: any[] = [];
  objTORoute;
  passedObj;
  constructor(private APIs: BaseAPIService) { }
  private controllerURL: string = environment.baseApiUrl + 'Patient/';

  getRepeated(data: any) {
    return this.APIs.create(this.controllerURL + 'GetPatientRepetedData', data);
  }

  getById(obj: any) {

    return this.APIs.create(this.controllerURL + 'GetSplitPatientRepetedData', obj);
  }

  getPatientAddedFromLabById(id:number) {
    return this.APIs.get(this.controllerURL + 'GetPatientAddedFromLabbyId?id='+id);
  }

  add(updateObj) {
    return this.APIs.post(this.controllerURL + "Add", updateObj);
  }

  update(updateObj) {
    return this.APIs.update(this.controllerURL + 'Update', updateObj);
  }


  delete(ArrToDelete) {

    return this.APIs.delete(this.controllerURL + 'DeleteByIds?ids=' + ArrToDelete);
  }


  deletePatientLab(id:number) {
    return this.APIs.delete(this.controllerURL + 'Delete?id=' + id);
  }

  editLabPatient(patient:any){
    return this.APIs.post(this.controllerURL + 'EditPatientAddedFromLab',patient);
  }

  getSplitPatientsRepeatedData(repeatedPatientsIds:number[]){
    const requestData = {
      repeatedPatientsIds: repeatedPatientsIds
    };
  
    return this.APIs.post(this.controllerURL + 'GetSplitPatientsRepeatedData', requestData);
  }


  deletePatientsByIds(ids:number[]){
    return this.APIs.deleteWithBody(this.controllerURL + `DeletePatientsByIds`,ids)
  }

  mergePatientsData(patient:any){
    return this.APIs.post(this.controllerURL + 'MergePatientsData',patient);
  }



}
