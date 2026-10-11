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
  selector: 'app-incident-source-to-department-report',
  templateUrl: './incident-source-to-department-report.component.html',
  styleUrls: ['./incident-source-to-department-report.component.css']
})
export class IncidentSourceToDepartmentReportComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  Categories: any;
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
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
  tarasodSelect: number = -1;
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
  Diseaseids: string = '';
  CaseCategryids: any = '';
  fromDate: string | number | Date;
  toDate: string | number | Date;
  Summtion: any[] = [];
  ChartData: [string, ...c3.PrimitiveArray][] = [['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['10']];

  moreDetails: string;
  craiteraHidden: boolean;
  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private exportService: ExportService,
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
    this.getDepartments();
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

  getIncidentSources(healthAdministrationID: any) {
    //, reportingOrResidence: 1
    this.incidentSourcesLoading = true;
    this.lookUpsService.getPageIncidentSourceHospitals({ healthAdministrationID: healthAdministrationID }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.incidentSources = result.data;
        var selectedIncidentSourceId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId;
        this.selectedIncidentSource = this.incidentSources.filter(s => s.id == selectedIncidentSourceId)
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
    this.myData = [];
    this.myDatalength = 0;
    this.generalDataService.isIncidentGovernmentValid = this.generalDataService.checkIncidentGovernmentValid(this.selectedGovernment);
    this.generalDataService.isIncidentHealthAdministrationValid = this.generalDataService.checkIncidentHealthAdministrationValid(this.selectedHealthAdministration);
    this.generalDataService.isIncidentSourceValid = this.selectedIncidentSource.length > 0;
    this.generalDataService.isIncidentDepartmentValid = this.selectedDepartment.length > 0;
    this.generalDataService.isPatientDiseasesValid = this.selectedDiseases.length > 0;
    this.isValid = this.generalDataService.isIncidentGovernmentValid && this.generalDataService.isIncidentHealthAdministrationValid && this.generalDataService.isIncidentSourceValid;

    if (this.isValid) {
      this.Desiesids = "";
      this.selectedDiseases.forEach(element => {
        this.Desiesids = this.Desiesids + element.id + ","
      });
      this.Desiesids = this.Desiesids.slice(0, -1);
      this.Dpartmentids = "";
      this.selectedDepartment.forEach(element => {
        this.Dpartmentids = this.Dpartmentids + element.id + ","
      });
      this.Dpartmentids = this.Dpartmentids.slice(0, -1);
      this.IncidentSourceids = "";
      this.selectedIncidentSource.forEach(element => {
        this.IncidentSourceids += element.id + ","
      });
      this.IncidentSourceids = this.IncidentSourceids.slice(0, -1);

      this.lookUpsService.getIncidentSourceToDepartmentReport(this.IncidentSourceids, this.Dpartmentids,
        this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        this.datePipe.transform(this.toDate, 'yyyy-MM-dd'), this.Desiesids).subscribe(

          (res) => {
            this.ids = '';
            this.Desiesids = '';
            this.Dpartmentids = '';
            this.IncidentSourceids = '';
            this.Summtion = [];
            if (res.data[0] != undefined && res.data[0].patientOfCount != undefined && res.data[0].patientOfCount.length > 0) {
              this.myData = res.data;
              for (let index = 0; index < res.data[0].patientOfCount.length; index++) {
                this.Summtion.push(0);
              }



              this.myDatalength = this.myData.length;

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
            let i = 0;
            this.selectedDepartment.forEach(element2 => {
              this.ChartData[i] = this.currentLang == 'ar' ? [element2.arabicName] : [element2.englishName];
              this.myData?.forEach((element) => {
                this.ChartData[i].push(element.patientOfCount[i])
              })
              this.chart1.load({
                columns: [this.ChartData[i]],
              });
              i++;
            });

            this.myData?.forEach((element) => {
              for (let i = 0; i < element.patientOfCount.length; i++) {
                this.Summtion[i] = this.Summtion[i] + element.patientOfCount[i]
              }
              this.yearsToDraw.push(element.incidentSourceAr);
            });
            this.chart1.categories(this.yearsToDraw);
            this.yearsToDraw.push("الاجمالي");
            this.reportTypeChange(this.reportType);
            $('.page-item .active').addClass('bg');
            this.refreshCountries();
          }
        );

      setTimeout(() => {
        this.yearsToDraw = [];
        this.ChartData = [['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.']];
      }, 700);
    }
  }

  refreshCountries() {
    if (this.myData == null || this.myData == undefined) {
      return;
    }

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

    this.exportService.exportTemplateAsPdf(document.getElementById(this.currentConfig), ' عدد الحالات حسب قسم ومصادر الابلاغ', [selectedGov, selectedAdm, selectedIncs, selectedDep], [sDate, eDate]);
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
