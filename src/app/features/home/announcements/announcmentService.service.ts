import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnouncmentServiceService {

  constructor(private http: HttpClient) { }

  addNewAnnouncment(data): Observable<any> {
    try {
      return this.http.post(`${environment.baseApiUrl}Announcement/Add`, data).pipe(
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

  updateAnnouncment(data): Observable<any> {
    try {
      return this.http.put(`${environment.baseApiUrl}Announcement/Update`, data).pipe(
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

  getAllAnnouncment(data): Observable<any> {
    try {
      return this.http.post(`${environment.baseApiUrl}Announcement/GetPage`, data).pipe(
        map(
          (res: any) => {
            return res.data

          }
        )
      )
    } catch (error) {
      return null
    }
  }

  delete(id): Observable<any> {
    return this.http.delete(`${environment.baseApiUrl}Announcement/Delete?id=${id}`);
  }


}
