import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-disease-based-on-age-pdf',
  templateUrl: './disease-based-on-age-pdf.component.html',
  styleUrls: ['./disease-based-on-age-pdf.component.css'],
})
export class DiseaseBasedOnAgePdfComponent {
  @Input() set pdfData(value) {
    this.getPdfData(value);
  }
  tableHeader: any[] = [
    {
      id: 6,
      name: 'اقل من شهر',
      key: 'lessThan1Month',
    },
    {
      id: 5,
      name: 'اقل من سنة',
      key: 'lessThan1Year',
    },
    {
      id: 4,
      name: '1:5',
      key: 'upTo5',
    },
    {
      id: 3,
      name: '5:15',
      key: 'upTo15',
    },
    {
      id: 2,
      name: '15:35',
      key: 'upTo35',
    },
    {
      id: 1,
      name: '35:65',
      key: 'upTo65',
    },
    {
      id: 0,
      name: 'أكثر من 65',
      key: 'moreThan65',
    },
    // {
    //   id: 7,
    //   name: 'غير محدد',
    //   key: 'unDefined',
    // },
  ];
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
    // this.tableHeader = value?.diagnosisLookup;
    this.reportTitle = value?.reportTitle;
    this.tableData = value?.reportDataForGovernments;
    this.totalCountsOfCounts = value?.totalCounts;
    this.fromDate = datePipe.transform(value?.fromDate, 'yyyy-MM-dd');
    this.toDate = datePipe.transform(value?.toDate, 'yyyy-MM-dd');
  }
}
