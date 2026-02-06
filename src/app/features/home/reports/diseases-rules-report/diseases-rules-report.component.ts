import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
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
    // this.loadingPanel = true;
    var element = document.getElementById('pdfTable');
    var clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.display = 'block';

    var opt = {
      margin: 0,
      filename: 'تقرير أحكام الامراض',
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



}
