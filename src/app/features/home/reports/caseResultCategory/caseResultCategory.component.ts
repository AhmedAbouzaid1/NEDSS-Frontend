import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import * as $ from 'jquery';
import * as c3 from 'c3';
import { DatePipe } from '@angular/common';
import { MultipleDropdownSettings, SingleDropdownSettings, YEARS } from 'src/app/core/constants';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { ExportService } from 'src/app/core/services/export.service';
@Component({
  selector: 'app-caseResultCategory',
  templateUrl: './caseResultCategory.component.html',
  styleUrls: ['./caseResultCategory.component.css'],
})
export class CaseResultCategoryComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  Categories: any;
  diseases: any;
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
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
  selectedGovernment: number = -1;
  healthAdministration: any;
  selectedHealthAdministration: any;
  ids: string = '';
  departments: any;
  myDatalength = 0;
  myData: any = null;
  page = 1;
  pageSize = 10;
  first = 0;
  last = 0;
  filterdData: any[] = [];
  reportType = 0;
  selectedDepartment: any[] = [];
  selectedCaseCategory: any[] = [];
  yearsToDraw: string[] = [];
  CalculatedData: [string, ...c3.PrimitiveArray] = ['عدد_الحالات'];
  chart1: c3.ChartAPI;
  nodata: boolean = true;
  tarasodSelect: number = -1;
  tarasodType = [
    { id: -1, arabicName: ' أختر', englishName: 'Select' },
    { id: 1, arabicName: 'ترصد روتيني', englishName: 'Routine monitoring' },
    { id: 2, arabicName: 'مواقع مختارة ', englishName: 'Sentinel' },
  ];
  yearsOptions = [
    { id: -1, arabicName: ' إختر', englishName: 'Select' },
    { id: 1, arabicName: 'سنوات محدده', englishName: 'Period by Years' },
    { id: 3, arabicName: 'الفتره بالسنوات', englishName: 'Specific Years' },
    { id: 5, arabicName: 'مده محدده', englishName: 'Specific Period' }
  ];
  selectedOption: number = -1;
  Diseaseids: string = '';
  CaseCategryids: any = '';
  fromDate: string | number | Date;
  toDate: string | number | Date;
  Summtion: any[] = [];
  ChartData: [string, ...c3.PrimitiveArray][] = [['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['10']];
  moreDetails: string;
  craiteraHidden: boolean;
  isValidCategory: boolean = true;
  isValidDisease: boolean = true;
  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private exportAsService: ExportAsService,
    private datePipe: DatePipe,
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

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;
    this.moreDetails = this.currentLang == 'ar' ? 'المزيد من التفاصيل >' : 'More Details >';

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
    if (this.selectedGovernment != -1) {
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
            this.healthAdministration = result.data;
            var selectedHealthAdministrationId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId;
            this.selectedHealthAdministration = this.healthAdministration.filter(s => s.id == selectedHealthAdministrationId);
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
      this.moreDetails = this.currentLang == 'ar' ? 'اخفاء التفاصيل <' : 'Hide Details >';
      this.craiteraHidden = true
      $('#moreCriteria').css('display', 'flex');
    }
  }

  getReport() {
    this.myData = [];
    this.myDatalength = 0;
    this.isValidCategory = this.selectedCaseCategory.length > 0;
    this.isValidDisease = this.selectedDiseases.length > 0;
    let isValid = this.isValidCategory && this.isValidDisease;

    if (isValid) {
      this.Diseaseids = "";
      this.selectedDiseases.forEach((element) => {
        this.Diseaseids = this.Diseaseids + element.id + ',';
      });
      this.CaseCategryids = "";
      this.selectedCaseCategory.forEach((element) => {
        this.CaseCategryids = this.CaseCategryids + element.id + ',';
      });

      this.lookUpsService
        .getCaseResultCategoryReport(
          this.Diseaseids.slice(0, -1),
          this.CaseCategryids.slice(0, -1),
          this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
          this.datePipe.transform(this.toDate, 'MM-dd-yyyy')

        )
        .subscribe(
          (res) => {
            console.log(res);
            this.Summtion = [];
            this.Diseaseids = '';
            this.CaseCategryids = '';
            if (res.data.length != 0) {
              this.nodata = false;
              this.myData = res.data;
              for (let index = 0; index < res.data[0].count_of_Pationt.length; index++) {
                this.Summtion.push(0);
              }

              console.log(this.Summtion);
              this.myDatalength = this.myData.length;
              this.ids = '';
              this.Diseaseids = '';
              this.CaseCategryids = '';

            }
            else {
              this.nodata = true;
            }



          },
          (err) => {
            // console.log(err);
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
            this.selectedDiseases.forEach(element => {
              this.yearsToDraw.push(element.arabicName);
            });
            this.yearsToDraw.push("الاجمالي");
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

            });
            this.chart1.categories(this.yearsToDraw);
            this.reportTypeChange(this.reportType);
            this.refreshCountries();
            $('.page-item .active').addClass('bg');

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
    if (this.myData.length > 0) {
      this.filterdData = this.myData
        .map((country, i) => ({ id: i + 1, ...country }))
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize
        );
    }
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
  Tablesearch(e) {
    if (e.target.value.toLowerCase().length == 0) {
      this.getReport();
    }
    if (this.myData.length > 0) {
      this.filterdData = this.myData.filter((m) =>
        m.incidentHealthAr.toLowerCase().includes(e.target.value.toLowerCase())
      );
    }
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
