
import { HttpClient } from '@angular/common/http';
import { AddPopulationCoefficientModel } from '../models/AddPopulationCoefficientModel';

import { map, of } from 'rxjs';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';

@Injectable({
  providedIn: 'root'
})
export class PopulationCoefficientService {



private controllerURL: string = environment.baseApiUrl+"OverPopulation/";

constructor( private APIs:BaseAPIService) { }


add(populationCoe: any) {
    return this.APIs.post(this.controllerURL + "Add", populationCoe);
}
getPagePopulations(population: any) {
  return this.APIs.create(
    this.controllerURL + 'GetPage',
    population
  );
}
delete(id: number) {
  return this.APIs.delete(
   this.controllerURL + 'Delete?id=' + id
  );
}
getById(id: number) {
  return this.APIs.get(
    this.controllerURL + 'GetById?id=' + id
  );
  }
  Update(population: any) {
    return this.APIs.update(
      this.controllerURL + 'Update',
      population
    );
  }
}
