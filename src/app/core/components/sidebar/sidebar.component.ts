import { Router, ActivatedRoute } from '@angular/router';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DiseaseFormService } from 'src/app/features/home/dashboard/components/disease-special-symptoms/services/disease-form.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  isCollapsed: Boolean = true;

  forms: any = [];
  lang: any;
  active: number = 0;
  userImage: any;
  username: any;
  reportRoutes: string[] = [
    '/home/reports',
    '/home/disease-based-on-gender',
    '/home/disease-based-on-result',
    '/home/disease-based-on-diagnosis',
    '/home/disease-based-on-age',
    '/home/disease-based-on-patient',
    '/home/user-report',
    '/home/zero-reporting-report',
    '/home/immediate-reporting-report',
    '/home/diseases-rules-report',
    '/home/roles-report',
    '/home/notInferring-report',
    '/home/populations-report',
    '/home/monitorUnitsPeparations-report',
    '/home/epidemiologicalThresholds-report',
    '/home/monitor-units-report',
    '/home/monitor-units-team-members-report',
    '/home/monitor-units-team-members-details-report',
  ];
  constructor(
    private router: Router,
    private diseaseFormService: DiseaseFormService,
    private lookupsService: LookupsGetterService
  ) {
    this.lang =
      localStorage.getItem('ls.currentLang') != undefined
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.getSideForms();
    this.userImage = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.profilePic;
    this.username = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).userName;
  }
  ngOnInit(): void {
    this.Customdisplay();
    this.loadChartsTabVisibility();
  }

  loadChartsTabVisibility(): void {
    this.lookupsService.getChartsTabEnabled().subscribe(
      (result: any) => {
        const value = result != null ? result.data : null;
        const normalized =
          typeof value === 'string' ? value.toLowerCase() : value;
        const disabled = normalized === false || normalized === 'false';
        // The charts <li> is shown by Customdisplay() via the user's permitted
        // pages (or the admin force-show loop). When the setting is off we
        // force it hidden regardless; when on we leave Customdisplay's result.
        if (disabled) {
          const el = document.getElementById('1');
          if (el != null) {
            el.style.setProperty('display', 'none');
          }
        }
      },
      () => {}
    );
  }
  Customdisplay(): void {
    let userPremitedPages: any[] = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).pages;
    userPremitedPages.forEach((element) => {
      let menuItem: HTMLElement = document.getElementById(element.id);
      if (menuItem != null) {
        menuItem.style.setProperty('display', 'block');
      }
    });
    const hasSurveyPermission = userPremitedPages.some(
      (p) => p.id == 200 || p.id == 201
    );
    if (hasSurveyPermission) {
      const investigationsMenu = document.getElementById('10');
      if (investigationsMenu != null) {
        investigationsMenu.style.setProperty('display', 'block');
      }
    }
    let userName = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).userName;
    if (userName == 'admin@admin.com') {
      const ul = document.getElementById('MainSidbar');
      const listItems = ul.getElementsByTagName('li');
      for (let i = 0; i <= listItems.length - 1; i++) {
        listItems[i].style.setProperty('display', 'block');
      }
    }
  }
  showDetails(id: number) {
    if (id == 1) this.router.navigate(['../chart']);
  }

  getSideForms() {
    this.diseaseFormService.getSideBar().subscribe(
      (res) => {
        this.forms = res.data;
      },
      (err) => { }
    );
  }

  isReportsActive(): boolean {
    const currentUrl = this.router.url.split('?')[0];
    const knownReportRoute = this.reportRoutes.some((route) =>
      currentUrl.startsWith(route)
    );

    if (knownReportRoute) {
      return true;
    }
    return /^\/home\/.*report/i.test(currentUrl);
  }

  navigateTo() {
    this.router.navigateByUrl('/home/redirect', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home/investigations'])
    });
  }
}
