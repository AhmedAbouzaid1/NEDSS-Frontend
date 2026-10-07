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
  selector: 'app-user-monitoring-report',
  templateUrl: './user-monitoring-report.component.html',
  styleUrls: ['./user-monitoring-report.component.css']
})
export class UserMonitoringReportComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  IncidentSourceids: string = '';
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
  selectedIncidentSource: number = -1;
  StartselectedDiseases: any[] = [];
  EndselectedDiseases: any[] = [];
  date;
  incidentSources !: any[];
  selectedReportMethod: any;
  startDate: any;
  endDate: any;
  levelId: any;
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
  governmentsLoading: boolean = false;
  healthAdministrationLoading: boolean = false;
  incidentSourcesLoading: boolean = false;
  selectedGovernment: number = -1;
  healthAdministration: any[];
  selectedHealthAdministration: number = -1;
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
  in24: [string, ...c3.PrimitiveArray] = ['ف_خلال_24'];
  in48: [string, ...c3.PrimitiveArray] = ['ف_خلال_48'];
  inWeek: [string, ...c3.PrimitiveArray] = ['ف_خلال_اسبوع'];
  moreWeek: [string, ...c3.PrimitiveArray] = ['بعد_اسبوع'];
  chart1: c3.ChartAPI;
  nodata: boolean = true;
  Summtion: number[] = [0, 0, 0, 0]
  tarasodType = [
    { id: 1, arabicName: 'ترصد روتيني' },
    { id: 2, arabicName: 'مواقع مختارة ' },
    { id: 3, arabicName: ' الكل' },
  ];
  moreDetails: string;

  craiteraHidden: boolean;
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

    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;

    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');

    this.getCaseCategories();
    this.getDiseases();
  }
  getDiseases() {
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
        this.loadingPanel = false;
      },
      (error) => {
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
          this.governments = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
          result.data.forEach(gov => {
            this.governments.push(gov);
          });
          if (result.data.length > 0) {
            this.selectedGovernment = JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId;
            if (this.selectedGovernment != null) {
              this.onGovernmentChanged();
            } else {
              this.selectedGovernment = -1;
            }
          }
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
    if (this.selectedGovernment > 0) {
      this.getHealthAdministration(this.selectedGovernment);
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

            this.healthAdministration = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
            result.data.forEach(gov => {
              this.healthAdministration.push(gov);
            });

            this.selectedHealthAdministration = JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId;
            if (this.selectedHealthAdministration != null) {
              this.onHealthAdministrationChanged();
            }
            else {
              this.selectedHealthAdministration = -1;
            }
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
  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration > 0) {

      this.getIncidentSources(this.selectedHealthAdministration);
    } else {

      this.incidentSources = [];

    }
  }
  getIncidentSources(healthAdministrationID: any) {
    //, reportingOrResidence: 1
    this.incidentSourcesLoading = true;
    this.lookUpsService.getPageIncidentSourceHospitals({ healthAdministrationID: healthAdministrationID }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.incidentSources = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
        result.data.forEach(gov => {
          this.incidentSources.push(gov);
        });
        this.selectedIncidentSource = JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId;
        if (this.selectedIncidentSource == null) {
          this.selectedIncidentSource = -1;
        }

      }
      this.incidentSourcesLoading = false;
      this.loadingPanel = false;
    }, error => {
      this.incidentSourcesLoading = false;
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
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
      .getUserMonitoringReport(this.Desiesids,
        this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        this.datePipe.transform(this.toDate, 'yyyy-MM-dd'), this.selectedIncidentSource[0].id)
      .subscribe(
        (res) => {
          this.Summtion = [0, 0, 0, 0];
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
            this.in24.push(element.in24);
            this.in48.push(element.in48);
            this.inWeek.push(element.inWeek);
            this.moreWeek.push(element.moreWeek);

          });
          this.myData.forEach(element => {
            this.Summtion[0] = this.Summtion[0] + element.in24
            this.Summtion[1] = this.Summtion[1] + element.in48
            this.Summtion[2] = this.Summtion[2] + element.inWeek
            this.Summtion[3] = this.Summtion[3] + element.moreWeek

            // this.Summtion[4]=this.Summtion[4] + element.sumtion
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
              this.in24,
              this.in48,
              this.inWeek,
              this.moreWeek,
            ],
          }); this.chart1.categories(this.yearsToDraw);
        }
      );



    setTimeout(() => {
      this.yearsToDraw = [];
      this.in24 = ['ف_خلال_24'];
      this.in48 = ['ف_خلال_48'];
      this.inWeek = ['ف_خلال_اسبوع'];
      this.moreWeek = ['بعد_اسبوع']

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
    this.lookUpsService.getAllCaseResultCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Categories = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
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
