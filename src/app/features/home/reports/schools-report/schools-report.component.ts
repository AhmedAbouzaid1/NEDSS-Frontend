import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { ReportDateRangeService } from 'src/app/core/services/report-date-range.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { FinalDiagnosisOption, finalDiagnosisOptionsWithOther } from 'src/app/core/shared/utilis/final-diagnoses';
import { ReportLocationType } from '../enums/ReportLocationType';
import { SchoolsReportData, SchoolsReportDiseaseGroup, SchoolsReportFilter, schoolsReportRowSpans } from './schools-report.model';
import { SchoolsReportService } from './schools-report.service';
import { SchoolsReportExcelService } from './schools-report-excel.service';

@Component({
  selector: 'app-schools-report',
  templateUrl: './schools-report.component.html',
  styleUrls: ['./schools-report.component.css'],
  providers: [DatePipe],
})
export class SchoolsReportComponent implements OnInit, OnDestroy {
  private readonly reportDateRange = inject(ReportDateRangeService);
  readonly reportLocationType = ReportLocationType;
  readonly pageSizes = [10, 25, 50, 100];
  readonly multipleDropdownSettings = { ...MultipleDropdownSettings, enableCheckAll: false };
  readonly minDate = new Date(1900, 0, 1);
  readonly maxDate = new Date();

  isArabic = true;
  dir = 'rtl';

  diseaseGroups: SchoolsReportDiseaseGroup[] = [];
  diseaseGroupsLoading = false;
  selectedDiseaseGroups: SchoolsReportDiseaseGroup[] = [];
  finalDiagnoses: FinalDiagnosisOption[] = [];
  finalDiagnosesLoading = false;
  selectedFinalDiagnoses: FinalDiagnosisOption[] = [];

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

  report: SchoolsReportData | null = null;
  rowSpans: Record<string, number>[] = [];
  appliedFilter: SchoolsReportFilter | null = null;
  private appliedFilterDescription: [string, string][] = [];
  private pageRequest?: Subscription;
  pageIndex = 1;
  pageSize = 10;
  loading = false;
  exporting = false;

  constructor(
    private reportService: SchoolsReportService,
    private excelService: SchoolsReportExcelService,
    private lookups: LookupsGetterService,
    private translate: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe
  ) {}

  ngOnDestroy(): void {
    this.pageRequest?.unsubscribe();
  }

  ngOnInit(): void {
    this.isArabic = (localStorage.getItem('ls.currentLang') || 'ar') === 'ar';
    this.dir = this.isArabic ? 'rtl' : 'ltr';
    this.loadDiseaseGroups();
    this.loadFinalDiagnoses();
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
    if (!this.reportDateRange.validate(this.fromDate, this.toDate)) {
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
    if (!this.appliedFilter || !this.report?.totalCount) return;
    this.exporting = true;
    this.reportService
      .getExportData({ ...this.appliedFilter, pageIndex: 1, pageSize: this.report.totalCount })
      .pipe(finalize(() => (this.exporting = false)))
      .subscribe((res) => {
        const data = res?.data;
        if (!data?.items?.length) {
          this.userMsg.warn(this.t('NO_DATA'));
          return;
        }
        this.excelService.export(data, this.appliedFilterDescription);
        if (data.items.length < data.totalCount) {
          this.userMsg.warn(this.t('EXPORT_TRUNCATED', { count: data.items.length, total: data.totalCount }));
        }
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
        error: () => this.setReport(null),
      });
  }

  private setReport(report: SchoolsReportData | null): void {
    this.report = report;
    this.rowSpans = schoolsReportRowSpans(report?.items ?? []);
  }

  private buildFilter(): SchoolsReportFilter {
    return {
      diseaseGroupsIds: (this.selectedDiseaseGroups ?? []).map((x) => x.id),
      finalDiseasesIds: (this.selectedFinalDiagnoses ?? []).map((x) => x.id),
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
      [this.t('FINAL_DIAGNOSIS'), names(this.selectedFinalDiagnoses) || all],
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
      .subscribe((res) => (this.diseaseGroups = res?.data ?? []));
  }

  private loadFinalDiagnoses(): void {
    this.finalDiagnosesLoading = true;
    this.lookups
      .getAllDiseases()
      .pipe(finalize(() => (this.finalDiagnosesLoading = false)))
      .subscribe((res: any) => (this.finalDiagnoses = finalDiagnosisOptionsWithOther(res?.data ?? [])));
  }

  private loadGovernments(): void {
    this.governmentsLoading = true;
    this.lookups
      .getAllGovernmentsForUser(true)
      .pipe(finalize(() => (this.governmentsLoading = false)))
      .subscribe((res: any) => (this.governments = res?.data ?? []));
  }

  private formatDate(value: Date | null): string {
    return value ? this.datePipe.transform(value, 'dd/MM/yyyy') ?? '' : '';
  }

  private t(key: string, params?: object): string {
    return this.translate.instant(`NEDSS.SCHOOLS_REPORT.${key}`, params);
  }
}
