import { Component, NgZone, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../core/services/notificationService.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConnectionService } from 'angular-connection-service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UiLoadingService } from 'src/app/core/services/ui-loading.service';
import { ActiveUserService } from 'src/app/core/services/active-user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  hasNetworkConnection: boolean = true;
  hasInternetAccess: boolean = true;
  incidentsForOrg: number[];
  lang: any;
  notifications: any;
  constructor(
    private lookupsService: LookupsGetterService,
    private translate: TranslateService,
    private router: Router,
    private uiLoadingService: UiLoadingService,
    private notificationService: NotificationService,
    private connectionService: ConnectionService,
    private activeUSerService: ActiveUserService,
    private ngZone: NgZone
  ) {
    this.ngZone.runOutsideAngular(() => {
      this.connectionService.monitor().subscribe((currentState: any) => {
        this.hasNetworkConnection = currentState.hasNetworkConnection;
        this.hasInternetAccess = currentState.hasInternetAccess;
      });
    });
    this.lang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.translate.setDefaultLang(this.lang);
    translate.use(this.lang);

    const authData = JSON.parse(localStorage.getItem('ls.authorizationData'));
    if (!authData?.userName) {
      this.router.navigateByUrl('');
      return;
    }
    this.activeUSerService.setAccessibleParts();
  }
  public isOnline() {
    return this.hasNetworkConnection;
  }
  ngOnInit() {
    this.uiLoadingService.isLoading = true;
    document.getElementById('incidentInfo')?.classList.remove('active');

    //REMOVE THIS IF INCIDENTS FOR ORGANIZATION HANDLED IN THE BACKEND LATER ON
    // this.lookupsService
    //   .getPageIncidentSourceHospitals({
    //     healthAdministrationID: -1,
    //     reportingOrResidence: -1,
    //   })
    //   .subscribe((result: any) => {
    //     let incidentsAllowed = result.data.map((inc) => inc.id);
    //     this.lookupsService.incidentsForOrg = incidentsAllowed;
    //     localStorage.setItem(
    //       'incidentsForOrg',
    //       JSON.stringify(incidentsAllowed)
    //     );
    //   });
    this.uiLoadingService.isLoading = false;
  }
}
