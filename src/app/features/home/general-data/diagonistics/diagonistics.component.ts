import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PatientModel } from '../models/patient-model';
import { SharedDataService } from '../services/shared-data.service';
import { DiseaseSpecialSymptomsService } from '../../dashboard/components/disease-special-symptoms/services/disease-special-symptoms.service';
import { GeneralDataService } from '../services/general-data.service';
import { map } from 'rxjs';
import { DepartmentEnum } from '../models/department-enum';

@Component({
  selector: 'app-diagonistics',
  templateUrl: './diagonistics.component.html',
  styleUrls: ['./diagonistics.component.css'],
})
export class DiagonisticsComponent implements OnInit, OnDestroy {
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();

  patient: PatientModel = new PatientModel();
  private diseasesInitializedFromPatient = false;

  levelId: any;
  currentLang: string = 'ar';
  governments!: any[];
  selectedTransferGovernment: any;
  selectedTransferGovernmentId: number;

  selectedTransferHealthAdmin: any;
  selectedTransferHealthAdminId: number;

  diseases: any[] = [];
  selectedDiseases: any;

  finalResuls!: any[];
  selectedFinalResult: any;
  selectedFinalResultId: number;

  incidentSources!: any[];
  selectedTransferIncidentSource: any;
  selectedTransferIncidentSourceId: number;

  selectedResultCategory: any;
  selectedFinalDigonistics: any;
  selectedFinalDigonisticsId: number;

  isRegionalLabSelected: boolean = false;
  isSpecialLabSelected: boolean = false;
  isPatientTransfered: boolean = false;

  regionalLabs!: any[];
  selectedRegionalLab: any;
  selectedRegionalLabId: number;

  specialGovernment!: any[];
  selectedSpecialGovernment!: any[];
  selectedSpecialGovernmentId: number;
  specialHealthAdmin!: any[];
  selectedSpecialHealthAdmin!: any[];
  selectedSpecialHealthAdminId: number;
  specialLabs!: any[];
  selectedSpecialLab: any;
  selectedSpecialLabId: number;

  loadingPanel: boolean = false;

  singleDropdownSettings = {};
  diagnosticsMultipleDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'arabicName'
        : 'englishName',
    selectAllText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'اختار الكل'
        : 'Select All',
    unSelectAllText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'الغاء الاختيار'
        : 'UnSelect All',
    placeholder:
      localStorage.getItem('ls.currentLang') == 'ar' ? 'اختر' : 'Choose',
    searchPlaceholderText:
      localStorage.getItem('ls.currentLang') == 'ar' ? 'بحث' : 'Search',
    noDataAvailablePlaceholderText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'لا يوجد بيانات'
        : 'No Data',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,
    limitSelection: 4,
  };
  DepartmentEnum = DepartmentEnum;
  HealthAdmins:any[] = [];
  constructor(
    private sharedDataService: SharedDataService,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private diseaseSpecialSymptomsService: DiseaseSpecialSymptomsService,
    public generalDataService: GeneralDataService
  ) { }

  ngOnDestroy(): void { }

  ngOnInit() {
    this.loadingPanel = true;
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
      this.selectedFinalResultId = this.patient.finalResultId;
      if (this.selectedFinalResultId == 1) {
        this.isPatientTransfered = true;
      }

      if (
        !this.diseasesInitializedFromPatient &&
        this.diseases?.length > 0 &&
        this.patient?.patientDiseases?.length > 0
      ) {
        this.selectedDiseases = this.diseases.filter((item) =>
          this.patient.patientDiseases.map((a) => a.diseaseGroupId).includes(item.id)
        );
        this.diseasesInitializedFromPatient = true;
        this.onDiseasesChanged();
      }
    });
    this.getLookups();
    this.singleDropdownSettings = SingleDropdownSettings;
    this.loadingPanel = false;
    this.populateTransferLocation();
 
  }

  getLookups() {
    this.getGovernments();
    this.getDiseases();
    this.getFinalResults();
  }

  populateTransferLocation(){
    if(this.patient.transferGovernmentId){
      this.selectedTransferGovernmentId = this.patient.transferGovernmentId;
      this.selectedTransferIncidentSourceId = this.patient.transferIncidentSourceId;
      this.selectedTransferHealthAdminId = this.patient.transferHealthAdministrationId;

      this.getHealthAdminUpdate();
      // this.onGovernmentChanged();
      // this.selectedTransferHealthAdminId = this.patient.transferHealthAdministrationId;
      this.onHealthAdminChange();
      // await this.getIncidentSourcesAsync();
    }
  }

  onItemSelect(item: any) { }
  onSelectAll(items: any) { }

  onDiseasesChanged() {
    this.sharedDataService.ShowSentinel = false;
    if (this.selectedDiseases.length > 0) {
      this.selectedDiseases.forEach((element) => {
        if (
          this.diseases.filter((o) => o.id == element.id && o.isSentinel)
            .length > 0
        ) {
          this.sharedDataService.ShowSentinel = true;
        }
      });
    }
    if (this.selectedDiseases.length > 0) {
      this.patient.patientDiseases = this.selectedDiseases.map((p) => ({
        diseaseGroupId: p.id,
      }));
      //add all patient disease properties
      this.patient.patientDiseases.forEach((d) => {
        let des = this.diseases.find((p) => p.id == d.diseaseGroupId);
        d.isSentinel = des.isSentinel;
        d.router = des.router;
      });
      this.sharedDataService.setPatientObject(this.patient);
      this.getAllQuestions();
    } else {
      this.patient.patientDiseases = null;
      this.patient.fields = [];
      this.sharedDataService.setPatientObject(this.patient);
    }
  }

  onDiseasesSelectAll(event: any) {
    this.selectedDiseases = [];

    event.forEach((d) => {
      this.selectedDiseases.push(d);
    });

    this.onDiseasesChanged();
  }

  onDiseasesDSelectAll() {
    this.selectedDiseases = [];
    this.onDiseasesChanged();
  }

  onGovernmentChanged() {
    if (this.selectedTransferGovernmentId != -1) {
      this.patient.transferGovernmentId = this.selectedTransferGovernmentId;
      this.incidentSources = [];
      this.selectedTransferIncidentSourceId = -1;
      this.patient.transferIncidentSourceId = null;
      this.getHealthAdmin();
    } else {
      this.patient.transferGovernmentId = null;
      this.HealthAdmins = [];
      this.incidentSources = [];
      this.selectedTransferIncidentSourceId = -1;
      this.patient.transferIncidentSourceId = null;
    }
  }

  onHealthAdminChange(){
    if (this.selectedTransferHealthAdminId != -1) {
      this.patient.transferHealthAdministrationId = this.selectedTransferHealthAdminId;
      this.getIncidentSources(this.patient.transferHealthAdministrationId);
    } else {
      this.patient.transferHealthAdministrationId = null;
      this.incidentSources = [];
      this.selectedTransferIncidentSourceId = -1;
    }
  }

  onIncidentSourceChanged() {
    if (this.selectedTransferIncidentSourceId != -1)
      this.patient.transferIncidentSourceId =
        this.selectedTransferIncidentSourceId;
    else this.patient.transferIncidentSourceId = null;
  }

  onFinalResultChanged() {
    if (this.selectedFinalResultId != -1) {
      this.patient.finalResultId = this.selectedFinalResultId;
      if (this.selectedFinalResultId == 1) {
        this.isPatientTransfered = true;
      } else {
        this.isPatientTransfered = false;
        this.HealthAdmins=[];
        this.incidentSources=[];
        this.patient.transferGovernmentId = null;
        this.patient.transferHealthAdministrationId = null;
        this.patient.transferIncidentSourceId = null;
        this.selectedTransferGovernmentId = null;
        this.selectedTransferHealthAdminId = null;
        this.selectedTransferIncidentSourceId = null;
      }
    } else {
      this.isPatientTransfered = false;
        this.HealthAdmins=[];
        this.incidentSources=[];
        this.patient.transferGovernmentId = null;
        this.patient.transferHealthAdministrationId = null;
        this.patient.transferIncidentSourceId = null;
        this.selectedTransferGovernmentId = null;
        this.selectedTransferHealthAdminId = null;
        this.selectedTransferIncidentSourceId = null;
    }
  }

  onRegionalLabChanged() {
    if (this.selectedRegionalLabId != -1)
      this.patient.regionalLabId = this.selectedRegionalLabId;
    else this.patient.regionalLabId = null;
  }

  onSpecialLabChanged() {
    if (this.selectedSpecialLabId != -1)
      this.patient.specialLabSourceId = this.selectedSpecialLabId;
    else this.patient.specialLabSourceId = null;
  }

  onRegionalLabSelected() {
    if (this.isRegionalLabSelected) {
      this.isRegionalLabSelected = false;
      this.patient.regionalLabId = null;
    }
  }

  onSpecialLabSelected() {
    if (!this.patient.isSpecialLabLab) {
      this.isSpecialLabSelected = false;
      this.patient.specialLabSourceId = null;
    } else {
      this.isSpecialLabSelected = true;
      this.getSpecialGovernments();
    }
  }

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

          if (this.levelId != 1) {
            this.selectedTransferGovernmentId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
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
  getDiseases() {
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        const list = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];
        this.diseases = list;

        if (
          this.patient?.patientDiseases != null &&
          this.patient.patientDiseases.length > 0 &&
          this.diseases.length > 0
        ) {
          this.selectedDiseases = this.diseases.filter((item) =>
            this.patient.patientDiseases
              .map((a) => a.diseaseGroupId)
              .includes(item.id)
          );
          this.onDiseasesChanged();
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
  getFinalResults() {
    this.lookupsService.getAllFinalResults().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.finalResuls = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.finalResuls.push(gov);
          });
          setTimeout(() => {
            if (this.patient.finalResultId > 0) {
              this.selectedFinalResultId = this.patient.finalResultId;
            } else {
              this.selectedFinalResultId = -1;
            }
          }, 500);
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
  getHealthAdmin() {
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: this.patient.transferGovernmentId,
        forSystemUser:false,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.HealthAdmins = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((healthAdmin) => {
              this.HealthAdmins.push(healthAdmin);
            });
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
          })
  }
  
  getIncidentSources(governmentID: any) {
    (!this.isPatientTransfered ?
      this.lookupsService
        .getPageIncidentSourceHospitals({ governmentID: governmentID }) :
      this.lookupsService
        .GetTransferedIncidentSources(governmentID).pipe(map((res: any) => {
          if (res?.data?.length) {
            res.data = res.data.map(x => {
              return {
                id: x.id,
                arabicName: x.name,
                englishName: x.name
              }
            })
          }
          return res;
        }))
    )
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.incidentSources.push(gov);
            });

            if (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) {
              this.selectedTransferIncidentSourceId = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.incidentSourceId;
              this.onIncidentSourceChanged();
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

  getRegionalLabs(governmentID: any) {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        governmentID: governmentID /*, IncidentSourceTypeID:*/,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.regionalLabs = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.regionalLabs.push(gov);
            });
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

  getSpecialGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.specialGovernment = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.specialGovernment.push(gov);
          });
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

  getSpecialHealthAdmins() {
    this.specialHealthAdmin = [];
    this.specialLabs = [];
    this.selectedSpecialLab = null;
    this.selectedSpecialLabId = -1;
    this.selectedSpecialHealthAdmin = null;
    this.selectedSpecialHealthAdminId = -1;
    if (this.selectedSpecialGovernmentId != -1) {
      this.lookupsService
        .getPageHealthAdministrations({
          governmentID: this.selectedSpecialGovernmentId,
        })
        .subscribe(
          (result: any) => {
            if (result != null && result != undefined) {
              this.specialHealthAdmin = [
                { id: -1, arabicName: 'إختر', englishName: 'Select' },
              ];
              result.data.forEach((gov) => {
                this.specialHealthAdmin.push(gov);
              });
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

  getSpecialLabs() {
    this.specialLabs = [];
    this.selectedSpecialLab = null;
    this.selectedSpecialLabId = -1;
    this.lookupsService
      .getPageIncidentSourceHospitals({
        reportingOrResidence: 1,
        governmentID: this.selectedSpecialGovernmentId,
        healthAdministrationID: this.selectedSpecialHealthAdminId,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.specialLabs = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.specialLabs.push(gov);
            });
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

  getAllQuestions() {
    let ids = this.patient.patientDiseases.map((a) => a.diseaseGroupId);

    this.diseaseSpecialSymptomsService
      .getForBuildFormByDiseaseId({
        diseaseGroupIds: ids,
        patientId: this.patient.id,
      })
      .subscribe(
        (res) => {
          this.patient.fields = res.data;
          this.sharedDataService.setPatientObject(this.patient);
        },
        () => { }
      );
  }

  getHealthAdminUpdate(){
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: this.patient.transferGovernmentId,
        forSystemUser:false,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.HealthAdmins = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((healthAdmin) => {
              this.HealthAdmins.push(healthAdmin);
            });
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
        })
  }
}
