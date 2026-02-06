import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';

@Injectable({
  providedIn: 'root'
})
export class SearchPopulationService {

  private PopulationControllerURL: string =
    environment.baseApiUrl + 'Population/';
  constructor(private http: HttpClient, private APIs: BaseAPIService) { }

  getPagePatients(population: any) {
    let userOrganization = JSON.parse(localStorage.getItem('ls.authorizationData')).user.organizationId;
    return this.APIs.create(
      this.PopulationControllerURL + 'GetPage?userOrganization=' + userOrganization,
      population
    );
  }
  deletePagePatient(id: number) {
    return this.APIs.delete(
      this.PopulationControllerURL + 'Delete?id=' + id
    );
  }

  CalculateNewYear(yearobj) {
    return this.APIs.create(
      this.PopulationControllerURL + 'CalculateNewYear', yearobj
    );
  }
}
