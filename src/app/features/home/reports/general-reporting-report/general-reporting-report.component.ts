import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PagePermissionService } from 'src/app/core/services/page-permission.service';
import { ReportLocationType } from '../enums/ReportLocationType';
import {
  GeneralReportingDiseaseGroup,
  GeneralReportingReportData,
  GeneralReportingReportFilter,
} from './general-reporting-report.model';
import { GeneralReportingReportService } from './general-reporting-report.service';
import { GeneralReportingExcelService } from './general-reporting-excel.service';

export const GENERAL_REPORTING_REPORT_PAGE_ID = 100;
export const GENERAL_REPORTING_EXPORT_PAGE_ID = 101;

@Component({
  selector: 'app-general-reporting-report',
  templateUrl: './general-reporting-report.component.html',
  styleUrls: ['./general-reporting-report.component.css'],
  providers: [DatePipe],
})
export class GeneralReportingReportComponent implements OnInit, OnDestroy {
  readonly reportLocationType = ReportLocationType;
  readonly pageSizes = [10, 25, 50, 100];
  readonly multipleDropdownSettings = { ...MultipleDropdownSettings, enableCheckAll: false };
  readonly minDate = new Date(1900, 0, 1);
  readonly maxDate = new Date();

  isArabic = true;
  dir = 'rtl';

  diseaseGroups: GeneralReportingDiseaseGroup[] = [];
  diseaseGroupsLoading = false;
  selectedDiseaseGroups: GeneralReportingDiseaseGroup[] = [];

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

  report: GeneralReportingReportData | null = null;
  groupSpans: { label: string; span: number }[] = [];
  appliedFilter: GeneralReportingReportFilter | null = null;
  private appliedFilterDescription: [string, string][] = [];
  private pageRequest?: Subscription;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  exporting = false;
  canExport = false;

  constructor(
    private reportService: GeneralReportingReportService,
    private excelService: GeneralReportingExcelService,
    private lookups: LookupsGetterService,
    private translate: TranslateService,
    private userMsg: UserMessageService,
    private router: Router,
    private datePipe: DatePipe,
    private pagePermission: PagePermissionService
  ) {}

  ngOnDestroy(): void {
    this.pageRequest?.unsubscribe();
  }

  ngOnInit(): void {
    this.isArabic = (localStorage.getItem('ls.currentLang') || 'ar') === 'ar';
    this.dir = this.isArabic ? 'rtl' : 'ltr';
    this.canExport = this.pagePermission.canAccessPage(GENERAL_REPORTING_EXPORT_PAGE_ID);
    this.loadDiseaseGroups();
    this.loadGovernments();
  }

  get nodata(): boolean {
    return !this.report || this.report.totalCount === 0;
  }

  get locationSuffix(): string {
    return this.locationType === ReportLocationType.Residence ? 'RESIDENCE' : 'REPORTING';
  }

  get firstRow(): number {
    return (this.pageIndex - 1) * this.pageSize;
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
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      this.userMsg.warn(this.t('INVALID_DATE_RANGE'));
      return;
    }
    this.appliedFilter = this.buildFilter();
    this.appliedFilterDescription = this.describeFilters();
    this.pageIndex = 1;
    this.loadPage();
  }

  onPage(event: { first: number; rows: number }): void {
    this.pageSize = event.rows;
    this.pageIndex = Math.floor(event.first / event.rows) + 1;
    this.loadPage();
  }

  exportExcel(): void {
    if (!this.canExport) {
      this.userMsg.error(this.t('EXPORT_DENIED'));
      return;
    }
    if (!this.appliedFilter || !this.report?.totalCount) return;
    this.exporting = true;
    this.reportService
      .getExportData({ ...this.appliedFilter, pageIndex: 1, pageSize: this.report.totalCount })
      .pipe(finalize(() => (this.exporting = false)))
      .subscribe({
        next: (res) => {
          const data = res?.data;
          if (!data?.items?.length) {
            this.userMsg.warn(this.t('NO_DATA'));
            return;
          }
          this.excelService.export(data, this.appliedFilterDescription);
          if (data.items.length < data.totalCount) {
            this.userMsg.warn(this.t('EXPORT_TRUNCATED', { count: data.items.length, total: data.totalCount }));
          }
        },
        error: (err) => this.handleError(err),
      });
  }

  private loadPage(): void {
    if (!this.appliedFilter) return;
    this.pageRequest?.unsubscribe();
    this.loading = true;
    this.pageRequest = this.reportService
      .getReport({ ...this.appliedFilter, pageIndex: this.pageIndex, pageSize: this.pageSize })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => this.setReport(res?.data ?? null),
        error: (err) => {
          this.setReport(null);
          this.handleError(err);
        },
      });
  }

  private setReport(report: GeneralReportingReportData | null): void {
    this.report = report;
    this.groupSpans = [];
    for (const column of report?.columns ?? []) {
      const last = this.groupSpans[this.groupSpans.length - 1];
      if (last && last.label === column.group) last.span++;
      else this.groupSpans.push({ label: column.group, span: 1 });
    }
  }

  private buildFilter(): GeneralReportingReportFilter {
    return {
      diseaseGroupsIds: (this.selectedDiseaseGroups ?? []).map((x) => x.id),
      reportLocationType: this.locationType,
      governmentsIds: (this.selectedGovernments ?? []).map((x) => x.id),
      healthAdministrationsIds: (this.selectedHealthAdministrations ?? []).map((x) => x.id),
      incidentSourcesIds: (this.selectedIncidentSources ?? []).map((x) => x.id),
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      pageIndex: 1,
      pageSize: this.pageSize,
    };
  }

  private describeFilters(): [string, string][] {
    const names = (list: any[]) => (list ?? []).map((x) => (this.isArabic ? x.arabicName : x.englishName) || x.arabicName).join('، ');
    const all = this.t('ALL');
    return [
      [this.t('FROM_DATE'), this.formatDate(this.fromDate) || all],
      [this.t('TO_DATE'), this.formatDate(this.toDate) || all],
      [this.t('DISEASE'), names(this.selectedDiseaseGroups) || all],
      [this.t('LOCATION_TYPE'), this.t(this.locationSuffix)],
      [this.t('GOVERNMENT_' + this.locationSuffix), names(this.selectedGovernments) || all],
      [this.t('ADMINISTRATION_' + this.locationSuffix), names(this.selectedHealthAdministrations) || all],
      [this.t('SOURCE_' + this.locationSuffix), names(this.selectedIncidentSources) || all],
    ];
  }

  private loadDiseaseGroups(): void {
    this.diseaseGroupsLoading = true;
    this.reportService
      .getDiseaseGroups()
      .pipe(finalize(() => (this.diseaseGroupsLoading = false)))
      .subscribe({
        next: (res) => (this.diseaseGroups = res?.data ?? []),
        error: (err) => this.handleError(err),
      });
  }

  private loadGovernments(): void {
    this.governmentsLoading = true;
    this.lookups
      .getAllGovernmentsForUser(true)
      .pipe(finalize(() => (this.governmentsLoading = false)))
      .subscribe((res: any) => (this.governments = res?.data ?? []));
  }

  private handleError(err: any): void {
    if (!(err instanceof HttpErrorResponse) || err.status !== 403) return;
    const message = (err.error?.messages ?? err.error?.Messages ?? [])[0];
    if (message === 'ReportExportDenied') {
      this.canExport = false;
      this.userMsg.error(this.t('EXPORT_DENIED'));
    } else {
      this.userMsg.error(this.t('ACCESS_DENIED'));
      this.router.navigateByUrl('/home/reports');
    }
  }

  private formatDate(value: Date | null): string {
    return value ? this.datePipe.transform(value, 'dd/MM/yyyy') ?? '' : '';
  }

  private t(key: string, params?: object): string {
    return this.translate.instant(`NEDSS.GENERAL_REPORTING_REPORT.${key}`, params);
  }
}
