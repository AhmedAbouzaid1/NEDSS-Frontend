import { Component, OnInit } from '@angular/core';
import { LevelsEnum } from '../../users/models/levels.enum';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { DatePipe } from '@angular/common';
import * as html2pdf from 'html2pdf.js';
import { ExportService } from 'src/app/core/services/export.service';

@Component({
  selector: 'app-monitor-units-report',
  templateUrl: './monitor-units-report.component.html',
  styleUrls: ['./monitor-units-report.component.css']
})
export class MonitorUnitsReportComponent implements OnInit{
  reportLevel: any = '1';
  loadingPanel: boolean = false;
  governmentsLoading: boolean = false;
  healthAdministrationLoading: boolean = false;
  LevelsEnum = LevelsEnum;
  governments: any;
  healthAdministration: any;
  selectedhealthAdministration: any;
  selectedgovernment: any;
  currentLang:string = '';
  dir: string;
  // maxDate = new Date();
  // minDate = new Date(1900, 0, 1);
  // fromDate: string | number | Date;
  // toDate: string | number | Date;
  nodata: boolean = true;
  allData: any;
  tableHeader: any[] = [];
  tableData: any[] = [];
  currentUserLevel:number;
  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private datePipe: DatePipe,
    private exportService: ExportService,
  ) {
    this.getGovernments();
    this.getUserLevelFromLocalStorage();
  }
  ngOnInit(): void {
    this.currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  }

  //#region Government
  getGovernments() {
    this.governmentsLoading = true;
    this.lookUpsService.getAllGovernmentsForUser(true).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
          this.governments.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
        }
        this.governmentsLoading = false;
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
    this.healthAdministration = [];
    if (this.reportLevel == LevelsEnum.Administration) {
      this.getHealthAdministration(this.selectedgovernment);
    }
  }
  //#endregion

  getHealthAdministration(governmentID: any) {
    this.healthAdministrationLoading = true;
    this.lookUpsService
      .getPageHealthAdministrations({
        GovernmentID: governmentID,
        forSystemUser: true,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministration = result.data;
            this.healthAdministration.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
          }
          this.healthAdministrationLoading = false;
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


  changeRadio() {
    this.selectedgovernment = null;
    this.selectedhealthAdministration = null;
    this.healthAdministration = [];
  }

  getReportResult() {
    this.lookUpsService
      .getMonitorUnitsReport({
        reportLevel: Number(this.reportLevel),
        governmentId: this.selectedgovernment,
        HealthAdministrationId: this.selectedhealthAdministration,
        // fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        // toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      })
      .subscribe((res) => {
        if (res?.data?.monitorUnitsSourcesData?.length) {
          this.allData = res.data;
          console.log('alldata' , this.allData);
          this.nodata = false;
          console.log('status now',this.nodata);
        } else {
          this.nodata = true;
        }
      });
  }


  disableForms() {
    return (
      !this.reportLevel ||
      (this.reportLevel == LevelsEnum.Governorate &&
        !this.selectedgovernment) ||
      (this.reportLevel == LevelsEnum.Administration &&
        (!this.selectedgovernment || !this.selectedhealthAdministration))
    );
    // return (
    //   !this.toDate ||
    //   !this.fromDate ||
    //   !this.reportLevel ||
    //   (this.reportLevel == LevelsEnum.Governorate &&
    //     !this.selectedgovernment) ||
    //   (this.reportLevel == LevelsEnum.Administration &&
    //     (!this.selectedgovernment || !this.selectedhealthAdministration))
    // );
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


  //#region Printing And exporting to pdf
  exportToPdf() {
    this.loadingPanel = true;
    this.exportService
      .exportElementByIdAsPdf('pdfTable', 'تقرير التجهيزات')
      .finally(() => (this.loadingPanel = false));
  }

  print() {
    this.exportService.printElementById('pdfTable');
  }

  generateReportToExcel() {
    this.loadingPanel = true;
    setTimeout(() => {
      const ok = this.exportService.exportElementTableAsExcel('pdfTable', 'تقرير التجهيزات');
      if (!ok) {
        this.translateService
          .get('NEDSS.REPORTS.NothingToPreview')
          .subscribe((res: string) => this.userMsg.warn(res));
      }
      this.loadingPanel = false;
    }, 0);
  }
  //#endregion
}
