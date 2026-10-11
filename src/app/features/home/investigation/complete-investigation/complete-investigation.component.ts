import { InvestigationService } from './../services/investigation.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InvestigationComponent } from '../investigation.component';
import { Router } from '@angular/router';
import { FormTemplateExportService } from 'src/app/core/services/form-template-export.service';
import { PagePermissionService } from 'src/app/core/services/page-permission.service';

@Component({
  selector: 'app-complete-investigation',
  templateUrl: './complete-investigation.component.html',
  styleUrls: ['./complete-investigation.component.css'],
})
export class CompleteInvestigationComponent implements OnInit {
  @ViewChild('investigationContainer', { read: ElementRef })
  investigationContainer?: ElementRef<HTMLElement>;

  patientDiseases: any[];
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
    this.patientDiseases = allDiseases.filter((d) =>
      this.pagePermission.canAccessInvestigationForm(d?.diseaseGroupId)
    );
    this.hiddenDiseasesCount = allDiseases.length - this.patientDiseases.length;
    const firstDisease = this.patientDiseases[0];
    if (firstDisease && firstDisease.router) {
      this.InvestigationService.diseaseGroupID = firstDisease.diseaseGroupId;
      this.Router.navigateByUrl(
        '/home/investigations/compelete-investigation/' + firstDisease.router,
        { replaceUrl: true }
      );
    }
  }
  ngOnDestroy(): void {
    if (this.Router.url == '/home/investigations/compelete-investigation') {
      this.InvestigationService.view = false;
    } else {
      this.InvestigationService.view = true;
    }
  }
  setDesiese(item: any) {
    this.InvestigationService.diseaseGroupID = item.diseaseGroupId;
    this.Router.navigateByUrl(
      '/home/investigations/compelete-investigation/' + item.router,
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
