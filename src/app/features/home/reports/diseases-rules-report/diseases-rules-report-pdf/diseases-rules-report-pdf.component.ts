import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-diseases-rules-report-pdf',
  templateUrl: './diseases-rules-report-pdf.component.html',
  styleUrls: ['./diseases-rules-report-pdf.component.css']
})
export class DiseasesRulesReportPdfComponent {
  lang:string = '';
  currentDate:string = '';
  currentLang:string = '';
  dir:string = '';
  tableHeader: any[] = [];
  tableData: any[] = [];
  totalCount:number = 0;
  totalActiveCount:number = 0;
  totalNotActiveCount:number = 0;
  @Input() set pdfData(value) {
    this.getPdfData(value);
  }
  constructor(){
    this.lang =
      localStorage.getItem('ls.currentLang') != undefined
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    const date = new Date();
    this.currentDate = date.toDateString(); // formats the date as a readable string
  }

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
  }

  getPdfData(value) {
    console.log(value);
    this.tableHeader = value?.diseasesRulesDataColumnsNames;
    this.tableData = value?.diseasesRulesData;
  }
}
