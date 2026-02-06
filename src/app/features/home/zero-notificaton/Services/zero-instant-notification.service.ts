import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZeroInstantNotificationService {

  private PathApiUrl: string = environment.baseApiUrl + 'DiseaseZeroInstantNotification/';
  constructor(private APIs: BaseAPIService) { }

  getPageNotificationsDashboard(zeroInstantNotificationFilter: any) {
    return this.APIs.create(
      this.PathApiUrl + 'GetPageDashboard',
      zeroInstantNotificationFilter
    );
  }

  getPageNotifications(zeroInstantNotificationFilter: any) {
    return this.APIs.create(
      this.PathApiUrl + 'GetPage',
      zeroInstantNotificationFilter
    );
  }

  getZeroNotification(filter: any) {
    return this.APIs.create(
      this.PathApiUrl + 'getZeroNotification',
      filter
    );
  }

  deleteNotification(id: number) {
    return this.APIs.delete(
      this.PathApiUrl + 'Delete?id=' + id
    );
  }
  getNotificationById(id: number) {
    return this.APIs.get(
      this.PathApiUrl + 'GetById?id=' + id
    );
  }
  updateZeroInstantNotification(ZeroInstantNotification: any) {
    return this.APIs.update(
      this.PathApiUrl + 'UpdateZeroNotification',
      ZeroInstantNotification
    );
  }

  addZeroInstantNotification(ZeroInstantNotification: any) {
    return this.APIs.post(
      this.PathApiUrl + 'AddZeroNotification',
      ZeroInstantNotification
    );
  }


  updateImmediateInstantNotification(ZeroInstantNotification: any) {
    return this.APIs.update(
      this.PathApiUrl + 'Update',
      ZeroInstantNotification
    );
  }
  addImmediateInstantNotification(ZeroInstantNotification: any) {
    return this.APIs.post(
      this.PathApiUrl + 'Add',
      ZeroInstantNotification
    );
  }
}
