import { PatientDiseases } from './../../../home/general-data/models/patient-model';
import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { UserService } from 'src/app/features/home/users/Services/user.service';
import { LabService } from '../../services/lab.service';
import { GeneralDataService } from 'src/app/features/home/general-data/services/general-data.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/core/services/notificationService.service';
import {
  SingleDropdownSettings,
  MultipleDropdownSettings,
} from 'src/app/core/constants';
import { from } from 'rxjs';
import { concatMap, finalize, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-add-lab-test',
  templateUrl: './add-lab-test.component.html',
  styleUrls: ['./add-lab-test.component.css'],
})
export class AddLabTestComponent {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  patient: any;
  caseDiscoveryDate: string | null = null;
  patientChecks: [];
  id: any;
  patientAddCheck = {
    id: null,
    diseaseGroupId: null,
    patientId: null,
    diseaseCheckId: null,
    dieaseLabTestId: null,
    diseaseLabTestResultId: null,
    getSampleDate: null,
    sampleDeliveryDate: null,
    labResultDate: null,
    labNumber: null,
    genotype: null,
    geneticNumber: null,
  };
  checkFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    patientId: null,
  };

  labChecks!: any[];
  selectedLabCheck: any;

  checkSamples!: any[];
  selectedCheckSample: any;

  labCheckResults!: any[];
  selectedLabCheckResult: any[] = [];

  noData: boolean = true;
  loadingPanel: boolean = false;
  labSamplesLoading: boolean = false;
  labChecksLoading: boolean = false;
  labCheckResultsLoading: boolean = false;
  diseasesLoading: boolean = false;
  diseaseGroupsLoading: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;

  singleDropdownSettings = {};
  multipleDropdownSettings = {};
  Diseasies: any[];
  filterdDisease: any[];

  readonly meningitisAndEncephalitisDiseaseGroupIds = [2, 23];
  readonly feverRashDiseaseGroupId = 5;

  underDeleting = {
    nameAr: '',
    id: null,
  };
  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private route: ActivatedRoute,
    private labService: LabService,
    private datePipe: DatePipe,
    private lookupsService: LookupsGetterService,
    private notificationService: NotificationService,
    private generalDataService: GeneralDataService
  ) {}

  ngOnInit() {
    this.loadingPanel = true;
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('id from route ',this.id);
    if (this.id != null) {
      this.getById(this.id);
    }

    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = {
      ...MultipleDropdownSettings,
      textField: this.currentLang == 'ar' ? 'arabicName' : 'englishName',
      placeholder: this.currentLang == 'ar' ? 'اختر' : 'Choose',
    };
    this.loadingPanel = false;
  }
  getLookups() {
    // this.getLabChecks();
    // this.getLabCheckResults();
    // this.getLabSamples();
    // this.getAllDiseasesGroup();

    setTimeout(() => {
      // const array = this.patient?.patientDiseases?.split(',');
      // this.filterdDisease = this.Diseasies?.filter(
      //   (x) => x.arabicName == array[0]
      // );
      this.filterdDisease = this.patient?.patientDiseasesList;
      // if (this.filterdDisease) {
      //   this.getLabSamples();
      // }
      // this.getAllDiseases();
      // for (let index = 1; index < array?.length; index++) {
      //   this.filterdDisease = this.filterdDisease.concat(
      //     this.Diseasies.filter((x) => x.arabicName == array[index])
      //   );
      // }
    }, 1000);
    setTimeout(() => {
      if (this.filterdDisease) {
        this.getLabSamples();
      } else{
        console.log('no disease');
      }
    }, 2000);
  }
  onItemSelect(item: any) {}
  onSelectAll(items: any) {}

  onSampleChanged() {
    if (this.selectedCheckSample != null) {
      this.patientAddCheck.diseaseCheckId = this.selectedCheckSample;
      this.getLabChecks();
      this.labChecks = null;
      this.labCheckResults = null;
      this.selectedLabCheckResult = [];
    } else {
      this.patientAddCheck.diseaseCheckId = null;
    }
  }

  onLabCheckChanged() {
    if (this.selectedLabCheck > 0) {
      this.patientAddCheck.dieaseLabTestId = this.selectedLabCheck;
      this.getLabCheckResults();
    } else {
      this.patientAddCheck.dieaseLabTestId = null;
      this.labCheckResults = null;
      this.selectedLabCheckResult = [];
    }
  }

  getLabChecks() {
    this.labChecksLoading = true;
    this.lookupsService
      .GetDiseaseLabTestByPatientId(
        this.patientAddCheck.diseaseGroupId,
        this.patientAddCheck.diseaseCheckId
      )
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.labChecks = result.data;
            this.labChecks.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (this.patientAddCheck.dieaseLabTestId > 0) {
              this.selectedLabCheck = this.labChecks.find(
                (item) => item.id === this.patientAddCheck.dieaseLabTestId
              )?.id;
            }
          }
          this.labChecksLoading = false;
        },
        (error) => {
          this.labChecksLoading = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getLabCheckResults() {
    this.labCheckResultsLoading = true;
    this.lookupsService
      .GetDiseaseLabTestResultByPatientId(
        this.patientAddCheck.diseaseGroupId,
        this.patientAddCheck.diseaseCheckId,
        this.patientAddCheck.dieaseLabTestId
      )
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.labCheckResults = result.data;
            if (this.patientAddCheck.diseaseLabTestResultId > 0) {
              this.selectedLabCheckResult = this.labCheckResults.filter(
                (item) =>
                  item.id === this.patientAddCheck.diseaseLabTestResultId
              );
            } else {
              this.selectedLabCheckResult = [];
            }
          }
          this.labCheckResultsLoading = false;
        },
        (error) => {
          this.labCheckResultsLoading = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  filterdDiseaseChange() {
    if (!this.isMeningitisOrEncephalitisSelected()) {
      this.getLabSamples();
    }
  }

  isMeningitisOrEncephalitisSelected(): boolean {
    return this.meningitisAndEncephalitisDiseaseGroupIds.includes(
      Number(this.patientAddCheck.diseaseGroupId)
    );
  }

  isFeverRashSelected(): boolean {
    return Number(this.patientAddCheck.diseaseGroupId) === this.feverRashDiseaseGroupId;
  }

  isPcrPositiveSelected(): boolean {
    const test = this.labChecks?.find((t) => t.id === this.selectedLabCheck);
    const isPcr = /PCR/i.test(`${test?.englishName ?? ''} ${test?.arabicName ?? ''}`);
    return (
      isPcr &&
      (this.selectedLabCheckResult ?? []).some((r: any) => {
        const full = this.labCheckResults?.find((x) => x.id === r.id) ?? r;
        return /positive/i.test(full?.englishName ?? '') || /إيجاب|ايجاب/.test(full?.arabicName ?? '');
      })
    );
  }

  private clearFeverRashFieldsIfHidden() {
    if (!this.isFeverRashSelected()) {
      this.patientAddCheck.labNumber = null;
    }
    if (!this.isFeverRashSelected() || !this.isPcrPositiveSelected()) {
      this.patientAddCheck.genotype = null;
      this.patientAddCheck.geneticNumber = null;
    }
  }

  isDiseaseSelected(): boolean {
    return (
      this.patientAddCheck.diseaseGroupId != null &&
      this.patientAddCheck.diseaseGroupId !== ('' as any)
    );
  }
  getLabSamples() {
    this.labSamplesLoading = true;
    this.lookupsService
      .GetByPatientId(this.patientAddCheck.diseaseGroupId)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.checkSamples = result.data;
            this.checkSamples.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (this.patientAddCheck.diseaseCheckId > 0) {
              this.selectedCheckSample = this.patientAddCheck.diseaseCheckId;
              this.getLabChecks();
              this.getLabCheckResults();
            }
          }
          this.labSamplesLoading = false;
        },
        (error) => {
          this.labSamplesLoading = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getAllDiseases() {
    this.diseasesLoading = true;
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Diseasies = result.data;
          if (this.patientAddCheck.diseaseGroupId > 0) {
            this.getLabSamples();
          }
        }

        this.diseasesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.diseasesLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getAllDiseasesGroup() {
    this.diseaseGroupsLoading = true;
    this.lookupsService
      .getPageDiseaseGroups({ patientId: this.patientAddCheck.patientId })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.filterdDisease = result.data;
            this.filterdDisease.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (this.patientAddCheck.diseaseGroupId > 0) {
              this.getLabSamples();
            }
            // const array = this.patient.patientDiseases.split(',');
            // this.filterdDisease=this.filterdDisease.filter( x => x.arabicName == array[0] )
            // for (let index = 1; index < array.length; index++) {
            //   this.filterdDisease = (this.filterdDisease.concat(this.Diseasies.filter( x => x.arabicName == array[index])))
            // }
          }

          this.diseaseGroupsLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.diseaseGroupsLoading = false;
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
    this.labService.getBy(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.patient = result.data;
          this.caseDiscoveryDate = this.datePipe.transform(this.patient?.caseDiscoveryDate, 'yyyy-MM-dd');
          if (!this.caseDiscoveryDate) this.loadCaseDiscoveryDate(id);
          this.checkFilter.patientId = this.patient.id;
          this.getPatientChecks();
        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }, () =>{
        this.getLookups();
      }
    );
  }
  getPatientChecks() {
    this.loadingPanel = true;
    this.labService.getPagePatientLabChecks(this.checkFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.patientChecks = result.data.patientLabChecks;
          if (
            this.patientChecks != undefined &&
            this.patientChecks.length == 0
          ) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = result.data.totalCount;
            this.last = this.checkFilter.pageIndex * this.checkFilter.pageSize;
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

  getCheckById(id: number) {
    this.labService.getPatientLabCheckById(id).subscribe(
      (result: any) => {
        this.patientAddCheck = result.data;
        this.patientAddCheck.getSampleDate = this.datePipe.transform(
          this.patientAddCheck.getSampleDate,
          'yyyy-MM-dd'
        );
        this.patientAddCheck.sampleDeliveryDate = this.datePipe.transform(
          this.patientAddCheck.sampleDeliveryDate,
          'yyyy-MM-dd'
        );
        this.patientAddCheck.labResultDate = this.datePipe.transform(
          this.patientAddCheck.labResultDate,
          'yyyy-MM-dd'
        );
        this.getAllDiseases();
        this.selectedCheckSample = this.patientAddCheck.diseaseCheckId;
        this.selectedLabCheck = this.labChecks?.find(
          (item) => item.id === this.patientAddCheck.dieaseLabTestId
        )?.id;
        this.selectedLabCheckResult = this.labCheckResults?.filter(
          (item) => item.id === this.patientAddCheck.diseaseLabTestResultId
        ) ?? [];
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

  private loadCaseDiscoveryDate(id: number) {
    this.generalDataService.getBy(id).subscribe((res: any) => {
      this.caseDiscoveryDate = this.datePipe.transform(res?.data?.caseDiscoveryDate, 'yyyy-MM-dd');
    });
  }

  isSampleDateBeforeDiscovery(): boolean {
    const sample = this.datePipe.transform(this.patientAddCheck?.getSampleDate, 'yyyy-MM-dd');
    return !!sample && !!this.caseDiscoveryDate && sample < this.caseDiscoveryDate;
  }

  isDeliveryDateBeforeSample(): boolean {
    const sample = this.datePipe.transform(this.patientAddCheck?.getSampleDate, 'yyyy-MM-dd');
    const delivery = this.datePipe.transform(this.patientAddCheck?.sampleDeliveryDate, 'yyyy-MM-dd');
    return !!sample && !!delivery && delivery < sample;
  }

  isResultDateBeforeDelivery(): boolean {
    const delivery = this.datePipe.transform(this.patientAddCheck?.sampleDeliveryDate, 'yyyy-MM-dd');
    const result = this.datePipe.transform(this.patientAddCheck?.labResultDate, 'yyyy-MM-dd');
    return !!delivery && !!result && result < delivery;
  }

  saving = false;

  save() {
    if (this.saving) {
      return;
    }
    if (this.isSampleDateBeforeDiscovery()) {
      this.userMsg.error(`تاريخ سحب العينة لا يمكن أن يكون قبل تاريخ اكتشاف الحالة (${this.caseDiscoveryDate})`);
      return;
    }
    if (this.isDeliveryDateBeforeSample()) {
      this.userMsg.error('تاريخ تسليم العينة يجب أن يكون في نفس يوم سحب العينة أو بعده');
      return;
    }
    if (this.isResultDateBeforeDelivery()) {
      this.userMsg.error('تاريخ النتيجة يجب أن يكون في نفس يوم تسليم العينة أو بعده');
      return;
    }
    if (this.validateRequiredData()) {
      this.clearFeverRashFieldsIfHidden();
      this.patientAddCheck.patientId = this.id;
      if (this.patientAddCheck.id == null) {
        const resultIds = this.selectedLabCheckResult?.length
          ? this.selectedLabCheckResult.map((r) => r.id)
          : [null];
        this.saving = true;
        from(resultIds)
          .pipe(
            concatMap((resultId) =>
              this.labService.addPatientLabCheck({
                ...this.patientAddCheck,
                diseaseLabTestResultId: resultId,
              })
            ),
            toArray(),
            finalize(() => (this.saving = false))
          )
          .subscribe(
            (responses: any[]) => {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getById(this.id);
              this.resetLabCheck();
              //send notification here
              responses.forEach((response) => {
                response?.messages?.forEach((msg) => {
                  this.notificationService.sendNotification([], JSON.parse(msg));
                });
              });
            },
            (error) => {
              this.translateService
                .get('NEDSS.COMMON.SENT_FAILD')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
            }
          );
      } else this.update();
    } else {
      this.userMsg.error('يجب ادخال كل الحقول');
    }
  }

  update() {
    this.saving = true;
    this.labService
      .updatePatientLabCheck({
        ...this.patientAddCheck,
        diseaseLabTestResultId: this.selectedLabCheckResult[0]?.id ?? null,
      })
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getById(this.id);
            this.resetLabCheck();
          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.checkFilter.pageIndex = event.page;
    this.checkFilter.pageSize = event.rows;
    this.getPatientChecks();
  }

  delete(id: number) {
    this.labService.deletePatientLabCheck(id).subscribe(
      (result: any) => {
        this.getById(this.id);
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

  resetLabCheck() {
    this.patientAddCheck = {
      id: null,
      patientId: null,
      diseaseGroupId: null,
      diseaseCheckId: null,
      dieaseLabTestId: null,
      diseaseLabTestResultId: null,
      getSampleDate: null,
      sampleDeliveryDate: null,
      labResultDate: null,
      labNumber: null,
      genotype: null,
      geneticNumber: null,
    };
    this.selectedCheckSample = null;
    this.selectedLabCheck = null;
    this.selectedLabCheckResult = [];
  }

  validateRequiredData(): boolean {
    if (
      this.patientAddCheck.dieaseLabTestId == null ||
      this.patientAddCheck.diseaseCheckId == null ||
      this.patientAddCheck.getSampleDate == null
    )
      return false;
    return true;
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.nameAr = ele.diseaseName;
  }
}
