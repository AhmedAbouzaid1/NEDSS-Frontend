import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvestigationService } from '../services/investigation.service';
import { InvestigationComponent } from '../investigation.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { firstValueFrom } from 'rxjs';
import { NationalityEnum } from '../../general-data/models/nationality-enum';

@Component({
  selector: 'app-investigation-detailes',
  templateUrl: './investigation-detailes.component.html',
  styleUrls: ['./investigation-detailes.component.css'],
})
export class InvestigationDetailesComponent implements OnInit, OnDestroy {
  readonly egyptianNationalityId = NationalityEnum.Egyptian;
  currentId: any;
  data: any = {};
  isLoadingInvestigationData = false;
  hasLoadedPatientData = false;
  singleDropdownSettings = SingleDropdownSettings;
  currentLang: string;
  dir: string;
  constructor(
    public investigation: InvestigationService,
    private router: ActivatedRoute,
    private translateService: TranslateService,
    private Router: Router,
    private userMsg: UserMessageService,
    public generalDataService: GeneralDataService,
    private invetigationService: InvestigationService
  ) { }

  ngOnInit() {
    this.generalDataService.phoneNo1ValidationMessage = '';
    this.generalDataService.addressValidationMessage = '';

    this.currentId = this.router.snapshot.paramMap.get('id');
    if (this.currentId != null) {
      this.invetigationService.currentid = this.currentId;
    }

    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.loadData();

  }
  async loadData() {
    this.isLoadingInvestigationData = true;

    try {
      await this.getById(this.currentId);
    } finally {
      this.isLoadingInvestigationData = false;
    }
  }

  async getById(id) {
    try {
      let result = await firstValueFrom(this.generalDataService.getPatientByIdForInvestigation(id))
      if (result != null && result != undefined) {
        this.hasLoadedPatientData = true;
        this.data = result.data;

        this.investigation.patient.firstName = this.data.firstName;
        this.investigation.patient.secondName = this.data.secondName;
        this.investigation.patient.thirdName = this.data.thirdName;
        this.investigation.patient.familyName = this.data.familyName;
        this.investigation.patient.phoneNo1 = this.data.phoneNo1;
        this.investigation.patient.livingAddress = this.data.livingAddress;
        const pendingDiseaseGroups = this.data.patientDiseasesGroups;
        this.invetigationService.patientDiseases =
          pendingDiseaseGroups && pendingDiseaseGroups.length
            ? pendingDiseaseGroups
            : this.data.patientDiseases || [];
      }
    } catch (error) {
      this.translateService
        .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
        .subscribe((res: string) => {
          this.userMsg.error(res);
        });
    }
  }

  canContinueInvestigation(): boolean {
    return !this.isLoadingInvestigationData && this.hasLoadedPatientData;
  }

  ngOnDestroy(): void {
    if (
      this.Router.url.includes(
        '/home/investigations/compelete-investigation'
      ) ||
      this.Router.url.includes('/home/investigations')
    ) {
      this.investigation.view = true;
    } else {
      this.investigation.view = false;
    }
  }
}
