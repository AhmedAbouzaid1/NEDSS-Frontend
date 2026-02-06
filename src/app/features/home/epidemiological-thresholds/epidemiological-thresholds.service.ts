import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EpidemiologicalThresholdsService {
  ThresholdControllerURL: string = environment.baseApiUrl + 'Threshold/';

  constructor(private APIs: BaseAPIService) { }


  GetEpidemiologicalThresholds(epidmiologicalForm: any) {
    return this.APIs.create(
      this.ThresholdControllerURL + 'GetEpidemiologicalThresholds',
      epidmiologicalForm
    );
  }


  getPage(filter: any) {
    return this.APIs.create(
      this.ThresholdControllerURL + 'GetPage',
      filter
    );
  }
  delete(id: number) {
    return this.APIs.delete(this.ThresholdControllerURL + 'Delete?id=' + id);
  }
  getById(id: number) {
    return this.APIs.get(this.ThresholdControllerURL + 'GetById?id=' + id);
  }

  start(id: number) {
    return this.APIs.get(this.ThresholdControllerURL + 'Start?id=' + id);
  }
  update(data: any) {
    return this.APIs.update(
      this.ThresholdControllerURL + 'Update',
      data
    );
  }
  add(data?: any) {
    return this.APIs.post(this.ThresholdControllerURL + 'Add', data);
  }
}
