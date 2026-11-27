import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { ExportService } from 'src/app/core/services/export.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { ReportDateRangeService } from 'src/app/core/services/report-date-range.service';
import { ReportLocationType } from '../enums/ReportLocationType';
import {
  ReportedCasesReportData,
  ReportedCasesReportDiseaseGroup,
  ReportedCasesReportFilter,
  ReportedCasesReportLevel,
} from './reported-cases-report.model';
import { ReportedCasesReportService } from './reported-cases-report.service';

@Component({
  selector: 'app-reported-cases-report',
  templateUrl: './reported-cases-report.component.html',
  styleUrls: ['./reported-cases-report.component.css'],
  providers: [DatePipe],
})
export class ReportedCasesReportComponent implements OnInit, OnDestroy {
  private readonly reportDateRange = inject(ReportDateRangeService);
  readonly reportLocationType = ReportLocationType;
  readonly level = ReportedCasesReportLevel;
  readonly multipleDropdownSettings = { ...MultipleDropdownSettings, enableCheckAll: false };
  readonly minDate = new Date(1900, 0, 1);
  readonly maxDate = new Date();

  isArabic = true;
  dir = 'rtl';

  diseaseGroups: ReportedCasesReportDiseaseGroup[] = [];
  diseaseGroupsLoading = false;
  selectedDiseaseGroups: ReportedCasesReportDiseaseGroup[] = [];

  fromDate: Date | null = null;
  toDate: Date | null = null;
  locationType: ReportLocationType = ReportLocationType.Reporting;

  governments: any[] = [];
  governmentsLoading = false;
  selectedGovernments: any[] = [];
  healthAdministrations: any[] = [];
  healthAdministrationsLoading = false;
  selectedHealthAdministrations: any[] = [];
  incidentSources: any[] = [];
  incidentSourcesLoading = false;
  selectedIncidentSources: any[] = [];

  report: ReportedCasesReportData | null = null;
  appliedLocationSuffix = 'REPORTING';
  searched = false;
  loading = false;
  private request?: Subscription;

  constructor(
    private reportService: ReportedCasesReportService,
    private lookups: LookupsGetterService,
    private exportService: ExportService,
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.isArabic = (localStorage.getItem('ls.currentLang') || 'ar') === 'ar';
    this.dir = this.isArabic ? 'rtl' : 'ltr';
    this.loadDiseaseGroups();
    this.loadGovernments();
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  get nodata(): boolean {
    return !this.report || this.report.totalCount === 0;
  }

  get locationSuffix(): string {
    return this.locationType === ReportLocationType.Residence ? 'RESIDENCE' : 'REPORTING';
  }

  get columnCount(): number {
    return this.report?.level ?? ReportedCasesReportLevel.Government;
  }

  onGovernmentsChanged(): void {
    this.selectedHealthAdministrations = [];
    this.selectedIncidentSources = [];
    this.incidentSources = [];
    const ids = (this.selectedGovernments ?? []).map((g) => g.id);
    if (!ids.length) {
      this.healthAdministrations = [];
      return;
    }
    this.healthAdministrationsLoading = true;
    this.lookups
      .getHealthAdministrationsIncidentByGovernmentsIds({ governmentsIds: ids, forSystemUser: true })
      .pipe(finalize(() => (this.healthAdministrationsLoading = false)))
      .subscribe((res: any) => (this.healthAdministrations = res?.data ?? []));
  }

  onHealthAdministrationsChanged(): void {
    this.selectedIncidentSources = [];
    const ids = (this.selectedHealthAdministrations ?? []).map((h) => h.id);
    if (!ids.length) {
      this.incidentSources = [];
      return;
    }
    this.incidentSourcesLoading = true;
    this.lookups
      .getIncidentSourceHospitalsByGovernmentsIds({ healthAdministrationsIds: ids, forSystemUser: true })
      .pipe(finalize(() => (this.incidentSourcesLoading = false)))
      .subscribe((res: any) => (this.incidentSources = res?.data ?? []));
  }

  search(): void {
    if (!this.reportDateRange.validate(this.fromDate, this.toDate)) {
      return;
    }
    const filter = this.buildFilter();
    const suffix = this.locationSuffix;
    this.request?.unsubscribe();
    this.loading = true;
    this.request = this.reportService
      .getReport(filter)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.report = res?.data ?? null;
          this.appliedLocationSuffix = suffix;
          this.searched = true;
        },
        error: () => {
          this.report = null;
          this.searched = true;
        },
      });
  }

  exportExcel(): void {
    if (this.nodata) return;
    this.loading = true;
    setTimeout(() => {
      this.exportService.exportElementTableAsExcel('reportedCasesTable', this.translate.instant('NEDSS.REPORTED_CASES_REPORT.TITLE'));
      this.loading = false;
    }, 0);
  }

  private buildFilter(): ReportedCasesReportFilter {
    return {
      diseaseGroupsIds: (this.selectedDiseaseGroups ?? []).map((x) => x.id),
      reportLocationType: this.locationType,
      governmentsIds: (this.selectedGovernments ?? []).map((x) => x.id),
      healthAdministrationsIds: (this.selectedHealthAdministrations ?? []).map((x) => x.id),
      incidentSourcesIds: (this.selectedIncidentSources ?? []).map((x) => x.id),
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
    };
  }

  private loadDiseaseGroups(): void {
    this.diseaseGroupsLoading = true;
    this.reportService
      .getDiseaseGroups()
      .pipe(finalize(() => (this.diseaseGroupsLoading = false)))
      .subscribe((res) => (this.diseaseGroups = res?.data ?? []));
  }

  private loadGovernments(): void {
    this.governmentsLoading = true;
    this.lookups
      .getAllGovernmentsForUser(true)
      .pipe(finalize(() => (this.governmentsLoading = false)))
      .subscribe((res: any) => (this.governments = res?.data ?? []));
  }
}
