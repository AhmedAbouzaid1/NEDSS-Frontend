import { Component, Input } from '@angular/core';
import { PopulationReportResponse } from 'src/app/features/Models/populationReportResponse';

@Component({
  selector: 'app-populations-report-pdf',
  templateUrl: './populations-report-pdf.component.html',
  styleUrls: ['./populations-report-pdf.component.css']
})
export class PopulationsReportPDFComponent {
  lang:string = '';
  currentDate:string = '';
  currentLang:string = '';
  dir:string = '';
  tableHeader: any[] = [];
  tableData!:PopulationReportResponse;
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
    this.tableData = value;
  }

}
