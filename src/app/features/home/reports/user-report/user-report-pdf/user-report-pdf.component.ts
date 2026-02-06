import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-report-pdf',
  templateUrl: './user-report-pdf.component.html',
  styleUrls: ['./user-report-pdf.component.css']
})
export class UserReportPdfComponent implements OnInit {
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
    this.totalCount = value?.totalCount;
    this.totalActiveCount = value?.totalActiveCount;
    this.totalNotActiveCount = value?.totalNotActiveCount;
    this.tableHeader = value?.userDataColumnsNames;
    this.tableData = value?.usersData;
  }
}
