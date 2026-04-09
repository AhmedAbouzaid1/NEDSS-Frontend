import { InvestigationService } from './../services/investigation.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InvestigationComponent } from '../investigation.component';
import { Router } from '@angular/router';
import { FormTemplateExportService } from 'src/app/core/services/form-template-export.service';

@Component({
  selector: 'app-complete-investigation',
  templateUrl: './complete-investigation.component.html',
  styleUrls: ['./complete-investigation.component.css'],
})
export class CompleteInvestigationComponent implements OnInit {
  @ViewChild('investigationContainer', { read: ElementRef })
  investigationContainer?: ElementRef<HTMLElement>;

  patientDiseases: any[];
  currentId: any;
  constructor(
    private investigation: InvestigationComponent,
    private Router: Router,
    public InvestigationService: InvestigationService,
    private formTemplateExportService: FormTemplateExportService
  ) { }

  ngOnInit() {
    this.currentId = this.InvestigationService.currentid;
    //;
    this.patientDiseases = this.InvestigationService.patientDiseases;
    if (this.patientDiseases.length >= 1) {
      this.InvestigationService.diseaseGroupID =
        this.patientDiseases[0].diseaseGroupId;
      //alert(JSON.stringify(this.patientDiseases));
      this.Router.navigateByUrl(
        '/home/investigations/compelete-investigation/' +
        this.patientDiseases[0].router
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
    //diseaseGroupID;
  }

  downloadFile() {
    const container = this.investigationContainer?.nativeElement;
    const form = container?.querySelector('form') as HTMLElement | null;
    if (!form) return;

    const diseaseSlug = this.getDiseaseSlug();
    const fileName = `${diseaseSlug}-investigation.xlsx`;
    this.formTemplateExportService.exportFormTemplate(form, fileName);
  }

  private getDiseaseSlug(): string {
    const url = this.Router.url || '';
    const lastSegment = url.split('/').filter(Boolean).pop() || 'investigation';
    return lastSegment.split('?')[0].split('#')[0];
  }
}
