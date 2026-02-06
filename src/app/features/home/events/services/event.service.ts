import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private controllerURL: string = environment.baseApiUrl + 'Event/';
  private eventPatientControllerURL: string =
    environment.baseApiUrl + 'EventPatient/';

  constructor(
    private APIs: BaseAPIService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  getAll(eventFilter: any) {
    return this.APIs.create(this.controllerURL + 'GetPage', eventFilter);
  }
  delete(id: number) {
    return this.APIs.delete(this.controllerURL + 'Delete?id=' + id);
  }
  deletepatient(id: number) {
    return this.APIs.delete(this.eventPatientControllerURL + 'Delete?id=' + id);
  }
  getBy(id: number) {
    return this.APIs.get(this.controllerURL + 'GetById?id=' + id);
  }
  update(patient: any) {
    return this.APIs.update(this.controllerURL + 'Update', patient);
  }
  add(event: any) {
    event.totalCount = 0;
    return this.APIs.post(this.controllerURL + 'Add', event);
  }

  getById(id) {
    return this.APIs.get(this.controllerURL + 'GetById?id=' + id);
  }
  addPAtientToEvent(patient: any) {
    return this.APIs.post(this.eventPatientControllerURL + 'Add', patient);
  }
  addAllPatientToEvent(patients: any[]) {
    return this.APIs.post(
      this.eventPatientControllerURL + 'AddRange',
      patients
    );
  }
  updateEventLevel(event: string) {
    return this.APIs.get(
      this.controllerURL + 'OnUpdateEventLevel?eventLevelEnum=' + event
    );
  }
}
