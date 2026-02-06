import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { EpidemiologicalThresholdsService } from './epidemiological-thresholds.service';
import { SortEvent } from 'primeng/api';
import { SingleDropdownSettings, SortOrder } from 'src/app/core/constants';
import { ActivatedRoute } from '@angular/router';
import { UserChatMappingDto } from '../chat/Models/UserChatMappingDto';
import { SystemUserDataDto } from '../chat/Models/UserDto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { EpidemiologicalThresholdsUsersComponent } from './epidemiological-thresholds-users/epidemiological-thresholds-users.component';
import { ThresholdUser } from './epidemiological-thresholds-users/Model/threshold-user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-epidemiological-thresholds',
  templateUrl: './epidemiological-thresholds.component.html',
  styleUrls: ['./epidemiological-thresholds.component.css'],
  providers: [DialogService,MessageService],
})
export class EpidemiologicalThresholdsComponent implements OnInit, OnDestroy {
  underDeleting = {
    arabicName: '',
    id: null
  };
  epidmiologicalForm: FormGroup
  loadingPanel: boolean;
  governments: any;
  selectedGovernment: number = -1;
  selectedHealthAdministration: number;
  Categories: any;
  cities: any;
  Diseasies: any;
  selectedDiseaseId: number = -1;
  selectedCategoryId: number = -1;
  tttt: any;
  singleDropdownSettings = SingleDropdownSettings;
  patientsFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
  }
  noData: boolean = true;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  //selectedDiseaseGroupId: number;
  selectedDiseaseID:number;
  healthAdministration: any;
  currentId: any;
  OperationResult: any = {
    hasOutbreak: true,
    mean: 0,
    standardDeviation: 0,
    threshold: 0,
    value: 0
  };
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  availableUsers: SystemUserDataDto[] = [];
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  resultOptions:any;
  calculationMethodOptions:any;
  casesRatioOptions:any;
  standardDeviationOptions:any;
  thresholdUsers:ThresholdUser[];
  currentOption:any;
  constructor(
    private lookupsService: LookupsGetterService, 
    private translateService: TranslateService, 
    private router: ActivatedRoute,
    private userMsg: UserMessageService, 
    private epidemiologicalThresholdsService: EpidemiologicalThresholdsService,
    public dialogService: DialogService, 
    public messageService: MessageService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.getResultOptions();
    this.getCalculationMethodsOptions();
    this.getCasesRatio();
    this.getStandardDeviation();
    let incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.currentId = this.router.snapshot.paramMap.get("id")
    if (this.currentId != null) {
      this.getById(this.currentId);

    }
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';



    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.epidmiologicalForm = new FormGroup({
      methodType: new FormControl("1"),
      governmentID: new FormControl(),
      healthAdministrationId: new FormControl(),
      diseaseId: new FormControl(),
      categoryTypeID: new FormControl(),
      resultID: new FormControl(),
      date: new FormControl(),
      dataPoint: new FormControl(),
      precentile: new FormControl(0),
      cases: new FormControl(),
      incidence: new FormControl(),
      standaredDeviation: new FormControl(null),
      yearsCount: new FormControl(),
      id: new FormControl(),
      notificationMessageArabic: new FormControl(),
      notificationMessageEnglish: new FormControl(),
      thresholdUsersIds: new FormControl()
    })

    this.getLookups();
  }

  getLookups() {
    this.getGovernments();
    this.getAllDiseases();
    this.getCaseCategories();
    this.gethomeCity();
    this.getPage()
  }
  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.governments = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
        result.data.forEach(nat => {
          this.governments.push(nat);
        });
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getHealthAdministration() {
    this.lookupsService.getPageHealthAdministrations({ governmentID: this.selectedGovernment }).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.healthAdministration = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
        result.data.forEach(nat => {
          this.healthAdministration.push(nat);
        });
        if (this.epidmiologicalForm.value.healthAdministrationId != null) {
          this.selectedHealthAdministration = this.epidmiologicalForm.value.healthAdministrationId;
        } else {
          this.epidmiologicalForm.value.healthAdministrationId = this.selectedHealthAdministration;
        }
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getCaseCategories() {
    this.lookupsService.getAllCaseResultCategorys().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.Categories = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
        result.data.forEach(nat => {
          this.Categories.push(nat);
        });
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });

  }
  gethomeCity() {
    this.lookupsService.getAllCitys().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.cities = result.data;
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getAllDiseases() {
    this.lookupsService.getAllDiseases().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.Diseasies = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
        result.data.forEach(nat => {
          this.Diseasies.push(nat);
        });
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });

  }
  show() {
    console.log(this.epidmiologicalForm.value);

  }
  governmentSelected() {
    this.epidmiologicalForm.value.homeGovernmentId = this.selectedGovernment;

    this.getHealthAdministration();
    this.selectedHealthAdministration = -1;
  }
  governmentDSelected() {
    this.epidmiologicalForm.value.homeGovernmentId = null
    this.healthAdministration = [];
  }
  healthAdministrationSelected() {
    this.epidmiologicalForm.value.healthAdministrationId = this.selectedHealthAdministration
  }
  healthAdministrationDSelected() {

    this.epidmiologicalForm.value.healthAdministrationId = null
  }
  diseasesSelected() {
    this.epidmiologicalForm.value.patientDiseases = this.selectedDiseaseId;
  }
  diseasesDSelected() {

    this.epidmiologicalForm.value.patientDiseases = null
  }
  caseResultCategorySelected() {

    this.epidmiologicalForm.value.caseResultCategoryId = this.selectedCategoryId;
  }
  caseResultCategoryDSelected() {

    this.epidmiologicalForm.value.caseResultCategoryId = null
  }
  calulateEpidemiologicalThresholds() {

    this.epidmiologicalForm.value.governmentID =
      this.selectedGovernment == undefined ?
        this.epidmiologicalForm.value.governmentID :
        this.selectedGovernment;

    this.epidmiologicalForm.value.categoryTypeID = this.selectedCategoryId == undefined ?
      this.epidmiologicalForm.value.categoryTypeID : this.selectedCategoryId;
    this.epidmiologicalForm.value.diseaseId = this.selectedDiseaseID == undefined ?
      this.epidmiologicalForm.value.diseaseId :
      this.selectedDiseaseID;
    this.epidmiologicalForm.value.healthAdministrationId = this.selectedHealthAdministration == undefined ?
      this.epidmiologicalForm.value.healthAdministrationId :
      this.selectedHealthAdministration;

    this.epidemiologicalThresholdsService.GetEpidemiologicalThresholds(this.epidmiologicalForm.value).subscribe((result: any) => {

      if (result != null && result != undefined) {
        this.tttt = result.data;

      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });

  }
  GetEpidemiologicalThresholds() {
    throw new Error('Method not implemented.');
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.patientsFilter.pageIndex = event.page;
    this.patientsFilter.pageSize = event.rows;
    this.calulateEpidemiologicalThresholds();
  }

  nameToDelete(ele) {

    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;

  }

  getPage() {
    
    this.epidemiologicalThresholdsService
      .getPage(this.patientsFilter)
      .subscribe(
        (result: any) => {

          if (result != null && result != undefined) {
            this.tttt = result.data;
            if (
              this.tttt != undefined &&
              this.tttt.length == 0
            ) {
              this.RemoveDelay();
              this.noData = true;
              this.pages = 0;
            } else {
              this.RemoveDelay();
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.patientsFilter.pageIndex *
                this.patientsFilter.pageSize;
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
  delete(id: number) {
    this.epidemiologicalThresholdsService.delete(id).subscribe(
      (result: any) => {
        this.getPage();
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
  viewUsers = true;
  getById(id: number) {
    //this.viewUsers = false;
    this.availableUsers = [];
    this.epidemiologicalThresholdsService.getById(id).subscribe(
      (result: any) => {
        document.getElementById("epidmiolog").scrollIntoView({ behavior: 'smooth' });
        this.epidmiologicalForm.patchValue(result.data);
        this.epidmiologicalForm.controls.methodType.setValue(result.data.methodType.toString());
        this.epidmiologicalForm.controls.governmentID.setValue([{
          id: result.data.governmentID, arabicName: result.data.governmentName
        }]);

        this.epidmiologicalForm.value.homeGovernmentId = result.data.governmentID;
        this.epidmiologicalForm.value.healthAdministrationId = result.data.healthAdministrationID;
        this.epidmiologicalForm.value.categoryTypeID = result.data.categoryTypeID;
        this.selectedGovernment = result.data.governmentID;
        this.selectedHealthAdministration = result.data.healthAdministrationID;
        this.getHealthAdministration();
        this.selectedCategoryId = result.data.categoryTypeID;
        this.selectedDiseaseId = result.data.diseaseId;
        this.thresholdUsers = result.data.thresholdUsersDtos;
        this.epidmiologicalForm.controls.methodType.setValue(result.data.methodType.toString())
        this.epidmiologicalForm.controls.dataPoint.setValue(result.data.dataPoint.toString())

        
        if(result.data.methodType == 1){
          this.epidmiologicalForm.controls.incidence.setValue(result.data.incidence.toString())
        }

        if(result.data.methodType == 2 || result.data.methodType == 3){
          this.epidmiologicalForm.controls.standaredDeviation.setValue(result.data.standaredDeviation.toString());
        }
        //this condition is added by shref
        if (this.epidmiologicalForm.value.thresholdUsers! = null) {
          if (this.epidmiologicalForm.value.thresholdUsers.length > 0) {
            let newusers: any = [];
            this.epidmiologicalForm.value.thresholdUsers.forEach(function (value) {
              newusers.push({ id: value.systemUserId, fullName: value.systemUser.fullName, })
            });

            this.availableUsers = newusers;
          }
        } else {
          console.log("users were null");
        }
        this.viewUsers = true;
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

  start(id: number) {
    this.epidemiologicalThresholdsService.start(id).subscribe(
      (result: any) => {
        this.OperationResult = result.data;
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

  validate(): boolean {
    let isValid = this.selectedCategoryId != -1 && this.selectedDiseaseId != -1 && this.selectedGovernment != -1 &&
      this.healthAdministration != -1 && this.epidmiologicalForm.value.methodType != null && this.epidmiologicalForm.value.methodType != 0 && this.epidmiologicalForm.value.methodType != ''; 
    return isValid && this.isMessageValid(this.epidmiologicalForm.controls.notificationMessageEnglish.value)
      && this.isMessageValid(this.epidmiologicalForm.controls.notificationMessageArabic.value);
  }

  save() {

    if (!this.validate()) {
      this.translateService.get('NEDSS.COMMON.FILL_INVALID').subscribe((res: string) => { this.userMsg.warn(res); });
      return;
    }

    if(this.thresholdUsers == null || this.thresholdUsers.length <= 0 || this.thresholdUsers == undefined){
      this.translateService.get('NEDSS.COMMON.FILL_INVALID').subscribe((res: string) => { this.userMsg.warn(res); });
      return;
    }

    this.filterFormFileds(this.epidmiologicalForm.value.methodType);

    this.epidmiologicalForm.value.thresholdUsersIds = this.thresholdUsers.map(user => user.id);

    if (this.selectedGovernment !== -1) {
      this.epidmiologicalForm.value.governmentID = this.selectedGovernment;
    }

    if (this.selectedCategoryId !== -1) {
      this.epidmiologicalForm.value.categoryTypeID = this.selectedCategoryId;
    }
    if (this.selectedDiseaseId !== -1) {
      this.epidmiologicalForm.value.diseaseId = this.selectedDiseaseId;
    }
    if (this.selectedHealthAdministration != -1) {
      this.epidmiologicalForm.value.healthAdministrationId = this.selectedHealthAdministration;
    }

    this.epidmiologicalForm.value.dataPoint = +this.epidmiologicalForm.value.dataPoint
    this.epidmiologicalForm.value.incidence = +this.epidmiologicalForm.value.incidence
    this.epidmiologicalForm.value.methodType = +this.epidmiologicalForm.value.methodType

    if (this.epidmiologicalForm.value.id == null) {
      this.epidemiologicalThresholdsService.add(this.epidmiologicalForm.value).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getPage();
            this.epidmiologicalForm.reset();
            this.selectedGovernment = -1;
            this.healthAdministration = [];
            this.selectedCategoryId = -1;
            this.selectedDiseaseId = -1;
            this.thresholdUsers = [];
          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
    } else this.update();
  }

  update() {
    this.epidemiologicalThresholdsService.update(this.epidmiologicalForm.value).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getPage();
          this.epidmiologicalForm.reset();
          //this.epidmiologicalForm.controls.methodType.setValue("1");
          this.selectedGovernment = -1;
          this.healthAdministration = [];
          this.selectedCategoryId = -1;
          this.selectedDiseaseId = -1;
          this.thresholdUsers = [];
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

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.patientsFilter.sortOrder != SortOrder.desc
    ) {
      this.patientsFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.patientsFilter.sortColumn = event.field;
      this.getPage();
    } else if (
      event.order == 1 &&
      this.patientsFilter.sortOrder != SortOrder.asc
    ) {
      this.patientsFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.patientsFilter.sortColumn = event.field;
      this.getPage();
    }
  }

  UpdateUsers(users: SystemUserDataDto[]) {
    this.availableUsers = users;
  }
  addUsers() {
    let newUsers = this.availableUsers;
    this.epidmiologicalForm.value.thresholdUsers = newUsers.map(p => ({
      systemUserId: p.id,
      fullName: p.fullName,
      thresholdId: this.epidmiologicalForm.value.id,

    }));
    let x = document.getElementById("close-add-user") as HTMLElement;
    x.click();
  }

  isMessageValid(message: any): boolean {
    if (message === undefined || message === null || message === '') {
      return true;
    }

    let namePattern = /^[A-Za-z\u0600-\u06FF ]{3,60}$/;
    if (!namePattern.test(message)) {
      return false;
    }

    return true;
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

  //translation section
  getResultOptions() {
    this.translateService.get(['NOUR.word180','NOUR.word25', 'NOUR.word26', 'NOUR.word27']).subscribe(translations => {
      this.resultOptions = [
        { label: translations['NOUR.word180'] , value: -1 },
        { label: translations['NOUR.word25']  , value: 2 },
        { label: translations['NOUR.word26']  , value: 6 },
        { label: translations['NOUR.word27']  , value: 3 }
      ];
    });
  }

  getCalculationMethodsOptions() {
    this.translateService
        .get(['NOUR.word180','NEDSS.HOME.USERS.EPIDEMIOLOGICAL-THRESHOLDS.THREEYEARS','NEDSS.HOME.USERS.EPIDEMIOLOGICAL-THRESHOLDS.FIVEYEARS'])
        .subscribe(translations => {
      this.calculationMethodOptions = [
        { label: translations['NOUR.word180']  , value: -1 },
        { label: translations['NEDSS.HOME.USERS.EPIDEMIOLOGICAL-THRESHOLDS.THREEYEARS'] , value: 3 },
        { label: translations['NEDSS.HOME.USERS.EPIDEMIOLOGICAL-THRESHOLDS.FIVEYEARS']  , value: 5 }
      ];
    });
  }

  getCasesRatio(){
      this.translateService
      .get(['NOUR.word180'])
      .subscribe(translations => {
        this.casesRatioOptions= [
          { label: translations['NOUR.word180']  , value: '-1' },
          { label: '100,000', value: '100000' },
          { label: '10,000', value: '10000' },
          { label: '1000', value: '1000' },
        ];
    });
  }

  getStandardDeviation() {
    this.standardDeviationOptions= [
      { label: '', value: null },
      { label: '-2sd', value: '-2'},
      { label: '-1sd', value: '-1'},
      { label: '1sd' , value: '1' },
      { label: '2sd' , value: '2' },
      { label: '3sd' , value: '3' },
    ]
    // <option value="-2">-2sd</option>
    // <option value="-1">-1sd</option>
    // <option value="1">1sd</option>
    // <option value="2">2sd</option>
    // <option value="3">3sd</option>
  }

  ref: DynamicDialogRef;
  showUserModal() {
      this.ref = this.dialogService.open(EpidemiologicalThresholdsUsersComponent, {
          // header: 'Select a Product',
          width: '80%',
          height:'80%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
          data:this.thresholdUsers
      });

      this.ref.onClose.subscribe((thresholdUsers: any) => {
          if (thresholdUsers) {
              this.thresholdUsers = thresholdUsers;
              this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: thresholdUsers.username });
              console.log('toooo parent component', thresholdUsers);
          }
      });

      this.ref.onMaximize.subscribe((value) => {
          this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
      });
  }

  ngOnDestroy() {
      if (this.ref) {
          this.ref.close();
      }
  }

  filterFormFileds(methodType:string){
    switch (methodType) {
      case "1":
        this.epidmiologicalForm.controls.precentile.setValue(null);
        this.epidmiologicalForm.controls.standaredDeviation.setValue(null);
        this.epidmiologicalForm.controls.yearsCount.setValue(null);
        break;
      case "2":
        this.epidmiologicalForm.controls.cases.setValue(null);
        this.epidmiologicalForm.controls.incidence.setValue(null);
        this.epidmiologicalForm.controls.yearsCount.setValue(null);
        break;
      case "3":
        this.epidmiologicalForm.controls.cases.setValue(null);
        this.epidmiologicalForm.controls.incidence.setValue(null);
        break;
      default:
        this.epidmiologicalForm.controls.cases.setValue(null);
        this.epidmiologicalForm.controls.incidence.setValue(null);
        this.epidmiologicalForm.controls.precentile.setValue(null);
        this.epidmiologicalForm.controls.standaredDeviation.setValue(null);
        this.epidmiologicalForm.controls.yearsCount.setValue(null);
        break;
    }
  }


}
