import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private controllerURL: string = environment.baseApiUrl + 'Account/';

  constructor(private APIs: BaseAPIService) {}

  getProfileData(userId: any): Observable<any> {
    return this.APIs.get(
      this.controllerURL + 'EditProfile?systemUserId=' + userId
    );
  }
  updateProfileData(profileData: any): Observable<any> {
    return this.APIs.post(this.controllerURL + 'EditProfile', profileData);
  }
}
