import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';
import { ReportedCasesReportData, ReportedCasesReportDiseaseGroup, ReportedCasesReportFilter } from './reported-cases-report.model';

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  messages: string[];
}

@Injectable({ providedIn: 'root' })
export class ReportedCasesReportService {
  private readonly baseUrl = environment.baseApiUrl + 'Reports/';

  constructor(private api: BaseAPIService) {}

  getDiseaseGroups(): Observable<ApiResponse<ReportedCasesReportDiseaseGroup[]>> {
    return this.api.get(this.baseUrl + 'GetReportedCasesReportDiseaseGroups') as Observable<any>;
  }

  getReport(filter: ReportedCasesReportFilter): Observable<ApiResponse<ReportedCasesReportData>> {
    return this.api.post(this.baseUrl + 'GetReportedCasesReport', filter, false) as Observable<any>;
  }
}
