import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnouncmentServiceService {
  private controllerURL: string = environment.baseApiUrl + 'Announcement/';

  constructor(private APIs: BaseAPIService) { }

  addNewAnnouncment(data): Observable<any> {
    return this.APIs.create(this.controllerURL + 'Add', data).pipe(map(() => undefined));
  }

  updateAnnouncment(data): Observable<any> {
    return this.APIs.update(this.controllerURL + 'Update', data).pipe(map(() => undefined));
  }

  getAllAnnouncment(data): Observable<any> {
    return this.APIs.create(this.controllerURL + 'GetPage', data).pipe(
      map((res: any) => res.data)
    );
  }

  delete(id): Observable<any> {
    return this.APIs.delete(`${this.controllerURL}Delete?id=${id}`);
  }
}
