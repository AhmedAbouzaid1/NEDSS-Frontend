import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import * as $ from 'jquery';
import * as c3 from 'c3';
import { DatePipe } from '@angular/common';
import { MultipleDropdownSettings, SingleDropdownSettings } from 'src/app/core/constants';

@Component({
  selector: 'app-ageCategoriesReport',
  templateUrl: './ageCategoriesReport.component.html',
  styleUrls: ['./ageCategoriesReport.component.css']
})
export class AgeCategoriesReportComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  fromDate: string | number | Date;
  toDate: string | number | Date;
  Categories: any;
  diseases: any;
  selectedDiseases: any = 0;
  selectedyears;
  years = [
    2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
    2022, 2023, 2024, 2025,
  ];
  startSelectedyears: number;
  endSelectedyears: number;
  StartselectedDiseases: any[] = [];
  EndselectedDiseases: any[] = [];
  date;
  selectedReportMethod: any;
  startDate: any;
  endDate: any;
  Desiesids: string = "";
  max: number;
  multipleDropdownSettings = MultipleDropdownSettings;
  singleDropdownSettings = SingleDropdownSettings;
  currentConfig: string = 'DataTables_Table_0';
  exportAsExcelConfig: ExportAsConfig = {
    type: 'xlsx', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };
  governments: any;
  loadingPanel: boolean;
  diseasesLoading: boolean = false;
  governmentsLoading: boolean = false;
  healthAdministrationLoading: boolean = false;
  caseCategoriesLoading: boolean = false;
  selectedGovernment: any[];
  healthAdministration: any[];
  selectedHealthAdministration: any[];
  ids: string = '';
  myDatalength = 0;
  myData: any = null;
  page = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  filterdData: any;
  reportType = 0;
  selectedDepartment: any[];
  yearsToDraw: string[] = [];
  lessThan1: [string, ...c3.PrimitiveArray] = ['اقل_من_1'];
  upTo5: [string, ...c3.PrimitiveArray] = ['من_1_الي_5'];
  upTo15: [string, ...c3.PrimitiveArray] = ['1من_5_الي_5'];
  upTo35: [string, ...c3.PrimitiveArray] = ['3من_15_الي_5'];
  upTo65: [string, ...c3.PrimitiveArray] = ['6من_35_الي_5'];
  chart1: c3.ChartAPI;
  nodata: boolean = true;
  Summtion: number[] = [0, 0, 0, 0, 0, 0]
  tarasodType = [
    { id: 1, arabicName: 'ترصد روتيني' },
    { id: 2, arabicName: 'مواقع مختارة ' },
    { id: 3, arabicName: ' الكل' },
  ];
  moreDetails: string;
  craiteraHidden: boolean = true;
  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private exportAsService: ExportAsService, private datePipe: DatePipe
  ) {
    this.getGovernments();
  }


  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
    this.moreDetails = this.currentLang == 'ar' ? 'المزيد من التفاصيل >' : 'More Details >';

    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.getCaseCategories();
    this.getDiseases();
  }
  getDiseases() {
    this.diseasesLoading = true;
    this.lookUpsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;

          // if (this.patient.patientDiseases !=null && this.patient.patientDiseases.length > 0) {
          //   this.selectedDiseases = this.diseases.filter(
          //     item => this.patient.patientDiseases.map(function(a) {return a.diseaseId;}).includes( item.id )
          //   )

          // }
        }
        this.diseasesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.diseasesLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  reportTypeChange(type) {
    if (this.myData != null && this.myDatalength > 0) {
      this.nodata = false;

      if (type == 1) {
        this.reportType = 1;
        this.currentConfig = 'myTableElementId';
        document.getElementById('chartReport').style.display = 'none'
        document.getElementById('tableChart').style.display = 'block'
      } else {
        this.reportType = 2;
        this.currentConfig = 'chartElementId';
        document.getElementById('tableChart').style.display = 'none'
        document.getElementById('chartReport').style.display = 'block'

      }
    } else {
      this.nodata = true;
    }
  }

  changeChartType(type) {
    if (type == 1) {
      this.chart1.transform('bar');
    } else {
      this.chart1.transform('pie');
    }
  }
  getGovernments() {
    this.governmentsLoading = true;
    this.lookUpsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
        }
        this.governmentsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.governmentsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  onGovernmentChanged() {
    if (this.selectedGovernment.length > 0) {
      this.getHealthAdministration(this.selectedGovernment[0].id);
    } else {
      this.healthAdministration = [];
    }
  }
  getHealthAdministration(governmentID: any) {
    this.healthAdministrationLoading = true;
    this.lookUpsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministration = result.data;
          }
          this.healthAdministrationLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.healthAdministrationLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  moreCriteriaToggle() {
    $('#moreCriteria').slideToggle();
    if (this.craiteraHidden == true) {
      this.moreDetails = this.currentLang == 'ar' ? 'المزيد من التفاصيل >' : 'More Details >';
      this.craiteraHidden = false
    } else {
      this.moreDetails = this.currentLang == 'ar' ? 'اخفاء التفاصيل <' : 'Hide Details <';
      this.craiteraHidden = true
      $('#moreCriteria').css('display', 'flex');
    }

  }
  getReport() {

    this.selectedDiseases.forEach(element => {
      this.Desiesids = this.Desiesids + element.id + ","
    });
    this.Desiesids = this.Desiesids.slice(0, -1);
    console.log(this.ids);
    // this.Categories.forEach((element) => {
    //   this.ids = this.ids + element.id + ',';});
    //
    this.lookUpsService
      .getDiseaseAccordingToAgeGroups(this.Desiesids,
        this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        this.datePipe.transform(this.toDate, 'yyyy-MM-dd'))
      .subscribe(
        (res) => {
          this.Summtion = [0, 0, 0, 0, 0, 0];
          this.ids = '';


          console.log(res);


          this.myData = res.data;
          this.myDatalength = this.myData.length;




          $('.page-item .active').addClass('bg');

        },
        (err) => {
          // console.log(err);
          this.ids = '';
        }, () => {
          this.myData.forEach((element) => {

            this.yearsToDraw.push(element.diseaseAr);
            this.lessThan1.push(element.lessThan1);
            this.upTo5.push(element.upTo5);
            this.upTo15.push(element.upTo15);
            this.upTo35.push(element.upTo35);
            this.upTo65.push(element.upTo65);
          });
          this.myData.forEach(element => {
            this.Summtion[0] = this.Summtion[0] + element.lessThan1
            this.Summtion[1] = this.Summtion[1] + element.upTo5
            this.Summtion[2] = this.Summtion[2] + element.upTo15
            this.Summtion[3] = this.Summtion[3] + element.upTo35
            this.Summtion[4] = this.Summtion[4] + element.upTo65
            this.Summtion[5] = this.Summtion[5] + element.sumtion
          });
          this.chart1 = c3.generate({
            bindto: '#chartElementId',
            size: {
              height: 300,
              width: 750,
            },
            zoom: {
              enabled: true,
            },
            data: {
              type: 'bar',

              columns: [['عدد_الحالات']],
            },
            axis: {
              x: {
                type: 'category',
                categories: ['القاهرة'],
              },
              y: {
                tick: {
                  outer: true,
                },
              },
            },
            bar: {
              width: {
                ratio: 0.5, // this makes bar width 50% of length between ticks
              },
              // or
              //width: 100 // this makes bar width 100px
            },
          });
          this.reportTypeChange(this.reportType);
          this.refreshCountries();
          this.chart1.load({
            columns: [
              this.lessThan1,
              this.upTo5,
              this.upTo15,
              this.upTo35,
              this.upTo65],
          }); this.chart1.categories(this.yearsToDraw);
        }
      );



    setTimeout(() => {
      this.yearsToDraw = [];
      this.lessThan1 = ['اقل_من_1'];
      this.upTo5 = ['من_1_الي_5'];
      this.upTo15 = ['1من_5_الي_5'];
      this.upTo35 = ['3من_15_الي_5']
      this.upTo65 = ['6من_35_الي_5']
    }, 600);
  }

  refreshCountries() {
    this.filterdData = this.myData
      .map((country, i) => ({ id: i + 1, ...country }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }
  getCaseCategories() {
    this.caseCategoriesLoading = true;
    this.lookUpsService.getAllCaseResultCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Categories = result.data;
        }
        this.caseCategoriesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.caseCategoriesLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  // In your component class:

  get startingIndex(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  get endingIndex(): number {
    return Math.min(this.page * this.pageSize, this.myDatalength);
  }

  // In your template:

  exportPatiantsAsExcel() {
    this.exportAsService
      .save(this.exportAsExcelConfig, 'Patients')
      .subscribe(() => { });
  }
  exportPatientsAsPdf() {
    this.exportAsService
      .save(this.exportAsPdfConfig, 'Patients')
      .subscribe(() => { });
  }
  Tablesearch(e) {
    if (e.target.value.toLowerCase().length == 0) {
      this.getReport();
    }
    this.filterdData = this.myData.filter((m) =>
      m.diseaseAr.toLowerCase().includes(e.target.value.toLowerCase())
    );
  }

  methodChange() {
    if (this.selectedReportMethod == 1) {
      this.max = 52;
    } else if (this.selectedReportMethod == 2) {
      this.max = 12;
    } else {
      this.max = 4;
    }
  }


}
