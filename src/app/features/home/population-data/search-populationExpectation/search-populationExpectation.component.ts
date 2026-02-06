import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { SearchPopulationService } from './Services/searchPopulationService.service';
import { PopulationDto } from './models/PopulationDto';
import { ExportService } from '../../../../core/services/export.service';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-search-populationExpectation',
  templateUrl: './search-populationExpectation.component.html',
  styleUrls: ['./search-populationExpectation.component.css']
})
export class SearchPopulationExpectationComponent implements OnInit {
  levelId: any;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  selectedAdministrationId: number;
  incidentSources: any[];
  departments: any;
  selectedDepartment: any[] = [];
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  calculateForm;
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;

  singleDropdownSettings = SingleDropdownSettings;

  underDeleting = {
    governmentName: '',
    id: null
  };
  governments: any;
  selectedGovernment: number = -1;
  healthAdministration: any;
  years: number[] = [];
  populations: PopulationDto[];
  populationExpectationForm: FormGroup;
  populationFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  totalRecords:number = 0;
  yearSubmtionDesable: boolean = true;
  selectedhealthAdministrationId: number;
  constructor(private lookupsService: LookupsGetterService, private translateService: TranslateService,
    private searchPopulationService: SearchPopulationService, private userMsg: UserMessageService,
    private exportService: ExportService) { }

  ngOnInit() {

    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;
    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.populationExpectationForm = new FormGroup({
      healthAdministrationID: new FormControl(),
      incidentSourceID: new FormControl(null),
      governmentID: new FormControl(),
      incidentDepartmentId: new FormControl(),
      year: new FormControl(),
      expectedYear: new FormControl(),
      searchText: new FormControl(),
      pageSize: new FormControl(10),
      pageIndex: new FormControl(0),

    });
    this.getLookups();

    let nextYear = new Date().getFullYear();
    for (let i = nextYear; i < nextYear + 10; i++) {
      this.years.push(i);
    }

    this.calculateForm = new FormGroup({
      year: new FormControl(),
      newYear: new FormControl()
    })

    this.translateService.get('NEDSS.HOME.POPULATION_DATA.SEARCH_POPULATION_DATA').subscribe(res => {
      this.screenName = res;
    });
    this.findPopulation();
  }



  yearChange() {
    if (this.calculateForm.value.year != null && this.calculateForm.value.newYear != null) {
      if (this.calculateForm.value.newYear - this.calculateForm.value.year != 1) {
        this.userMsg.warn("سنة التنبؤ يجب ان تكون اكبر و بعام واحد فقط")
        this.yearSubmtionDesable = true
      } else { this.yearSubmtionDesable = false }
    }
  }

  CalculateNewYear() {
    this.searchPopulationService.CalculateNewYear(this.calculateForm.value).subscribe(
      (res) => {
        this.userMsg.success("تمت الإضافة بنجاح");
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    )
  }

  findPopulation() {
    if (this.selectedGovernment != null && this.selectedGovernment > 0) {
      this.populationExpectationForm.value.governmentID = this.selectedGovernment;
    }
    if (this.selectedhealthAdministrationId != null && this.selectedhealthAdministrationId > 0) {
      this.populationExpectationForm.value.healthAdministrationID = this.selectedhealthAdministrationId;
    }
    
    //this.Delay();
    this.searchPopulationService.getPagePatients(this.populationExpectationForm.value).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.populations = result.data;
          if (this.populations != undefined && this.populations.length == 0) {
            this.RemoveDelay();
            this.noData = true;
            this.pages = 0;
          } else {
            this.RemoveDelay();
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last = this.populationFilter.pageIndex * this.populationFilter.pageSize;
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
    )
  }

  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.populationFilter.pageIndex = event.page +1;
    this.populationFilter.pageSize = event.rows;
    this.findPopulation();
  }

  getLookups() {
    this.getGovernments();
  }

  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.governments = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
        result.data.forEach(nat => {
          this.governments.push(nat);
        });

        if (this.levelId != 1) {
          this.selectedGovernment = JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId;
          this.governmentSelected();
        }
      }

    }, error => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getHealthAdministration(id) {
    this.lookupsService.getPageHealthAdministrations({ governmentID: id }).subscribe((result: any) => {
      if (result != null && result != undefined) {

        this.healthAdministration = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
        result.data.forEach(nat => {
          this.healthAdministration.push(nat);
        });

        if (this.levelId != 1 && this.levelId != 2) {
          this.selectedhealthAdministrationId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId;
          this.healthAdministrationSelected();
        }
        else {
          this.selectedhealthAdministrationId = -1;
        }
      }
      else {
        this.selectedhealthAdministrationId = -1;
      }
    }, error => {

      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getHealthAdministrationByGovId(x: any) {
    this.lookupsService.getPageHealthAdministrations({ "governmentID": x }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.healthAdministration = result.data;
      }
    }, error => {

      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  delete(id: number) {
    this.searchPopulationService.deletePagePatient(id).subscribe(
      (result: any) => {
        this.findPopulation();
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }
  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }

  exportPatientsAsPdf() {

    let selectedGov = this.governments.filter(g => g.id == this.selectedGovernment)

    let tempSelectedAdm = [this.selectedhealthAdministrationId];
    let selectedAdm = this.healthAdministration?.filter(g => tempSelectedAdm.includes(g.id))
    selectedAdm = selectedAdm?.map(g => g.arabicName)

    let tempSelectedIncs = this.incidentSources?.map(g => g.id);
    let selectedIncs = this.incidentSources?.filter(g => tempSelectedIncs.includes(g.id))
    selectedIncs = selectedIncs?.map(g => g.arabicName)

    let tempSelectedDeps = this.selectedDepartment?.map(g => g.id);
    let selectedDep = this.departments?.filter(g => tempSelectedDeps.includes(g.id))
    selectedDep = selectedDep?.map(g => g.arabicName)

    let sDate, eDate

    try {
      sDate = (((new Date(this.startDate))?.toISOString())?.split('T'))[0]
      eDate = (((new Date(this.endDate))?.toISOString())?.split('T'))[0]
    } catch (error) {
      sDate = ''; eDate = '';
    }
    this.exportService.exportTemplateAsPdf(document.getElementById(this.currentConfig), 'بحث/توقع التعداد السكاني', [selectedGov,
      selectedAdm,
      //selectedIncs, 
      //selectedDep
    ],
      [sDate, eDate]);
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.governmentName = ele.governmentName;
  }

  governmentSelected() {
    this.populationExpectationForm.value.homeGovernmentId = this.selectedGovernment;
    this.getHealthAdministration(this.populationExpectationForm.value.homeGovernmentId);
    this.selectedAdministrationId = -1;
  }
  governmentDSelected() {
    this.populationExpectationForm.value.homeGovernmentId = null
    this.healthAdministration = null
    this.selectedhealthAdministrationId = -1

    this.getHealthAdministration(this.populationExpectationForm.value.homeGovernmentId);
  }
  healthAdministrationSelected() {
    this.populationExpectationForm.value.healthAdministrationID = this.selectedhealthAdministrationId
  }
  healthAdministrationDSelected() {
    this.populationExpectationForm.value.healthAdministrationID = null
  }
  Delay()
  {
    this.delay= true;
    this.timer= setTimeout(() => {
      if (this.delay)
      {
        this.translateService.get('NOUR.WaitPlease').subscribe(msg => this.userMsg.info(msg));
      }
      
    }, 500);

  }
  RemoveDelay()
  {
    setTimeout(() => {
      this.delay= false;
      clearTimeout(this.timer);
    },0);
  }

  search(firstTime?: boolean) {
    this.loadingPanel = true;
    // this.Delay();
    this.findPopulation();
  }
}
