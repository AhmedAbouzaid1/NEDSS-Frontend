import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { SortEvent } from 'primeng/api';
import { SortOrder } from 'src/app/core/constants';
import { DiseaseSpecialSymptomsService } from '../disease-special-symptoms/services/disease-special-symptoms.service';
import { DiseaseFormService } from '../disease-special-symptoms/services/disease-form.service';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.css']
})
export class DynamicFormsComponent {
  diseaseForm = {
    id: null,
    NameAr: null,
    NameEn: null,
    DiseaseGroupId: null,

  };
  diseasesField!: any[];
  diseases!: any[];
  diseaseSelected: any = 0;
  diseasesFieldForm: any = {};
  isListShow = false;

  incidentSources!: any[];
  diseaseFieldFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    diseaseId: 0
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  isEdit: boolean = false;

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
  }
  constructor(
    private diseaseService: LookupsGetterService,

    private diseaseFormService: DiseaseFormService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private router: Router,
  ) { }
  getDiseases() {
    this.diseaseService.getAllDiseaseGroups().subscribe(
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
    this.getDiseasesForm();
  }
  onDiseaseChange($event: any) {
    this.diseaseSelected = $event.target.value;
    this.getDiseasesForm();
  }

  getDiseasesForm() {
    this.loadingPanel = true;
    this.diseaseFieldFilter.diseaseId = this.diseaseSelected === "" ? null : this.diseaseSelected;
    this.diseaseFormService.getDiseaseFieldByDiseaseId(this.diseaseFieldFilter).subscribe(
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
      this.getDiseasesForm();
    } else if (
      event.order == 1 &&
      this.diseaseFieldFilter.sortOrder != SortOrder.asc
    ) {
      this.diseaseFieldFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.diseaseFieldFilter.sortColumn = event.field;
      this.getDiseasesForm();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.diseaseFieldFilter.pageIndex = event.page;
    this.diseaseFieldFilter.pageSize = event.rows;
    this.getDiseasesForm();
  }
  getById(id: any) {
    this.diseaseFormService.getById(id).subscribe(
      (result: any) => {
        document.getElementById("dynam-form").scrollIntoView({ behavior: 'smooth' });
        this.diseasesFieldForm = result.data;
        this.isEdit = true;
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
  delete(id: any) {
    this.diseaseFormService.deleteDiseaseField(id).subscribe(
      (result: any) => {
        this.userMsg.success("");
        this.getDiseasesForm();
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
    this.diseasesFieldForm.diseaseGroupId = this.diseaseSelected === "" ? null : this.diseaseSelected;

    this.diseaseFormService.addDiseaseField(this.diseasesFieldForm).subscribe(
      (result: any) => {
        this.userMsg.success("");
        this.getDiseasesForm();
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
    this.diseasesFieldForm.diseaseGroupId = this.diseaseSelected === "" ? null : this.diseaseSelected;

    this.diseaseFormService.update(this.diseasesFieldForm).subscribe(
      (result: any) => {
        this.userMsg.success("");
        this.getDiseasesForm();
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
  viewDesgin(id: any) {
    this.router.navigateByUrl("home/control-panel/dynamic-forms/design/" + id);
  }
  getContainers(id: any) {
    this.router.navigateByUrl("home/control-panel/dynamic-forms/sections/" + id);
  }


}
