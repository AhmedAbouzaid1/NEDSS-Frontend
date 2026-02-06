import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientDiseseAnswerService {
  private DiseaseFieldControllerURL: string =
  environment.baseApiUrl + 'PatientDiseaseQuestionAnswer/';

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


GetByPateintId(id: any) {
   return this.APIs.get(this.DiseaseFieldControllerURL + 'GetByPateintId?id=' + id);


}

deleteDiseaseField(id: number) {
  return this.APIs.delete(this.DiseaseFieldControllerURL + 'Delete?id=' + id);
}
getDiseaseFieldById(id: number) {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'GetById?id=' + id);
}
getDiseaseFieldByDiseaseId(patientFilter: any) {
   return this.APIs.create(this.DiseaseFieldControllerURL + "GetByDisease", patientFilter);

}
getForBuildFormByDiseaseId(ids: number[]) {
  return this.APIs.post(this.DiseaseFieldControllerURL + 'getForBuildFormByDiseaseId/' , ids);
}
updateDiseaseField(DiseaseField: any) {
  return this.APIs.update(
    this.DiseaseFieldControllerURL + 'Update',
    DiseaseField
  );
}
addDiseaseField(DiseaseField: any) {
  return this.APIs.post(this.DiseaseFieldControllerURL + 'Add', DiseaseField);
}
updateDiseaseFiledAnswer(model: any) {
  return this.APIs.post(this.DiseaseFieldControllerURL + 'updateDiseaseFiledAnswer', model);
}
///#endregion
}
