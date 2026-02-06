import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { PopulationExcelTemplateFilterVM } from '../upload-excelfile/Model/population-excel-template-filter-vm';
@Injectable({
  providedIn: 'root'
})
export class AddPopulationServiceService {
  private PopulationControllerURL: string =
    environment.baseApiUrl + 'Population/';
  constructor(private http: HttpClient, private userMsg: UserMessageService, private APIs: BaseAPIService) { }


  addPopulation(model: any) {
    return this.APIs.post(
      this.PopulationControllerURL + 'Add',
      model
    );
  }

  updatePopulation(model: any) {
    return this.APIs.update(
      this.PopulationControllerURL + 'Update',
      model
    );
  }

  getPagePatients(population: any) {
    let userOrganization = JSON.parse(localStorage.getItem('ls.authorizationData')).user.organizationId;
    return this.APIs.create(
      this.PopulationControllerURL + 'GetPageDetailed?userOrganization=' + userOrganization,
      population
    );
  }

  getById(id: number) {
    return this.APIs.get(this.PopulationControllerURL + 'GetById?id=' + id);
  }

  DownloadTemplate(filter:PopulationExcelTemplateFilterVM) {
    return this.APIs.postWithBlob(
      this.PopulationControllerURL + 'GetTempletExcel', filter,true,
      { responseType: 'blob' as 'json' }  
    );
  }

  // DownloadTemplete(govpx: any, helpx: any, gincpx: any) {
  //   govpx = govpx == null || govpx == undefined || govpx == '' ? -1 : govpx;
  //   helpx = helpx == null || helpx == undefined || helpx == '' ? -1 : helpx;
  //   gincpx = gincpx == null || gincpx == undefined || gincpx == '' ? -1 : gincpx;

  //   return this.APIs.get(
  //     this.PopulationControllerURL + 'GetTempletExcel?govpx=' + govpx + "&helpx=" + helpx + "&gincpx=" + gincpx, 'blob'
  //   );
  // }

  Import(file: any,filter:any) {
    try {
    let headers = new HttpHeaders();
    if (localStorage.getItem('ls.currentLang') != null && localStorage.getItem('ls.currentLang') != 'undefined') {
      var lang = localStorage.getItem('ls.currentLang');
      headers = headers.set('Accept-Language', lang);
    }

    if (localStorage.getItem('ls.authorizationData') != null && localStorage.getItem('ls.authorizationData') != 'undefined') {
      var authData = JSON.parse(localStorage.getItem('ls.authorizationData'));
      headers = headers.set('Authorization', ` Bearer ${authData.token}`);
    }
      const formData: FormData = new FormData();

      formData.append('file',file);
      for (let key in filter) {
        if (filter.hasOwnProperty(key)) {
          formData.append(key, filter[key]);
        }
      }
      // let headers = this.setHeader();
      return this.http.post(`${this.PopulationControllerURL}GetFromExcel/process-file`, formData,{headers:headers,responseType: 'blob' as 'json' });
    } catch (error) {
      return error
    }


  }


  setHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    if (localStorage.getItem('ls.currentLang') != null && localStorage.getItem('ls.currentLang') != 'undefined') {
      var lang = localStorage.getItem('ls.currentLang');
      headers = headers.set('Accept-Language', lang);
    }

    if (localStorage.getItem('ls.authorizationData') != null && localStorage.getItem('ls.authorizationData') != 'undefined') {
      var authData = JSON.parse(localStorage.getItem('ls.authorizationData'));
      headers = headers.set('Authorization', ` Bearer ${authData.token}`);
    }
    return headers;
  }
}

