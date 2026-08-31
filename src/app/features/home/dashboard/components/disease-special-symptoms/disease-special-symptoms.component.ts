import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DiseaseSpecialSymptomsService } from './services/disease-special-symptoms.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { SortEvent } from 'primeng/api';
import { SortOrder } from 'src/app/core/constants';
import { DiseaseGroupQuestionType, DiseaseGroupQuestionTypeList } from './models/DiseaseGroupQuestionType';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'disease-special-symptoms',
  templateUrl: './disease-special-symptoms.component.html',
  styleUrls: ['./disease-special-symptoms.component.css']
})
export class DiseaseSpecialSymptomsComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  diseaseField = {
    id: null,
    fieldName: null,
    englishName: null,
    arabicName: null,
    diseaseGroupQuestionType: null,
    isRequired: null,
    listItem: null,
    diseaseId: null,
  };
  diseasesField!: any[];
  diseases!: any[];
  diseasesLoading: boolean = false;
  diseaseSelected: number = 0;
  diseasesFieldForm: any = {};
  isListShow = false;

  incidentSources!: any[];
  diseaseFieldFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    diseaseGroupId: 0
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  isEdit: boolean = false;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  currentLang: string = 'ar';
  diseaseGroupQuestionTypeList = DiseaseGroupQuestionTypeList;

  repeaterFields: any = {
    id: null,
    arabicName: null,
    englishName: null
  };
  editAnswerIndex: number;
  isEditAnswer: boolean;
  AnswersPaginator = {
    pageSize: 5,
    pageIndex: 0,
  };
  firstPageAnswer: number = 0;
  lastPageAnswer: number;

  ngOnInit() {
    this.getDiseases();
    this.setLanguage();
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(environment.DebounceWaiting),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.search();
      });
  }
  setLanguage() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
  }
  constructor(
    private diseaseService: LookupsGetterService,

    private diseaseSpecialSymptomsService: DiseaseSpecialSymptomsService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }
  getDiseases() {
    this.diseasesLoading = true;
    this.diseaseService.getAllDiseaseGroups().pipe(finalize(() => (this.diseasesLoading = false))).subscribe(
      (result: any) => {
        this.diseases = result.data;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failToGetDisease')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );

  }
  search() {
    this.first = 0;
    this.diseaseFieldFilter.pageIndex = 0;
    this.last =
      this.diseaseFieldFilter.pageIndex * this.diseaseFieldFilter.pageSize;
    this.getFields();
  }
  onDiseaseChange($event: any) {
    this.diseaseSelected = $event.value;
    this.getFields();
    this.diseasesFieldForm = {};
    this.isListShow = false;
    this.isEdit = false;
    this.diseasesFieldForm.diseaseGroupId = this.diseaseSelected;
  }

  getFields() {
    this.loadingPanel = true;
    this.diseaseFieldFilter.diseaseGroupId = this.diseaseSelected;
    this.diseaseSpecialSymptomsService.getDiseaseFieldByDiseaseId(this.diseaseFieldFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseasesField = result.data;
          if (this.diseasesField != undefined && this.diseasesField.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last =
              this.diseaseFieldFilter.pageIndex * this.diseaseFieldFilter.pageSize;
          }
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  clearSearch() {
    this.diseaseFieldFilter.searchText = '';
    this.search();
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.diseaseFieldFilter.sortOrder != SortOrder.desc
    ) {
      this.diseaseFieldFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.diseaseFieldFilter.sortColumn = event.field;
      this.getFields();
    } else if (
      event.order == 1 &&
      this.diseaseFieldFilter.sortOrder != SortOrder.asc
    ) {
      this.diseaseFieldFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.diseaseFieldFilter.sortColumn = event.field;
      this.getFields();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.diseaseFieldFilter.pageIndex = event.page;
    this.diseaseFieldFilter.pageSize = event.rows;
    this.getFields();
  }
  getById(id: any) {
    this.diseaseSpecialSymptomsService.getDiseaseFieldById(id).subscribe(
      (result: any) => {
        this.diseasesFieldForm = result.data;
        this.isEdit = true;
        this.resetAnswersTable();
        document.getElementById("diseas-speci").scrollIntoView({ behavior: 'smooth' });
        if (this.diseasesFieldForm.diseaseGroupQuestionType === DiseaseGroupQuestionType.DropDownList || this.diseasesFieldForm.diseaseGroupQuestionType === DiseaseGroupQuestionType.RadioButton || this.diseasesFieldForm.diseaseGroupQuestionType === DiseaseGroupQuestionType.CheckBox)
          this.isListShow = true;
        else
          this.isListShow = false;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failaddField')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );

  }
  resetAnswersTable() {
    this.firstPageAnswer = 0;
    this.AnswersPaginator = {
      pageSize: 5,
      pageIndex: 0,
    };
  }
  delete(id: any) {
    this.diseaseSpecialSymptomsService.deleteDiseaseField(id).subscribe(
      (result: any) => {
        this.userMsg.success("");
        this.getFields();
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failaddField')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );

  }
  save() {
    this.diseaseSpecialSymptomsService.addDiseaseField(this.diseasesFieldForm).subscribe(
      (result: any) => {
        this.userMsg.success("");
        this.getFields();
        this.diseasesFieldForm = {};
        this.diseasesFieldForm.diseaseGroupId = this.diseaseSelected;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failaddField')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  edit() {
    this.diseaseSpecialSymptomsService.updateDiseaseField(this.diseasesFieldForm).subscribe(
      (result: any) => {
        this.userMsg.success("");
        this.getFields();
        this.diseasesFieldForm = {};
        this.isEdit = false;
        this.diseasesFieldForm.diseaseGroupId = this.diseaseSelected;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.faileditField')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  onFieldTypeChange($event: any) {
    let value = $event.value;
    if (value === DiseaseGroupQuestionType.DropDownList || value === DiseaseGroupQuestionType.RadioButton || value === DiseaseGroupQuestionType.CheckBox)
      this.isListShow = true;
    else
      this.isListShow = false;
  }


  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }

  saveAnswer(answersForms: NgForm) {
    if (!answersForms?.valid) return;
    let item = JSON.parse(JSON.stringify(this.repeaterFields));
    if (!this.diseasesFieldForm?.diseaseGroupQuestionAnswers?.length) {
      this.diseasesFieldForm.diseaseGroupQuestionAnswers = [item];
    } else {
      this.diseasesFieldForm.diseaseGroupQuestionAnswers.push(item);
    }
    this.resetRepeaterFields();
    answersForms.resetForm();
  }

  editAnswer(answersForms: NgForm) {
    if (!answersForms?.valid) return;
    let item = JSON.parse(JSON.stringify(this.repeaterFields));
    if (
      (this.diseasesFieldForm.diseaseGroupQuestionAnswers as any[])?.find(
        (_, i) => i == this.editAnswerIndex
      )
    ) {
      this.diseasesFieldForm.diseaseGroupQuestionAnswers[this.editAnswerIndex] = item;
    }
    this.resetRepeaterFields()
  }
  resetRepeaterFields() {
    this.repeaterFields = {
      id: null,
      arabicName: null,
      englishName: null
    };
  }

  startEditAnswer(index: number) {
    let item = (this.diseasesFieldForm.diseaseGroupQuestionAnswers as any[])?.find(
      (_, i) => i == index
    );
    if (!item) return;
    this.repeaterFields = JSON.parse(JSON.stringify(item));
    this.isEditAnswer = true;
    this.editAnswerIndex = index;
  }
  RemoveAnswer(index: number) {
    this.diseasesFieldForm.diseaseGroupQuestionAnswers =
      this.diseasesFieldForm.diseaseGroupQuestionAnswers?.filter((_, i) => i != index);
  }
  paginateAnswers(event: any) {
    this.firstPageAnswer = event.first;
    this.lastPageAnswer = event.last;
    this.AnswersPaginator.pageIndex = event.page;
    this.AnswersPaginator.pageSize = event.rows;
  }

}
