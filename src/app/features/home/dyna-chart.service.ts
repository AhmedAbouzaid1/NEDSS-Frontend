import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { DynaChartFilter } from 'src/app/models/dyna-chart-filter';
import { environment } from 'src/environments/environment';
import { Result } from '../Result';
import { DynaChart } from 'src/app/models/dyna-chart';

@Injectable({
  providedIn: 'root'
})
export class DynaChartService {

  private controllerURL: string = environment.baseApiUrl + 'DynamicChart/';
  constructor(private APIs: BaseAPIService) { }

  GetFilteredChart(filter: DynaChartFilter): Observable<Result<DynaChart[]>> {
    return this.APIs.create(this.controllerURL + "Filter", filter);
  }
}
