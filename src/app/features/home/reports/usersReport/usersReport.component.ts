import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import * as $ from 'jquery';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import * as c3 from 'c3';
import { MultipleDropdownSettings, SingleDropdownSettings } from 'src/app/core/constants';

@Component({
  selector: 'app-usersReport',
  templateUrl: './usersReport.component.html',
  styleUrls: ['./usersReport.component.css']
})
export class UsersReportComponent implements OnInit {
  levelId: any;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  multipleDropdownSettings = MultipleDropdownSettings;
  singleDropdownSettings = SingleDropdownSettings;
  currentConfig: string = 'myTableElementId';
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
  selectedGovernment: number = -1;
  healthAdministration: any;
  selectedHealthAdministration: number;
  ids: string = '';
  incidentSources!: any[];
  selectedIncidentSource: number;
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
  CalculatedData: [string, ...c3.PrimitiveArray] = ['عدد_الحالات'];
  chart1: c3.ChartAPI;
  nodata: boolean = true;
  moreDetails: string;
  craiteraHidden: boolean;
  Categories: any[];
  diseases: any[];
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
  max: number;


  tarasodType = [
    { id: 1, arabicName: 'ترصد روتيني' },
    { id: 2, arabicName: 'مواقع مختارة ' },
    { id: 3, arabicName: ' الكل' },
  ];
  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private exportAsService: ExportAsService
  ) {
  }


  ngOnInit() {
    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;
    this.getGovernments();
    this.getCaseCategories();
    this.getAllDiseases();
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';
    this.moreDetails = this.currentLang == 'ar' ? 'المزيد من التفاصيل >' : 'More Details >';

    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
  }

  getCaseCategories() {
    this.lookUpsService.getAllCaseResultCategorys().subscribe((result: any) => {
      this.Categories = [];
      if (result != null && result != undefined) {
        result.data.forEach(nat => {
          this.Categories.push(nat);
        });
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });

  }
  getAllDiseases() {
    this.lookUpsService.getAllDiseases().subscribe((result: any) => {
      this.diseases = [];
      if (result != null && result != undefined) {
        result.data.forEach(nat => {
          this.diseases.push(nat);
        });
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });

  }
  reportTypeChange(type) {
    if (this.myData != null && this.myDatalength > 0) {
      this.nodata = false;

      if (type == 1) {
        this.reportType = 1;
        this.currentConfig = 'myTableElementId';
        document.getElementById('chartReport2').style.display = 'none'
        document.getElementById('tableChart').style.display = 'block'
      } else {
        this.reportType = 2;
        this.currentConfig = 'chartElementId';
        document.getElementById('tableChart').style.display = 'none'
        document.getElementById('chartReport2').style.display = 'block'
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
    this.lookUpsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
          result.data.forEach(nat => {
            this.governments.push(nat);
          });

          if (this.levelId != 1) {
            this.selectedGovernment = JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId;
            this.onGovernmentChanged();
          }
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
  getIncidentSources(healthAdministrationID: any) {
    this.lookUpsService
      // ,reportingOrResidence: 1,
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
            result.data.forEach(nat => {
              this.incidentSources.push(nat);
            });

            if (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) {
              this.selectedIncidentSource = JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId;
            }
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
  onGovernmentChanged() {
    if (this.selectedGovernment > 0) {
      this.getHealthAdministration(this.selectedGovernment);
    } else {
      this.healthAdministration = [];
    }
  }
  getHealthAdministration(governmentID: any) {
    this.lookUpsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministration = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
            result.data.forEach(nat => {
              this.healthAdministration.push(nat);
            });

            if (this.levelId != 1 && this.levelId != 2) {
              this.selectedHealthAdministration = JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId;
              this.onHealthAdministrationChanged();
            }
            else {
              this.selectedHealthAdministration = -1;
            }
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
    this.ids = this.ids + (this.selectedIncidentSource + ',');

    this.ids = this.ids.slice(0, -1);

    this.lookUpsService.UsersReport(this.ids).subscribe(
      (res) => {
        console.log(res);
        this.ids = '';

        this.myData = res.data;
        // res.data.forEach((element) => {

        //   this.yearsToDraw.push(element.arabicName);
        //   this.CalculatedData.push(element.countOFCases);
        // });
        this.myDatalength = this.myData.length;



        $('.page-item .active').addClass('bg');

      },
      (err) => {
        this.ids = '';
      }, () => {
        this.reportTypeChange(this.reportType);
        this.refreshCountries();
      }
    );
  }
  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration > 0) {
      this.getIncidentSources(this.selectedHealthAdministration);
      this.selectedIncidentSource = -1;
    } else {
      this.incidentSources = [];
    }
  }
  refreshCountries() {
    this.filterdData = this.myData
      .map((country, i) => ({ id: i + 1, ...country }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
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
      m.fullName.toLowerCase().includes(e.target.value.toLowerCase())
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
