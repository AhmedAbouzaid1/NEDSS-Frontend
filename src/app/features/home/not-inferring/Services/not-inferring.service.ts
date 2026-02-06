import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotInferringService {
  private PathApiUrl: string = environment.baseApiUrl + 'Patient/';
  constructor(private APIs: BaseAPIService) {}
  getPageNotInferringsDashboard(GNotInferringFilter: any) {
    return this.APIs.create(
      this.PathApiUrl + 'GetNotInferringPageDashboard',
      GNotInferringFilter
    );
  }
  getPageNotInferrings(GNotInferringFilter: any) {
    return this.APIs.create(
      this.PathApiUrl + 'GetNotInferringPage',
      GNotInferringFilter
    );
  }

  updatePageNotInferrings(GNotInferringFilter: any) {
    return this.APIs.update(
      this.PathApiUrl +
        'UpdatePatientStatusToMisInvestigated?patientId=' +
        GNotInferringFilter,
      GNotInferringFilter
    );
  }
}
