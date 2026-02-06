import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiseaseSpecialSymptomsService {
  private DiseaseFieldControllerURL: string =
    environment.baseApiUrl + 'DiseaseFiled/';

  private DiseaseGroupQuestionControllerURL: string = environment.baseApiUrl + 'DiseaseGroupQuestion/'

  private PatientDiseaseGroupQuestionAnswerControllerURL: string = environment.baseApiUrl + 'PatientDiseaseGroupQuestionAnswer/';

  constructor(private APIs: BaseAPIService) { }

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
    return this.APIs.delete(this.DiseaseGroupQuestionControllerURL + 'Delete?id=' + id);
  }
  getDiseaseFieldById(id: number) {
    return this.APIs.get(this.DiseaseGroupQuestionControllerURL + 'GetById?id=' + id);
  }
  getDiseaseFieldByDiseaseId(patientFilter: any) {
    return this.APIs.create(this.DiseaseGroupQuestionControllerURL + "GetPage", patientFilter);

  }
  getForBuildFormByDiseaseId(payload) {
    return this.APIs.post(this.PatientDiseaseGroupQuestionAnswerControllerURL + 'GetByPatientIdAndDiseaseGroupIds/', payload);
  }
  updateDiseaseField(DiseaseField: any) {
    return this.APIs.update(
      this.DiseaseGroupQuestionControllerURL + 'Update',
      DiseaseField
    );
  }
  addDiseaseField(DiseaseField: any) {
    return this.APIs.post(this.DiseaseGroupQuestionControllerURL + 'Add', DiseaseField);
  }
  updateDiseaseFiledAnswer(model: any) {
    return this.APIs.post(this.DiseaseFieldControllerURL + 'updateDiseaseFiledAnswer', model);
  }

  ///#endregion
}
