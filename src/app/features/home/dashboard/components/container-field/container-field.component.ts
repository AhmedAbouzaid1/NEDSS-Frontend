import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { SortEvent } from 'primeng/api';
import { SortOrder } from 'src/app/core/constants';
import { FormControlService } from '../disease-special-symptoms/services/form-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionType, QustionTypesLookups } from '../../models/container-fields.models';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-container-field',
  templateUrl: './container-field.component.html',
  styleUrls: ['./container-field.component.css'],
})
export class ContainerFieldComponent {
  underDeleting = {
    nameAr: '',
    id: null,
  };
  diseaseField = {
    id: null,
    fieldName: null,
    fieldLabel: null,
    fieldLabelAr: null,
    questionType: null,
    isRequired: null,
    listItem: null,
    diseaseId: null,
  };
  diseasesField!: any[];
  diseases!: any[];
  diseaseSelected: number = 0;
  diseasesFieldForm: any = {};
  isListShow = false;

  incidentSources!: any[];
  diseaseFieldFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: 'fieldLabel',
    sortOrder: 'asc',
    searchText: '',
    diseaseFormContainerId: 0,
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  isEdit: boolean = false;
  diseaseFormContainerId: any = 0;
  FormContainerId: any = 0;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  sidebarVisible: boolean;
  isArabic: boolean;

  repeaterFields: any = {
    id: null,
    answer: null,
    answerAr: null,
    answerDegree: null,
    isActive: true
  }
  isEditAnswer: boolean;
  readonly MaxNumberOfAnswersForEmojiAndTrueFalse: number = 2;

  AnswersPaginator = {
    pageSize: 5,
    pageIndex: 0,
  };
  firstPageAnswer: number = 0;
  lastPageAnswer: number;
  EditAnswerIndex: number;
  questionTypesLookups = QustionTypesLookups;

  ngOnInit() {
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
    this.diseaseFormContainerId =
      +this.activatedRoute.snapshot.paramMap.get('containerId');
    this.diseasesFieldForm.diseaseFormContainerId = this.diseaseFormContainerId;
    this.FormContainerId = this.activatedRoute.snapshot.paramMap.get('id');
    this.setIsArabic();
  }
  setIsArabic() {
    this.isArabic =
      (localStorage.getItem('ls.currentLang') != undefined
        ? localStorage.getItem('ls.currentLang')
        : 'ar') == 'ar';
  }

  resetForm() {
    this.diseasesFieldForm = {};
    if (this.isEdit) {
      this.isEdit = false;
    }
  }

  ngAfterViewInit() {
    this.getFields();
  }

  constructor(
    private diseaseService: LookupsGetterService,
    private router: Router,
    private formControlService: FormControlService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private activatedRoute: ActivatedRoute
  ) { }




  search() {
    this.first = 0;
    this.diseaseFieldFilter.pageIndex = 0;
    this.last =
      this.diseaseFieldFilter.pageIndex * this.diseaseFieldFilter.pageSize;
    this.getFields();
  }
  onDiseaseChange($event: any) {
    this.diseaseSelected = $event.target.value;
    this.getFields();
  }

  getFields() {
    this.loadingPanel = true;
    this.diseaseFormContainerId =
      +this.activatedRoute.snapshot.paramMap.get('containerId');
    this.diseaseFieldFilter.diseaseFormContainerId =
      this.diseaseFormContainerId;
    this.formControlService.getPage(this.diseaseFieldFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseasesField = result.data;
          if (
            this.diseasesField != undefined &&
            this.diseasesField.length == 0
          ) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last =
              this.diseaseFieldFilter.pageIndex *
              this.diseaseFieldFilter.pageSize;
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
    this.formControlService.getById(id).subscribe(
      (result: any) => {
        this.diseasesFieldForm = result.data;
        this.isEdit = true;
        this.sidebarVisible = true;
        this.resetAnswersTable();
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
    this.formControlService.deleteByld(id).subscribe(
      (result: any) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.getFields();
        this.diseasesFieldForm = {};
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
  save(diseaseFieldForm: NgForm) {
    this.diseasesFieldForm.diseaseFormContainerId =
      +this.activatedRoute.snapshot.paramMap.get('containerId');

    this.formControlService.add(this.diseasesFieldForm).subscribe(
      (result: any) => {
        this.sidebarVisible = false;
        diseaseFieldForm.resetForm();
        this.translateService
          .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.getFields();
        this.diseasesFieldForm = {};
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
  edit(diseaseFieldForm: NgForm) {
    this.diseasesFieldForm.diseaseFormContainerId = this.diseaseFormContainerId;

    this.formControlService.update(this.diseasesFieldForm).subscribe(
      (result: any) => {
        this.sidebarVisible = false;
        diseaseFieldForm.resetForm();
        this.translateService
          .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.getFields();
        this.diseasesFieldForm = {};
        this.isEdit = false;
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
  onFieldTypeChange() {
    this.diseasesFieldForm.questionAnswers = []
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.nameAr = ele.fieldLabelAr;
  }

  back() {
    this.router.navigateByUrl(
      'home/control-panel/dynamic-forms/sections/' + this.FormContainerId
    );
  }
  goToQuestionForm(questionId?: number) {
    this.router.navigateByUrl('home/control-panel/qustion-form/' + this.FormContainerId + '/' + this.diseaseFormContainerId + (questionId ? `/${questionId}` : ''))
  }


  public get fieldTypes(): typeof QuestionType {
    return QuestionType
  }


  public get isHideAddAnswer(): boolean {
    return (this.diseasesFieldForm.questionType == this.fieldTypes.Emoji || this.diseasesFieldForm.questionType == this.fieldTypes.TrueOrFalse) && this.diseasesFieldForm?.questionAnswers?.length >= this.MaxNumberOfAnswersForEmojiAndTrueFalse;
  }

  startEditAnswer(index: number) {
    let item = (this.diseasesFieldForm.questionAnswers as any[])?.find((_, i) => i == index);
    if (!item) return;
    this.repeaterFields = JSON.parse(JSON.stringify(item));
    this.isEditAnswer = true;
    this.EditAnswerIndex = index;
  }
  RemoveAnswer(index: number) {
    this.diseasesFieldForm.questionAnswers = this.diseasesFieldForm.questionAnswers?.filter((_, i) => i != index);
  }

  saveAnswer(answersForms: NgForm) {
    if (!answersForms?.valid) return;
    let item = JSON.parse(JSON.stringify(this.repeaterFields));
    if (!this.diseasesFieldForm?.questionAnswers?.length) {
      this.diseasesFieldForm.questionAnswers = [item];
    } else {
      this.diseasesFieldForm.questionAnswers.push(item);
    }
    this.resetRepeaterFields();
    answersForms.resetForm();
  }

  editAnswer(answersForms: NgForm) {
    if (!answersForms?.valid) return;
    let item = JSON.parse(JSON.stringify(this.repeaterFields));
    if ((this.diseasesFieldForm.questionAnswers as any[])?.find((_, i) => i == this.EditAnswerIndex)) {
      this.diseasesFieldForm.questionAnswers[this.EditAnswerIndex] = item
    }

    this.resetRepeaterFields();
    answersForms.resetForm();
    this.isEditAnswer = false;
  }

  paginateAnswers(event: any) {
    this.firstPageAnswer = event.first;
    this.lastPageAnswer = event.last;
    this.AnswersPaginator.pageIndex = event.page;
    this.AnswersPaginator.pageSize = event.rows;
  }

  resetRepeaterFields() {
    this.repeaterFields = {
      id: null,
      answer: null,
      answerAr: null,
      answerDegree: null,
      isActive: true
    }
  }
  getFieldType(questionType) {
    return this.questionTypesLookups.find(x => x.id == questionType)?.name
  }
  CancelChangeAnswer() {
    this.resetRepeaterFields();
  }
}
