import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-monitor-units-team-members-details-report-pdf',
  templateUrl: './monitor-units-team-members-details-report-pdf.component.html',
  styleUrls: ['./monitor-units-team-members-details-report-pdf.component.css']
})
export class MonitorUnitsTeamMembersDetailsReportPDFComponent {
  lang:string = '';
  currentDate:string = '';
  currentLang:string = '';
  dir:string = '';
  tableHeader: any[] = [];
  tableData!:any;
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
