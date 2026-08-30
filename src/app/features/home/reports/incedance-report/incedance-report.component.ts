import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import * as $ from 'jquery';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import * as c3 from 'c3';
import { MultipleDropdownSettings, SingleDropdownSettings, WEAKS, YEARS } from 'src/app/core/constants';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { ExportService } from 'src/app/core/services/export.service';

@Component({
  selector: 'app-incedance-report',
  templateUrl: './incedance-report.component.html',
  styleUrls: ['./incedance-report.component.css'],
})
export class IncedanceReportComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  isHome: boolean = false;
  selectedCategories: any[] = [];
  AllFinalResults: any;
  selectedFinalResults: any[] = [];
  isValid: boolean = true;
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
  departments: any;
  governments: any;
  governmentsLoading: boolean = false;
  loadingPanel: boolean;
  selectedGovernment: number = -1;
  healthAdministration: any[];
  healthAdministrationLoading: boolean = false;
  selectedHealthAdministration: number;
  ids: string = ''; categoryIds: string = '';
  incidentSources!: any[];
  selectedIncidentSource: any[];
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
  moreDetails: string;
  craiteraHidden: boolean;
  Categories: any;
  diseases: any;
  selectedDiseases: any = 0;
  selectedyears;
  levelId: any;
  years = YEARS;
  startSelectedyears: number;
  endSelectedyears: number;
  StartselectedDiseases: any[] = [];
  EndselectedDiseases: any[] = [];
  date;
  selectedReportMethod: any;
  startDate: any;
  endDate: any;
  max: number;
  Summtion: number = 0

  tarasodSelect: number = -1;
  tarasodType = [
    { id: -1, arabicName: ' أختر', englishName: 'Select' },
    { id: 1, arabicName: 'ترصد روتيني', englishName: 'Routine monitoring' },
    { id: 2, arabicName: 'مواقع مختارة ', englishName: 'Sentinel' },
  ];
  selectedOption: number = -1;
  yearsOptions = [
    { id: -1, arabicName: ' إختر', englishName: 'Select' },
    { id: 1, arabicName: 'سنوات محدده', englishName: 'Period by Years' },
    { id: 2, arabicName: 'مده محدده', englishName: 'Specific Period' }
  ];
  fromDate: string | number | Date;
  toDate: string | number | Date;

  Departmentids: string = "";

  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private exportAsService: ExportAsService,
    private exportService: ExportService,
    public generalDataService: GeneralDataService

  ) {

    this.getGovernments();
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

    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.getCaseCategories();
    this.getDiseases();
    this.getAllFinalResults();
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
    this.governmentsLoading = true;
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
  getIncidentSources(healthAdministrationID: any) {
    // reportingOrResidence: 1,
    this.lookUpsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,

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
      this.selectedHealthAdministration = -1;
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
            result.data.forEach(nat => {
              this.healthAdministration.push(nat);
            });
            this.selectedHealthAdministration = JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId;
            if (this.selectedHealthAdministration == null) {
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
  getReport() {
    this.filterdData = [];
    this.Summtion = 0;
    this.generalDataService.isIncidentGovernmentValid = this.generalDataService.checkIncidentGovernmentValid(this.selectedGovernment);
    this.generalDataService.isIncidentHealthAdministrationValid = this.generalDataService.checkIncidentHealthAdministrationValid(this.selectedHealthAdministration);
    this.generalDataService.isIncidentSourceValid = this.selectedIncidentSource.length > 0 || this.selectedGovernment == -1;
    this.isValid = true;// this.generalDataService.isIncidentGovernmentValid && this.generalDataService.isIncidentHealthAdministrationValid && this.generalDataService.isIncidentSourceValid;
    if ((this.generalDataService.isIncidentSourceValid && this.selectedGovernment != -1) || this.selectedGovernment == -1) {
      this.ids = "";
      this.selectedIncidentSource.forEach((element) => {
        this.ids = this.ids + element.id + ',';
      });
      if (this.ids == "") { this.ids = '-1,'; }
      this.ids = this.ids.slice(0, -1);

      this.categoryIds = "";
      this.selectedCategories.forEach((element) => {
        this.categoryIds = this.categoryIds + element.id + ',';
      });
      if (this.categoryIds == "") { this.categoryIds = '-1,'; }

      this.categoryIds = this.categoryIds.slice(0, -1);

      this.Departmentids = "";
      this.selectedDepartment.forEach(element => {
        this.Departmentids = this.Departmentids + element.id + ","
      });
      if (this.Departmentids == "") { this.Departmentids = '-1,'; }
      this.Departmentids = this.Departmentids.slice(0, -1);

      let StartSelectedDiseaseIds = "";
      this.StartselectedDiseases.forEach(element => {
        StartSelectedDiseaseIds = StartSelectedDiseaseIds + element.id + ","
      });
      if (StartSelectedDiseaseIds == "") { StartSelectedDiseaseIds = '-1,'; }
      StartSelectedDiseaseIds = StartSelectedDiseaseIds.slice(0, -1);

      let EndSelectedDiseaseIds = "";
      this.StartselectedDiseases.forEach(element => {
        EndSelectedDiseaseIds = EndSelectedDiseaseIds + element.id + ","
      });
      if (EndSelectedDiseaseIds == "") { EndSelectedDiseaseIds = '-1,'; }
      EndSelectedDiseaseIds = EndSelectedDiseaseIds.slice(0, -1);

      let filterDateDTO: any = {
        startDate: this.startDate,
        endDate: this.endDate
      }

      let years = this.selectedyears != undefined && this.selectedyears.length > 0 ? this.selectedyears.map(dateObj => dateObj.arabicName) : '-1';

      this.lookUpsService.getIncedanceReport(this.ids, this.Departmentids, this.isHome,
        this.categoryIds, this.tarasodSelect, StartSelectedDiseaseIds, EndSelectedDiseaseIds, years, filterDateDTO).subscribe(
          (res) => {
            this.ids = '';
            this.Summtion = 0;
            this.myData = res.data;
            this.filterdData = res.data;
            res.data.forEach((element) => {
              this.Summtion = this.Summtion + element.countOFCases;
              this.yearsToDraw.push(element.arabicName);
              this.CalculatedData.push(element.countOFCases);
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
            this.myDatalength = this.myData.length;

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
            });
            this.chart1.categories(this.yearsToDraw);
          }
        );

      setTimeout(() => {
        this.yearsToDraw = [];
        this.CalculatedData = ['عدد_الحالات'];
      }, 600);
    }
  }
  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration > 0) {
      this.getIncidentSources(this.selectedHealthAdministration);
      this.selectedIncidentSource = [];
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

    this.exportService.exportTemplateAsPdf(document.getElementById(this.currentConfig),
      'عدد الحالات حسب مصادر الابلاغ',
      [selectedGov,
        selectedAdm,
        selectedIncs,
        selectedDep],
      [sDate, eDate]);
  }

  Tablesearch(e) {
    if (e.target.value.toLowerCase().length == 0) {
      this.getReport();
    }
    this.filterdData = this.myData.filter((m) =>
      m.arabicName.toLowerCase().includes(e.target.value.toLowerCase())
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
