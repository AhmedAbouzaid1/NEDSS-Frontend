import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';
import { SchoolsReportData, SchoolsReportDiseaseGroup, SchoolsReportFilter } from './schools-report.model';

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  messages: string[];
}

@Injectable({ providedIn: 'root' })
export class SchoolsReportService {
  private readonly baseUrl = environment.baseApiUrl + 'Reports/';

  constructor(private api: BaseAPIService) {}

  getDiseaseGroups(): Observable<ApiResponse<SchoolsReportDiseaseGroup[]>> {
    return this.api.get(this.baseUrl + 'GetSchoolsReportDiseaseGroups') as Observable<any>;
  }

  getReport(filter: SchoolsReportFilter): Observable<ApiResponse<SchoolsReportData>> {
    return this.api.post(this.baseUrl + 'GetSchoolsReport', filter, false) as Observable<any>;
  }

  getExportData(filter: SchoolsReportFilter): Observable<ApiResponse<SchoolsReportData>> {
    return this.api.post(this.baseUrl + 'GetSchoolsReportExportData', filter, false) as Observable<any>;
  }
}
