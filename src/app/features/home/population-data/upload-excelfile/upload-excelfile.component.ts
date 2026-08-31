import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { AddPopulationServiceService } from '../add-population-data/addPopulationService.service';
import { saveAs } from 'file-saver';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PopulationExcelTemplateFilterVM } from './Model/population-excel-template-filter-vm';

@Component({
  selector: 'app-upload-excelfile',
  templateUrl: './upload-excelfile.component.html',
  styleUrls: ['./upload-excelfile.component.css'],
})
export class UploadExcelfileComponent {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

  loadingPanel: boolean = false;
  governmentsLoading: boolean = false;
  healthAdministrationLoading: boolean = false;
  pleaseComplete: boolean = false;
  multipleDropdownSettings = MultipleDropdownSettings;
  healthAdministration: any[];
  selectedHealthAdministration: any;
  ids: string = '';
  //incidentSources!: any[];
  //selectedIncidentSource: any;
  governments: any;
  selectedGovernment: number = -1;
  obj: any;
  selectedFile: any;
  file: FormData = new FormData();
  addPopulationFormGroup: FormGroup;
  excelFilter: PopulationExcelTemplateFilterVM = {} as PopulationExcelTemplateFilterVM;
  years: any;
  selectedYear: number = 0;
  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private addPopulationServiceService: AddPopulationServiceService,
    private lookUpsService: LookupsGetterService,
    public generalDataService: GeneralDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getGovernments();
    this.years = [
      { year: '' },
      { year: new Date().getFullYear() - 4 },
      { year: new Date().getFullYear() - 3 },
      { year: new Date().getFullYear() - 2 },
      { year: new Date().getFullYear() - 1 },
      { year: new Date().getFullYear() },
      { year: new Date().getFullYear() + 1 },
      { year: new Date().getFullYear() + 2 },
      { year: new Date().getFullYear() + 3 },
      { year: new Date().getFullYear() + 4 },
    ];
  }

  ngOnInit() {
    this.addPopulationFormGroup = new FormGroup({
      governmentID: new FormControl(),
      healthAdministrationID: new FormControl(),
      year: new FormControl(),
    });
  }
  DownloadTemplete(empty: boolean) {
    if (this.selectedGovernment != null && this.selectedGovernment > 0) {
      this.addPopulationFormGroup.value.governmentID = this.selectedGovernment;
      this.excelFilter.governmentId = this.selectedGovernment;
    }

    if (
      this.selectedHealthAdministration != null &&
      this.selectedHealthAdministration > 0
    ) {
      this.addPopulationFormGroup.value.healthAdministrationID =
        this.selectedHealthAdministration;
      this.excelFilter.healthAdministrationId = this.selectedHealthAdministration;

      this.pleaseComplete = true;
    }

    // if (
    //   this.selectedIncidentSource != null &&
    //   this.selectedIncidentSource > 0
    // ) {
    //   this.addPopulationFormGroup.value.incidentSourceId =
    //     this.selectedIncidentSource;
    //   this.pleaseComplete = true;
    // }

    if (
      this.years != null &&
      this.selectedYear > 0
    ) {
      this.addPopulationFormGroup.value.year = this.selectedYear;
      this.excelFilter.year = this.selectedYear;
      this.pleaseComplete = true;
    }

    this.excelFilter.isEmptyTemplate = empty;

    if (
      this.selectedGovernment !== null &&
      this.selectedGovernment !== -1 &&
      this.selectedHealthAdministration !== null &&
      this.selectedHealthAdministration !== -1 &&
      this.selectedYear > 0 &&
      this.selectedYear !== null
    ) {
      this.pleaseComplete = false;
      this.addPopulationServiceService
        .DownloadTemplate(
          this.excelFilter
        )
        .subscribe(
          (response: any) => {
            if (response.size > 0) {
              const file = new Blob([response], {
                type: 'application/octet-stream',
              });
              const fileName = 'ftemplateGuide - ' + this.selectedYear + '- ' + this.selectedGovernment + '- ' + this.selectedHealthAdministration + '.xlsx';
              saveAs(file, fileName);
              this.userMsg.success('تمت التنزيل بنجاح');
              // this.router.navigateByUrl("home/population-data/populationExpectation");
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
          }
        );
    } else {
      this.pleaseComplete = true;
    }
  }

  Import() {
    if (this.selectedFile) {
      // this.file.append('formFile', );
      let filter = {} as PopulationExcelTemplateFilterVM;
      filter.governmentId = this.selectedGovernment;
      filter.healthAdministrationId = this.selectedHealthAdministration;
      filter.year = this.selectedYear;
      this.addPopulationServiceService.Import(this.selectedFile, filter).subscribe(
        (response: Blob) => {
          if (response.size > 0) {
            const fileName = 'ErrorFile.xlsx';
            saveAs(response, fileName);
            this.userMsg.success('تمت الإضافة بنجاح');
            this.router.navigateByUrl(
              'home/population-data/populationExpectation'
            );
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.userMsg.error('خطـ في الاضافة');
          this.loadingPanel = false;
        }
      );
    }
  }
  onFileSelect(input) {
    this.selectedFile = input.files[0];
  }
  removeSelectedFile() {
    this.selectedFile = null;
    this.file.delete('formFile');
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookUpsService.getAllGovernmentsForUser(true).subscribe(
      (result: any) => {
        this.governmentsLoading = false;
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'All' },
          ];
          result.data.forEach((nat) => {
            this.governments.push(nat);
          });
          if (result.data.length > 0) {
            this.selectedGovernment = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
            if (this.selectedGovernment != null) {
              this.onGovernmentChanged();
            } else {
              this.selectedGovernment = -1;
            }
          }
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.governmentsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  onGovernmentChanged() {
    // this.selectedIncidentSource = -1;
    // this.incidentSources = [];
    if (this.selectedGovernment > 0) {
      this.getHealthAdministration(this.selectedGovernment);
      this.selectedHealthAdministration = [];
    } else {
      this.healthAdministration = [];
    }
  }

  getHealthAdministration(governmentID: any) {
    this.healthAdministrationLoading = true;
    this.lookUpsService
      .getPageHealthAdministrationsForUsers({ governmentID: governmentID, forSystemUser: true })
      .subscribe(
        (result: any) => {
          this.healthAdministrationLoading = false;
          if (result != null && result != undefined) {
            this.healthAdministration = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthAdministration.push(nat);
            });
            this.selectedHealthAdministration = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.healthAdministrationId;
            if (this.selectedHealthAdministration == null) {
              this.selectedHealthAdministration = -1;
            }
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.healthAdministrationLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  // onHealthAdministrationChanged() {
  //   if (this.selectedHealthAdministration > 0) {
  //     this.getIncidentSources(this.selectedHealthAdministration);
  //     this.selectedIncidentSource = -1;
  //   } else {
  //     this.incidentSources = [];
  //   }
  // }

  // getIncidentSources(healthAdministrationID: any) {
  //   // reportingOrResidence: 1,
  //   this.lookUpsService
  //     .getPageIncidentSourceHospitals({
  //       healthAdministrationID: healthAdministrationID,
  //     })
  //     .subscribe(
  //       (result: any) => {
  //         if (result != null && result != undefined) {
  //           this.incidentSources = result.data;
  //         }
  //         this.loadingPanel = false;
  //       },
  //       (error) => {
  //         this.loadingPanel = false;
  //         this.translateService
  //           .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
  //           .subscribe((res: string) => {
  //             this.userMsg.error(res);
  //           });
  //       }
  //     );
  // }

  // choosed(){
  //
  //   if((this.selectedGovernment !== null  && this.selectedGovernment !== -1 )
  //   && (this.selectedHealthAdministration !== null && this.selectedHealthAdministration !== -1 )
  //   && (this.selectedIncidentSource !== null && this.selectedIncidentSource !== -1 ))
  //   {
  //     return true;

  //   }
  //   else
  //   {
  //     return false;

  //   }
  // }
}
