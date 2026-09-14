import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PopulationCoefficientService } from './Services/populationCoefficient.service';
import { ExportService } from '../../../../core/services/export.service';
import { PopulationDto } from '../search-populationExpectation/models/PopulationDto';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SingleDropdownSettings, SortOrder } from 'src/app/core/constants';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { ExportAsConfig } from 'ngx-export-as';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-population-increase-coefficient',
  templateUrl: './population-increase-coefficient.component.html',
  styleUrls: ['./population-increase-coefficient.component.css']
})
export class PopulationIncreaseCoefficientComponent implements OnInit {
  levelId: any;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  selectedAdministrationId: number;
  departments: any;
  selectedDepartment: any[] = [];
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  governments: any;
  governmentsLoading: boolean = false;
  healthAdministrationLoading: boolean = false;
  healthAdministration: any;
  overPopulationForm: FormGroup;
  incidentSources: any;
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;

  singleDropdownSettings = SingleDropdownSettings;
  populations: PopulationDto[];
  selectedGovern: number = -1;
  selectedgovernments: any;

  constructor(private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private populationCoefficientService: PopulationCoefficientService,
    private userMsg: UserMessageService,
    private exportService: ExportService,
    private generalDataService: GeneralDataService) {

  }
  populationFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    governmentID: 0,
    healthAdministrationID: 0
  };

  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;


  selectedhealthAdministration: any;
  //selectedincidentSource: number;
  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;
    this.overPopulationForm = new FormGroup({
      id: new FormControl(0),
      increaseRate: new FormControl(),
      // ageLowerThanMonth: new FormControl(),
      // ageLowerThanYear: new FormControl(),
      // ageUpTo5: new FormControl(),
      // ageUpTo15: new FormControl(),
      // ageUpTo35: new FormControl(),
      // ageUpTo65: new FormControl(),
      // ageMoreThan65: new FormControl(),
      // maleCount: new FormControl(),
      // femalCount: new FormControl(),
      governmentID: new FormControl(),
      healthAdministrationID: new FormControl(),
      // incidentSourceID: new FormControl(),
      // totalCount: new FormControl(),

    })


    this.getLookups();
    this.getPagePopulations();

    this.translateService.get('NEDSS.HOME.POPULATION_DATA.POPULATION_INCREASE_COE').subscribe(res => {
      this.screenName = res;
    });
  }

  onNumberKeyPress(event: KeyboardEvent): void {

    const inputChar = String.fromCharCode(event.charCode);

    // Allow digits and decimal point
    if (!/[0-9.]/.test(inputChar)) {
      event.preventDefault();
    }
  
    const inputValue = (event.target as HTMLInputElement).value;
  
    // Prevent multiple decimal points
    if (inputChar === '.' && inputValue.includes('.')) {
      event.preventDefault();
    }
  
    // Ensure only one digit is allowed after the decimal point
    const decimalIndex = inputValue.indexOf('.');
    if (decimalIndex !== -1 && inputValue.length - decimalIndex > 1 && inputChar !== '.') {
      event.preventDefault();
    }
    

    // let inputKey = event.key;
    // if (inputKey !== '+' && inputKey !== 'Backspace' && isNaN(Number(inputKey))) {
    //   event.preventDefault();
    // }
  }
  // search() {
  //   this.first = 0;
  //   this.populationFilter.pageIndex = 0;
  //   this.last =
  //     this.populationFilter.pageIndex * this.populationFilter.pageSize;
  //   this.getPagePopulations();
  // }


  addPopulationCoefficient() {
    this.populationCoefficientService.add(this.overPopulationForm.value).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.overPopulationForm.reset();
        this.userMsg.success("تمت الإضافة بنجاح");
        this.getPagePopulations();
      }
    }, error => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getLookups() {
    this.getGovernments();
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService.getAllGovernments().subscribe((result: any) => {
      this.governmentsLoading = false;
      if (result != null && result != undefined) {
        this.governments = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
        result.data.forEach(nat => {
          this.governments.push(nat);
        });

        if (this.levelId != 1) {
          this.selectedGovern = JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId;
          this.governmentSelected();
        }
      }

    }, error => {
      this.governmentsLoading = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getHealthAdministrationByGovId(x: any) {
    this.healthAdministration = [];
    this.healthAdministrationLoading = true;
    this.lookupsService.getPageHealthAdministrations({ "governmentID": x }).subscribe((result: any) => {
      this.healthAdministrationLoading = false;
      if (result != null && result != undefined) {
        this.healthAdministration = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
        result.data.forEach(nat => {
          this.healthAdministration.push(nat);
        });

        if (this.levelId != 1 && this.levelId != 2) {
          this.selectedhealthAdministration = JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId;
          this.healthAdministrationSelected();
        }
        else if (this.overPopulationForm.value.healthAdministrationID != null) {
          this.selectedhealthAdministration = this.overPopulationForm.value.healthAdministrationID;

          // this.getRelatedIncidentSources(this.overPopulationForm.value.healthAdministrationID)
        }
      }
    }, error => {
      this.healthAdministrationLoading = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  // getRelatedIncidentSources(x: any) {
  //   this.incidentSources = [];

  //   this.lookupsService.getPageIncidentSourceHospitals({ "healthAdministrationID": x }).subscribe((result: any) => {
  //     if (result != null && result != undefined) {
  //       this.incidentSources = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
  //       result.data.forEach(nat => {
  //         this.incidentSources.push(nat);
  //       });

  //       if (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) {
  //         this.selectedincidentSource = JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId;
  //       }
  //       else if (this.overPopulationForm.value.incidentSourceID !== null) {

  //         this.selectedincidentSource = this.overPopulationForm.value.incidentSourceID;
  //       }
  //     }
  //   }, error => {

  //     this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
  //       this.userMsg.error(res);
  //     });
  //   });
  // }

  

  getPagePopulations() {
    this.delay= true;
    this.timer= setTimeout(() => {
      if (this.delay)
      {
        this.translateService.get('NOUR.WaitPlease').subscribe(msg => this.userMsg.info(msg));
      }
      
    }, 500);
    this.populationCoefficientService.getPagePopulations(this.populationFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.populations = result.data;
          if (this.populations != undefined && this.populations.length == 0) {
            setTimeout(() => {
              this.delay= false;
              clearTimeout(this.timer);
            },0);
            this.noData = true;
            this.pages = 0;
          } else {
            setTimeout(() => {
              this.delay= false;
              clearTimeout(this.timer);
            },0);
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last = this.populationFilter.pageIndex * this.populationFilter.pageSize;
            this.selectedhealthAdministration = this.overPopulationForm.value.healthAdministrationID;
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
    this.populationFilter.pageIndex = event.page;
    this.populationFilter.pageSize = event.rows;
    this.getPagePopulations();
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      (this.populationFilter.sortOrder != SortOrder.desc ||
        this.populationFilter.sortColumn != event.field)
    ) {
      this.populationFilter.sortOrder = SortOrder.desc;
      this.populationFilter.sortColumn = event.field;
      this.search(false);
    } else if (
      event.order == 1 &&
      (this.populationFilter.sortOrder != SortOrder.asc ||
        this.populationFilter.sortColumn != event.field)
    ) {
      this.populationFilter.sortOrder = SortOrder.asc;
      this.populationFilter.sortColumn = event.field;
      this.search(false);
    }
  }

  search(firstTime?: boolean) {
    this.loadingPanel = true;
    // this.Delay();
    this.getPagePopulations();
  }


  delete(id: number) {
    this.populationCoefficientService.delete(id).subscribe(
      (result: any) => {
        this.getPagePopulations();
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

    let selectedGov = this.governments?.filter(g => g.id == this.selectedGovern)

    let tempSelectedAdm = [this.selectedhealthAdministration];
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

  getById(id: number) {
    this.populationCoefficientService.getById(id).subscribe(
      (result: any) => {
        this.overPopulationForm.patchValue({
          id: result.data.id,
          governmentID: result.data.governmentID,
          healthAdministrationID: result.data.healthAdministrationID,
          incidentSourceID: result.data.incidentSourceID,
          increaseRate: result.data.increaseRate,
          ageLowerThanMonth: result.data.ageLowerThanMonth,
          ageLowerThanYear: result.data.ageLowerThanYear,
          ageUpTo5: result.data.ageUpTo5,
          ageUpTo15: result.data.ageUpTo15,
          ageUpTo35: result.data.ageUpTo35,
          ageUpTo65: result.data.ageUpTo65,
          ageMoreThan65: result.data.ageMoreThan65,
          maleCount: result.data.maleCount,
          femalCount: result.data.femalCount,
        });

        if (result.data.governmentID > 0) {
          this.selectedGovern = result.data.governmentID;
        }

        this.getHealthAdministrationByGovId(this.overPopulationForm.value.governmentID);
        this.selectedhealthAdministration = -1;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  update() {
    this.populationCoefficientService
      .Update(this.overPopulationForm.value)
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
              //this.overPopulationForm.reset();
              this.getPagePopulations();
              
          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  public factor: number;

  save() {
    
    this.overPopulationForm.value.governmentID = this.selectedGovern
    this.overPopulationForm.value.healthAdministrationID = this.selectedhealthAdministration;
    if(this.overPopulationForm.value.increaseRate != null){
      this.overPopulationForm.value.increaseRate = +this.overPopulationForm.value.increaseRate;
    }
    //this.overPopulationForm.value.increaseRate = this.factor;
    // this.overPopulationForm.value.incidentSourceID = this.selectedincidentSource;
    // this.overPopulationForm.value.incidentSourceID = this.factor;
    if (!this.validateRequiredData()) {
      this.translateService
      .get('NEDSS.HOME.POPULATION_DATA.POPULATION_INCREASE_FACTOR.REQUIRED')
      .subscribe((res: string) => {
        // this.userMsg.error("هذة البيانات مضافة مسبقاً يمكنك التعديل على معامل الضرب");
        this.userMsg.error(res);
      });
      return;
    }

    let isExist:boolean = this.populations.some(s => s.governmentID == this.selectedGovern && s.healthAdministrationID == this.selectedhealthAdministration);
    if(isExist && this.overPopulationForm.value.id == 0){
      this.translateService
      .get('NEDSS.HOME.POPULATION_DATA.POPULATION_INCREASE_FACTOR.ALREADY_EXIST')
      .subscribe((res: string) => {
        // this.userMsg.error("هذة البيانات مضافة مسبقاً يمكنك التعديل على معامل الضرب");
        this.userMsg.error(res);
      });
      return;
    }

    if (this.overPopulationForm.value.id == null || this.overPopulationForm.value.id == 0) {
      this.addPopulationCoefficient()
    } else this.update();
  }

  isGovernmentValid: boolean = true;
  isAdminValid: boolean = true;
  isIncidentSourceValid: boolean = true;
  isIncreaseRateValid:boolean = true;

  validateRequiredData(): boolean {
    this.isGovernmentValid = this.generalDataService.validateField(this.overPopulationForm.value.governmentID);
    this.isAdminValid = this.generalDataService.validateField(this.overPopulationForm.value.healthAdministrationID);
    this.isIncreaseRateValid = this.generalDataService.validateField(this.overPopulationForm.value.increaseRate);
    //this.isIncidentSourceValid = this.generalDataService.validateField(this.overPopulationForm.value.incidentSourceID);

    if (!this.isGovernmentValid || !this.isAdminValid || !this.isIncreaseRateValid) // || !this.isIncidentSourceValid
      return false;
    return true;
  }

  underDeleting = {
    arabicName: '',
    id: null
  };


  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }

  governmentSelected() {
    this.overPopulationForm.value.governmentID = this.selectedGovern;

    this.isGovernmentValid = this.generalDataService.validateField(this.overPopulationForm.value.governmentID);

    this.getHealthAdministrationByGovId(this.overPopulationForm.value.governmentID);
    this.selectedhealthAdministration = -1;

    this.populationFilter.governmentID = this.selectedGovern;
    this.populationFilter.healthAdministrationID = this.selectedhealthAdministration;
    this.getPagePopulations();
  }

  //Useless (unused) Method
  // governmentDSelected() {
  //   this.overPopulationForm.value.governmentID = null
  //   this.isGovernmentValid = this.generalDataService.validateField(this.overPopulationForm.value.governmentID);
  //   this.healthAdministration = null
  //   this.selectedhealthAdministration = -1;
  //   this.incidentSources = null
  //   // this.selectedincidentSource = -1
  // }
  healthAdministrationSelected() {
    this.overPopulationForm.value.healthAdministrationID = this.selectedhealthAdministration;
    this.isAdminValid = this.generalDataService.validateField(this.overPopulationForm.value.healthAdministrationID);

    this.populationFilter.governmentID = this.selectedGovern;
    this.populationFilter.healthAdministrationID = this.selectedhealthAdministration;
    this.getPagePopulations();    // this.getRelatedIncidentSources(this.overPopulationForm.value.healthAdministrationID);
    // this.selectedincidentSource = -1;
  }


  //Useless method
  // healthAdministrationDSelected() {
  //   this.overPopulationForm.value.healthAdministrationID = null
  //   this.isAdminValid = this.generalDataService.validateField(this.overPopulationForm.value.healthAdministrationID);
  //   this.incidentSources = null
  //   // this.selectedincidentSource = -1
  // }
  // incidentSourceSelected() {

  //   this.overPopulationForm.value.incidentSourceID = this.selectedincidentSource;
  //   this.isIncidentSourceValid = this.generalDataService.validateField(this.overPopulationForm.value.incidentSourceID);
  // }

  // incidentSourceDSelected() {
  //   this.overPopulationForm.value.incidentSourceID = null
  //   this.isIncidentSourceValid = this.generalDataService.validateField(this.overPopulationForm.value.incidentSourceID);
  // }
}
