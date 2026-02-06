import { InvestigationService } from './../../investigation/services/investigation.service';
import { GeneralDataService } from './../services/general-data.service';
import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { SharedDataService } from '../services/shared-data.service';
import { PatientModel, SentinelData } from '../models/patient-model';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notificationService.service';
import { DatePipe } from '@angular/common';

import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { DiseaseSpecialSymptomsService } from '../../dashboard/components/disease-special-symptoms/services/disease-special-symptoms.service';
import { Observable, Subscription } from 'rxjs';
import { GeneralDataEnum } from '../models/general-data.eums';

@Component({
  selector: 'app-general-data',
  templateUrl: './general-data.component.html',
  styleUrls: ['./general-data.component.css']
})
export class GeneralDataComponent implements OnDestroy {
  @Input() finalTab2: boolean;
  loadingPanel: boolean = false;
  patient: PatientModel = new PatientModel();
  updating: boolean = false;
  dataSource: any;
  diseases!: any[];
  activeTab: number;
  isLoadingData: boolean = true;
  constructor(
    private generalDataService: GeneralDataService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public sharedDataService: SharedDataService,
    private routerActive: ActivatedRoute,
    private lookupsService: LookupsGetterService,
    private notificationService: NotificationService,
    private router: Router,
    private datePipe: DatePipe,
    private diseaseSpecialSymptomsService: DiseaseSpecialSymptomsService,
    private investigaion: InvestigationService
  ) {
    this.activeTab = this.generalDataEnum.IncidentInfo;

    if (
      this.sharedDataService.patientId == null ||
      this.sharedDataService.patientId == undefined
    ) {
      this.sharedDataService.patientId =
        localStorage.getItem('patientId') != null
          ? parseInt(localStorage.getItem('patientId'))
          : 0;
    }
    if (
      this.sharedDataService.patientId != null &&
      this.sharedDataService.patientId > 0
    ) {
      localStorage.setItem(
        'patientId',
        this.sharedDataService.patientId.toString()
      );
      this.activeAllTabs = true;
      this.sharedDataService.isEditMode = true
      this.getById(this.sharedDataService.patientId);
    } else {
      this.isLoadingData = false;
      this.sharedDataService.isEditMode = false;
    }
  }

  getDiseases() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
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

  public currentTab: string = '/home/general-data/incident-info';
  private routerSubscription: Subscription;
  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      this.currentTab = event.url?.replace('?clear=1', '') ?? this.currentTab;
    });

    this.getDiseases();
    this.sharedDataService.setPatientObject(this.patient);
    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
    });
  }

  routeDataConfig() {
    this.routerActive.data.subscribe(
      (res: any) => {
        this.patient = res.data;
      },
      (err) => { }
    );
  }
  getById(id: number) {
    this.generalDataService.getBy(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          result.data.caseDiscoveryDate = this.datePipe.transform(
            result.data.caseDiscoveryDate,
            'yyyy-MM-dd'
          );
          result.data.hospitalEntryDate = this.datePipe.transform(
            result.data.hospitalEntryDate,
            'yyyy-MM-dd'
          );
          result.data.hospitalLeaveDate = this.datePipe.transform(
            result.data.hospitalLeaveDate,
            'yyyy-MM-dd'
          );
          result.data.incidentDate = this.datePipe.transform(
            result.data.incidentDate,
            'yyyy-MM-dd'
          );
          result.data.infectionDate = this.datePipe.transform(
            result.data.infectionDate,
            'yyyy-MM-dd'
          );
          this.sharedDataService.setPatientObject(result.data);
          this.patient = result.data;
          this.activeAllTabs = true;
          this.getSentinel(this.sharedDataService.patientId);
          this.getFields();
          this.isLoadingData = false;
        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
        this.isLoadingData = false;
      }
    );
  }
  getFields() {
    let ids = this.patient.patientDiseases.map((a) => a.diseaseGroupId);
    this.diseaseSpecialSymptomsService
      .getForBuildFormByDiseaseId({
        diseaseGroupIds: ids,
        patientId: this.patient.id,
      })
      .subscribe(
        (res) => {
          this.patient.fields = res.data;
          if (this.patient?.fields?.length) {
            this.patient.fields = this.patient?.fields?.map((x) => {
              if (x.fieldType == 'checkBox') {
                x.answer = +x.listItem;
              }
              return x;
            });
          }
        },
        () => { }
      );
  }
  completedTabs: number = 0;
  finalTab: boolean;

  activeAllTabs: boolean = false;
  routes: string[] = [
    '/home/general-data/incident-info',
    '/home/general-data/demographic-info',
    '/home/general-data/residence-info',
    '/home/general-data/clinical-symptoms',
    '/home/general-data/diagonistic-info',
    '/home/general-data/special-symptoms',
    '/home/general-data/sentinel',
  ];
  addPatient() {
    try {
      let validationRes;
      switch (this.activeTab) {
        case this.generalDataEnum.IncidentInfo:
          validationRes = this.generalDataService.validateIncidentInfo(
            this.patient
          );

          if (!(validationRes == -1))
            throw 'validation failed ' + validationRes;
          this.routingBasedOnCurrentPage(1);
          this.activeTab = this.generalDataEnum.DemographicInfo;
          break;

        case this.generalDataEnum.DemographicInfo:
          validationRes = this.generalDataService.validateDemographicInfo(
            this.patient
          );
          if (!(validationRes == -1))
            throw 'validation failed ' + validationRes;
          this.routingBasedOnCurrentPage(2);
          this.activeTab = this.generalDataEnum.ResidenceInfo;
          break;

        case this.generalDataEnum.ResidenceInfo:
          validationRes = this.generalDataService.validateResidenceInfo(
            this.patient
          );
          if (!(validationRes == -1))
            throw 'validation failed ' + validationRes;

          this.routingBasedOnCurrentPage(3);
          this.activeTab = this.generalDataEnum.ClinicalSymptoms;
          break;

        case this.generalDataEnum.ClinicalSymptoms:
          validationRes = this.generalDataService.validateClinicalSymptoms(
            this.patient
          );

          if (!(validationRes == -1))
            throw 'validation failed ' + validationRes;

          this.routingBasedOnCurrentPage(4);
          this.activeTab = this.generalDataEnum.DiagnosticInfo;
          break;

        case this.generalDataEnum.DiagnosticInfo:
          validationRes = this.generalDataService.validateDiagnostics(
            this.patient
          );

          if (!(validationRes == -1))
            throw 'validation failed ' + validationRes;

          this.routingBasedOnCurrentPage(5);
          if (this.patient.fields?.length) {
            this.activeTab = this.generalDataEnum.SpecialSymptom;
            this.finalTab = false;
          } else {
            if (this.sharedDataService.ShowSentinel) {
              this.finalTab2 = true;
              this.routingBasedOnCurrentPage(6);
              this.activeTab = this.generalDataEnum.Sentinal;
            } else {
              this.save();
            }
          }
          break;

        case this.generalDataEnum.SpecialSymptom:
          if (this.generalDataService.validatespecialSymptoms(this.patient)) {
            if (this.sharedDataService.ShowSentinel) {
              this.finalTab2 = true;
              this.routingBasedOnCurrentPage(6);
              this.activeTab = this.generalDataEnum.Sentinal;
            } else this.save();
          } else {
            throw 'validation failed';
          }

          break;
        default:
          //Revalidate (optional)
          // if (this.generalDataService.validateRequiredFields(this.patient)) throw 'final Validation error'
          this.save();
      }

      this.finalTab =
        (this.completedTabs >= 5 && !this.sharedDataService.ShowSentinel) ||
        (this.completedTabs >= 6 && this.sharedDataService.ShowSentinel);

      //if (this.activeAllTabs) {
      //  this.save();
      //}
    } catch (error) {
      console.error(error);
      this.translateService
        .get('NEDSS.COMMON.FILL_REQUIRED')
        .subscribe((msg) => {
          this.userMsg.warn(msg);
        });
    }

    // if (this.generalDataService.validateRequiredFields(this.patient)) {
    //   this.save();
    // }
    // else {
    //   this.translateService.get('NEDSS.COMMON.FILL_REQUIRED').subscribe(msg => {
    //     this.userMsg.warn(msg);
    //   });
    // }
  }

  routingBasedOnCurrentPage(varNum: number) {
    if (this.finalTab) this.save();
    this.completedTabs =
      this.completedTabs > varNum || this.completedTabs < varNum - 1
        ? this.completedTabs
        : varNum;
    // let routeToGo =
    //   this.completedTabs < varNum
    //     ? this.routes[this.completedTabs].split('/')
    //     : this.routes[varNum].split('/');
    // this.router.navigate(routeToGo);
  }

  save() {
    try {
      this.validateAllTabs();
      this.loadingPanel = true;
      let ValidationResult = this.validatePatientRequiredData();
      if (ValidationResult == true) {
        this.patient.nationalId =
          this.patient.nationalId != null
            ? this.patient.nationalId.toString()
            : null;
        this.patient.passportNo =
          this.patient.passportNo != null
            ? this.patient.passportNo.toString()
            : null;
        this.patient.workAddress =
          this.patient.workAddress != null
            ? this.patient.workAddress.toString()
            : null;

        if (this.patient.id == null) {
          this.generalDataService.add(this.patient).subscribe(
            (response: any) => {
              if (response) {
                this.translateService
                  .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                  .subscribe((res: string) => {
                    this.userMsg.success(res);
                    this.completedTabs = 0;
                    this.finalTab =
                      (this.completedTabs >= 5 &&
                        !this.sharedDataService.ShowSentinel) ||
                      (this.completedTabs >= 6 &&
                        this.sharedDataService.ShowSentinel);
                  });
                if (this.sharedDataService.ShowSentinel == true) {
                  this.addSentinel(response.data.id);
                  this.loadingPanel = false;
                }

                if (this.sharedDataService.ShowSentinel == true) {
                  this.investigaion.view = false;
                  this.loadingPanel = false;
                }
              }
              this.loadingPanel = false;

              //window.location.href = '/#/home/general-data/incident-info?clear=1';

              //send notification here
              response.messages.forEach((msg) => {
                this.notificationService.sendNotification([], JSON.parse(msg));
              });

              if (this.sharedDataService.ShowSentinel == false) {
                this.patient = new PatientModel();
                this.sharedDataService.setPatientObject(new PatientModel());
                this.loadingPanel = false;
                // window.location.href =
                //   '/#/home/general-data/incident-info?clear=1';
              }
              this.router
                .navigateByUrl('/home/chart', { skipLocationChange: true })
                .then(() => {
                  // to reload component when component is already loaded
                  this.router.navigate(['/home/general-data'], {
                    queryParams: { clear: 1 },
                  });
                });
            },
            (error) => {
              this.translateService
                .get('NEDSS.COMMON.SENT_FAILD')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              this.loadingPanel = false;
            }
          );
        } else {
          this.updating = true;
          this.generalDataService.update(this.patient).subscribe(
            (response: any) => {
              if (response) {
                this.translateService
                  .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                  .subscribe((res: string) => {
                    this.userMsg.success(res);

                    this.patient.patientDiseases.forEach((element) => {
                      if (
                        this.diseases.filter(
                          (o) => o.id == element.id && o.isSentinel
                        ).length > 0
                      ) {
                        this.sharedDataService.ShowSentinel = true;
                      } else {
                      }
                    });

                    if (this.sharedDataService.ShowSentinel == true) {
                      this.addSentinel(this.patient.id);
                      this.sharedDataService.ShowSentinel = false;
                    }
                    this.sharedDataService.setPatientObject(new PatientModel());
                    this.patient = new PatientModel();
                    this.completedTabs = 0;
                    this.activeAllTabs = false;
                    this.sharedDataService.ShowSentinel = false;
                    this.finalTab =
                      (this.completedTabs >= 5 &&
                        !this.sharedDataService.ShowSentinel) ||
                      (this.completedTabs >= 6 &&
                        this.sharedDataService.ShowSentinel);
                    this.router.navigate(['home', 'search', 'fast-search']);
                    //window.location.href = '/#/home/chart';
                    //this.router.navigate(['home', 'chart']) ;
                  });
              }

              this.loadingPanel = false;
            },
            (error) => {
              this.translateService
                .get('NEDSS.COMMON.SENT_FAILD')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              this.loadingPanel = false;
              this.sharedDataService.setPatientObject(new PatientModel());
              this.patient = new PatientModel();
            }
          );
        }
      }
    } catch (error) {
      console.error(error);
      this.translateService
        .get('NEDSS.COMMON.FILL_REQUIRED')
        .subscribe((msg) => {
          this.userMsg.warn(msg);
        });
    }
  }
  validateAllTabs() {
    let validationRes = this.generalDataService.validateDiagnostics(
      this.patient
    );
    if (!(validationRes == -1))
      throw 'validation failed ' + validationRes;
    validationRes = this.generalDataService.validateClinicalSymptoms(
      this.patient
    );
    if (!(validationRes == -1))
      throw 'validation failed ' + validationRes;
    validationRes = this.generalDataService.validateResidenceInfo(
      this.patient
    );
    if (!(validationRes == -1))
      throw 'validation failed ' + validationRes;
    validationRes = this.generalDataService.validateDemographicInfo(
      this.patient
    );
    if (!(validationRes == -1))
      throw 'validation failed ' + validationRes;
    validationRes = this.generalDataService.validateIncidentInfo(
      this.patient
    );
    if (!(validationRes == -1))
      throw 'validation failed ' + validationRes;
  }
  getSentinel(id: number) {
    this.generalDataService.getSentinelByPID(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.sharedDataService.setSentinelDataObject(result.data);
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
  addSentinel(patientId) {
    this.sharedDataService.getSentinelDataObject().subscribe(
      (r) => {
        r.patientID = patientId;
        for (let i = 0; i < Object.values(r).length; i++) {
          if (i > 1 && Object.values(r)[i] == null) {
            return;
          }
        }

        if (r.id > 0) {
          this.generalDataService.updateSentinel(r).subscribe(
            (result: any) => {
              if (result.data != null && result.data != undefined) {
                if (!this.updating) {
                  if (this.patient.patientDiseases.length > 0) {
                    var disease = this.patient.patientDiseases.filter(
                      (s) => s.isSentinel == true
                    );
                    if (disease != null) {
                      this.investigaion.currentid = result.data.id;
                      this.investigaion.patient = this.patient;
                      this.investigaion.patientDiseases = disease;
                      this.investigaion.diseaseGroupID =
                        disease[0].diseaseGroupId;
                      let diseaseName = disease[0].router;
                      this.router.navigateByUrl(
                        'home/' +
                        diseaseName +
                        '/' +
                        patientId +
                        '/diseaseId/' +
                        disease[0].diseaseGroupId
                      );
                    }
                  }
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
        } else {
          this.generalDataService.addSentinel(r).subscribe(
            (result: any) => {
              if (result.data != null && result.data != undefined) {
                if (this.patient.patientDiseases.length > 0) {
                  var disease = this.patient.patientDiseases.filter(
                    (s) => s.isSentinel == true
                  );
                  if (disease != null) {
                    //;
                    this.investigaion.currentid = result.data.id;
                    this.investigaion.patient = this.patient;
                    this.investigaion.patientDiseases = disease;
                    this.investigaion.diseaseGroupID =
                      disease[0].diseaseGroupId;
                    let diseaseName = disease[0].router;
                    this.router.navigateByUrl(
                      'home/' +
                      diseaseName +
                      '/' +
                      patientId +
                      '/diseaseId/' +
                      disease[0].diseaseGroupId
                    );
                  }
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
  //TODO
  // validate entry of required fields

  validatePatientRequiredData(): any {
    if (this.sharedDataService.ShowSentinel) {
      let retResult = true;
      this.sharedDataService.getSentinelDataObject().subscribe(
        (r) => {
          r.patientID = 1;
          for (let i = 0; i < Object.values(r).length; i++) {
            if (i > 1 && Object.values(r)[i] == null) {
              this.userMsg.warn('برجاء ملىء بيانات المواقع المختارة');
              retResult = false;
              return false;
            }
          }
          retResult = true;
          return true;
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
              retResult = false;
              return false;
            });
          retResult = false;
          return false;
        }
      );
      return retResult;
    } else {
      return true;
    }
  }
  ngOnDestroy(): void {
    this.sharedDataService.setPatientObject(new PatientModel());
    this.sharedDataService.patientId = null;
    localStorage.removeItem('patientId');
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  public get generalDataEnum(): typeof GeneralDataEnum {
    return GeneralDataEnum;
  }
  onTabChange(activeTab) {
    this.activeTab = activeTab;
  }
}
