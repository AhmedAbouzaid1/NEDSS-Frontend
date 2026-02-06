import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-disease-based-on-result-pdf',
  templateUrl: './disease-based-on-result-pdf.component.html',
  styleUrls: ['./disease-based-on-result-pdf.component.css'],
})
export class DiseaseBasedOnResultPdfComponent {
  @Input() set pdfData(value) {
    this.getPdfData(value);
  }
  tableHeader: any[] = [];
  tableData: any[] = [];
  nodata: boolean = true;
  currentLang: string;
  dir: string;
  fromDate: any;
  toDate: any;
  lang: any;
  currentDate: string;
  reportTitle:string;
  totalCountsOfCounts:any[]=[];
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
    this.tableHeader = value?.resultLookup;
    this.reportTitle = value?.reportTitle;
    this.tableData = value?.reportDataForGovernments;
    this.fromDate = datePipe.transform(value?.fromDate, 'yyyy-MM-dd');
    this.toDate = datePipe.transform(value?.toDate, 'yyyy-MM-dd');
    this.totalCountsOfCounts = value?.totalCounts;
  }
}
