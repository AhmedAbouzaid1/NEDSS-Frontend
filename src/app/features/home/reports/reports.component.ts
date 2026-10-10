import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DiseaseBasedOnGenderComponent } from './disease-based-on-gender/disease-based-on-gender.component';
import { DiseaseBasedOnResultComponent } from './disease-based-on-result/disease-based-on-result.component';
import { DiseaseBasedOnDiagnosisComponent } from './disease-based-on-diagnosis/disease-based-on-diagnosis.component';
import { DiseaseBasedOnAgeComponent } from './disease-based-on-age/disease-based-on-age.component';
import { DiseaseBasedOnPatientComponent } from './disease-based-on-patient/disease-based-on-patient.component';
import { InvestigationFormsReportComponent } from './investigation-forms-report/investigation-forms-report.component';
import { UserReportComponent } from './user-report/user-report.component';
import { ZeroReportingReportComponent } from './zero-reporting-report/zero-reporting-report.component';
import { ImmediateReportingReportComponent } from './immediate-reporting-report/immediate-reporting-report.component';
import { DiseasesRulesReportComponent } from './diseases-rules-report/diseases-rules-report.component';
import { RolesReportComponent } from './roles-report/roles-report.component';
import { NotInferringReportComponent } from './not-inferring-report/not-inferring-report.component';
import { PopulationsReportComponent } from './populations-report/populations-report.component';
import { MonitorUnitsPeparationsReportComponent } from './monitor-units-peparations-report/monitor-units-peparations-report.component';
import { MonitorUnitsReportComponent } from './monitor-units-report/monitor-units-report.component';
import { MonitorUnitsTeamMembersReportComponent } from './monitor-units-team-members-report/monitor-units-team-members-report.component';
import { MonitorUnitsTeamMembersDetailsReportComponent } from './monitor-units-team-members-details-report/monitor-units-team-members-details-report.component';

interface ReportItem {
  key: string;
  labelKey: string;
  component: Type<unknown>;
}

interface ReportOption {
  key: string;
  label: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  reports: ReportItem[] = [
    { key: 'disease-based-on-gender', labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnGender', component: DiseaseBasedOnGenderComponent },
    { key: 'disease-based-on-result', labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnResult', component: DiseaseBasedOnResultComponent },
    { key: 'disease-based-on-diagnosis', labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnDiagnosis', component: DiseaseBasedOnDiagnosisComponent },
    { key: 'disease-based-on-age', labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnAge', component: DiseaseBasedOnAgeComponent },
    { key: 'disease-based-on-patient', labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnPatient', component: DiseaseBasedOnPatientComponent },
    { key: 'investigation-forms-report', labelKey: 'NEDSS.REPORTS_LABELS.InvestigationFormsReport', component: InvestigationFormsReportComponent },
    { key: 'user-report', labelKey: 'NEDSS.REPORTS_LABELS.UserReports', component: UserReportComponent },
    { key: 'zero-reporting-report', labelKey: 'NEDSS.REPORTS_LABELS.ZeroReportingReport', component: ZeroReportingReportComponent },
    { key: 'immediate-reporting-report', labelKey: 'NEDSS.REPORTS_LABELS.ImmediateReportingReport', component: ImmediateReportingReportComponent },
    { key: 'diseases-rules-report', labelKey: 'NEDSS.REPORTS_LABELS.DISEASES_RULES_REPORT', component: DiseasesRulesReportComponent },
    { key: 'roles-report', labelKey: 'NEDSS.REPORTS_LABELS.RulesReport', component: RolesReportComponent },
    { key: 'notInferring-report', labelKey: 'NEDSS.REPORTS_LABELS.NotInferringReport', component: NotInferringReportComponent },
    { key: 'populations-report', labelKey: 'NEDSS.REPORTS_LABELS.POPULATIONS_REPORT', component: PopulationsReportComponent },
    { key: 'monitorUnitsPeparations-report', labelKey: 'NEDSS.REPORTS_LABELS.MonitorUnitsPeparationsReport', component: MonitorUnitsPeparationsReportComponent },
    { key: 'monitor-units-report', labelKey: 'NEDSS.REPORTS_LABELS.MonitorUnitsReport', component: MonitorUnitsReportComponent },
    { key: 'monitor-units-team-members-report', labelKey: 'NEDSS.REPORTS_LABELS.MonitorUnitsTeamMembers', component: MonitorUnitsTeamMembersReportComponent },
    { key: 'monitor-units-team-members-details-report', labelKey: 'NEDSS.REPORTS_LABELS.MonitorUnitsTeamDetailsMembers', component: MonitorUnitsTeamMembersDetailsReportComponent },
  ];

  reportOptions: ReportOption[] = [];
  selectedKey: string | null = null;
  selectedReport: ReportItem | null = null;

  private subscriptions = new Subscription();

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    if (incidentInfoLink) {
      incidentInfoLink.classList.remove('active');
    }

    this.buildOptions();
    this.subscriptions.add(this.translate.onLangChange.subscribe(() => this.buildOptions()));
    this.subscriptions.add(
      this.route.queryParamMap.subscribe((params) => {
        const key = params.get('report');
        this.selectedReport = this.reports.find((r) => r.key === key) ?? null;
        this.selectedKey = this.selectedReport?.key ?? null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onReportChange(key: string | null): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { report: key || null },
      replaceUrl: true,
    });
  }

  private buildOptions(): void {
    this.reportOptions = this.reports.map((r) => ({
      key: r.key,
      label: String(this.translate.instant(r.labelKey)),
    }));
  }
}
