import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreparationsService {

  private PreparationsUrl: string = environment.baseApiUrl + 'MonitorUnit/';
  private PreparationsDataUrl: string = environment.baseApiUrl + 'MonitorUnit/';
  private PreparationsTeamUrl: string = environment.baseApiUrl + 'MonitorUnitTeamMember/';
  private PreparationsDeviceUrl: string = environment.baseApiUrl + 'MonitorUnitPreparation/';


  constructor(private APIs: BaseAPIService) { }

  ///#region  Preparations
  getAllPreparations() {
    return this.APIs.get(this.PreparationsUrl + 'GetAll');
  }
  getPagePreparations(PreparationsFilter: any) {
    return this.APIs.create(
      this.PreparationsUrl + 'GetPage',
      PreparationsFilter
    );
  }
  deletePreparation(id: number) {
    return this.APIs.delete(
      this.PreparationsUrl + 'Delete?id=' + id
    );
  }
  getPreparationById(id: number) {
    return this.APIs.get(
      this.PreparationsUrl + 'GetById?id=' + id
    );
  }
  updatePreparation(Preparation: any) {
    return this.APIs.update(
      this.PreparationsUrl + 'Update',
      Preparation
    );
  }
  addPreparation(Preparation: any) {
    return this.APIs.post(
      this.PreparationsUrl + 'Add',
      Preparation
    );
  }
  ///#endregion

  ///#region  Preparations Data add
  getPreparatioDataById(id: number) {
    return this.APIs.get(
      this.PreparationsDataUrl + 'GetById?id=' + id
    );
  }
  updatePreparationData(PreparationData: any) {
    return this.APIs.update(
      this.PreparationsDataUrl + 'Update',
      PreparationData
    );
  }
  addPreparationData(PreparationData: any) {
    return this.APIs.post(
      this.PreparationsDataUrl + 'Add',
      PreparationData
    );
  }
  ///#endregion 01096914573


  ///#region  PreparationsTeam
  getAllPreparationsTeam() {
    return this.APIs.get(this.PreparationsTeamUrl + 'GetAll');
  }
  getPagePreparationsTeam(PreparationsTeamFilter: any) {
    return this.APIs.create(
      this.PreparationsTeamUrl + 'GetPage',
      PreparationsTeamFilter
    );
  }
  deletePreparationTeam(id: number) {
    return this.APIs.delete(
      this.PreparationsTeamUrl + 'Delete?id=' + id
    );
  }
  getPreparationTeamById(id: number) {
    return this.APIs.get(
      this.PreparationsTeamUrl + 'GetById?id=' + id
    );
  }
  updatePreparationTeam(PreparationTeam: any) {
    return this.APIs.update(
      this.PreparationsTeamUrl + 'Update',
      PreparationTeam
    );
  }
  addPreparationTeam(PreparationTeam: any) {
    return this.APIs.post(
      this.PreparationsTeamUrl + 'Add',
      PreparationTeam
    );
  }
  ///#endregion

  ///#region  Preparations Device
  getAllPreparationsDevice() {
    return this.APIs.get(this.PreparationsDeviceUrl + 'GetAll');
  }
  getPagePreparationsDevice(PreparationsDeviceFilter: any) {
    return this.APIs.create(
      this.PreparationsDeviceUrl + 'GetPage',
      PreparationsDeviceFilter
    );
  }
  deletePreparationDevice(id: number) {
    return this.APIs.delete(
      this.PreparationsDeviceUrl + 'Delete?id=' + id
    );
  }
  getPreparationDeviceById(id: number) {
    return this.APIs.get(
      this.PreparationsDeviceUrl + 'GetById?id=' + id
    );
  }
  updatePreparationDevice(PreparationDevice: any) {
    return this.APIs.update(
      this.PreparationsDeviceUrl + 'Update',
      PreparationDevice
    );
  }
  addPreparationDevice(PreparationDevice: any) {
    return this.APIs.post(
      this.PreparationsDeviceUrl + 'Add',
      PreparationDevice
    );
  }
  ///#endregion
}
