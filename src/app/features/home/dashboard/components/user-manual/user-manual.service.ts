import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManualService {
  private controllerURL: string = environment.baseApiUrl + 'OptionsHelp/';

  constructor(private APIs: BaseAPIService) { }

  addNewManual(data): Observable<any> {
    return this.APIs.create(this.controllerURL + 'Save', data).pipe(map(() => undefined));
  }

  getAllMauals(): Observable<any> {
    return this.APIs.create(this.controllerURL + 'GetPage', {}).pipe(
      map((res: any) => res.data[0])
    );
  }

  delete(id): Observable<any> {
    return this.APIs.delete(`${this.controllerURL}Delete?id=${id}`);
  }

}
