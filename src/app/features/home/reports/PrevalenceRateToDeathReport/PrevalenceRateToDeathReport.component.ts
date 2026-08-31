import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import * as $ from 'jquery';
import * as c3 from 'c3';
import { MultipleDropdownSettings, SingleDropdownSettings, YEARS } from 'src/app/core/constants';

@Component({
  selector: 'app-PrevalenceRateToDeathReport',
  templateUrl: './PrevalenceRateToDeathReport.component.html',
  styleUrls: ['./PrevalenceRateToDeathReport.component.css']
})
export class PrevalenceRateToDeathReportComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  years = YEARS
  selectedYear: any;
  Categories: any;
  diseases: any;
  selectedDiseases: any[] = [];
  selectedyears;
  startSelectedyears: number;
  endSelectedyears: number;
  StartselectedDiseases: any[] = [];
  EndselectedDiseases: any[] = [];
  date;
  selectedReportMethod: any;
  startDate: any;
  endDate: any;
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
  CategoriesLoading: boolean = false;
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
  CalculatedData: [string, ...c3.PrimitiveArray] = ['معدل_الوفيات'];
  CalculatedData1: [string, ...c3.PrimitiveArray] = ['معدل_الوفيات_للعام_الماضي'];
  chart1: c3.ChartAPI;
  nodata: boolean = true;
  Summtion: number = 0
  tarasodType = [
    { id: 1, arabicName: 'ترصد روتيني' },
    { id: 2, arabicName: 'مواقع مختارة ' },
    { id: 3, arabicName: ' الكل' },
  ];
  moreDetails: string;
  craiteraHidden: boolean;
  lastIndex: number;
  constructor(
    private lookUpsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private exportAsService: ExportAsService
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
    this.selectedDiseases.forEach((element) => {
      this.ids = this.ids + element.id + ',';

    });
    console.log(this.ids);
    // this.Categories.forEach((element) => {
    //   this.ids = this.ids + element.id + ',';});
    //
    this.lookUpsService
      .PrevalenceRateToDeathReport(this.ids.slice(0, -1), this.selectedYear[0].arabicName)
      .subscribe(
        (res) => {
          this.Summtion = 0; this.ids = '';


          console.log(res);


          this.myData = res.data;
          this.myDatalength = this.myData.length;
          this.lastIndex = this.myDatalength - 1;
          let i = 0;
          res.data.forEach((element) => {
            i++;
            if (i <= this.lastIndex) {
              this.Summtion = this.Summtion + element.populationCount;
              this.yearsToDraw.push(element.resultAr);
              this.CalculatedData.push(element.prevalenceRateThisYear);
              this.CalculatedData1.push(element.prevalenceRatePreviousYear);
            }


          });


          $('.page-item .active').addClass('bg');

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
          this.reportTypeChange(this.reportType);
          this.refreshCountries();
          this.chart1.load({
            columns: [this.CalculatedData, this.CalculatedData1],
          }); this.chart1.categories(this.yearsToDraw);
        }
      );
    console.log(this.yearsToDraw, '------------', this.CalculatedData);

    // setTimeout(() => {
    //   this.chart1.load({
    //     columns: [this.CalculatedData],
    //   });
    //   this.chart1.categories(this.yearsToDraw);
    // }, 300);

    setTimeout(() => {
      this.yearsToDraw = [];
      this.CalculatedData = ['معدل_الوفيات'];
      this.CalculatedData1 = ['معدل_الوفيات_للعام_الماضي'];
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
    this.CategoriesLoading = true;
    this.lookUpsService.getAllCaseResultCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Categories = result.data;
        }
        this.CategoriesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.CategoriesLoading = false;
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
      m.resultAr.toLowerCase().includes(e.target.value.toLowerCase())
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
