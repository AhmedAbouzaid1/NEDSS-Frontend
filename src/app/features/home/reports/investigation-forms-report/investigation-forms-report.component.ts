import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { ReportLocationType } from '../enums/ReportLocationType';
import {
  InvestigationFormsDiseaseGroup,
  InvestigationFormsReportData,
  InvestigationFormsReportFilter,
  InvestigationFormsReportItem,
} from './investigation-form-field.model';
import { ExportColumn, InvestigationFormsExcelService } from './investigation-forms-excel.service';
import { InvestigationFormsReportService } from './investigation-forms-report.service';

type StatusFilter = 'all' | 'done' | 'notDone';

interface Option {
  id: any;
  arabicName: string;
  englishName: string;
}

const ROUTER_ALIASES: Record<string, string> = { animal: 'rabies' };
const ROUTERS_WITHOUT_DIRECT_ROUTE = new Set(['h5n1']);

@Component({
  selector: 'app-investigation-forms-report',
  templateUrl: './investigation-forms-report.component.html',
  styleUrls: ['./investigation-forms-report.component.css'],
  providers: [DatePipe],
})
export class InvestigationFormsReportComponent implements OnInit {
  readonly reportLocationType = ReportLocationType;
  readonly pageSizes = [10, 25, 50, 100];
  readonly multipleDropdownSettings = { ...MultipleDropdownSettings, enableCheckAll: false };
  readonly singleDropdownSettings = {
    ...MultipleDropdownSettings,
    singleSelection: true,
    enableCheckAll: false,
    closeDropDownOnSelection: true,
    allowSearchFilter: true,
  };
  readonly minDate = new Date(1900, 0, 1);
  readonly maxDate = new Date();

  isArabic = true;
  dir = 'rtl';

  diseaseGroups: InvestigationFormsDiseaseGroup[] = [];
  diseaseGroupsLoading = false;
  selectedDiseaseGroups: InvestigationFormsDiseaseGroup[] = [];

  fromDate: Date | null = null;
  toDate: Date | null = null;
  statusOptions: Option[] = [];
  selectedStatus: Option[] = [];
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

  report: InvestigationFormsReportData | null = null;
  columns: ExportColumn[] = [];
  groupSpans: { label: string; span: number }[] = [];
  rows: (string | number)[][] = [];
  private columnsCache: { router: string; columns: ExportColumn[] } | null = null;
  appliedFilter: InvestigationFormsReportFilter | null = null;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  exporting = false;
  submitted = false;

  constructor(
    private reportService: InvestigationFormsReportService,
    private excelService: InvestigationFormsExcelService,
    private lookups: LookupsGetterService,
    private translate: TranslateService,
    private userMsg: UserMessageService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.isArabic = (localStorage.getItem('ls.currentLang') || 'ar') === 'ar';
    this.dir = this.isArabic ? 'rtl' : 'ltr';
    this.statusOptions = (['STATUS_ALL', 'STATUS_DONE', 'STATUS_NOT_DONE'] as const).map((key, i) => ({
      id: (['all', 'done', 'notDone'] as StatusFilter[])[i],
      arabicName: this.translate.instant(`NEDSS.INVESTIGATION_FORMS_REPORT.${key}`),
      englishName: this.translate.instant(`NEDSS.INVESTIGATION_FORMS_REPORT.${key}`),
    }));
    this.selectedStatus = [this.statusOptions[0]];
    this.loadDiseaseGroups();
    this.loadGovernments();
  }

  get selectedDiseaseGroupId(): number | null {
    return this.selectedDiseaseGroups?.[0]?.id ?? null;
  }

  get status(): StatusFilter {
    return (this.selectedStatus?.[0]?.id as StatusFilter) ?? 'all';
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
    this.submitted = true;
    if (!this.selectedDiseaseGroupId) {
      this.warn('DISEASE_REQUIRED');
      return;
    }
    this.appliedFilter = this.buildFilter();
    this.pageIndex = 1;
    this.loadPage();
  }

  onPage(event: { first: number; rows: number }): void {
    this.pageSize = event.rows;
    this.pageIndex = Math.floor(event.first / event.rows) + 1;
    this.loadPage();
  }

  openForm(item: InvestigationFormsReportItem): void {
    const router = (this.report?.router || '').trim();
    const target = ROUTER_ALIASES[router] ?? router;
    if (!target || ROUTERS_WITHOUT_DIRECT_ROUTE.has(target)) {
      this.router.navigate(['/home/investigations/investigation-detailes', item.patientId]);
      return;
    }
    this.router.navigate(['/home', target, item.patientId, 'diseaseId', this.report!.diseaseGroupId]);
  }

  exportExcel(): void {
    if (!this.appliedFilter || !this.report?.totalCount) return;
    this.exporting = true;
    this.reportService
      .getExportData({ ...this.appliedFilter, pageIndex: 1, pageSize: this.report.totalCount })
      .pipe(finalize(() => (this.exporting = false)))
      .subscribe({
        next: (res) => {
          const data = res?.data;
          if (!data?.items?.length) {
            this.warn('NO_DATA');
            return;
          }
          this.excelService.export(data, { filters: this.describeFilters() });
          if (data.items.length < data.totalCount) {
            this.userMsg.warn(this.t('EXPORT_TRUNCATED', { count: data.items.length, total: data.totalCount }));
          }
        },
        error: (err) => this.handleError(err),
      });
  }

  private loadPage(): void {
    if (!this.appliedFilter) return;
    this.loading = true;
    this.reportService
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

  private setReport(report: InvestigationFormsReportData | null): void {
    this.report = report;
    if (!report) {
      this.columns = [];
      this.groupSpans = [];
      this.rows = [];
      return;
    }
    const hasForms = report.items.some((item) => !!item.form);
    let formColumns = this.excelService.buildFormColumns(report);
    if (hasForms) {
      this.columnsCache = { router: report.router, columns: formColumns };
    } else if (this.columnsCache?.router === report.router) {
      formColumns = this.columnsCache.columns;
    }
    const columns = [...this.excelService.patientColumns(), ...formColumns];
    this.columns = columns;
    this.groupSpans = this.excelService.groupSpans(columns);
    this.rows = report.items.map((item) => columns.map((c) => c.value(item)));
  }

  private buildFilter(): InvestigationFormsReportFilter {
    return {
      diseaseGroupId: this.selectedDiseaseGroupId!,
      reportLocationType: this.locationType,
      governmentsIds: (this.selectedGovernments ?? []).map((x) => x.id),
      healthAdministrationsIds: (this.selectedHealthAdministrations ?? []).map((x) => x.id),
      incidentSourcesIds: (this.selectedIncidentSources ?? []).map((x) => x.id),
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      isInvestigationDone: this.status === 'all' ? null : this.status === 'done',
      pageIndex: 1,
      pageSize: this.pageSize,
    };
  }

  private describeFilters(): [string, string][] {
    const names = (list: any[]) => (list ?? []).map((x) => (this.isArabic ? x.arabicName : x.englishName) || x.arabicName).join('، ');
    const all = this.t('STATUS_ALL');
    const statusKey = this.status === 'done' ? 'STATUS_DONE' : this.status === 'notDone' ? 'STATUS_NOT_DONE' : 'STATUS_ALL';
    return [
      [this.t('FROM_DATE'), this.formatDate(this.fromDate) || all],
      [this.t('TO_DATE'), this.formatDate(this.toDate) || all],
      [this.t('STATUS'), this.t(statusKey)],
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
    if (!(err instanceof HttpErrorResponse)) return;
    const message = (err.error?.messages ?? err.error?.Messages ?? [])[0];
    if (err.status === 403) {
      this.userMsg.error(this.t(message === 'DiseaseGroupAccessDenied' ? 'DISEASE_ACCESS_DENIED' : 'ACCESS_DENIED'));
      if (message !== 'DiseaseGroupAccessDenied') this.router.navigateByUrl('/home/reports');
    } else if (err.status === 400) {
      this.warn('DISEASE_REQUIRED');
    }
  }

  private formatDate(value: Date | null): string {
    return value ? this.datePipe.transform(value, 'dd/MM/yyyy') ?? '' : '';
  }

  private warn(key: string): void {
    this.userMsg.warn(this.t(key));
  }

  private t(key: string, params?: object): string {
    return this.translate.instant(`NEDSS.INVESTIGATION_FORMS_REPORT.${key}`, params);
  }
}
