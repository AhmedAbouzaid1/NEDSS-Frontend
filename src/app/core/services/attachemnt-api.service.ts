import { Injectable } from '@angular/core';
import { BaseAPIService } from './BaseAPI.service';
import { environment } from 'src/environments/environment';
import { finalize, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PartialLoadingService } from '../components/partial-loading/partial-loading.service';

@Injectable({
  providedIn: 'root'
})
export class AttachemntApiService {

  private AttachmentControllerURL: string = environment.baseApiUrl + 'Attachment/';

  constructor(private APIs: BaseAPIService, private http: HttpClient, private partialLoadingService: PartialLoadingService) { }


  upload(data): Observable<any> {
    this.partialLoadingService.showloader()
    try {
      return this.http.post(`${this.AttachmentControllerURL}Uploud`, data).pipe(finalize(() => this.partialLoadingService.hideLoader()))
    } catch (error) {
      return null
    }
  }

}
