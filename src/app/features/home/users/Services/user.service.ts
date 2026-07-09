import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { ChatFilter } from 'src/app/models/chat-filter';
import { environment } from 'src/environments/environment';
import { SystemUserDataDto } from '../../chat/Models/UserDto';
import { Result } from 'src/app/features/Result';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private iUrl: string = environment.baseApiUrl + 'Account/';
  private RoleUrl: string = environment.baseApiUrl + 'Role/';

  private DiseasesUrl: string = environment.baseApiUrl + 'DiseaseForm/';

  constructor(private APIs: BaseAPIService) {}

  getAllDiseaseField() {
    return this.APIs.get(this.DiseasesUrl + 'GetAll');
  }
  getAllUsers() {
    return this.APIs.get(this.iUrl + 'GetAll');
  }
  getPageUsers(UserFilter: any) {
    return this.APIs.create(this.iUrl + 'GetPage', UserFilter);
  }
  getFilteredUsers(
    chatFilter: ChatFilter
  ): Observable<Result<SystemUserDataDto[]>> {
    return this.APIs.create(this.iUrl + 'GetFilteredUsers', chatFilter);
  }
  deleteUser(id: number) {
    return this.APIs.delete(this.iUrl + 'Delete?id=' + id);
  }
  getUserById(id: number) {
    return this.APIs.get(this.iUrl + 'GetById?id=' + id);
  }
  updateUser(User: any) {
    return this.APIs.update(this.iUrl + 'Update', User);
  }
  resetUserPassword(systemUserId: number) {
    return this.APIs.post(
      this.iUrl + 'ResetUserPassword?systemUserId=' + systemUserId,
      {}
    );
  }
  addUser(User: any) {
    return this.APIs.post(this.iUrl + 'Register', User);
  }

  getPageRoles(RoleFilter: any) {
    return this.APIs.create(this.RoleUrl + 'GetPage', RoleFilter);
  }

  getAllRoles() {
    return this.APIs.get(this.RoleUrl + 'GetAll');
  }
}
