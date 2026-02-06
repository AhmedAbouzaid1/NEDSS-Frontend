import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataCompletionServiceService {
  private PathApiUrl: string = environment.baseApiUrl + 'Patient/';
  constructor(private APIs: BaseAPIService) { }

  getPageGeneralDataCompletions(GeneralDataCompletionFilter: any) {
    return this.APIs.create(
      this.PathApiUrl + 'GetFollowUpPage',
      GeneralDataCompletionFilter
    );
  }

  getPageGeneralDataCompletions2(GeneralDataCompletionFilter: any) {
    return this.APIs.create(
      this.PathApiUrl + 'GetFollowUpPage2',
      GeneralDataCompletionFilter
    );
  }
}
