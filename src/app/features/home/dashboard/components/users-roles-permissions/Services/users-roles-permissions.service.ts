import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersRolesPermissionsService {
  private URL: string = environment.baseApiUrl + 'Role/';

  constructor(private APIs: BaseAPIService) {}

  GetAllSystemPages(roleId: null, roleView) {
    return this.APIs.get(
      this.URL +
        'GetAllSystemPages?roleId=' +
        roleId +
        '&IsInRoleView=' +
        roleView
    );
  }
  GetAllSystemPagesByRole(roleId: null) {
    return this.APIs.get(this.URL + 'GetAllSystemPages?roleId=' + roleId);
  }

  getAlRolelDiseases(roleId?: null) {
    return this.APIs.get(this.URL + 'GetAllRoleDiseases?roleId=' + roleId);
  }
  getAllRoleDiseaseField(roleId?: null) {
    return this.APIs.get(this.URL + 'GetAllRoleDiseaseField?roleId=' + roleId);
  }
  getAllSelectedRoleDiseases(roleId?: null) {
    return this.APIs.get(
      this.URL + 'GetAllSelectedRoleDiseases?roleId=' + roleId
    );
  }

  getPageUsersRolesPermissions(UsersRolesPermissionFilter: any) {
    return this.APIs.create(this.URL + 'GetPage', UsersRolesPermissionFilter);
  }

  GetAllUserRoleDiseases(roleId: null) {
    return this.APIs.get(this.URL + 'GetAllUserRoleDiseases?roleId=' + roleId);
  }
  GetAllUserRoleSelectedDiseases(roleId: null) {
    return this.APIs.get(
      this.URL + 'GetAllUserRoleSelectedDiseases?roleId=' + roleId
    );
  }
  GetAllUserSystemPages(roleId: null) {
    return this.APIs.get(this.URL + 'GetAllUserSystemPages?roleId=' + roleId);
  }

  deleteUsersRolesPermission(id: number) {
    return this.APIs.delete(this.URL + 'Delete?id=' + id);
  }
  getUsersRolesPermissionById(id: number) {
    return this.APIs.get(this.URL + 'GetById?id=' + id);
  }
  updateUsersRolesPermission(UsersRolesPermission: any) {
    return this.APIs.update(this.URL + 'Update', UsersRolesPermission);
  }
  addUsersRolesPermission(UsersRolesPermission: any) {
    return this.APIs.post(this.URL + 'Add', UsersRolesPermission);
  }
}
