import { Injectable } from '@angular/core';
import { BaseAPIService } from './BaseAPI.service';
import { environment } from 'src/environments/environment';
import { finalize, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PartialLoadingService } from '../components/partial-loading/partial-loading.service';

@Injectable({
  providedIn: 'root'
})
export class AttachemntApiService {

  private AttachmentControllerURL: string = environment.baseApiUrl + 'Attachment/';

  constructor(private APIs: BaseAPIService, private http: HttpClient, private partialLoadingService: PartialLoadingService) { }


  upload(data): Observable<any> {
    const loaderGeneration = this.partialLoadingService.showloader()
    try {
      let headers = new HttpHeaders();
      if (
        localStorage.getItem('ls.currentLang') != null &&
        localStorage.getItem('ls.currentLang') != 'undefined'
      ) {
        const lang = localStorage.getItem('ls.currentLang');
        headers = headers.set('Accept-Language', lang);
      }
      if (
        localStorage.getItem('ls.authorizationData') != null &&
        localStorage.getItem('ls.authorizationData') != 'undefined'
      ) {
        const authData = JSON.parse(localStorage.getItem('ls.authorizationData'));
        headers = headers.set('Authorization', ` Bearer ${authData.token}`);
      }
      return this.http
        .post(`${this.AttachmentControllerURL}Uploud`, data, { headers })
        .pipe(finalize(() => this.partialLoadingService.hideLoader(loaderGeneration)))
    } catch (error) {
      this.partialLoadingService.hideLoader(loaderGeneration);
      return null
    }
  }

}
