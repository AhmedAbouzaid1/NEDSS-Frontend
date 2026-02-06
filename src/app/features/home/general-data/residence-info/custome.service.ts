import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomeService {
  dataObj = {
    cityID : 0 , healthAdministrationID : 0 ,governmentID :0
  }
  constructor(private APIs:BaseAPIService) { }

  getCustomData(healthofficeId):Observable<any>{
    if (navigator.onLine) {
    return this.APIs.get(`${environment.baseApiUrl}HealthOffice/GetHeakthOfficeData?id=${healthofficeId}`).pipe(
      map((res : any)=>{
        this.dataObj.healthAdministrationID = res.data.healthAdministrationId;
        this.dataObj.governmentID = res.data.governmentId;
      })
    )
    }else {
      const data = new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
      return data;
    }


  }
}
