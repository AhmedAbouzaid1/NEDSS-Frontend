import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import * as $ from 'jquery'
import * as c3 from 'c3';
import { MultipleDropdownSettings, SingleDropdownSettings, YEARS } from 'src/app/core/constants';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { ExportService } from 'src/app/core/services/export.service';
@Component({
  selector: 'app-incident-department-report',
  templateUrl: './incident-department-report.component.html',
  styleUrls: ['./incident-department-report.component.css']
})
export class IncidentDepartmentReportComponent implements OnInit {
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  categoryIds: string = '';
  isHome: boolean = false;
  Categories: any;
  diseases: any;
  selectedDiseases: any[] = [];
  selectedyears;
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
  levelId: any;
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
  categoriesLoading: boolean = false;
  diseasesLoading: boolean = false;
  departmentsLoading: boolean = false;
  selectedGovernment: number = -1;
  healthAdministration: any;
  selectedHealthAdministration: number;
  ids: string = '';
  myDatalength = 0;
  myData: any = null;
  page = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  incidentSources !: any[];
  selectedIncidentSource: any[] = [];
  myDiseasDepartmentData: any[] = [];
  selectedDepartment: any[] = [];
  departments: any;
  Desiesids: string = "";
  Dpartmentids: string = "";
  filterdData: any[] = [];
  reportType = 0;
  selectedCaseCategory: any[] = [];
  yearsToDraw: string[] = [];
  CalculatedData: [string, ...c3.PrimitiveArray] = ['عدد_الحالات'];
  chart1: c3.ChartAPI;
  IncidentSourceids: string = "";
  nodata: boolean = true;
  tarasodType = [
    { id: -1, arabicName: ' أختر', englishName: 'Select' },
    { id: 1, arabicName: 'ترصد روتيني', englishName: 'Routine monitoring' },
    { id: 2, arabicName: 'مواقع مختارة ', englishName: 'Sentinel' },
  ];
  isValid: boolean = true;
  selectedOption: number = -1;
  yearsOptions = [
    { id: -1, arabicName: ' إختر', englishName: 'Select' },
    { id: 1, arabicName: 'سنوات محدده', englishName: 'Period by Years' }
  ];
  Diseaseids: string = '';
  CaseCategryids: any = '';
  fromDate: string | number | Date;
  toDate: string | number | Date;
  Summtion: any[] = [];
  SummtionTable: number = 0;
  ChartData: [string, ...c3.PrimitiveArray][] = [['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['10']];

  moreDetails: string;
  craiteraHidden: boolean;
  tarasodSelect: number = -1;
  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private exportAsService: ExportAsService, private datePipe: DatePipe,
    private exportService: ExportService
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

    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;
    this.moreDetails = this.currentLang == 'ar' ? 'المزيد من التفاصيل >' : 'More Details >';

    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.getCaseCategories();
    this.getDiseases();
    this.getDepartments();
  }
  getIncidentSources(healthAdministrationID: any) {
    //, reportingOrResidence: 1
    this.incidentSourcesLoading = true;
    this.lookUpsService.getPageIncidentSourceHospitals({ healthAdministrationID: healthAdministrationID }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.incidentSources = result.data;
        var selectedIncidentSourceId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId;
        this.selectedIncidentSource = this.incidentSources.filter(s => s.id == selectedIncidentSourceId);

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
  healthTypeChange(type) {
    if (type == false) {
      this.isHome = false;
    } else {
      this.isHome = true;
    }
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
  getDiseases() {
    this.diseasesLoading = true;
    this.lookUpsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
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
  getDepartments() {
    this.departmentsLoading = true;
    this.lookUpsService.getAllDepartments().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.departments = result.data;


      }
      this.departmentsLoading = false;
      this.loadingPanel = false;
    }, error => {
      this.departmentsLoading = false;
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getGovernments() {
    this.governmentsLoading = true;
    this.lookUpsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
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
  getReport() {
    this.filterdData = [];
    this.Summtion = [];
    this.SummtionTable = 0;
    this.generalDataService.isIncidentGovernmentValid = this.generalDataService.checkIncidentGovernmentValid(this.selectedGovernment);
    this.generalDataService.isIncidentHealthAdministrationValid = this.generalDataService.checkIncidentHealthAdministrationValid(this.selectedHealthAdministration);
    this.generalDataService.isIncidentSourceValid = this.selectedIncidentSource.length > 0 || this.selectedGovernment == -1;
    this.generalDataService.isIncidentDepartmentValid = this.selectedDepartment.length > 0;
    this.generalDataService.isPatientDiseasesValid = this.selectedDiseases.length > 0;
    this.isValid = true;// this.generalDataService.isIncidentGovernmentValid && this.generalDataService.isIncidentHealthAdministrationValid && this.generalDataService.isIncidentSourceValid;

    if ((this.generalDataService.isIncidentSourceValid && this.selectedGovernment != -1) || this.selectedGovernment == -1) {
      this.Desiesids = "";
      this.selectedDiseases.forEach(element => {
        this.Desiesids = this.Desiesids + element.id + ","
      });
      this.Desiesids = this.Desiesids.slice(0, -1);
      if (this.Desiesids == "") { this.Desiesids = '-1,'; }
      this.Dpartmentids = "";
      this.selectedDepartment.forEach(element => {
        this.Dpartmentids = this.Dpartmentids + element.id + ","
      });
      this.Dpartmentids = this.Dpartmentids.slice(0, -1);
      if (this.Dpartmentids == "") { this.Dpartmentids = '-1,'; }
      this.IncidentSourceids = "";
      this.selectedIncidentSource.forEach(element => {
        this.IncidentSourceids += element.id + ","
      });
      this.IncidentSourceids = this.IncidentSourceids.slice(0, -1);
      if (this.IncidentSourceids == "") { this.IncidentSourceids = '-1,'; }
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
      this.categoryIds = "";
      this.selectedCaseCategory.forEach((element) => {
        this.categoryIds = this.categoryIds + element.id + ',';
      });
      if (this.categoryIds == "") { this.categoryIds = '-1,'; }

      this.categoryIds = this.categoryIds.slice(0, -1);

      let years = this.selectedyears != undefined && this.selectedyears.length > 0 ? this.selectedyears.map(dateObj => dateObj.arabicName) : '-1';
      if (years != '-1') {
        this.fromDate = null;
        this.toDate = null;
      }
      this.lookUpsService.getIncidentDepartmentReport(this.Desiesids, this.Dpartmentids,
        this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        this.datePipe.transform(this.toDate, 'yyyy-MM-dd'), this.IncidentSourceids, this.isHome,
        this.categoryIds, this.tarasodSelect, StartSelectedDiseaseIds, EndSelectedDiseaseIds, years).subscribe(

          (res) => {
            this.ids = '';
            this.Desiesids = '';
            this.Dpartmentids = '';
            this.IncidentSourceids = '';
            this.Summtion = [];
            this.SummtionTable = 0;
            this.myData = res.data;
            this.filterdData = res.data;
            res.data.forEach((element) => {
              this.SummtionTable = this.SummtionTable + element.count_of_Pationt[0];
              this.Summtion = this.Summtion + element.count_of_Pationt;
              this.yearsToDraw.push(element.diseases_NameAr);
              this.CalculatedData.push(element.count_of_Pationt);
            });

            this.myDatalength = this.myData.length;
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

                columns: [],
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
        this.ChartData = [['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.']];
      }, 700);
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
    this.categoriesLoading = true;
    this.lookUpsService.getAllCaseResultCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Categories = result.data;
        }
        this.categoriesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.categoriesLoading = false;
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

    this.exportService.exportTemplateAsPdf(document.getElementById(this.currentConfig), ' عدد الحالات حسب قسم الابلاغ والامراض ', [selectedGov, selectedAdm, selectedIncs, selectedDep], [sDate, eDate]);
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

}
