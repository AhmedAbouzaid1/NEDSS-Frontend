import { InvestigationService } from './../services/investigation.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InvestigationComponent } from '../investigation.component';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { FormTemplateExportService } from 'src/app/core/services/form-template-export.service';
import { PagePermissionService } from 'src/app/core/services/page-permission.service';
import { ENTOMOLOGICAL_ROUTES } from './entomological/entomological.constants';

interface InvestigationTab {
  diseaseGroupId: number;
  router: string;
  arabicName: string;
  entomological: boolean;
}

@Component({
  selector: 'app-complete-investigation',
  templateUrl: './complete-investigation.component.html',
  styleUrls: ['./complete-investigation.component.css'],
})
export class CompleteInvestigationComponent implements OnInit {
  @ViewChild('investigationContainer', { read: ElementRef })
  investigationContainer?: ElementRef<HTMLElement>;
  @ViewChild('diseaseStrip', { read: ElementRef })
  diseaseStrip?: ElementRef<HTMLElement>;
  private routerSub?: Subscription;

  patientDiseases: InvestigationTab[];
  hiddenDiseasesCount = 0;
  currentId: any;
  constructor(
    private investigation: InvestigationComponent,
    private Router: Router,
    public InvestigationService: InvestigationService,
    private formTemplateExportService: FormTemplateExportService,
    private pagePermission: PagePermissionService
  ) { }

  ngOnInit() {
    this.currentId = this.InvestigationService.currentid;
    const allDiseases = this.InvestigationService.patientDiseases || [];
    this.patientDiseases = this.buildTabs(allDiseases);
    this.hiddenDiseasesCount = this.patientDiseases.length ? 0 : allDiseases.length;
    const firstDisease = this.patientDiseases[0];
    if (firstDisease && firstDisease.router) {
      this.setDesiese(firstDisease);
    }
    this.routerSub = this.Router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => this.revealActiveDisease()));
  }

  private revealActiveDisease(): void {
    const strip = this.diseaseStrip?.nativeElement;
    const active = strip?.querySelector('.disease-tab.active') as HTMLElement | null;
    if (!strip || !active || strip.scrollWidth <= strip.clientWidth) {
      return;
    }
    const stripRect = strip.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    strip.scrollTo({
      left: strip.scrollLeft + activeRect.left - stripRect.left - (stripRect.width - activeRect.width) / 2,
      behavior: 'smooth',
    });
  }

  private buildTabs(diseases: any[]): InvestigationTab[] {
    const tabs: InvestigationTab[] = [];
    diseases.forEach((d) => {
      if (d?.router && this.pagePermission.canAccessInvestigationForm(d?.diseaseGroupId)) {
        tabs.push({ diseaseGroupId: d.diseaseGroupId, router: d.router, arabicName: d.arabicName, entomological: false });
      }
      const entomologicalRoute = ENTOMOLOGICAL_ROUTES[Number(d?.entomologicalFormType)];
      if (entomologicalRoute && this.pagePermission.canAccessEntomologicalForm(d?.diseaseGroupId)) {
        tabs.push({
          diseaseGroupId: d.diseaseGroupId,
          router: entomologicalRoute,
          arabicName: 'تقصي حشرى - ' + d.arabicName,
          entomological: true,
        });
      }
    });
    return tabs;
  }
  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    if (this.Router.url == '/home/investigations/complete-investigation') {
      this.InvestigationService.view = false;
    } else {
      this.InvestigationService.view = true;
    }
  }
  isSelected(item: InvestigationTab): boolean {
    const isEntomologicalUrl = Object.values(ENTOMOLOGICAL_ROUTES).some((r) => this.Router.url.includes('/' + r));
    return (
      item?.diseaseGroupId != null &&
      item.diseaseGroupId == this.InvestigationService.diseaseGroupID &&
      item.entomological === isEntomologicalUrl
    );
  }

  setDesiese(item: InvestigationTab) {
    this.InvestigationService.diseaseGroupID = item.diseaseGroupId;
    this.Router.navigateByUrl(
      '/home/investigations/complete-investigation/' + item.router +
        (item.entomological ? '?diseaseGroupId=' + item.diseaseGroupId : ''),
      { replaceUrl: true }
    );
  }

  downloadFile() {
    const container = this.investigationContainer?.nativeElement;
    if (!container) return;

    const form = container.querySelector('form') as HTMLElement | null;
    const root = form || container;

    const diseaseSlug = this.getDiseaseSlug();
    const fileName = `${diseaseSlug}-investigation.xlsx`;
    this.formTemplateExportService.exportFormTemplate(root, fileName);
  }

  private getDiseaseSlug(): string {
    const url = this.Router.url || '';
    const lastSegment = url.split('/').filter(Boolean).pop() || 'investigation';
    return lastSegment.split('?')[0].split('#')[0];
  }
}
