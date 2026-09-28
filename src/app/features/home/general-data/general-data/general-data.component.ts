import { InvestigationService } from './../../investigation/services/investigation.service';
import { GeneralDataService } from './../services/general-data.service';
import { Component, ElementRef, HostListener, Input, NgZone, OnDestroy } from '@angular/core';
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
import { PagePermissionService } from 'src/app/core/services/page-permission.service';

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
  sectionsReady = [true, false, false, false, false];
  private lastAuxiliaryHydratedPatientId: number | null = null;

  private readonly LAB_SAMPLE_PAGE_IDS = [51, 8];
  private readonly INVESTIGATION_PAGE_ID = 10;
  private readonly GENERAL_DATA_PAGE_ID = 2;
  postSaveDialogVisible = false;
  savedPatientId: number | null = null;
  canEnterLabSample = false;
  canFillInvestigation = false;
  canEnterAnotherPatient = false;

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
    private investigaion: InvestigationService,
    private ngZone: NgZone,
    private pagePermission: PagePermissionService,
    private hostRef: ElementRef
  ) {
    this.activeTab = this.generalDataEnum.IncidentInfo;
    this.generalDataService.resetValidationState();

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
      this.sharedDataService.isEditMode = true;
      this.getById(this.sharedDataService.patientId);
    } else {
      this.isLoadingData = false;
      this.revealSections();
      this.sharedDataService.isEditMode = false;
    }
  }

  registerNewCase(): void {
    this.sharedDataService.patientId = 0;
    localStorage.removeItem('patientId');
    this.sharedDataService.setPatientObject(new PatientModel());
    this.sharedDataService.isEditMode = false;
    this.router
      .navigateByUrl('/home/redirect', { skipLocationChange: true })
      .then(() => {
        this.router
          .navigate(['/home/general-data'], { queryParams: { clear: 1 } })
          .then(() =>
            document
              .getElementById('general-data-top')
              ?.scrollIntoView({ behavior: 'smooth' })
          );
      });
  }

  private revealSections(): void {
    this.sectionsReady = [true, false, false, false, false];
    this.ngZone.runOutsideAngular(() => {
      for (let i = 1; i < this.sectionsReady.length; i++) {
        setTimeout(() => {
          this.ngZone.run(() => { this.sectionsReady[i] = true; });
        }, i * 150);
      }
    });
  }

  private isMobileView(): boolean {
    return typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 767.98px)').matches;
  }

  private isFieldControl(el: HTMLElement | null): boolean {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
      el.isContentEditable === true;
  }

  @HostListener('focusin', ['$event'])
  onFieldFocusIn(event: FocusEvent): void {
    if (!this.isMobileView()) return;
    const target = event.target as HTMLElement;
    if (!this.isFieldControl(target)) return;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  private scrollToFirstError(): void {
    if (!this.isMobileView()) return;
    setTimeout(() => {
      const host = this.hostRef?.nativeElement as HTMLElement;
      if (!host) return;
      const err = host.querySelector(
        '.form-text.text-danger'
      ) as HTMLElement | null;
      if (!err) return;
      const target =
        (err.closest('.form-group, .form-outline, [class*="col-"]') as HTMLElement) ||
        err;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
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
      },
    );
  }

  public currentTab: string = '/home/general-data/incident-info';
  private routerSubscription: Subscription;
  private patientObjectSub?: Subscription;
  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      this.currentTab = event.url?.replace('?clear=1', '') ?? this.currentTab;
    });

    this.getDiseases();
    const storedPidRaw = localStorage.getItem('patientId');
    const storedPid =
      storedPidRaw != null && storedPidRaw !== ''
        ? parseInt(storedPidRaw, 10)
        : NaN;
    const openingExistingPatientId =
      (this.sharedDataService.patientId != null &&
        this.sharedDataService.patientId > 0) ||
      (Number.isFinite(storedPid) && storedPid > 0);
    if (!openingExistingPatientId) {
      this.sharedDataService.setPatientObject(this.patient);
    }
    this.patientObjectSub = this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
      const rawId = patientObject?.id;
      const pid =
        rawId != null &&
          String(rawId).trim() !== '' &&
          !Number.isNaN(Number(rawId))
          ? Number(rawId)
          : null;
      if (pid != null && pid > 0) {
        if (this.lastAuxiliaryHydratedPatientId !== pid) {
          this.lastAuxiliaryHydratedPatientId = pid;
          this.getFields();
          this.getSentinel(pid);
        }
      } else {
        this.lastAuxiliaryHydratedPatientId = null;
      }
    });
  }

  routeDataConfig() {
    this.routerActive.data.subscribe(
      (res: any) => {
        this.patient = res.data;
      },
      (err) => { },
    );
  }
  getById(id: number) {
    this.generalDataService.getBy(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.generalDataService.normalizePatientApiPayload(result.data);
          result.data.caseDiscoveryDate = this.datePipe.transform(
            result.data.caseDiscoveryDate,
            'yyyy-MM-dd',
          );
          result.data.hospitalEntryDate = this.datePipe.transform(
            result.data.hospitalEntryDate,
            'yyyy-MM-dd',
          );
          result.data.hospitalLeaveDate = this.datePipe.transform(
            result.data.hospitalLeaveDate,
            'yyyy-MM-dd',
          );
          result.data.incidentDate = this.datePipe.transform(
            result.data.incidentDate,
            'yyyy-MM-dd',
          );
          result.data.infectionDate = this.datePipe.transform(
            result.data.infectionDate,
            'yyyy-MM-dd',
          );
          this.sharedDataService.setPatientObject(result.data);
          this.patient = result.data;
          this.activeAllTabs = true;
          this.isLoadingData = false;
          this.revealSections();
        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
        this.isLoadingData = false;
        this.revealSections();
      },
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
        () => { },
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
            this.patient,
          );

          if (!(validationRes == -1))
            throw 'validation failed ' + validationRes;
          this.routingBasedOnCurrentPage(1);
          this.activeTab = this.generalDataEnum.DemographicInfo;
          break;

        case this.generalDataEnum.DemographicInfo:
          validationRes = this.generalDataService.validateDemographicInfo(
            this.patient,
          );
          if (!(validationRes == -1))
            throw 'validation failed ' + validationRes;
          this.routingBasedOnCurrentPage(2);
          this.activeTab = this.generalDataEnum.ResidenceInfo;
          break;

        case this.generalDataEnum.ResidenceInfo:
          validationRes = this.generalDataService.validateResidenceInfo(
            this.patient,
          );
          if (!(validationRes == -1))
            throw 'validation failed ' + validationRes;

          this.routingBasedOnCurrentPage(3);
          this.activeTab = this.generalDataEnum.ClinicalSymptoms;
          break;

        case this.generalDataEnum.ClinicalSymptoms:
          validationRes = this.generalDataService.validateClinicalSymptoms(
            this.patient,
          );
          if (!(validationRes == -1))
            throw 'validation failed ' + validationRes;
          this.routingBasedOnCurrentPage(4);
          this.activeTab = this.generalDataEnum.DiagnosticInfo;
          break;

        case this.generalDataEnum.DiagnosticInfo:
          validationRes = this.generalDataService.validateDiagnostics(
            this.patient,
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
      const missingFieldLabel = this.getActiveTabInvalidFieldLabel();
      if (missingFieldLabel) {
        this.showMissingFieldError(missingFieldLabel);
      } else {
        this.translateService
          .get('NEDSS.COMMON.FILL_REQUIRED')
          .subscribe((msg) => {
            this.userMsg.warn(msg);
          });
      }
    }
  }

  private getActiveTabInvalidFieldLabel(): string | null {
    switch (this.activeTab) {
      case this.generalDataEnum.IncidentInfo:
        return this.generalDataService.getIncidentInfoInvalidFieldLabel(
          this.patient,
        );
      case this.generalDataEnum.DemographicInfo:
        return this.generalDataService.getDemographicInfoInvalidFieldLabel(
          this.patient,
        );
      case this.generalDataEnum.ResidenceInfo:
        return this.generalDataService.getResidenceInfoInvalidFieldLabel(
          this.patient,
        );
      case this.generalDataEnum.ClinicalSymptoms:
        return this.generalDataService.getClinicalSymptomsInvalidFieldLabel(
          this.patient,
        );
      case this.generalDataEnum.DiagnosticInfo:
        return this.generalDataService.getDiagnosticsInvalidFieldLabel(
          this.patient,
        );
      default:
        return null;
    }
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
    if (this.loadingPanel) return;
    try {
      const missingFieldLabel = this.generalDataService.getFirstInvalidFieldLabel(this.patient);
      if (missingFieldLabel) {
        this.showMissingFieldError(missingFieldLabel);
        this.scrollToFirstError();
        return;
      }
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

        this.normalizeFeverSymptomsForApi(this.patient);

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
              this.savedPatientId = response?.data?.id ?? null;
              this.openPostSaveDialog();
            },
            (error) => {
              this.translateService
                .get('NEDSS.COMMON.SENT_FAILD')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              this.loadingPanel = false;
            },
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
                          (o) => o.id == element.id && o.isSentinel,
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
            },
          );
        }
      }
    } catch (error) {
      console.error(error);
      this.loadingPanel = false;
      const missingFieldLabel =
        this.generalDataService.getFirstInvalidFieldLabel(this.patient);
      if (missingFieldLabel) {
        this.showMissingFieldError(missingFieldLabel);
        this.scrollToFirstError();
      } else {
        this.translateService
          .get('NEDSS.COMMON.FILL_REQUIRED')
          .subscribe((msg) => {
            this.userMsg.warn(msg);
          });
      }
    }
  }

  private openPostSaveDialog() {
    this.canEnterLabSample = this.pagePermission.canAccessPage(
      this.LAB_SAMPLE_PAGE_IDS
    );
    this.canFillInvestigation = this.pagePermission.canAccessPage(
      this.INVESTIGATION_PAGE_ID
    );
    this.canEnterAnotherPatient = this.pagePermission.canAccessPage(
      this.GENERAL_DATA_PAGE_ID
    );
    this.postSaveDialogVisible = true;
  }

  goToLabSample() {
    this.postSaveDialogVisible = false;
    this.router.navigate(['/home/add-checks', this.savedPatientId]);
  }

  goToInvestigation() {
    this.postSaveDialogVisible = false;
    this.router.navigate([
      '/home/investigations/investigation-detailes',
      this.savedPatientId,
    ]);
  }

  enterAnotherPatient() {
    this.postSaveDialogVisible = false;
    this.router
      .navigateByUrl('/home/redirect', { skipLocationChange: true })
      .then(() => {
        this.router
          .navigate(['/home/general-data'], { queryParams: { clear: 1 } })
          .then(() =>
            document
              .getElementById('general-data-top')
              ?.scrollIntoView({ behavior: 'smooth' })
          );
      });
  }

  goToHome() {
    this.postSaveDialogVisible = false;
    this.router.navigate(['/home/welcome']);
  }

  private showMissingFieldError(fieldLabelKey: string) {
    const specificMessage = this.generalDataService.lastInvalidFieldMessage;
    if (specificMessage) {
      this.userMsg.warn(specificMessage);
      return;
    }
    this.translateService.get(fieldLabelKey).subscribe((fieldName: string) => {
      this.translateService
        .get('NEDSS.COMMON.FILL_REQUIRED_FIELD', { field: fieldName })
        .subscribe((msg: string) => {
          this.userMsg.warn(msg);
        });
    });
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
      },
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
                      (s) => s.isSentinel == true,
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
                        disease[0].diseaseGroupId,
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
            },
          );
        } else {
          this.generalDataService.addSentinel(r).subscribe(
            (result: any) => {
              if (result.data != null && result.data != undefined) {
                if (this.patient.patientDiseases.length > 0) {
                  var disease = this.patient.patientDiseases.filter(
                    (s) => s.isSentinel == true,
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
                      disease[0].diseaseGroupId,
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
            },
          );
        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
    );
  }

  validatePatientRequiredData(): boolean {
    if (!this.sharedDataService.ShowSentinel) {
      return true;
    }
    const r = this.sharedDataService.getSentinelSnapshot();
    const vals = Object.values(r ?? {});
    for (let i = 0; i < vals.length; i++) {
      if (i > 1 && vals[i] == null) {
        this.translateService
          .get('NEDSS.HOME.GENERAL_DATA_COMPLETION.SENTINEL_FIELDS_REQUIRED')
          .subscribe((msg: string) => {
            this.userMsg.warn(msg);
          });
        return false;
      }
    }
    return true;
  }
  ngOnDestroy(): void {
    this.patientObjectSub?.unsubscribe();
    this.sharedDataService.duplicateNationalIdMatchCount = 0;
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

  /**
   * API expects feverSymptoms.feverDurationType as int 1–3 (enum). PrimeNG "Select" uses null;
   * empty strings or 0 cause 400 model-binding errors.
   */
  private normalizeFeverSymptomsForApi(patient: PatientModel): void {
    if (!patient.feverSymptoms) {
      return;
    }
    const f = patient.feverSymptoms;
    const raw = f.feverDurationType as unknown;
    let n: number | null = null;
    if (raw !== null && raw !== undefined && raw !== '') {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 3) {
        n = parsed;
      }
    }
    f.feverDurationType = n ?? 3;
  }
}
