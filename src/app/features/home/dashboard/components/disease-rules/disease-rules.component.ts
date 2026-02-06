import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { PatientModel } from '../../../general-data/models/patient-model';
import { SingleDropdownSettings, MultipleDropdownSettings } from 'src/app/core/constants';

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

}
