import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';
import {
  InvestigationFormsDiseaseGroup,
  InvestigationFormsReportData,
  InvestigationFormsReportFilter,
} from './investigation-form-field.model';

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  messages: string[];
}

@Injectable({ providedIn: 'root' })
export class InvestigationFormsReportService {
  private readonly baseUrl = environment.baseApiUrl + 'Reports/';

  constructor(private api: BaseAPIService) {}

  getDiseaseGroups(): Observable<ApiResponse<InvestigationFormsDiseaseGroup[]>> {
    return this.api.get(this.baseUrl + 'GetInvestigationFormsReportDiseaseGroups') as Observable<any>;
  }

  getReport(filter: InvestigationFormsReportFilter): Observable<ApiResponse<InvestigationFormsReportData>> {
    return this.api.post(this.baseUrl + 'GetInvestigationFormsReport', filter, false) as Observable<any>;
  }

  getExportData(filter: InvestigationFormsReportFilter): Observable<ApiResponse<InvestigationFormsReportData>> {
    return this.api.post(this.baseUrl + 'GetInvestigationFormsReportExportData', filter, false) as Observable<any>;
  }
}
