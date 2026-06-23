import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PatientModel } from '../../../general-data/models/patient-model';
import { SingleDropdownSettings, MultipleDropdownSettings } from 'src/app/core/constants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-disease-rules',
  templateUrl: './disease-rules.component.html',
  styleUrls: ['./disease-rules.component.css']
})
export class DiseaseRulesComponent implements OnInit {
  underDeleting = {
    sample: '',
    id: null
  };
  diseaseRule = {
    id: null,
    diseaseGroupId: null,
    diseaseLabTestId: null,
    diseaseCheckId: null,
    caseResultCategoryId: null,
    diseaseLabTestResultId: null,
    diseaseId: null,
  };

  rulesFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    diseaseGroupId: null,
  };
  diseaseRules: [];
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;

  diseaseGroups !: any[];
  selectedDiseaseGroup: any;

  diseases !: any[];
  selectedDisease: any;

  caseResultCategories !: any[];
  selectedCaseResultCategory: any;

  labChecks !: any[];
  selectedLabCheck: any;

  checkSamples !: any[];
  selectedCheckSample: any;

  labCheckResults !: any[];
  selectedLabCheckResult: any;

  singleDropdownSettings = {};
  multipleDropdownSettings = {};

  currentLang: string;

  // Import state machine: idle → preview → inserting → done
  importPhase: 'idle' | 'preview' | 'inserting' | 'done' = 'idle';
  showImportDialog: boolean = false;

  importPreviewRows: ImportRow[] = [];
  importValidRows: ImportRow[] = [];
  importErrorRows: ImportRow[] = [];

  importProgress = { total: 0, current: 0, success: 0, failed: 0 };
  importInsertErrors: ImportRow[] = [];
  importDuplicateRows: ImportRow[] = [];
  importLoading: boolean = false;

  readonly IMPORT_ROW_LIMIT = 1000;

  private existingRulesKeys: Set<string> = new Set();

  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService) { }

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.loadingPanel = true;
    this.getLookups();

    this.singleDropdownSettings = SingleDropdownSettings;
    this.multipleDropdownSettings = MultipleDropdownSettings;
    this.loadingPanel = false;
  }

  getLookups() {
    this.getDiseases();
    this.getDiseaseGroups();
    this.getCaseResultCategories();
    this.getLabChecks();
    this.getLabCheckResults();
    this.getLabSamples();
  }

  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  onDiseaseGroupChanged() {
    if (this.diseaseRule.diseaseGroupId) {
      // this.diseaseRule.diseaseGroupId = this.selectedDiseaseGroup[0].id;
      this.rulesFilter.diseaseGroupId = this.diseaseRule.diseaseGroupId;
      this.getDiseaseRule();
      this.clearSelections();
    } else {
      this.diseaseRule.diseaseGroupId = null;
      this.rulesFilter.diseaseGroupId = -1;
      this.diseaseRules = [];
      this.getDiseaseRule();
      this.clearSelections();
    }
  }

  onSampleChanged() {
    if (this.selectedCheckSample.length > 0) {
      this.diseaseRule.diseaseCheckId = this.selectedCheckSample[0].id;
    } else {
      this.diseaseRule.diseaseCheckId = null;
    }
  }

  onLabCheckChanged() {
    if (this.selectedLabCheck.length > 0) {
      this.diseaseRule.diseaseLabTestId = this.selectedLabCheck[0].id;
    } else {
      this.diseaseRule.diseaseLabTestId = null;
    }
  }

  onLabCheckResultChanged() {
    if (this.selectedLabCheckResult.length > 0) {
      this.diseaseRule.diseaseLabTestResultId = this.selectedLabCheckResult[0].id;
    } else {
      this.diseaseRule.diseaseLabTestResultId = null;
    }
  }

  onCaseResultCategoryChanged() {
    if (this.selectedCaseResultCategory.length > 0) {
      this.diseaseRule.caseResultCategoryId = this.selectedCaseResultCategory[0].id;
    } else {
      this.diseaseRule.caseResultCategoryId = null;
    }
  }

  onFinalDiseaseChanged() {
    if (this.selectedDisease.length > 0) {
      this.diseaseRule.diseaseId = this.selectedDisease[0].id;
    } else {
      this.diseaseRule.diseaseId = null;
    }
  }

  getDiseases() {
    this.lookupsService.getAllDiseases().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.diseases = result.data;
        this.AddItemInCaseOfNull(this.diseases);
      }
    }, error => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getDiseaseGroups() {
    this.lookupsService.getAllDiseaseGroups().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.diseaseGroups = result.data;
        this.AddItemInCaseOfNull(this.diseaseGroups);
      }
    }, error => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getCaseResultCategories() {
    this.lookupsService.getAllCaseResultCategorys().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.caseResultCategories = result.data;
        this.AddItemInCaseOfNull(this.caseResultCategories);
      }
    }, error => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getLabChecks() {
    this.lookupsService.getAllDiseaseLabTests().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.labChecks = result.data;
        this.AddItemInCaseOfNull(this.labChecks);
      }
    }, error => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getLabCheckResults() {
    this.lookupsService.getAllDiseaseLabTestResults().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.labCheckResults = result.data;
        this.AddItemInCaseOfNull(this.labCheckResults);
      }
    }, error => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getLabSamples() {
    this.lookupsService.getAllDiseaseChecks().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.checkSamples = result.data;
        this.AddItemInCaseOfNull(this.checkSamples);
      }
    }, error => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getDiseaseRule() {
    this.lookupsService.getPageDiseaseRules(this.rulesFilter).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.diseaseRules = result.data;
        if (this.diseaseRules != undefined && this.diseaseRules.length == 0) {
          this.noData = true;
          this.pages = 0;
        } else {
          this.noData = false;
          this.pages = result.data[0].totalCount;
          this.last = this.rulesFilter.pageIndex * this.rulesFilter.pageSize;
        }
      }
    }, error => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  save() {
    if (this.validateRequiredFields()) {
      if (this.diseaseRule.id == null) {
        this.lookupsService.addDiseaseRule(this.diseaseRule).subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.clearSelections();
              this.getDiseaseRule();
            }
          },
          (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        );
      } else this.update();
    } else {
      this.userMsg.error("يجب ادخال كل الحقول")
    }
  }

  update() {
    this.lookupsService.updateDiseaseRule(this.diseaseRule).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.clearSelections();
          this.getDiseaseRule();
        }
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.UPDATE_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getById(id: number) {
    this.lookupsService.getDiseaseRuleById(id).subscribe(
      (result: any) => {
        this.diseaseRule = result.data;
        this.selectedCaseResultCategory = this.caseResultCategories.filter(
          item => item.id === this.diseaseRule.caseResultCategoryId);
        this.selectedCheckSample = this.checkSamples.filter(
          item => item.id === this.diseaseRule.diseaseCheckId);
        this.selectedDisease = this.diseases.filter(
          item => item.id === this.diseaseRule.diseaseId);
        this.selectedLabCheck = this.labChecks.filter(
          item => item.id === this.diseaseRule.diseaseLabTestId);
        this.selectedLabCheckResult = this.labCheckResults.filter(
          item => item.id === this.diseaseRule.diseaseLabTestResultId);
        document.getElementById("diseas-rule").scrollIntoView({ behavior: 'smooth' });
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.rulesFilter.pageIndex = event.page;
    this.rulesFilter.pageSize = event.rows;
    this.getDiseaseRule();
  }

  delete(id: number) {
    this.lookupsService.deleteDiseaseRule(id).subscribe(
      (result: any) => {
        this.getDiseaseRule();
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  clearSelections() {
    this.diseaseRule.id = null;
    this.diseaseRule.diseaseLabTestId = null;
    this.diseaseRule.diseaseCheckId = null;
    this.diseaseRule.caseResultCategoryId = null;
    this.diseaseRule.diseaseLabTestResultId = null;
    this.diseaseRule.diseaseId = null;

    this.selectedCaseResultCategory = null;
    this.selectedCheckSample = null;
    this.selectedDisease = null;
    this.selectedLabCheck = null;
    this.selectedLabCheckResult = null;
  }

  validateRequiredFields(): Boolean {

    if (this.diseaseRule.diseaseGroupId == null || this.diseaseRule.diseaseLabTestId == null
      || this.diseaseRule.diseaseCheckId == null || this.diseaseRule.caseResultCategoryId == null
      || this.diseaseRule.diseaseLabTestResultId == null
    )
      return false;
    else return true;
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.sample = ele.sample;
  }

  AddItemInCaseOfNull(list: any[]) {
    list.unshift({
      id: null,
      code: null,
      arabicName: 'اختر',
      englishName: 'Select',
      totalCount: null
    });
  }

  downloadTemplate() {
    const headers = ['مجموعة المرض', 'العينة', 'الاختبار المعملي', 'نتيجة الاختبار', 'تشخيص الحالة', 'التشخيص النهائي'];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    ws['!cols'] = headers.map(() => ({ wch: 25 }));
    ws['!SheetPR'] = { rightToLeft: true };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Disease Rules');
    XLSX.writeFile(wb, 'Disease_Rules_Template.xlsx');
  }

  exportTableToExcel(rows: ImportRow[], filename: string, includeError: boolean = true) {
    if (!rows || rows.length === 0) return;

    const isAr = this.currentLang === 'ar';
    const data = rows.map(r => {
      const row: any = {
        [isAr ? 'الصف' : 'Row']: r.rowNum,
        [isAr ? 'مجموعة المرض' : 'Disease Group']: r.diseaseGroupName,
        [isAr ? 'العينة' : 'Sample']: r.sampleName,
        [isAr ? 'الاختبار المعملي' : 'Lab Test']: r.labTestName,
        [isAr ? 'نتيجة الاختبار' : 'Test Result']: r.testResultName,
        [isAr ? 'تصنيف الحالة' : 'Case Category']: r.caseCategoryName,
        [isAr ? 'التشخيص النهائي' : 'Final Disease']: r.finalDiseaseName,
      };
      if (includeError) {
        row[isAr ? 'الخطأ' : 'Error'] = r.errorMessage || r.insertError;
      }
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = Object.keys(data[0]).map(() => ({ wch: 25 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, filename);
  }

  exportErrorsToExcel() {
    const allErrors = [...this.importErrorRows, ...this.importInsertErrors, ...this.importDuplicateRows];
    this.exportTableToExcel(allErrors, 'Disease_Rules_Import_Errors.xlsx');
  }

  onImportFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!rows || rows.length === 0) {
        this.userMsg.error(this.currentLang === 'ar' ? 'الملف فارغ أو لا يحتوي على بيانات' : 'File is empty or contains no data');
        return;
      }

      if (rows.length > this.IMPORT_ROW_LIMIT) {
        this.userMsg.error(this.currentLang === 'ar'
          ? `الحد الأقصى ${this.IMPORT_ROW_LIMIT} صف. الملف يحتوي على ${rows.length} صف`
          : `Maximum ${this.IMPORT_ROW_LIMIT} rows allowed. File contains ${rows.length} rows`);
        return;
      }

      this.importLoading = true;
      this.lookupsService.getAllDiseaseRules().subscribe((result: any) => {
        this.existingRulesKeys.clear();
        if (result?.data) {
          for (const rule of result.data) {
            const key = `${rule.diseaseGroupId}-${rule.diseaseCheckId}-${rule.diseaseLabTestId}-${rule.diseaseLabTestResultId}-${rule.caseResultCategoryId}-${rule.diseaseId}`;
            this.existingRulesKeys.add(key);
          }
        }
        this.importLoading = false;
        this.parseAndPreview(rows);
      }, () => {
        this.importLoading = false;
        this.parseAndPreview(rows);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  private findLookup(list: any[], enName: string, arName: string): { id: number | null; name: string } {
    const rawEn = (enName || '').toString().trim();
    const rawAr = (arName || '').toString().trim();
    if (!rawEn && !rawAr) return { id: null, name: '' };
    const normalizedEn = rawEn.toLowerCase();
    const match = list.find(item =>
      item.id != null && (
        (item.englishName && item.englishName.trim().toLowerCase() === normalizedEn) ||
        (item.arabicName && item.arabicName.trim() === rawAr)
      )
    );
    const displayName = this.currentLang === 'ar' ? (rawAr || rawEn) : (rawEn || rawAr);
    return match ? { id: match.id, name: this.currentLang === 'ar' ? (match.arabicName || match.englishName) : (match.englishName || match.arabicName) } : { id: null, name: displayName };
  }

  parseAndPreview(rows: any[]) {
    this.importPreviewRows = [];
    this.importValidRows = [];
    this.importErrorRows = [];
    this.importDuplicateRows = [];
    this.importInsertErrors = [];
    this.importProgress = { total: 0, current: 0, success: 0, failed: 0 };

    const seen = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      const diseaseGroup = this.findLookup(this.diseaseGroups, row['DisNameEn'], row['DisNameAr'] || row['مجموعة المرض']);
      const sample = this.findLookup(this.checkSamples, row['SpecNameEn'], row['SpecNameAr'] || row['العينة']);
      const labTest = this.findLookup(this.labChecks, row['TestNameEn'], row['TestNameAr'] || row['الاختبار المعملي']);
      const testResult = this.findLookup(this.labCheckResults, row['ResultNameEn'], row['ResultNameAr'] || row['نتيجة الاختبار']);
      const caseCategory = this.findLookup(this.caseResultCategories, row['StatusNameEn'], row['StatusNameAr'] || row['تشخيص الحالة'] || row['تصنيف الحالة']);
      const finalDisease = this.findLookup(this.diseases, null, row['التشخيص النهائي']);

      const fieldErrors: string[] = [];
      if (!diseaseGroup.id) fieldErrors.push(this.currentLang === 'ar' ? 'مجموعة المرض' : 'Disease Group');
      if (!labTest.id) fieldErrors.push(this.currentLang === 'ar' ? 'الاختبار المعملي' : 'Lab Test');
      if (!testResult.id) fieldErrors.push(this.currentLang === 'ar' ? 'نتيجة الاختبار' : 'Test Result');
      if (!caseCategory.id) fieldErrors.push(this.currentLang === 'ar' ? 'تشخيص الحالة' : 'Case Category');
      const finalDiseaseRaw = (row['التشخيص النهائي'] || '').toString().trim();
      if (finalDiseaseRaw && !finalDisease.id) fieldErrors.push(this.currentLang === 'ar' ? 'التشخيص النهائي' : 'Final Disease');

      let duplicateError = '';
      let isDuplicate = false;
      if (fieldErrors.length === 0) {
        const key = `${diseaseGroup.id}-${sample.id}-${labTest.id}-${testResult.id}-${caseCategory.id}-${finalDisease.id}`;
        if (this.existingRulesKeys.has(key)) {
          duplicateError = this.currentLang === 'ar' ? 'موجود مسبقاً في قاعدة البيانات' : 'Already exists in database';
          isDuplicate = true;
        } else if (seen.has(key)) {
          duplicateError = this.currentLang === 'ar' ? 'صف مكرر في الملف' : 'Duplicate row in file';
          isDuplicate = true;
        } else {
          seen.add(key);
        }
      }

      const parsed: ImportRow = {
        rowNum,
        diseaseGroupName: diseaseGroup.name || row['DisNameAr'] || row['DisNameEn'] || '',
        sampleName: sample.name || row['SpecNameAr'] || row['SpecNameEn'] || '',
        labTestName: labTest.name || row['TestNameAr'] || row['TestNameEn'] || '',
        testResultName: testResult.name || row['ResultNameAr'] || row['ResultNameEn'] || '',
        caseCategoryName: caseCategory.name || row['StatusNameAr'] || row['StatusNameEn'] || '',
        finalDiseaseName: finalDisease.name || row['التشخيص النهائي'] || '',
        diseaseGroupId: diseaseGroup.id,
        sampleId: sample.id,
        labTestId: labTest.id,
        testResultId: testResult.id,
        caseCategoryId: caseCategory.id,
        finalDiseaseId: finalDisease.id,
        valid: fieldErrors.length === 0 && !isDuplicate,
        errorFields: fieldErrors,
        errorMessage: duplicateError || (fieldErrors.length > 0
          ? (this.currentLang === 'ar' ? 'لم يتم العثور على: ' : 'Not found: ') + fieldErrors.join(', ')
          : ''),
        insertError: ''
      };

      this.importPreviewRows.push(parsed);
      if (parsed.valid) {
        this.importValidRows.push(parsed);
      } else if (isDuplicate) {
        this.importDuplicateRows.push(parsed);
      } else {
        this.importErrorRows.push(parsed);
      }
    }

    this.importPhase = 'preview';
    this.showImportDialog = true;
  }

  cancelImport() {
    this.showImportDialog = false;
    this.importPhase = 'idle';
    this.importPreviewRows = [];
    this.importValidRows = [];
    this.importErrorRows = [];
    this.importInsertErrors = [];
  }

  async confirmImport() {
    if (this.importValidRows.length === 0) return;

    this.importPhase = 'inserting';
    this.importProgress = { total: this.importValidRows.length, current: 0, success: 0, failed: 0 };
    this.importInsertErrors = [];

    for (const row of this.importValidRows) {
      this.importProgress.current++;

      const rule = {
        id: null,
        diseaseGroupId: row.diseaseGroupId,
        diseaseCheckId: row.sampleId,
        diseaseLabTestId: row.labTestId,
        diseaseLabTestResultId: row.testResultId,
        caseResultCategoryId: row.caseCategoryId,
        diseaseId: row.finalDiseaseId
      };

      try {
        await this.lookupsService.addDiseaseRule(rule).toPromise();
        this.importProgress.success++;
      } catch (error: any) {
        this.importProgress.failed++;
        let msg = this.currentLang === 'ar' ? 'فشل في الحفظ' : 'Failed to save';
        if (error?.error?.message) msg = error.error.message;
        else if (error?.error?.Message) msg = error.error.Message;
        else if (error?.message) msg = error.message;
        row.insertError = msg;
        this.importInsertErrors.push(row);
      }
    }

    this.importPhase = 'done';
    this.getDiseaseRule();
  }

  getProgressPercent(): number {
    if (this.importProgress.total === 0) return 0;
    return Math.round((this.importProgress.current / this.importProgress.total) * 100);
  }

}

export interface ImportRow {
  rowNum: number;
  diseaseGroupName: string;
  sampleName: string;
  labTestName: string;
  testResultName: string;
  caseCategoryName: string;
  finalDiseaseName: string;
  diseaseGroupId: number | null;
  sampleId: number | null;
  labTestId: number | null;
  testResultId: number | null;
  caseCategoryId: number | null;
  finalDiseaseId: number | null;
  valid: boolean;
  errorFields: string[];
  errorMessage: string;
  insertError: string;
}
