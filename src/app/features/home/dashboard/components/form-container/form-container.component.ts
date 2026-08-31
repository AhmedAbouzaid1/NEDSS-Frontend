import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { SortEvent } from 'primeng/api';
import { SortOrder } from 'src/app/core/constants';
import { DiseaseFormService } from '../disease-special-symptoms/services/disease-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormContainerService } from '../disease-special-symptoms/services/form-container.service';
@Component({
  selector: 'form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.css'],
})
export class FormContainerComponent {
  underDeleting = {
    nameAr: '',
    id: null,
  };
  diseaseForm = {
    id: null,
    NameAr: null,
    NameEn: null,
    DiseaseGroupId: null,
  };
  diseasesField!: any[];
  forms!: any[];
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
    diseaseFormId: 0,
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  isEdit: boolean = false;
  containerParent: any[] = [];
  containerParentLoading: boolean = false;
  formId: any;
  isArabic: boolean = false;
  sidebarVisible: boolean = false;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  ngOnInit() {
    this.getDiseases();

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

    this.formId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getFormContainers();
    this.getContainerParent();
    this.isArabic =
      (localStorage.getItem('ls.currentLang') != undefined
        ? localStorage.getItem('ls.currentLang')
        : 'ar') == 'ar';
  }
  constructor(
    private diseaseService: LookupsGetterService,
    private formContainerService: FormContainerService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private diseaseFormService: DiseaseFormService
  ) {}

  getDiseases() {
    this.diseaseFormService.getAllDiseaseField().subscribe(
      (result: any) => {
        this.forms = result.data;
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
  getContainerParent() {
    this.containerParentLoading = true;
    this.formContainerService.getAllByParentId(this.formId)
      .pipe(finalize(() => (this.containerParentLoading = false)))
      .subscribe(
      (res) => {
        this.containerParent = res.data;
        this.translateService
          .get('NEDSS.HOME.USERS.AUDIT-TRIAL.Notexist')
          .subscribe((res: string) => {
            this.containerParent.unshift({
              id: null,
              title: res,
            });
          });
      },
      (err) => {
        this.translateService
          .get('NEDSS.COMMON.Failed to bring Sketch Father')
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
    this.getFormContainers();
  }
  onFormChange($event: any) {
    this.diseaseSelected = $event.target.value;
    this.getFormContainers();
    this.getContainerParent();
  }

  getFormContainers() {
    this.loadingPanel = true;
    this.diseaseFieldFilter.diseaseFormId = this.formId;
    this.formContainerService
      .getPageDiseaseField(this.diseaseFieldFilter)
      .subscribe(
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
      this.getFormContainers();
    } else if (
      event.order == 1 &&
      this.diseaseFieldFilter.sortOrder != SortOrder.asc
    ) {
      this.diseaseFieldFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.diseaseFieldFilter.sortColumn = event.field;
      this.getFormContainers();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.diseaseFieldFilter.pageIndex = event.page;
    this.diseaseFieldFilter.pageSize = event.rows;
    this.getFormContainers();
  }
  getById(id: any) {
    this.formContainerService.getById(id).subscribe(
      (result: any) => {
        this.diseasesFieldForm = result.data;
        this.isEdit = true;
        this.sidebarVisible = true;
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
  delete(id: any) {
    this.formContainerService.deleteByld(id).subscribe(
      (result: any) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.getFormContainers();
        this.diseasesFieldForm = {};
        this.diseasesFieldForm.diseaseFormId = this.diseaseSelected;
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
  resetForm() {
    this.diseasesFieldForm = {};
    if (this.isEdit) {
      this.isEdit = false;
    }
  }
  save() {
    this.diseasesFieldForm.containerId =
      this.diseasesFieldForm.containerId === ''
        ? null
        : this.diseasesFieldForm.containerId;
    this.diseasesFieldForm.diseaseFormId =
      this.activatedRoute.snapshot.paramMap.get('id');
    this.formContainerService.addDiseaseField(this.diseasesFieldForm).subscribe(
      (result: any) => {
        // this.userMsg.success("NEDSS.COMMON.SENT_SUCESSFULLY");
        this.sidebarVisible = false;
        this.translateService
          .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });

        this.getFormContainers();
        this.diseasesFieldForm = {};
        this.diseasesFieldForm.diseaseFormId = this.diseaseSelected;
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
  edit() {
    this.diseasesFieldForm.containerId =
      this.diseasesFieldForm.containerId === ''
        ? null
        : this.diseasesFieldForm.containerId;
    this.diseasesFieldForm.diseaseFormId = this.formId;

    this.formContainerService.update(this.diseasesFieldForm).subscribe(
      (result: any) => {
        this.sidebarVisible = false;
        this.translateService
          .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          .subscribe((res: string) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          });
        this.getFormContainers();
        this.diseasesFieldForm = {};
        this.isEdit = false;
        this.diseasesFieldForm.diseaseFormId = this.diseaseSelected;
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
  viewDesgin(id: any) {
    this.router.navigateByUrl('home/control-panel/dynamic-forms/design/' + id);
  }
  goFields(id: any) {
    this.router.navigateByUrl(
      'home/control-panel/dynamic-forms/controls/' + this.formId + '/' + id
    );
  }
  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.nameAr = ele.title;
  }
  back() {
    this.router.navigateByUrl('home/control-panel/evaluation-questions');
  }
}
