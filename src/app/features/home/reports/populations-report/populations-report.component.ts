import { Component, OnInit } from '@angular/core';
import { LevelsEnum } from '../../users/models/levels.enum';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { GovernmentDTO } from '../../chat/Models/government-dto';
import { Result } from 'src/app/features/Result';
import { HealthAdministrationDTO } from 'src/app/features/Models/health-administration';
import { PopulationReportResponse } from 'src/app/features/Models/populationReportResponse';
import * as html2pdf from 'html2pdf.js';
import { LocalStorage } from '@ng-idle/core';

@Component({
  selector: 'app-populations-report',
  templateUrl: './populations-report.component.html',
  styleUrls: ['./populations-report.component.css'],
})
export class PopulationsReportComponent implements OnInit {
  //Language Settings
  currentLang: string = '';
  dir: string = '';
  //loading settings
  loadingPanel: boolean = false;
  governmentsLoading: boolean = false;
  healthAdministrationsLoading: boolean = false;

  levelValue: string = '1';
  levelsEnum = LevelsEnum; // Makes LevelsEnum available in the template
  selectedDate: Date;
  selectedYear: number;
  governments: GovernmentDTO[];
  selectedGovernmentId: number;
  healthAdministrations: HealthAdministrationDTO[];
  selectedHealthAdminId: number;
  populationReport: any;
  tableData!: PopulationReportResponse;
  showTableData: boolean = false;
  reportMessage: string = '';
  currentUserLevel:number;
  constructor(
    private lookupsService: LookupsGetterService,
    private userMsg: UserMessageService,
    private translateService: TranslateService
  ) {
    this.getLanguageConfiguration();
    this.getUserLevelFromLocalStorage();

  }

  ngOnInit(): void {}

  //Page Configuration
  getLanguageConfiguration() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
  }

  onLevelChange() {
    if (this.levelValue == this.levelsEnum.Central) {
      this.selectedGovernmentId = -1;
      this.governments = [];
    }
    if (
      this.levelValue == this.levelsEnum.Governorate ||
      this.levelValue == this.levelsEnum.Central
    ) {
      this.selectedHealthAdminId = -1;
      this.healthAdministrations = [];
    }
    if (
      this.levelValue == LevelsEnum.Governorate ||
      this.levelValue == this.levelsEnum.Administration
    ) {
      this.getGovernments();
    }
  }

  //Select year.
  setYear(normalizedYear: Date, datepicker: any) {
    this.selectedDate = new Date(normalizedYear.getFullYear(), 0, 1); // Set the date to January 1 of the selected year
    this.selectedYear = normalizedYear.getFullYear(); // Set the date to January 1 of the selected year
    datepicker.close(); // close the date picker after choosing the year.
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService.getAllGovernmentsForUser(true).subscribe({
      next: (result: Result<GovernmentDTO[]>) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
          this.governments.unshift({
            id: -1,
            arabicName: 'إختر',
            englishName: 'Select',
          });
        }
        this.governmentsLoading = false;
        this.loadingPanel = false;

        if (
          this.selectedGovernmentId !== -1 &&
          this.levelValue == LevelsEnum.Administration
        ) {
          this.getHealthAdministration(this.selectedGovernmentId);
        }
      },
      error: (error) => {
        this.governmentsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
    });
  }

  onGovernmentChanged() {
    this.healthAdministrations = [];
    if (this.selectedGovernmentId == -1) {
      return;
    }

    if (this.levelValue == LevelsEnum.Administration) {
      this.getHealthAdministration(this.selectedGovernmentId);
    }
  }

  getHealthAdministration(governmentID: number) {
    this.healthAdministrationsLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: governmentID,
        forSystemUser: true,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = result.data;
            this.healthAdministrations.unshift({
              id: -1,
              arabicName: 'إختر',
              englishName: 'Select',
            });
          }
          this.healthAdministrationsLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.healthAdministrationsLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getReportResult() {
    const isValid: boolean = this.validateForm();
    if (!isValid) {
      this.translateService
        .get('NEDSS.COMMON.FILL_REQUIRED')
        .subscribe((res: string) => {
          this.userMsg.warn(res);
        });
      return;
    }

    this.buildReportObject();
    this.reportMessage = '';

    this.lookupsService.getPopulationsReport(this.populationReport).subscribe({
      next: (data) => {
        const result = data?.data;
        if (result?.message) {
          this.showTableData = false;
          this.tableData = null;
          this.reportMessage = result.message;
        } else if (result != null && result != undefined) {
          this.showTableData = true;
          this.tableData = result;
          this.reportMessage = '';
        } else {
          this.showTableData = false;
          this.tableData = null;
          this.reportMessage = '';
        }
      },
      error: (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      complete: () => {},
    });
  }

  validateForm(): boolean {
    if (this.levelValue == LevelsEnum.Central) {
      return this.selectedYear !== undefined;
    } else if (this.levelValue == LevelsEnum.Governorate) {
      return (
        this.selectedYear !== undefined && this.selectedGovernmentId !== -1
      );
    } else if (this.levelValue == LevelsEnum.Administration) {
      return (
        this.selectedYear !== undefined &&
        this.selectedGovernmentId !== -1 &&
        this.selectedHealthAdminId !== -1
      );
    } else {
      return false;
    }
  }

  buildReportObject() {
    this.populationReport = {};
    if (this.levelValue == LevelsEnum.Central) {
      this.populationReport.reportLevel = +this.levelValue;
      this.populationReport.year = this.selectedYear;
    } else if (this.levelValue == LevelsEnum.Governorate) {
      this.populationReport.reportLevel = +this.levelValue;
      this.populationReport.year = this.selectedYear;
      this.populationReport.governmentId = this.selectedGovernmentId;
    } else if (this.levelValue == LevelsEnum.Administration) {
      this.populationReport.reportLevel = +this.levelValue;
      this.populationReport.year = this.selectedYear;
      this.populationReport.governmentId = this.selectedGovernmentId;
      this.populationReport.healthAdministrationId = this.selectedHealthAdminId;
    } else {
      this.populationReport = {};
    }
  }

  getUserLevelFromLocalStorage() {
    const storedData = localStorage.getItem('ls.authorizationData'); 
    if (storedData) {
      const parsedData = JSON.parse(storedData); 
      // user object
      const user = parsedData.user;
      if (user) {
        //levelId from the user
        const levelId = user.levelId;
        if (levelId !== undefined) {
          this.currentUserLevel = levelId;
        }
      }
    }
  }

  //#region of printing PDF

  exportToPdf() {
    // this.loadingPanel = true;
    var element = document.getElementById('pdfTable');
    var clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.display = 'block';

    var opt = {
      margin: 0,
      filename: 'تقرير البيانات السكانية',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1, useCORS: true },
      pagebreak: { mode: 'always', after: ['#break'] },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'landscape' },
    };
    const self = this;
    html2pdf()
      .set(opt)
      .from(clonedElement)
      .save()
      .then(function () {
        // self.loadingPanel = false;
        clonedElement.remove();
      });
  }

  print() {
    var element = document.getElementById('pdfTable');
    var clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.display = 'block';
    setTimeout(() => {
      window.print();
    }, 2000);
  }

  generateReportToExcel() {
    this.lookupsService.ExportDiseasesReportToExcel({
      //   governmentsIds: this.selectedgovernment.map((x) => x.id),
      //   HomeGovernmentsIds: this.selectedHomeGovernment.map((x) => x.id),
      //   healthAdministrationsIds: this.selectedhealthAdministration.map(
      //     (x) => x.id
      //   ),
      //   HomeHealthAdministrationsIds: this.selectedHomeHealthAdministration.map(
      //     (x) => x.id
      //   ),
      //   incidentSourcesIds: this.selectedIncidentSource.map((x) => x.id),
      //   HomeHealthOfficesIds: this.selectedHomeIncidentSource.map((x) => x.id),
      //   diseasesIds: this.selectedDiseases.map((x) => x.id),
      //   diseaseGroupsIds: this.selectedPrimaryDiseases.map((x) => x.id),
      //   reportType: ReportsEnum.DiseaseBasedOnGenederReport,
      //   fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      //   toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      // })
      // .subscribe((res) => {
      //   if (res?.data) {
      //     const response = res?.data;
      //     let file = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${response}`;
      //     const fileName = 'تقرير الامراض طبقا للنوع.xlsx';
      //     saveAs(file, fileName);
      //     this.userMsg.success('تمت التنزيل بنجاح');
      //     this.nodata = false;
      //   } else {
      //     this.nodata = true;
      //   }
    });
  }

  //#endregion
}
