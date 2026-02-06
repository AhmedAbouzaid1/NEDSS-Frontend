import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import * as $ from 'jquery';
import * as c3 from 'c3';
import { MultipleDropdownSettings, SingleDropdownSettings, WEAKS, YEARS } from 'src/app/core/constants';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core'
import { ExportService } from 'src/app/core/services/export.service';

@Component({
  selector: 'app-health-administration-report',
  templateUrl: './health-administration-report.component.html',
  styleUrls: ['./health-administration-report.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class HealthAdministrationReportComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  isHome: boolean = false;
  pleaseComplete: boolean;
  selectedCategories: any[] = [];
  isValid: boolean = true;
  Categories: any;
  diseases: any;
  departments: any;
  selectedDiseases: any = 0;
  selectedyears;
  years = YEARS;
  startSelectedyears: number;
  endSelectedyears: number;
  StartselectedDiseases: any[] = [];
  EndselectedDiseases: any[] = [];
  date;
  selectedReportMethod: any;

  max: number;
  AllFinalResults: any;
  selectedFinalResults: any[] = [];
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
  selectedGovernment: number = -1;
  healthAdministration: any[];
  selectedHealthAdministration: any[];
  ids: string = '';
  incidentSources!: any[];
  selectedIncidentSource: any[];
  categoryIds: string = '';
  myDatalength = 0;
  myData: any = null;
  page = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  filterdData: any;
  reportType = 0;
  selectedDepartment: any[] = [];
  yearsToDraw: string[] = [];
  CalculatedData: [string, ...c3.PrimitiveArray] = ['عدد_الحالات'];
  chart1: c3.ChartAPI;
  nodata: boolean = true;
  Summtion: number = 0
  levelId: any;
  tarasodSelect: number = -1;
  timeDuration: string = '';
  tarasodType = [
    { id: -1, arabicName: ' أختر', englishName: 'Select' },
    { id: 1, arabicName: 'ترصد روتيني', englishName: 'Routine monitoring' },
    { id: 2, arabicName: 'مواقع مختارة ', englishName: 'Sentinel' },
  ];
  craiteraHidden: boolean;
  moreDetails: string;
  selectedOption: number = -1;
  selectedWeaks: any[] = [];
  weaks = WEAKS;
  multipleYearDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'arabicName',
    selectAllText: localStorage.getItem("ls.currentLang") == 'ar' ? 'اختار الكل' : 'Select All',
    unSelectAllText: localStorage.getItem("ls.currentLang") == 'ar' ? 'الغاء الاختيار' : 'UnSelect All',
    placeholder: localStorage.getItem("ls.currentLang") == 'ar' ? 'اختر' : "Choose",
    searchPlaceholderText: localStorage.getItem("ls.currentLang") == 'ar' ? 'بحث' : "Search Items",
    noDataAvailablePlaceholderText: localStorage.getItem("ls.currentLang") == 'ar' ? 'لا يوجد بيانات' : "No Data",
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: true,
  };
  yearsOptions = [
    { id: -1, arabicName: ' إختر', englishName: 'Select' },
    { id: 1, arabicName: 'سنوات محدده', englishName: 'Period by Years' },
    { id: 2, arabicName: 'مده محدده', englishName: 'Specific Period' }
  ];
  startDate: string | number | Date;
  endDate: string | number | Date;
  selectedYear: any = -1;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();

  Departmentids: string = "";
  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private exportAsService: ExportAsService, public generalDataService: GeneralDataService,
    private exportService: ExportService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.getGovernments();
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    setTimeout((i) => {
      document.getElementById("incident").click();
      document.getElementById("table").click();
    }, 500);

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.moreDetails = this.currentLang == 'ar' ? 'المزيد من التفاصيل >' : 'More Details >';
    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;

    const date = new Date();
    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.getCaseCategories();
    this.getAllFinalResults();
    this.getDiseases();
    this.getDepartments();
  }
  getDepartments() {
    this.lookUpsService.getAllDepartments().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.departments = result.data;
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getMonthDaysCount(date: string | Date): number {
    const tmp = new Date(date);
    tmp.setMonth(tmp.getMonth() + 1);
    tmp.setDate(0);
    return tmp.getDate();
  }

  getDiseases() {
    this.lookUpsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
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
  healthTypeChange(type) {
    if (type == false) {
      this.isHome = false;
    } else {
      this.isHome = true;
    }
  }
  reportTypeChange(type) {
    if (this.myData != null && this.myDatalength > 0) {
      this.nodata = false;

      if (type == 1) {
        this.reportType = 1;
        this.currentConfig = 'myTableElementId';
        document.getElementById('chartReport').style.display = 'none'
        document.getElementById('tableChart').style.display = 'block'
      } else if (this.myData.length <= 15) {
        this.reportType = 2;
        this.currentConfig = 'chartElementId';
        document.getElementById('tableChart').style.display = 'none'
        document.getElementById('chartReport').style.display = 'block'
      }
      if (this.myData.length > 15) { this.reportType = 1; }
    } else {
      this.nodata = true;
    }

    if (this.nodata) {
      document.getElementById('tableChart').style.display = 'none'
      document.getElementById('chartReport').style.display = 'none'
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
          this.governments = [{ id: -1, arabicName: 'الكل', englishName: 'All' }];
          result.data.forEach(nat => {
            this.governments.push(nat);
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
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,
        reportingOrResidence: 1,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = result.data;
            if (JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId != null) {
              this.selectedIncidentSource.push(JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId);
            }
            if (this.selectedIncidentSource == null) {
              this.selectedIncidentSource = [];
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
    this.selectedIncidentSource = [];
    this.incidentSources = [];
    if (this.selectedGovernment > 0) {
      this.getHealthAdministration(this.selectedGovernment);
      this.selectedHealthAdministration = [];
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
            this.healthAdministration = result.data;

            this.selectedHealthAdministration = JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId;
            if (this.selectedHealthAdministration == null) {
              this.selectedHealthAdministration = [];
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



  // MARK IMP
  getReport() {
    this.ids = "";
    this.filterdData = [];
    this.Summtion = 0;
    this.selectedHealthAdministration.forEach((element) => {
      this.ids = this.ids + element.id + ',';
    });
    if (this.ids == "") { this.ids = '-1,'; }
    this.categoryIds = "";
    this.selectedCategories.forEach((element) => {
      this.categoryIds = this.categoryIds + element.id + ',';
    });
    if (this.categoryIds == "") { this.categoryIds = '-1,'; }
    this.Departmentids = "";
    this.selectedDepartment.forEach(element => {
      this.Departmentids = this.Departmentids + element.id + ","
    });
    this.Departmentids = this.Departmentids.slice(0, -1);

    if (this.Departmentids == "") { this.Departmentids = '-1,'; }

    let StartSelectedDiseaseIds = "";
    this.StartselectedDiseases.forEach(element => {
      StartSelectedDiseaseIds = StartSelectedDiseaseIds + element.id + ","
    });
    StartSelectedDiseaseIds = StartSelectedDiseaseIds.slice(0, -1);
    if (StartSelectedDiseaseIds == "") { StartSelectedDiseaseIds = '-1,'; }


    let EndSelectedDiseaseIds = "";
    this.StartselectedDiseases.forEach(element => {
      EndSelectedDiseaseIds = EndSelectedDiseaseIds + element.id + ","
    });
    EndSelectedDiseaseIds = EndSelectedDiseaseIds.slice(0, -1);
    if (EndSelectedDiseaseIds == "") { EndSelectedDiseaseIds = '-1,'; }

    this.generalDataService.isIncidentGovernmentValid = this.generalDataService.checkIncidentGovernmentValid(this.selectedGovernment);
    this.generalDataService.isIncidentHealthAdministrationValid = this.selectedHealthAdministration.length > 0 || this.selectedGovernment == -1;
    this.isValid = true;// this.generalDataService.isIncidentGovernmentValid && this.generalDataService.isIncidentHealthAdministrationValid;
    if ((this.selectedGovernment != -1 && this.selectedHealthAdministration.length > 0) || this.selectedGovernment == -1) {
      let filterDateDTO: any = {
        startDate: this.startDate == null ? this.minDate : this.startDate,
        endDate: this.endDate == null ? this.maxDate : this.endDate,
      }

      let years = this.selectedyears != undefined && this.selectedyears.length > 0 ? this.selectedyears.map(dateObj => dateObj.arabicName) : '-1';
      if (years != '-1') {
        filterDateDTO = {
          startDate: null,
          endDate: null
        }
      }
      this.lookUpsService
        .getHealthAdministrationReport(this.ids.slice(0, -1), this.Departmentids, this.isHome,
          this.categoryIds, this.tarasodSelect, StartSelectedDiseaseIds, EndSelectedDiseaseIds, years, filterDateDTO)
        .subscribe(
          (res) => {
            this.Summtion = 0; this.ids = '';
            res.data.forEach((element) => {
              this.Summtion = this.Summtion + element.patientCount;
              this.yearsToDraw.push(element.incidentHealthAr);
              this.CalculatedData.push(element.patientCount.toString());
            });
            if (res.data.length > 15) {
              document.getElementById("chart").setAttribute('disabled', 'true');
              this.translateService
                .get('NEDSS.COMMON.AlertMessage')
                .subscribe((res: string) => {
                  this.userMsg.info(res);
                });
            }
            else {
              document.getElementById("chart").removeAttribute('disabled');
            }
            this.myData = res.data;
            this.myDatalength = res.data.length;

            $('.page-item .active').addClass('bg');
          },
          (err) => {
            this.ids = '';
          }, () => {
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
              columns: [this.CalculatedData],
            }); this.chart1.categories(this.yearsToDraw);
          }
        );

      // setTimeout(() => {
      //   this.chart1.load({
      //     columns: [this.CalculatedData],
      //   });
      //   this.chart1.categories(this.yearsToDraw);
      // }, 300);

      setTimeout(() => {
        this.yearsToDraw = [];
        this.CalculatedData = ['عدد_الحالات'];
      }, 600);
    }
  }



  refreshCountries() {
    this.filterdData = this.myData
      .map((country, i) => ({ id: i + 1, ...country }))
    // .slice(
    //   (this.page - 1) * this.pageSize,
    //   (this.page - 1) * this.pageSize + this.pageSize
    // );
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


  getAllFinalResults() {
    this.lookUpsService
      .getAllFinalResults()
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.AllFinalResults = result.data;
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
  // exportPatientsAsPdf() {
  //   let sDate = (((new Date(this.startDate))?.toISOString())?.split('T'))[0]
  //   let eDate = (((new Date(this.endDate))?.toISOString())?.split('T'))[0]

  //   let selectedGov = this.governments.filter(g => g.id == this.selectedGovernment)

  //   let tempSelectedAdm = this.selectedHealthAdministration.map(g => g.id);
  //   let selectedAdm = this.healthAdministration?.filter(g => tempSelectedAdm.includes(g.id))
  //   selectedAdm = selectedAdm?.map(g => g.arabicName)

  //   let tempSelectedDeps = this.selectedDepartment.map(g => g.id);
  //   let selectedDep = this.departments?.filter(g => tempSelectedDeps.includes(g.id))
  //   selectedDep = selectedDep?.map(g => g.arabicName)

  //   this.exportService.exportTemplateAsPdf(document.getElementById(this.currentConfig), 'عدد الحالات حسب ادارة الابلاغ', [selectedGov, selectedAdm, [], selectedDep], [sDate, eDate]);
  // }

  exportPatientsAsPdf() {

    let selectedGov = this.governments.filter(g => g.id == this.selectedGovernment)

    let tempSelectedAdm = [this.selectedHealthAdministration];
    let selectedAdm = this.healthAdministration?.filter(g => tempSelectedAdm.includes(g.id))
    selectedAdm = selectedAdm?.map(g => g.arabicName)

    let tempSelectedIncs = this.selectedIncidentSource.map(g => g.id);
    let selectedIncs = this.incidentSources?.filter(g => tempSelectedIncs.includes(g.id))
    selectedIncs = selectedIncs?.map(g => g.arabicName)

    let tempSelectedDeps = this.selectedDepartment.map(g => g.id);
    let selectedDep = this.departments?.filter(g => tempSelectedDeps.includes(g.id))
    selectedDep = selectedDep?.map(g => g.arabicName)

    let sDate, eDate

    try {
      sDate = (((new Date(this.startDate))?.toISOString())?.split('T'))[0]
      eDate = (((new Date(this.endDate))?.toISOString())?.split('T'))[0]
    } catch (error) {
      sDate = ''; eDate = '';
    }

    this.exportService.exportTemplateAsPdf(document.getElementById(this.currentConfig), 'عدد الحالات حسب ادارة الابلاغ', [selectedGov, selectedAdm, selectedIncs, selectedDep], [sDate, eDate]);
  }


  Tablesearch(e) {
    if (e.target.value.toLowerCase().length == 0) {
      this.getReport();
    }
    this.filterdData = this.myData.filter((m) =>
      m.incidentHealthAr.toLowerCase().includes(e.target.value.toLowerCase())
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
  complete() {
    if (this.pleaseComplete) {
      this.pleaseComplete = false;
    }
  }

}
