import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { DiseaseFormService } from '../disease-special-symptoms/services/disease-form.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReviewService } from './Services/review.service';
import { SortEvent } from 'primeng/api';
import { SortOrder } from '../../../../../core/constants';
import * as $ from 'jquery';
import * as c3 from 'c3';
import { DatePipe } from '@angular/common';
import { getDatePlusOneDay } from 'src/app/core/shared/utilis/utilis';

@Component({
  selector: 'app-visit-new-review',
  templateUrl: './visit-new-review.component.html',
  styleUrls: ['./visit-new-review.component.css'],
})
export class VisitNewReviewComponent implements OnInit {
  fromDate: string | number | Date;
  toDate: string | number | Date;
  diseaseForm = {
    id: null,
    NameAr: null,
    NameEn: null,
    DiseaseGroupId: null,
    formType: null,
  };
  diseaseFieldForm = {
    id: null,
    DiseaseFormID: null,
    GovernmentID: null,
    FromDate: null,
    ToDate: null,
  };
  currentLang: string = 'ar';
  governments!: any[];
  reviews!: any[];
  diseases!: any[];
  diseaseSelected: any = null;
  reviewForm: any = {};
  isListShow = false;
  selectedGovernmentId: number = -1;
  selectedDiseaseFormID: number = -1;
  Name: string;
  incidentSources!: any[];
  diseaseFieldFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    diseaseId: 0,
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  isEdit: boolean = false;
  diseaseFields: any[];
  underDeleting = {
    nameAr: '',
    id: null,
  };
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  constructor(
    private lookupsService: LookupsGetterService,
    private reviewService: ReviewService,
    private diseaseService: LookupsGetterService,
    private diseaseFormService: DiseaseFormService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private router: Router
  ) {}
  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.diseaseFormService.getAllDiseaseField().subscribe(
      (result: any) => {
        this.diseaseFields = [{ id: -1, nameAr: 'إختر', nameEn: 'Select' }];
        result.data.forEach((dis) => {
          this.diseaseFields.push(dis);
        });
        this.getGovernments();
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failaddField')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getDiseases() {
    this.diseaseService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        this.diseases = result.data;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failToGetDisease')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  search() {
    this.first = 0;
    this.diseaseFieldFilter.pageIndex = 0;
    this.last =
      this.diseaseFieldFilter.pageIndex * this.diseaseFieldFilter.pageSize;
    this.getReviews();
  }
  onDiseaseChange($event: any) {
    this.diseaseSelected = $event.target.value;
    this.getReviews();
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.nameAr =
      ele.governmentName + ' - ' + ele.diseaseFieldName;
  }
  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.diseaseFieldFilter.sortOrder != SortOrder.desc
    ) {
      this.diseaseFieldFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.diseaseFieldFilter.sortColumn = event.field;
      this.getReviews();
    } else if (
      event.order == 1 &&
      this.diseaseFieldFilter.sortOrder != SortOrder.asc
    ) {
      this.diseaseFieldFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.diseaseFieldFilter.sortColumn = event.field;
      this.getReviews();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.diseaseFieldFilter.pageIndex = event.page;
    this.diseaseFieldFilter.pageSize = event.rows;
    this.getReviews();
  }
  getById(id: any) {
    this.reviewService.getViewById(id).subscribe(
      (result: any) => {
        this.reviewForm = result.data;
        console.log('tt');
        console.log(this.reviewForm);
        this.selectedDiseaseFormID = result.data.diseaseFormID;
        this.selectedGovernmentId = result.data.governmentID;
        this.fromDate = result.data.fromDate;
        this.toDate = result.data.toDate;
        this.isEdit = true;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failaddField')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  delete(id: any) {
    this.reviewService.deleteReview(id).subscribe(
      (result: any) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.getReviews();
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failaddField')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  getReviews() {
    this.loadingPanel = true;
    this.reviewService.getAllReviews().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.reviews = result.data;
          if (this.reviews != undefined && this.reviews.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.reviews.forEach((review) => {
              var disease = this.diseaseFields.find(
                (d) => d.id == review.diseaseFormID
              );
              var gov = this.governments.find(
                (g) => g.id == review.governmentID
              );

              // review.diseaseFieldName =
              //   disease != null
              //     ? this.currentLang == 'ar'
              //       ? disease.nameAr
              //       : disease.nameEn
              //     : '';
              // review.governmentName =
              //   gov != null
              //     ? this.currentLang == 'ar'
              //       ? gov.arabicName
              //       : gov.englishName
              //     : '';
            });
            this.pages = result.data[0].totalCount;

            this.last =
              this.diseaseFieldFilter.pageIndex *
              this.diseaseFieldFilter.pageSize;
          }
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  save() {
    // this.reviewForm.isEvaluation = true;

    this.reviewForm.fromDate = this.fromDate
      ? getDatePlusOneDay(this.fromDate as string)
      : this.fromDate;
    this.reviewForm.toDate = this.toDate
      ? getDatePlusOneDay(this.toDate as string)
      : this.toDate;

    this.reviewService.addReview(this.reviewForm).subscribe(
      (result: any) => {
        this.userMsg.success('تمت الإضافة بنجاح');
        this.getReviews();
        this.reviewForm = {};
        this.selectedDiseaseFormID = -1;
        this.selectedGovernmentId = -1;
        this.toDate = null;
        this.fromDate = null;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failaddField')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  edit() {
    this.reviewForm.fromDate = this.fromDate;
    this.reviewForm.toDate = this.toDate;

    console.log(this.reviewForm);
    this.reviewService.updateReview(this.reviewForm).subscribe(
      (result: any) => {
        this.userMsg.success('تم التعديل بنجاح');
        this.getReviews();
        this.reviewForm = {};
        this.selectedDiseaseFormID = -1;
        this.selectedGovernmentId = -1;
        this.toDate = null;
        this.fromDate = null;
        this.isEdit = false;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failedit')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  onGovernmentChanged() {
    if (this.selectedGovernmentId != null && this.selectedGovernmentId != -1) {
      this.reviewForm.GovernmentID = this.selectedGovernmentId;
    }
    //   this.selectedIncidentSourceId = -1;
    //   this.getHealthAdministration(this.patient.incidentGovernmentId);
    // } else {
    //   this.patient.incidentGovernmentId = null;
    //   this.healthAdministration = [];
    //   this.selectedHealthAdministration = null;
    //   this.selectedHealthAdministrationId = -1;
    //   this.patient.incidentHealthAdministrationId = null;
    //   this.incidentSources = [];
    //   this.patient.incidentSourceId = null;
    //   this.selectedIncidentSource = null;
    //   this.selectedIncidentSourceId = -1;
    // }
  }
  onDiseaseFormChanged() {
    if (
      this.selectedDiseaseFormID != null &&
      this.selectedDiseaseFormID != -1
    ) {
      this.reviewForm.DiseaseFormID = this.selectedDiseaseFormID;
    }
  }

  onFromDateSelection(event) {
    this.fromDate = event.value;
    // this.getZeroNotification();
  }
  onToDateSelection(event) {
    this.toDate = event.value;
    // this.getZeroNotification();
  }
  // fromDateSelected(event) {
  //   this.timePercentageFilter.startDate = event.value;
  // }
  // toDateSelected(event) {
  //   this.timePercentageFilter.endDate = event.value;
  // }

  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.governments.push(gov);
          });

          this.getReviews();
          if (this.selectedGovernmentId != -1) {
            this.onGovernmentChanged();
          }
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
}
