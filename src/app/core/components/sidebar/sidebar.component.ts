import { Router, ActivatedRoute } from '@angular/router';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DiseaseFormService } from 'src/app/features/home/dashboard/components/disease-special-symptoms/services/disease-form.service';
import { LayoutService } from '../../services/layout.service';

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
  constructor(
    private router: Router,
    private diseaseFormService: DiseaseFormService,
    private layout: LayoutService
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

  changeReport(i) {
    this.layout.report = i;
  }
  navigateTo() {
    this.router.navigateByUrl('/home/redirect', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home/investigations'])
    });
  }
}
