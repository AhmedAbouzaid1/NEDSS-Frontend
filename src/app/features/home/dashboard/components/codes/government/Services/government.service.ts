import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GovernmentService {

  private controllerURL: string = environment.baseApiUrl+"Government/";
  // private controllerURL: string = "https://localhost:7295/Government/";

  constructor( private APIs:BaseAPIService) { }

  getAll(governmentFilter: any) {
    return this.APIs.create(this.controllerURL + "GetPage", governmentFilter);
  }
  delete(id: number) {
    return this.APIs.delete(this.controllerURL + "Delete?id=" + id);
  }
  getBy(id: number) {
      return this.APIs.get(this.controllerURL + "GetById?id=" + id);
  }
  update(government : any) {
    return this.APIs.update(this.controllerURL + "Update", government);
  }
  add(govenment: any) {
      return this.APIs.post(this.controllerURL + "Add", govenment);
  }

}
