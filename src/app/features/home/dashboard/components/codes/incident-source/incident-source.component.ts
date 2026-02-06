import { TypereportingOrResidence } from './../../../../../../core/constants';
import { LookupsGetterService } from './../../../../../../core/services/lookups-getter.service';
import { UserMessageService } from './../../../../../../core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SortEvent } from 'primeng/api';
import { SortOrder } from 'src/app/core/constants';

@Component({
  selector: 'app-incident-source',
  templateUrl: './incident-source.component.html',
  styleUrls: ['./incident-source.component.css'],
})
export class IncidentSourceComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  incidentSource = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    governmentID: null,
    healthAdministrationID: null,
    incidentSourceTypeID: null,
    // reportingOrResidence: null,
    organizationID: null,
    // dependencyID: null,
  };
  TypereportingOrResidence = TypereportingOrResidence;
  incidentSources!: any[];
  governments!: any[];
  incidentSourceTypes!: any[];
  healthAdministrations!: any[];
  incidentSourceFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    code: null,
    arabicName: "",
    englishName: "",
    governmentID: null,
    healthAdministrationID: null,
    incidentSourceTypeID: null,
    // reportingOrResidence: null,
    organizationID: null,
    // dependencyID: null,
    isGetWithAll: false
  };
  organizations!: any[];
  dependencys!: any[];
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  codeValidationMsg: string = '';
  ArabicValidationMsg: string = '';
  EnglishNameValidationMsg: string = '';
  isUpdate: boolean = false;
  updateHealthAdministrationID: number | null = null;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private incidentSourceService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getGovernments();
    this.getIncidentSourceTypes();
    this.getIncidentSources();
    this.getOrganization();
    // this.getDependencys();
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(environment.DebounceWaiting),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.search();
      });
  }

  getOrganization() {
    this.incidentSourceService.getAllOrganizations().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.organizations = result.data;
        this.incidentSource.organizationID = 1;
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getGovernments() {
    this.incidentSourceService.getAllGovernmentsForUser(true).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
          this.governments.unshift({
            id: null,
            arabicName: this.translateService.instant('NEDSS.COMMON.SELECT'),
            englishName: this.translateService.instant('NEDSS.COMMON.SELECT'),  
          });
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

  governmentSelected() {
    this.healthAdministrations = [];
    if(this.incidentSource.governmentID){
      this.getHealthAdministrations(this.incidentSource.governmentID);
    }
    //this.incidentSource.healthAdministrationID =null;
  }


  getHealthAdministrations(governmentID: any) {
    this.incidentSourceService
      .getPageHealthAdministrations({
        governmentID: governmentID,
        forSystemUser: true,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = result.data;
            this.healthAdministrations.unshift({
              id: null,
              arabicName: this.translateService.instant('NEDSS.COMMON.SELECT'),
              englishName: this.translateService.instant('NEDSS.COMMON.SELECT'),
            });
            if(this.isUpdate){
              this.incidentSource.healthAdministrationID = this.updateHealthAdministrationID;
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

  getIncidentSourceTypes() {
    this.incidentSourceService.getAllIncidentSourceHospitalTypes().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.incidentSourceTypes = result.data;
          this.incidentSourceTypes.unshift({
            id: null,
            arabicName: this.translateService.instant('NEDSS.COMMON.SELECT'),
            englishName: this.translateService.instant('NEDSS.COMMON.SELECT'),
          });
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


  search() {
    this.first = 0;
    this.incidentSourceFilter.pageIndex = 0;
    this.last =
      this.incidentSourceFilter.pageIndex * this.incidentSourceFilter.pageSize;
    this.incidentSourceFilter.code = this.incidentSource.code;
    this.incidentSourceFilter.arabicName = this.incidentSource.arabicName;
    this.incidentSourceFilter.englishName = this.incidentSource.englishName;
    // this.incidentSourceFilter.dependencyID = this.incidentSource.dependencyID;
    this.incidentSourceFilter.governmentID = this.incidentSource.governmentID;
    this.incidentSourceFilter.healthAdministrationID = this.incidentSource.healthAdministrationID;
    this.incidentSourceFilter.organizationID = this.incidentSource.organizationID;
    // this.incidentSourceFilter.reportingOrResidence = this.incidentSource.reportingOrResidence;
    this.incidentSourceFilter.incidentSourceTypeID = this.incidentSource.incidentSourceTypeID;

    this.getIncidentSources();
  }

  getIncidentSources() {
    this.loadingPanel = true;
    this.incidentSourceService
      .getPageIncidentSourceHospitalsTable(this.incidentSourceFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = result.data.items;
            if (
              this.incidentSources != undefined &&
              this.incidentSources.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } 
            else {
              this.noData = false;
              this.pages = result.data.metaData.totalCount;
              this.last = result.data.metaData.currentPage * result.data.metaData.pageSize;
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

  getById(id: number) {
    document.getElementById("incid-src").scrollIntoView({ behavior: 'smooth' });
    this.isUpdate = true;
    const incidentSource = { ...this.incidentSources.find(i => i.id === id) };
    this.incidentSource = incidentSource;
    this.updateHealthAdministrationID = incidentSource.healthAdministrationID;
    this.governmentSelected();

    // this.getOrganization();

    // this.incidentSourceService.getIncidentSourceHospitalById(id).subscribe(
    //   (result: any) => {
    //     this.incidentSource = result.data;
    //     this.governmentSelected();
    //     this.getOrganization();
    //     // this.OrganizationSelect();
    //   },
    //   () => {
    //     this.translateService
    //       .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
    //       .subscribe((res: string) => {
    //         this.userMsg.error(res);
    //       });
    //   }
    // );
  }

  save() {
    if (this.incidentSource.id == null) {
      this.incidentSourceService
        .addIncidentSourceHospital(this.incidentSource)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getIncidentSources();
              this.incidentSource = {
                id: null,
                code: null,
                arabicName: null,
                englishName: null,
                governmentID: null,
                healthAdministrationID: null,
                incidentSourceTypeID: null,
                // reportingOrResidence: null,
                organizationID: null,
                // dependencyID: null,
              };
            }
          },
          (error) => {
            if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
              || error.error?.messages?.includes("DuplicatedArabicName")) {
              // this.translateService
              //   .get('NEDSS.COMMON.' + error.error.messages[0])
              //   .subscribe((res: string) => {
              //     this.userMsg.error(res);
              //     if (res.includes("Code")) {
              //       this.codeValidationMsg = res;
              //     }
              //     if (res.includes("Arabic")) {
              //       this.ArabicValidationMsg = res;
              //     }

              //     if (res.includes("English")) {
              //       this.EnglishNameValidationMsg = res;
              //     }
              //   });

              error.error.messages.forEach(msg => {

                if (msg.includes("Code")) {
                  this.codeValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }
                if (msg.includes("Arabic")) {
                  this.ArabicValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }

                if (msg.includes("English")) {
                  this.EnglishNameValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }

                // this.userMsg.error('NEDSS.COMMO.' + msg);


              });
            } else {
              this.translateService
                .get('NEDSS.COMMON.SENT_FAILD')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
            }
          }
        );
    } else this.update();
  }

  update() {
    this.incidentSourceService
      .updateIncidentSourceHospital(this.incidentSource)
      .subscribe(
        (response: any) => {
          if (response?.statusCode == 500) {
            //this.userMsg.error(res);

            // this.translateService
            //   .get('NEDSS.COMMON.' + response.messages[0])
            //   .subscribe((res: string) => {
            //     this.userMsg.error(res);
            //   });
            // this.translateService
            //   .get('NEDSS.COMMON.SENT_FAILD')
            //   .subscribe((res: string) => {
            //     this.userMsg.error(res);
            //   });
            response.messages.forEach(msg => {
              this.translateService.get('NEDSS.HOME.USERS.ADD_USER.' + msg).subscribe(res => {
                if (msg.includes("Code")) {
                  this.codeValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }
                if (msg.includes("Arabic")) {
                  this.ArabicValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }

                if (msg.includes("English")) {
                  this.EnglishNameValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }

                // this.userMsg.error('NEDSS.COMMO.' + msg);

              });
            });

            return;
          }
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getIncidentSources();
            this.incidentSource = {
              id: null,
              code: null,
              arabicName: null,
              englishName: null,
              governmentID: null,
              healthAdministrationID: null,
              incidentSourceTypeID: null,
              // reportingOrResidence: null,
              organizationID: null,
              // dependencyID: null,
            };
          }
        },
        (error) => {
          if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
            || error.error?.messages?.includes("DuplicatedArabicName")) {
            this.translateService
              .get('NEDSS.COMMON.' + error.error.messages[0])
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          } else {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        }
      );
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.incidentSourceFilter.sortOrder != SortOrder.desc
    ) {
      this.incidentSourceFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.incidentSourceFilter.sortColumn = event.field;
      this.getIncidentSources();
    } else if (
      event.order == 1 &&
      this.incidentSourceFilter.sortOrder != SortOrder.asc
    ) {
      this.incidentSourceFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.incidentSourceFilter.sortColumn = event.field;
      this.getIncidentSources();
    }
  }

  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.incidentSourceFilter.pageIndex = event.page;
    this.incidentSourceFilter.pageSize = event.rows;
    this.getIncidentSources();
  }

  delete(id: number) {
    console.log('delete',id);
    this.incidentSourceService.deleteIncidentSourceHospital(id).subscribe(
      (result: any) => {
        if(result.statusCode == 500) {
          this.userMsg.error(result.messages[0]);
          return;
        }
        this.getIncidentSources();
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

  clearSearch() {
    this.incidentSourceFilter.searchText = '';
    this.search();
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }

  // getreportingOrResidenceType(code: number): any {
  //   return this.TypereportingOrResidence[code].arabicName;
  // }

  codeChange() {

    this.codeValidationMsg = '';
  }

  arabicNameChange() {
    this.ArabicValidationMsg = '';
  }

  englishNameChange() {
    this.EnglishNameValidationMsg = '';
  }

}
