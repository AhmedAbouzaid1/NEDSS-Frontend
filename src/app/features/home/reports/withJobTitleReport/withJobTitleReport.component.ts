import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import * as $ from 'jquery';
import * as c3 from 'c3';
import { DatePipe } from '@angular/common';
import { MultipleDropdownSettings, SingleDropdownSettings } from 'src/app/core/constants';

@Component({
  selector: 'app-withJobTitleReport',
  templateUrl: './withJobTitleReport.component.html',
  styleUrls: ['./withJobTitleReport.component.css']
})
export class WithJobTitleReportComponent implements OnInit {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  Categories: any;
  diseases: any;
  selectedDiseases: any[] = [];
  selectedJobs: any[] = [];
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
  selectedGovernment: any[];
  healthAdministration: any;
  selectedHealthAdministration: any;
  ids: string = '';
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
  FinalResultsids: any[] = [];
  resultType: any[] = [];
  yearsToDraw: any[] = [];
  CalculatedData: [string, ...c3.PrimitiveArray] = ['عدد_الحالات'];
  chart1: c3.ChartAPI;
  nodata: boolean = true;
  moreDetails: string;
  craiteraHidden: boolean;
  tarasodType = [
    { id: 1, arabicName: 'ترصد روتيني' },
    { id: 2, arabicName: 'مواقع مختارة ' },
    { id: 3, arabicName: ' الكل' },
  ];
  tashKhesType = [
    { id: 1, arabicName: ' تشخيص ابتدائي' },
    { id: 2, arabicName: ' تشخيص نهائي ' },
    { id: 3, arabicName: ' الكل' },
  ];
  Diseaseids: any[] = [];
  CaseCategryids: any = '';
  fromDate: string | number | Date;
  toDate: string | number | Date;
  Summtion: any[] = [];
  ChartData: [string, ...c3.PrimitiveArray][] = [['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['10']];
  AllFinalResults: any;
  selectedFinalResults: any[] = [];
  jobs: any;
  Jobsids: any[] = [];
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
    this.getJobs();
    this.getAllFinalResults();
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
  getJobs() {
    this.lookUpsService.getAllPatientJobs().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.jobs = result.data;
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
  getGovernments() {
    this.lookUpsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
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
    if (this.selectedGovernment.length > 0) {
      this.getHealthAdministration(this.selectedGovernment[0].id);
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
      this.Diseaseids.push(element.id);
    });
    this.selectedJobs.forEach((element) => {
      this.Jobsids.push(element.id);
    });
    console.log(this.ids);

    //
    this.lookUpsService
      .getAccordingPatientJob(
        {
          ids_Disease: this.Diseaseids,
          from_Date: this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
          to_Date: this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
          ids_PationtJop: this.Jobsids,

        }

      )
      .subscribe(
        (res) => {
          console.log(res);

          this.myData = res.data;

          this.Summtion = [];
          console.log(this.Summtion);
          this.ids = '';
          this.Diseaseids = [];
          this.Jobsids = [];
          for (let index = 0; index < res.data[0].countOfPatient.length; index++) {
            this.Summtion.push(0);
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
          this.selectedJobs.forEach(element2 => {
            this.ChartData[i] = [element2.arabicName]
            this.myData.forEach((element) => {
              this.ChartData[i].push(element.countOfPatient[i])
            })
            this.chart1.load({
              columns: [this.ChartData[i]],
            });
            i++;
          });
          this.myData.forEach((element) => {
            for (let i = 0; i < element.countOfPatient.length; i++) {
              this.Summtion[i] = this.Summtion[i] + element.countOfPatient[i]
            }
            this.yearsToDraw.push(element.resultAr);
          });
          this.myDatalength = this.Summtion[this.Summtion.length - 1];
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
    }, 1000)
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
