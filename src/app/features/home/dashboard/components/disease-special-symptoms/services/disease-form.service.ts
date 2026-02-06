

import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiseaseFormService {
  private DiseaseFieldControllerURL: string =
  environment.baseApiUrl + 'DiseaseForm/';

constructor(private APIs: BaseAPIService) {}

///#region  DiseaseFieldLookup
getAllDiseaseField() {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'GetAll');
}
getPageDiseaseField(DiseaseFieldFilter: any) {
  return this.APIs.create(
    this.DiseaseFieldControllerURL + 'GetPage',
    DiseaseFieldFilter
  );
}

deleteDiseaseField(id: number) {
  return this.APIs.delete(this.DiseaseFieldControllerURL + 'Delete?id=' + id);
}
getById(id: number) {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'GetById?id=' + id);
}
getViewById(id: number) {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'GetViewById?id=' + id);
}
getSideBar() {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'getSideBar');
}

getByContainer(id: number) {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'getByContainer?id=' + id);
}
getDiseaseFieldByDiseaseId(patientFilter: any) {
   return this.APIs.create(this.DiseaseFieldControllerURL + "GetByDisease", patientFilter);

}
getByEvaluation(patientFilter: any) {
  return this.APIs.create(this.DiseaseFieldControllerURL + "getByEvaluation", patientFilter);

}
getForBuildFormByDiseaseId(ids: number[]) {
  return this.APIs.post(this.DiseaseFieldControllerURL + 'getForBuildFormByDiseaseId/' , ids);
}
update(model: any) {
  return this.APIs.update(
    this.DiseaseFieldControllerURL + 'Update',
    model
  );
}
addDiseaseField(DiseaseField: any) {
  return this.APIs.post(this.DiseaseFieldControllerURL + 'Add', DiseaseField);
}
updateDiseaseFiledAnswer(model: any) {
  return this.APIs.post(this.DiseaseFieldControllerURL + 'updateDiseaseFiledAnswer', model);
}
AddMianContainer(id: any) {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'addMianContainer?id=' + id);
}
AddSubContainer(id: any,containerId) {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'addSubContainer?id=' + id+'&&containerId='+containerId);
}
deleteContainer(id: any) {
  return this.APIs.delete(this.DiseaseFieldControllerURL + 'deleteContainer?id=' + id);
}
DeleteControl(id: any) {
  return this.APIs.delete(this.DiseaseFieldControllerURL + 'deleteControl?id=' + id);
}
addControlContainer(model: any) {
   return this.APIs.post(this.DiseaseFieldControllerURL + 'addControlContainer', model);

}
///#endregion
}
