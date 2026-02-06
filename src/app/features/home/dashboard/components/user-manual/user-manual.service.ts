import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManualService {

  constructor(private http: HttpClient) { }

  addNewManual(data): Observable<any> {
    try {
      return this.http.post(`${environment.baseApiUrl}OptionsHelp/Save`, data).pipe(
        map(
          (res) => {
            console.log(res);

          }
        )
      )
    } catch (error) {
      return null
    }
  }


  getAllMauals(): Observable<any> {
    try {
      return this.http.post(`${environment.baseApiUrl}OptionsHelp/GetPage`, {}).pipe(
        map(
          (res: any) => {
            console.log(res);
            return res.data[0]

          }
        )
      )
    } catch (error) {
      return null
    }
  }

  delete(id): Observable<any> {
    return this.http.delete(`${environment.baseApiUrl}OptionsHelp/Delete?id=${id}`);
  }

}
