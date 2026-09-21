import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { ExportService } from 'src/app/core/services/export.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-diseases-rules-report',
  templateUrl: './diseases-rules-report.component.html',
  styleUrls: ['./diseases-rules-report.component.css']
})
export class DiseasesRulesReportComponent implements OnInit{

  //Language Settings
  currentLang: string = '';
  dir: string = '';
  //loading settings
  loadingPanel: boolean = false;

  //Multi select settings
  multipleDropdownSettings = {
    ...MultipleDropdownSettings,
    enableCheckAll: false,
  };

  diseasesGroups:any[];
  selectedDiseaseGroups:any;

  showTableData:boolean = false;
  tableData: any;
  isDiseaseGroupsValid:boolean = true;
  constructor(
    private lookupsService: LookupsGetterService,
    private userMsg: UserMessageService,
    private translateService: TranslateService,
    private exportService: ExportService,
  ){

  }
  ngOnInit(): void {
    this.getDiseaseGroups();
  }


  getDiseaseGroups(){
    this.lookupsService.getAllDiseaseGroups().subscribe({
      next:(data) => {
        this.diseasesGroups = data.data;
      },
      error:(error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      complete:()=> {

      }
    })
  }

  getDiseasesRulesReport() {
    this.validateForm();
    if(!this.isDiseaseGroupsValid){
      return;
    }
    if(this.selectedDiseaseGroups === undefined || this.selectedDiseaseGroups?.length == 0){
        this.translateService
        .get('NEDSS.COMMON.FILL_REQUIRED')
        .subscribe((res: string) => {
          this.userMsg.warn(res);
        });
        return;
    }
    let diseasesRulesReportFilter:any = {} ;
    diseasesRulesReportFilter.diseasesGroupsIds = this.selectedDiseaseGroups.map(dg => dg.id);
    this.lookupsService.getDiseasesRulesReport(diseasesRulesReportFilter).subscribe({
      next: (response) => {
        this.tableData = response.data;
        this.showTableData = true;
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
  validateForm() {
    if(this.selectedDiseaseGroups?.length > 0){
      this.isDiseaseGroupsValid = true;
    } else {
      this.isDiseaseGroupsValid = false;
    }
  }

  exportToPdf() {
    this.loadingPanel = true;
    this.exportService
      .exportElementByIdAsPdf('pdfTable', 'تقرير أحكام الامراض')
      .finally(() => (this.loadingPanel = false));
  }

  print() {
    this.exportService.printElementById('pdfTable');
  }

  generateReportToExcel() {
    this.loadingPanel = true;
    setTimeout(() => {
      const ok = this.exportService.exportElementTableAsExcel(
        'pdfTable',
        'تقرير أحكام الامراض'
      );
      if (!ok) {
        this.translateService
          .get('NEDSS.REPORTS.NothingToPreview')
          .subscribe((res: string) => this.userMsg.warn(res));
      }
      this.loadingPanel = false;
    }, 0);
  }



}
