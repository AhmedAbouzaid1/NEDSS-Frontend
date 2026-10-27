import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';
import {
  GeneralReportingDiseaseGroup,
  GeneralReportingReportData,
  GeneralReportingReportFilter,
} from './general-reporting-report.model';

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  messages: string[];
}

@Injectable({ providedIn: 'root' })
export class GeneralReportingReportService {
  private readonly baseUrl = environment.baseApiUrl + 'Reports/';

  constructor(private api: BaseAPIService) {}

  getDiseaseGroups(): Observable<ApiResponse<GeneralReportingDiseaseGroup[]>> {
    return this.api.get(this.baseUrl + 'GetGeneralReportingReportDiseaseGroups') as Observable<any>;
  }

  getReport(filter: GeneralReportingReportFilter): Observable<ApiResponse<GeneralReportingReportData>> {
    return this.api.post(this.baseUrl + 'GetGeneralReportingReport', filter, false) as Observable<any>;
  }

  getExportData(filter: GeneralReportingReportFilter): Observable<ApiResponse<GeneralReportingReportData>> {
    return this.api.post(this.baseUrl + 'GetGeneralReportingReportExportData', filter, false) as Observable<any>;
  }
}
