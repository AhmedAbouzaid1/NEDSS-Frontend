

import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {
  private DiseaseFieldControllerURL: string =
  environment.baseApiUrl + 'DiseaseFormContainerControl/';

constructor(private APIs: BaseAPIService) {}

///#region  DiseaseFieldLookup
getAllDiseaseField() {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'GetAll');
}
getPage (DiseaseFieldFilter: any) {
  return this.APIs.create(
    this.DiseaseFieldControllerURL + 'GetPage',
    DiseaseFieldFilter
  );
}

deleteByld(id: number) {
  return this.APIs.delete(this.DiseaseFieldControllerURL + 'Delete?id=' + id);
}
getById(id: number) {
  return this.APIs.get(this.DiseaseFieldControllerURL + 'GetById?id=' + id);
}


add(DiseaseField: any) {
  return this.APIs.post(this.DiseaseFieldControllerURL + 'Add', DiseaseField);
}
get(patientFilter: any) {
   return this.APIs.create(this.DiseaseFieldControllerURL + "GetByDisease", patientFilter);

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


///#endregion
}
