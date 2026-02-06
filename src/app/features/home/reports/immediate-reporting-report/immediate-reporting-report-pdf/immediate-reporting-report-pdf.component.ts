import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-immediate-reporting-report-pdf',
  templateUrl: './immediate-reporting-report-pdf.component.html',
  styleUrls: ['./immediate-reporting-report-pdf.component.css'],
})
export class ImmediateReportingReportPdfComponent {
  @Input() set pdfData(value) {
    this.getPdfData(value);
  }
  allData: any;
  tableHeader: any[] = [];
  tableData: any[] = [];
  nodata: boolean = true;
  currentLang: string;
  dir: string;
  fromDate: any;
  toDate: any;
  lang: any;
  currentDate: string;
  totalCount:number = 0;
  constructor(private datePipe: DatePipe) {
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
    var datePipe = new DatePipe('en-EG');
    this.allData = value;
    this.tableHeader = value?.instantNotificationDataColumnsNames;
    this.tableData = value?.instantNotificationSourcesData;
    this.fromDate = datePipe.transform(value?.fromDate, 'yyyy-MM-dd');
    this.toDate = datePipe.transform(value?.toDate, 'yyyy-MM-dd');
    this.totalCount = value?.totalCount;
  }
}
