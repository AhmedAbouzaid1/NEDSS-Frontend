import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-disease-based-on-patient-pdf',
  templateUrl: './disease-based-on-patient-pdf.component.html',
  styleUrls: ['./disease-based-on-patient-pdf.component.css'],
})
export class DiseaseBasedOnPatientPdfComponent {
  @Input() set pdfData(value) {
    this.getPdfData(value);
  }
  tableData: any[] = [];
  nodata: boolean = true;
  currentLang: string;
  dir: string;
  fromDate: any;
  toDate: any;
  lang: any;
  currentDate: string;
  reportTitle:string = '';
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
  totalCount:number = 0;
  getPdfData(value) {
    var datePipe = new DatePipe('en-EG');
    this.reportTitle = value?.reportTitle;
    this.tableData = value?.reportDataItems;
    this.fromDate = datePipe.transform(value?.fromDate, 'yyyy-MM-dd');
    this.totalCount = value?.totalCount;
    this.toDate = datePipe.transform(value?.toDate, 'yyyy-MM-dd');
  }
}
