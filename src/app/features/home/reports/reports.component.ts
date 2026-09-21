import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface ReportItem {
  route: string;
  labelKey: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent {
  searchTerm = '';

  reports: ReportItem[] = [
    {
      route: '/home/disease-based-on-gender',
      labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnGender',
    },
    {
      route: '/home/disease-based-on-result',
      labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnResult',
    },
    {
      route: '/home/disease-based-on-diagnosis',
      labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnDiagnosis',
    },
    {
      route: '/home/disease-based-on-age',
      labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnAge',
    },
    {
      route: '/home/disease-based-on-patient',
      labelKey: 'NEDSS.REPORTS_LABELS.DiseseBasedOnPatient',
    },
    {
      route: '/home/user-report',
      labelKey: 'NEDSS.REPORTS_LABELS.UserReports',
    },
    {
      route: '/home/zero-reporting-report',
      labelKey: 'NEDSS.REPORTS_LABELS.ZeroReportingReport',
    },
    {
      route: '/home/immediate-reporting-report',
      labelKey: 'NEDSS.REPORTS_LABELS.ImmediateReportingReport',
    },
    {
      route: '/home/diseases-rules-report',
      labelKey: 'NEDSS.REPORTS_LABELS.DISEASES_RULES_REPORT',
    },
    {
      route: '/home/roles-report',
      labelKey: 'NEDSS.REPORTS_LABELS.RulesReport',
    },
    {
      route: '/home/notInferring-report',
      labelKey: 'NEDSS.REPORTS_LABELS.NotInferringReport',
    },
    {
      route: '/home/populations-report',
      labelKey: 'NEDSS.REPORTS_LABELS.POPULATIONS_REPORT',
    },
    {
      route: '/home/monitorUnitsPeparations-report',
      labelKey: 'NEDSS.REPORTS_LABELS.MonitorUnitsPeparationsReport',
    },
    {
      route: '/home/monitor-units-report',
      labelKey: 'NEDSS.REPORTS_LABELS.MonitorUnitsReport',
    },
    {
      route: '/home/monitor-units-team-members-report',
      labelKey: 'NEDSS.REPORTS_LABELS.MonitorUnitsTeamMembers',
    },
    {
      route: '/home/monitor-units-team-members-details-report',
      labelKey: 'NEDSS.REPORTS_LABELS.MonitorUnitsTeamDetailsMembers',
    },
  ];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    const incidentInfoLink = document.getElementById('incidentInfo') as HTMLElement;
    if (incidentInfoLink) {
      incidentInfoLink.classList.remove('active');
    }
  }

  get filteredReports(): ReportItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.reports;
    }

    return this.reports.filter((report) => {
      const translatedLabel = String(this.translate.instant(report.labelKey)).toLowerCase();
      return translatedLabel.includes(term) || report.route.toLowerCase().includes(term);
    });
  }
}
