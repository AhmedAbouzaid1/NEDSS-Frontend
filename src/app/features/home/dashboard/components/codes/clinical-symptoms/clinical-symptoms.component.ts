import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clinical-symptoms-codes',
  templateUrl: './clinical-symptoms.component.html',
  styleUrls: ['./clinical-symptoms.component.css'],
})
export class ClinicalSymptomsCodesComponent implements OnInit, OnDestroy {
  underDeleting = {
    arabicName: '',
    id: null as number | null,
  };

  clinicalSymptom = {
    id: null as number | null,
    code: null as string | null,
    arabicName: null as string | null,
    englishName: null as string | null,
  };

  clinicalSymptoms!: any[];

  clinicalSymptomFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    code: '',
    arabicName: '',
    englishName: '',
  };

  noData = true;
  loadingPanel = false;
  first = 0;
  last = 0;
  pages = 0;

  codeValidationMsg = '';
  ArabicValidationMsg = '';
  EnglishNameValidationMsg = '';

  hidColName = false;
  hidColFather = false;
  hidColAdress = false;
  hidColDate = false;
  hidColExtAuto = false;

  private readonly searchInput$ = new Subject<void>();
  private searchSub = this.searchInput$
    .pipe(debounceTime(environment.DebounceWaiting))
    .subscribe(() => {
      this.first = 0;
      this.clinicalSymptomFilter.pageIndex = 0;
      this.getClinicalSymptoms();
    });

  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {}

  ngOnInit(): void {
    this.getClinicalSymptoms();
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }

  onSearchTextInput(): void {
    this.searchInput$.next();
  }

  search(): void {
    this.first = 0;
    this.clinicalSymptomFilter.pageIndex = 0;
    this.last =
      this.clinicalSymptomFilter.pageIndex *
      this.clinicalSymptomFilter.pageSize;
    this.clinicalSymptomFilter.code = this.clinicalSymptom.code ?? '';
    this.clinicalSymptomFilter.arabicName = this.clinicalSymptom.arabicName ?? '';
    this.clinicalSymptomFilter.englishName =
      this.clinicalSymptom.englishName ?? '';

    this.getClinicalSymptoms();
  }

  getClinicalSymptoms(): void {
    this.loadingPanel = true;
    this.lookupsService.getPageClinicalSymptoms(this.clinicalSymptomFilter).subscribe(
      (result: any) => {
        if (result != null && result !== undefined) {
          this.clinicalSymptoms = result.data;
          if (
            this.clinicalSymptoms !== undefined &&
            this.clinicalSymptoms.length === 0
          ) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last =
              this.clinicalSymptomFilter.pageIndex *
              this.clinicalSymptomFilter.pageSize;
          }
        }
        this.loadingPanel = false;
      },
      () => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getById(id: number): void {
    this.lookupsService.getClinicalSymptomById(id).subscribe(
      (result: any) => {
        this.clinicalSymptom = result?.data ?? this.clinicalSymptom;
        document.getElementById('cs')?.scrollIntoView({ behavior: 'smooth' });
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

  save(): void {
    if (this.clinicalSymptom.id == null) {
      this.lookupsService.addClinicalSymptom(this.clinicalSymptom).subscribe(
        () => {
          this.translateService
            .get('NEDSS.COMMON.SENT_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.clinicalSymptom = {
            id: null,
            code: null,
            arabicName: null,
            englishName: null,
          };
          this.getClinicalSymptoms();
        },
        (error) => this.handleSaveError(error)
      );
    } else {
      this.update();
    }
  }

  private handleSaveError(error: any): void {
    const msgs: string[] = error?.error?.messages || [];
    if (msgs.length > 0) {
      msgs.forEach((msg) => {
        const m = msg.toLowerCase();
        if (m.includes('code')) {
          this.codeValidationMsg = msg;
          this.translateService
            .get('NEDSS.COMMON.CODEVALIDATEMSG')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        } else if (m.includes('arabic')) {
          this.ArabicValidationMsg = msg;
          this.translateService
            .get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        } else if (m.includes('english')) {
          this.EnglishNameValidationMsg = msg;
          this.translateService
            .get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      });
      return;
    }

    this.translateService
      .get('NEDSS.COMMON.SENT_FAILD')
      .subscribe((res: string) => {
        this.userMsg.error(res);
      });
  }

  update(): void {
    this.lookupsService.updateClinicalSymptom(this.clinicalSymptom).subscribe(
      (response: any) => {
        if (response?.statusCode === 500 && response?.messages?.length) {
          response.messages.forEach((msg: string) => {
            if (msg.includes('Code')) {
              this.codeValidationMsg = msg;
              this.translateService
                .get('NEDSS.COMMON.CODEVALIDATEMSG')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
            }
            if (msg.includes('Arabic')) {
              this.ArabicValidationMsg = msg;
              this.translateService
                .get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
            }
            if (msg.includes('English')) {
              this.EnglishNameValidationMsg = msg;
              this.translateService
                .get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
            }
          });
          return;
        }
        this.translateService
          .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.clinicalSymptom = {
          id: null,
          code: null,
          arabicName: null,
          englishName: null,
        };
        this.getClinicalSymptoms();
      },
      (error) => this.handleSaveError(error)
    );
  }

  sort(event: SortEvent): void {
    if (
      event.order === -1 &&
      this.clinicalSymptomFilter.sortOrder !== SortOrder.desc
    ) {
      this.clinicalSymptomFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string') {
        this.clinicalSymptomFilter.sortColumn = event.field;
      }
      this.getClinicalSymptoms();
    } else if (
      event.order === 1 &&
      this.clinicalSymptomFilter.sortOrder !== SortOrder.asc
    ) {
      this.clinicalSymptomFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string') {
        this.clinicalSymptomFilter.sortColumn = event.field;
      }
      this.getClinicalSymptoms();
    }
  }

  paginate(event: any): void {
    this.first = event.first;
    this.last = event.last;
    this.clinicalSymptomFilter.pageIndex = event.page;
    this.clinicalSymptomFilter.pageSize = event.rows;
    this.getClinicalSymptoms();
  }

  delete(id: number | null): void {
    if (id == null) {
      return;
    }
    this.lookupsService.deleteClinicalSymptom(id).subscribe(
      () => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.getClinicalSymptoms();
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  nameToDelete(ele: any): void {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }

  toHidColName(): void {
    this.hidColName = !this.hidColName;
  }
  toHhidColFather(): void {
    this.hidColFather = !this.hidColFather;
  }
  toHidColAdress(): void {
    this.hidColAdress = !this.hidColAdress;
  }
  toHidColDate(): void {
    this.hidColDate = !this.hidColDate;
  }

  codeChange(): void {
    this.codeValidationMsg = '';
  }
  arabicNameChange(): void {
    this.ArabicValidationMsg = '';
  }
  englishNameChange(): void {
    this.EnglishNameValidationMsg = '';
  }
}
