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

@Component({
  selector: 'app-incedentSourceToCase',
  templateUrl: './incedentSourceToCase.component.html',
  styleUrls: ['./incedentSourceToCase.component.css']
})
export class IncedentSourceToCaseComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  Categories: any;
  diseases: any;
  selectedDiseases: any[] = [];
  selectedyears;
  years = YEARS;
  isValidCategory: boolean = true;
  startSelectedyears: number;
  endSelectedyears: number;
  StartselectedDiseases: any[] = [];
  EndselectedDiseases: any[] = [];
  date;
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
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
  filterdData: any[] = [];
  reportType = 0;
  selectedDepartment: any[] = [];
  selectedCaseCategory: any[] = [];
  yearsToDraw: string[] = [];
  CalculatedData: [string, ...c3.PrimitiveArray] = ['عدد_الحالات'];
  chart1: c3.ChartAPI;
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
    { id: 1, arabicName: 'سنوات محدده', englishName: 'Period by Years' },
    { id: 3, arabicName: 'الفتره بالسنوات', englishName: 'Specific Years' },
    { id: 5, arabicName: 'مده محدده', englishName: 'Specific Period' }
  ];
  tarasodSelect: number = -1;
  CaseCategryids: any = '';
  fromDate: string | number | Date;
  toDate: string | number | Date;
  Summtion: any[] = [];
  ChartData: [string, ...c3.PrimitiveArray][] = [['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['10']];
  moreDetails: string;
  craiteraHidden: boolean;
  IncidentSourceids: string = '';
  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService, public generalDataService: GeneralDataService,
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

    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;
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

    if (this.nodata) {
      document.getElementById('tableChart').style.display = 'none'
      document.getElementById('chartReport2').style.display = 'none'
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
    //, reportingOrResidence: 1 
    this.incidentSourcesLoading = true;
    this.lookUpsService.getPageIncidentSourceHospitals({ healthAdministrationID: healthAdministrationID }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.incidentSources = result.data;
        var selectedIncident = JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId;
        this.selectedIncidentSource = this.incidentSources.filter(s => s.id == selectedIncident);
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
  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration > 0) {

      this.getIncidentSources(this.selectedHealthAdministration);
    } else {

      this.incidentSources = [];

    }
  }
  onGovernmentChanged() {
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
  moreCriteriaToggle() {
    $('#moreCriteria').slideToggle();
    if (this.craiteraHidden == true) {
      this.moreDetails = this.currentLang == 'ar' ? 'المزيد من التفاصيل >' : 'More Details >';
      this.craiteraHidden = false
    } else {
      this.moreDetails = this.currentLang == 'ar' ? 'اخفاء التفاصيل <' : 'Hide Details >';
      this.craiteraHidden = true
      $('#moreCriteria').css('display', 'flex');
    }
  }

  getReport() {
    this.myData = [];
    this.myDatalength = 0;
    this.generalDataService.isIncidentGovernmentValid = this.generalDataService.checkIncidentGovernmentValid(this.selectedGovernment);
    this.generalDataService.isIncidentHealthAdministrationValid = this.generalDataService.checkIncidentHealthAdministrationValid(this.selectedHealthAdministration);
    this.generalDataService.isIncidentSourceValid = this.selectedIncidentSource.length > 0;
    this.isValidCategory = this.selectedCaseCategory.length > 0;
    this.isValid = this.isValidCategory && this.generalDataService.isIncidentGovernmentValid && this.generalDataService.isIncidentHealthAdministrationValid && this.generalDataService.isIncidentSourceValid;
    if (this.isValid) {

      this.IncidentSourceids = "";
      this.selectedIncidentSource.forEach((element) => {
        this.IncidentSourceids = this.IncidentSourceids + element.id + ',';
      });
      this.CaseCategryids = "";
      this.selectedCaseCategory.forEach((element) => {
        this.CaseCategryids = this.CaseCategryids + element.id + ',';
      });
      this.lookUpsService
        .getIncedencSourceToCategoryReport(
          this.IncidentSourceids.slice(0, -1),
          this.CaseCategryids.slice(0, -1),
          this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
          this.datePipe.transform(this.toDate, 'yyyy-MM-dd')
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.Summtion = [];
            this.IncidentSourceids = '';
            this.CaseCategryids = '';
            if (res.data.length > 0) {
              this.myData = res.data;
              for (let index = 0; index < res.data[0].count_of_Pationt.length; index++) {
                this.Summtion.push(0);
              }
              this.myDatalength = this.myData.length;
              this.ids = '';
              this.IncidentSourceids = '';
              this.CaseCategryids = '';
            }
          },
          (err) => {
            // console.log(err);
            this.ids = '';
            this.IncidentSourceids = '';
            this.CaseCategryids = '';
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
            let i = 0;
            this.selectedCaseCategory.forEach(element2 => {
              this.ChartData[i] = [element2.arabicName]
              this.myData.forEach((element) => {
                this.ChartData[i].push(element.count_of_Pationt[i])
              })
              this.chart1.load({
                columns: [this.ChartData[i]],
              });
              i++;
            });
            this.myData.forEach((element) => {
              for (let i = 0; i < element.count_of_Pationt.length; i++) {
                this.Summtion[i] = this.Summtion[i] + element.count_of_Pationt[i]
              }
              this.yearsToDraw.push(element.incidentSourceAr);
            });

            this.yearsToDraw.push("الاجمالي");
            this.chart1.categories(this.yearsToDraw);
            this.reportTypeChange(this.reportType);
            $('.page-item .active').addClass('bg');
            this.refreshCountries();
          }
        );
      console.log(this.yearsToDraw, '------------', this.CalculatedData);

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
    this.exportAsService
      .save(this.exportAsPdfConfig, 'Patients')
      .subscribe(() => { });
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
