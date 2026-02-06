import { Injectable } from '@angular/core';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private ReviewControllerURL: string =
  environment.baseApiUrl + 'review/';

  constructor(private APIs: BaseAPIService) { }
  addReview(DiseaseField: any) {
    return this.APIs.post(this.ReviewControllerURL + 'Add', DiseaseField);
  }
  updateReview(DiseaseField: any) {
    return this.APIs.update(this.ReviewControllerURL + 'Update', DiseaseField);
  }
  getAllReviews() {
    return this.APIs.get(this.ReviewControllerURL + "GetAll");
  }

  getViewById(id: number) {
    return this.APIs.get(this.ReviewControllerURL + 'GetById?id=' + id);
  }

  deleteReview(id: number) {
    return this.APIs.delete(this.ReviewControllerURL + 'Delete?id=' + id);
  }
}
