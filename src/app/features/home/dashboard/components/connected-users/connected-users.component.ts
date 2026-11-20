import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { ExportService } from '../../../../../core/services/export.service';

@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styleUrls: ['./connected-users.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConnectedUsersComponent implements OnInit, OnDestroy {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  currentLang: string;
  dir: string;
  levelId: any;
  screenName: string = '';

  governments: any[] = [];
  healthAdministrations: any[] = [];
  incidentSources: any[] = [];
  governmentsLoading: boolean = false;
  healthAdministrationsLoading: boolean = false;
  incidentSourcesLoading: boolean = false;

  selectedGovernmentId: number = -1;
  selectedHealthAdministrationId: number = -1;
  selectedIncidentSourceId: number = -1;

  users: any[] = [];
  loadingPanel: boolean = false;
  noData: boolean = true;
  first: number = 0;
  last: number = 0;
  pages: number = 0;

  userFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    govenmentId: null as number | null,
    healthAdministrationId: null as number | null,
    incidentSourceId: null as number | null,
  };

  private usersSub: Subscription;

  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    const lang = localStorage.getItem('ls.currentLang');
    this.currentLang = lang && lang !== 'undefined' ? lang : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    document.getElementById('home')?.classList.add('active');

    const authData = this.getAuthUser();
    this.levelId = authData?.levelId;

    this.translateService.get('NEDSS.HOME.GENERAL_DATA_COMPLETION.UsersReport').subscribe((res: string) => {
      this.screenName = res;
    });

    this.getGovernments();
  }

  ngOnDestroy() {
    document.getElementById('home')?.classList.remove('active');
    this.usersSub?.unsubscribe();
  }

  private getAuthUser(): any {
    try {
      return JSON.parse(localStorage.getItem('ls.authorizationData'))?.user;
    } catch {
      return null;
    }
  }

  private showLoadError() {
    this.translateService
      .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
      .subscribe((res: string) => this.userMsg.error(res));
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService
      .getAllGovernments()
      .pipe(finalize(() => (this.governmentsLoading = false)))
      .subscribe(
        (result: any) => {
          this.governments = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }, ...(result?.data ?? [])];
          const userGovernmentId = this.levelId != 1 ? this.getAuthUser()?.govenmentId : null;
          this.selectedGovernmentId = userGovernmentId ?? -1;
          this.governmentSelected();
        },
        () => {
          this.showLoadError();
          this.governmentSelected();
        }
      );
  }

  governmentSelected() {
    this.healthAdministrations = [];
    this.incidentSources = [];
    this.selectedHealthAdministrationId = -1;
    this.selectedIncidentSourceId = -1;
    this.userFilter.healthAdministrationId = null;
    this.userFilter.incidentSourceId = null;

    if (this.selectedGovernmentId > 0) {
      this.userFilter.govenmentId = this.selectedGovernmentId;
      this.getHealthAdministrations(this.selectedGovernmentId);
    } else {
      this.userFilter.govenmentId = null;
      this.search();
    }
  }

  getHealthAdministrations(governmentID: number) {
    this.healthAdministrationsLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .pipe(finalize(() => (this.healthAdministrationsLoading = false)))
      .subscribe(
        (result: any) => {
          this.healthAdministrations = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }, ...(result?.data ?? [])];
          const userHealthAdministrationId =
            this.levelId != 1 && this.levelId != 2 ? this.getAuthUser()?.healthAdministrationId : null;
          this.selectedHealthAdministrationId = userHealthAdministrationId ?? -1;
          this.healthAdministrationSelected();
        },
        () => {
          this.showLoadError();
          this.search();
        }
      );
  }

  healthAdministrationSelected() {
    this.incidentSources = [];
    this.selectedIncidentSourceId = -1;
    this.userFilter.incidentSourceId = null;

    if (this.selectedHealthAdministrationId > 0) {
      this.userFilter.healthAdministrationId = this.selectedHealthAdministrationId;
      this.getIncidentSources(this.selectedHealthAdministrationId);
    } else {
      this.userFilter.healthAdministrationId = null;
      this.search();
    }
  }

  getIncidentSources(healthAdministrationID: number) {
    this.incidentSourcesLoading = true;
    this.lookupsService
      .getPageIncidentSourceHospitals({ healthAdministrationID: healthAdministrationID })
      .pipe(finalize(() => (this.incidentSourcesLoading = false)))
      .subscribe(
        (result: any) => {
          this.incidentSources = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }, ...(result?.data ?? [])];
          const userIncidentSourceId =
            this.levelId != 1 && this.levelId != 2 && this.levelId != 3 ? this.getAuthUser()?.incidentSourceId : null;
          this.selectedIncidentSourceId = userIncidentSourceId ?? -1;
          this.onIncidentSourceChanged();
        },
        () => {
          this.showLoadError();
          this.search();
        }
      );
  }

  onIncidentSourceChanged() {
    this.userFilter.incidentSourceId = this.selectedIncidentSourceId > 0 ? this.selectedIncidentSourceId : null;
    this.search();
  }

  search() {
    this.first = 0;
    this.last = 0;
    this.userFilter.pageIndex = 0;
    this.getUsers();
  }

  paginate(event: any) {
    this.first = event.first;
    this.userFilter.pageIndex = event.page;
    this.userFilter.pageSize = event.rows;
    this.getUsers();
  }

  getUsers() {
    this.usersSub?.unsubscribe();
    this.loadingPanel = true;
    this.usersSub = this.lookupsService
      .getConnectedUsers(this.userFilter)
      .pipe(finalize(() => (this.loadingPanel = false)))
      .subscribe(
        (result: any) => {
          this.users = result?.data ?? [];
          if (this.users.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = this.users[0].totalCount ?? this.users.length;
            this.last = this.userFilter.pageIndex * this.userFilter.pageSize;
          }
        },
        () => {
          this.users = [];
          this.noData = true;
          this.pages = 0;
          this.showLoadError();
        }
      );
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }

  exportPatientsAsPdf() {
    this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  }
}
