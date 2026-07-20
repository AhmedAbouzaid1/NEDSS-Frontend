import { PatientDiseases } from './../../../home/general-data/models/patient-model';
import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { UserService } from 'src/app/features/home/users/Services/user.service';
import { LabService } from '../../services/lab.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/core/services/notificationService.service';
import {
  SingleDropdownSettings,
  MultipleDropdownSettings,
} from 'src/app/core/constants';

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
    labResultDate: null,
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
  selectedLabCheckResult: any;

  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;

  singleDropdownSettings = {};
  multipleDropdownSettings = {};
  Diseasies: any[];
  filterdDisease: any[];

  readonly meningitisAndEncephalitisDiseaseGroupIds = [2, 23];

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
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadingPanel = true;
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('id from route ',this.id);
    if (this.id != null) {
      this.getById(this.id);
    }

    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = MultipleDropdownSettings;
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
    if (this.selectedCheckSample.length > 0) {
      this.patientAddCheck.diseaseCheckId = this.selectedCheckSample[0].id;
      this.getLabChecks();
      this.labChecks = null;
      this.labCheckResults = null;
      this.selectedLabCheckResult = null;
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
      this.selectedLabCheckResult = null;
    }
  }

  onLabCheckResultChanged() {
    if (this.selectedLabCheckResult > 0) {
      this.patientAddCheck.diseaseLabTestResultId = this.selectedLabCheckResult;
    } else {
      this.patientAddCheck.diseaseLabTestResultId = null;
    }
  }
  getLabChecks() {
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
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getLabCheckResults() {
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
            this.labCheckResults.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (this.patientAddCheck.diseaseLabTestResultId > 0) {
              this.selectedLabCheckResult = this.labCheckResults.find(
                (item) =>
                  item.id === this.patientAddCheck.diseaseLabTestResultId
              )?.id;
            }
          }
        },
        (error) => {
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

  isDiseaseSelected(): boolean {
    return (
      this.patientAddCheck.diseaseGroupId != null &&
      this.patientAddCheck.diseaseGroupId !== ('' as any)
    );
  }
  getLabSamples() {
    this.lookupsService
      .GetByPatientId(this.patientAddCheck.diseaseGroupId)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.checkSamples = result.data;
            if (this.patientAddCheck.diseaseCheckId > 0) {
              this.selectedCheckSample = this.checkSamples.filter(
                (item) => item.id === this.patientAddCheck.diseaseCheckId
              );
              this.getLabChecks();
              this.getLabCheckResults();
            }
          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getAllDiseases() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Diseasies = result.data;
          if (this.patientAddCheck.diseaseGroupId > 0) {
            this.getLabSamples();
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

  getAllDiseasesGroup() {
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
    this.labService.getBy(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.patient = result.data;
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
        this.patientAddCheck.labResultDate = this.datePipe.transform(
          this.patientAddCheck.labResultDate,
          'yyyy-MM-dd'
        );
        this.getAllDiseases();
        this.selectedCheckSample = this.checkSamples?.filter(
          (item) => item.id === this.patientAddCheck.diseaseCheckId
        );
        this.selectedLabCheck = this.labChecks?.find(
          (item) => item.id === this.patientAddCheck.dieaseLabTestId
        )?.id;
        this.selectedLabCheckResult = this.labCheckResults?.find(
          (item) => item.id === this.patientAddCheck.diseaseLabTestResultId
        )?.id;
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
    if (this.validateRequiredData()) {
      this.patientAddCheck.patientId = this.id;
      if (this.patientAddCheck.id == null) {
        this.labService.addPatientLabCheck(this.patientAddCheck).subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getPatientChecks();
              this.resetLabCheck();
              //send notification here
              response.messages.forEach((msg) => {
                this.notificationService.sendNotification([], JSON.parse(msg));
              });
            }
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
    this.labService.updatePatientLabCheck(this.patientAddCheck).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getPatientChecks();
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
        this.getPatientChecks();
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
      labResultDate: null,
    };
    this.selectedCheckSample = null;
    this.selectedLabCheck = null;
    this.selectedLabCheckResult = null;
  }

  validateRequiredData(): boolean {
    if (
      this.patientAddCheck.dieaseLabTestId == null ||
      this.patientAddCheck.diseaseCheckId == null ||
      this.patientAddCheck.diseaseLabTestResultId == null ||
      this.patientAddCheck.getSampleDate == null ||
      this.patientAddCheck.labResultDate == null
    )
      return false;
    return true;
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.nameAr = ele.diseaseName;
  }
}
