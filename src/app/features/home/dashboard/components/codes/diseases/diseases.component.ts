import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-diseases',
  templateUrl: './diseases.component.html',
  styleUrls: ['./diseases.component.css'],
})
export class DiseasesComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  disease = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    icd10: null,
    treatmentPeriodInDays: null,
    diseaseCategoryId: null,
    diseaseGroupId: null,
    infectionAllowncePeriod: null,
    infictionAgeLimit: null,
    ageTypeId: null,
    hasTrackingForm: null,
    openFormExamination: null,
  };
  diseases!: any[];
  diseaseCategorys!: any[];
  diseaseGroups!: any[];
  diseaseFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    code: "",
    arabicName: "",
    englishName: "",
    icd10: "",
    treatmentPeriodInDays: null,
    diseaseCategoryId: null,
    diseaseGroupId: null,
    infectionAllowncePeriod: null,
    infictionAgeLimit: null,
    ageTypeId: null,
    hasTrackingForm: null,
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  numberInput: boolean = true;
  numberInput2: boolean = true;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private diseaseService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getDiseases();
    this.getDiseaseCategorys();
    this.getDiseaseGroups();
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(environment.DebounceWaiting),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.search();
      });
  }

  getDiseaseCategorys() {
    this.diseaseService.getAllDiseaseCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseaseCategorys = result.data;
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
  getDiseaseGroups() {
    this.diseaseService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseaseGroups = result.data;
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

  search() {
    this.first = 0;
    this.diseaseFilter.pageIndex = 0;
    this.last = this.diseaseFilter.pageIndex * this.diseaseFilter.pageSize;
    this.diseaseFilter.code = this.disease.code;
    this.diseaseFilter.arabicName = this.disease.arabicName;
    this.diseaseFilter.englishName = this.disease.englishName;
    this.diseaseFilter.icd10 = this.disease.icd10;
    this.diseaseFilter.ageTypeId = this.disease.ageTypeId;
    this.diseaseFilter.diseaseCategoryId = this.disease.diseaseCategoryId;
    this.diseaseFilter.diseaseGroupId = this.disease.diseaseGroupId;
    this.diseaseFilter.infictionAgeLimit = this.disease.infictionAgeLimit;
    this.diseaseFilter.hasTrackingForm = this.disease.hasTrackingForm;
    this.getDiseases();
  }

  getDiseases() {
    this.loadingPanel = true;
    this.diseaseService.getPageDiseases(this.diseaseFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
          if (this.diseases != undefined && this.diseases.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last =
              this.diseaseFilter.pageIndex * this.diseaseFilter.pageSize;
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

  getById(id: number) {
    this.diseaseService.getDiseaseById(id).subscribe(
      (result: any) => {
        document.getElementById("diseas").scrollIntoView({ behavior: 'smooth' });
        this.disease = result.data;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  save() {

    if (this.disease.id == null) {
      this.diseaseService.addDisease(this.disease).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getDiseases();
            this.disease = {
              id: null,
              code: null,
              arabicName: null,
              englishName: null,
              icd10: null,
              treatmentPeriodInDays: null,
              diseaseCategoryId: null,
              diseaseGroupId: null,
              infectionAllowncePeriod: null,
              infictionAgeLimit: null,
              ageTypeId: null,
              hasTrackingForm: null,
              openFormExamination: null,
            };
          }
        },
        (error) => {
          if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
            || error.error?.messages?.includes("DuplicatedArabicName")) {
            this.translateService
              .get('NEDSS.COMMON.' + error.error.messages[0])
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          } else {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        }
      );
    } else this.update();
  }

  update() {
    this.diseaseService.updateDisease(this.disease).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getDiseases();
          this.disease = {
            id: null,
            code: null,
            arabicName: null,
            englishName: null,
            icd10: null,
            treatmentPeriodInDays: null,
            diseaseCategoryId: null,
            diseaseGroupId: null,
            infictionAgeLimit: null,

            infectionAllowncePeriod: null,
            ageTypeId: null,
            hasTrackingForm: null,
            openFormExamination: null,
          };
        }
      },
      (error) => {
        if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
          || error.error?.messages?.includes("DuplicatedArabicName")) {
          this.translateService
            .get('NEDSS.COMMON.' + error.error.messages[0])
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        } else {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      }
    );
  }

  sort(event: SortEvent) {
    if (event.order == -1 && this.diseaseFilter.sortOrder != SortOrder.desc) {
      this.diseaseFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.diseaseFilter.sortColumn = event.field;
      this.getDiseases();
    } else if (
      event.order == 1 &&
      this.diseaseFilter.sortOrder != SortOrder.asc
    ) {
      this.diseaseFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.diseaseFilter.sortColumn = event.field;
      this.getDiseases();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.diseaseFilter.pageIndex = event.page;
    this.diseaseFilter.pageSize = event.rows;
    this.getDiseases();
  }

  delete(id: number) {
    this.diseaseService.deleteDisease(id).subscribe(
      (result: any) => {
        this.getDiseases();
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  clearSearch() {
    this.diseaseFilter.searchText = '';
    this.search();
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }

  onInputChange(event: any) {

    const inputValue2 = event.target.value;

    if (isNaN(Number(inputValue2))) {
      this.numberInput = false;
    }
    else {
      this.numberInput = true;
    }
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    inputElement.value = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters

  }

  onInputChange2(event: any) {

    const inputValue2 = event.target.value;

    if (isNaN(Number(inputValue2))) {
      this.numberInput2 = false;
    }
    else {
      this.numberInput2 = true;
    }
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    inputElement.value = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters

  }


}
