import { LookupsGetterService } from './../../../../../../core/services/lookups-getter.service';
import { UserMessageService } from './../../../../../../core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SortEvent } from 'primeng/api';
import { SortOrder } from 'src/app/core/constants';

@Component({
  selector: 'app-patient-job',
  templateUrl: './patient-job.component.html',
  styleUrls: ['./patient-job.component.css'],
})
export class PatientJobComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  patientJob = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    patientJobCategoryID: null,
  };
  patientJobs!: any[];
  patientJobCategorys!: any[];
  patientJobFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: 'code',
    sortOrder: 'desc',
    searchText: '',
    code: "",
    arabicName: "",
    englishName: "",
    patientJobCategoryID: null,
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  patientJobCategorysLoading: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  codeValidationMsg: string = '';
  ArabicValidationMsg: string = '';
  EnglishNameValidationMsg: string = '';

  private searchWired = false;
  @ViewChild('searchInput') set searchInput(el: ElementRef) {
    if (el && !this.searchWired) {
      this.searchWired = true;
      fromEvent(el.nativeElement, 'keyup')
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
  }

  constructor(
    private patientJobService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getPatientJobs();
    this.getPatientJobCategorys();
  }

  getPatientJobCategorys() {
    this.patientJobCategorysLoading = true;
    this.patientJobService.getAllPatientJobCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.patientJobCategorys = result.data;
        }
        this.loadingPanel = false;
        this.patientJobCategorysLoading = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.patientJobCategorysLoading = false;
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
    this.patientJobFilter.pageIndex = 0;
    this.last =
      this.patientJobFilter.pageIndex * this.patientJobFilter.pageSize;
    this.patientJobFilter.code = this.patientJob.code;
    this.patientJobFilter.arabicName = this.patientJob.arabicName;
    this.patientJobFilter.englishName = this.patientJob.englishName;
    this.patientJobFilter.patientJobCategoryID = this.patientJob.patientJobCategoryID;

    this.getPatientJobs();
  }

  getPatientJobs() {
    this.loadingPanel = true;
    this.patientJobService.getPagePatientJobs(this.patientJobFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.patientJobs = result.data;
          if (this.patientJobs != undefined && this.patientJobs.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last =
              this.patientJobFilter.pageIndex * this.patientJobFilter.pageSize;
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
    this.patientJobService.getPatientJobById(id).subscribe(
      (result: any) => {
        document.getElementById("patient-jo").scrollIntoView({ behavior: 'smooth' });
        this.patientJob = result.data;
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
    if (this.patientJob.id == null) {
      this.patientJobService.addPatientJob(this.patientJob).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getPatientJobs();
            this.patientJob = {
              id: null,
              code: null,
              arabicName: null,
              englishName: null,
              patientJobCategoryID: null,
            };
          }
        },
        (error) => {
          if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
            || error.error?.messages?.includes("DuplicatedArabicName")) {
            // this.translateService
            //   .get('NEDSS.COMMON.' + error.error.messages[0])
            //   .subscribe((res: string) => {
            //     this.userMsg.error(res);
            //     if (res.includes("Code")) {
            //       this.codeValidationMsg = res;
            //     }
            //     if (res.includes("Arabic")) {
            //       this.ArabicValidationMsg = res;
            //     }

            //     if (res.includes("English")) {
            //       this.EnglishNameValidationMsg = res;
            //     }
            //   });
            error.error.messages.forEach(msg => {

              if (msg.includes("Code")) {
                this.codeValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }
              if (msg.includes("Arabic")) {
                this.ArabicValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }

              if (msg.includes("English")) {
                this.EnglishNameValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }

              // this.userMsg.error('NEDSS.COMMO.' + msg);


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
    this.patientJobService.updatePatientJob(this.patientJob).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getPatientJobs();
          this.patientJob = {
            id: null,
            code: null,
            arabicName: null,
            englishName: null,
            patientJobCategoryID: null,
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
    if (
      event.order == -1 &&
      this.patientJobFilter.sortOrder != SortOrder.desc
    ) {
      this.patientJobFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.patientJobFilter.sortColumn = event.field;
      this.getPatientJobs();
    } else if (
      event.order == 1 &&
      this.patientJobFilter.sortOrder != SortOrder.asc
    ) {
      this.patientJobFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.patientJobFilter.sortColumn = event.field;
      this.getPatientJobs();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.patientJobFilter.pageIndex = event.page;
    this.patientJobFilter.pageSize = event.rows;
    this.getPatientJobs();
  }

  delete(id: number) {
    this.patientJobService.deletePatientJob(id).subscribe(
      (result: any) => {
        this.getPatientJobs();
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
    this.patientJobFilter.searchText = '';
    this.search();
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }
  codeChange() {

    this.codeValidationMsg = '';
  }
  arabicNameChange() {

    this.ArabicValidationMsg = '';
  }
  englishNameChange() {

    this.EnglishNameValidationMsg = '';
  }
}
