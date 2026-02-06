import { Component, OnInit } from '@angular/core';
import { PatientModel } from '../models/patient-model';
import { SharedDataService } from '../services/shared-data.service';
import { TranslateService } from '@ngx-translate/core';
import { GeneralDataService } from '../services/general-data.service';
import * as $ from 'jquery';
import { MultipleDropdownSettings } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';

@Component({
  selector: 'app-clinical-symptoms',
  templateUrl: './clinical-symptoms.component.html',
  styleUrls: ['./clinical-symptoms.component.css'],
})
export class ClinicalSymptomsComponent implements OnInit {
  patient: PatientModel = new PatientModel();
  currentLang: string;
  isfeverDurationTypeChanged: boolean;

  constructor(
    private sharedDataService: SharedDataService,
    private translateService: TranslateService,
    private lookupsService: LookupsGetterService,
    private userMsg: UserMessageService,

    public generalDataService: GeneralDataService
  ) { }
  FEVERStatus: boolean = true;
  GENERALDESIEASE: boolean = false;
  SYMPTOMS: boolean = false;
  muscular: boolean = false;
  Respiratory: boolean = false;
  otherdieases: boolean = false;

  FEVER_DURATION_DAYS: string;

  feverDurationTypes: any[] = [
    { id: null, arabicName: 'إختر', englishName: 'Select' },
    { id: 1, arabicName: 'دقيقة', englishName: 'Minute' },
    { id: 2, arabicName: 'ساعة', englishName: 'Hour' },
    { id: 3, arabicName: 'يوم', englishName: 'Day' },
  ];
  multipleDropdownSettings = {};
  chronicDiseases!: any[];
  selectedChronicDiseases: any = {};
  loadingPanel: boolean = false;

  ngOnInit() {
    this.multipleDropdownSettings = MultipleDropdownSettings;

    this.sharedDataService
      .getPatientObject()
      .subscribe((patientObject: PatientModel) => {
        this.patient = patientObject;
        this.patient?.chronicDiseasesIds?.map(
          (x) => (this.selectedChronicDiseases[x] = x)
        );
      });
    if (!this.patient.clinicalAsymptoms) {
      this.patient.clinicalAsymptoms = {
        feverDuration: null, // or provide a default value
        // other properties...
      };
    }
    this.translateService
      .get('NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.FEVERDURATION')
      .subscribe((res) => (this.FEVER_DURATION_DAYS = res));
    this.translateService
      .get('NEDSS.HOME.GENERAL_DATA_CLINICAL_SYMPTOMS.DAYS')
      .subscribe((res) => (this.FEVER_DURATION_DAYS += ' ' + res));

    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.getChronicDisease();
  }
  change($event: any) {
    this.FEVERStatus = $event.currentTarget.checked;
  }

  getChronicDisease() {
    this.lookupsService.getChronicDiseases().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.chronicDiseases = result.data;
        }
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

  itemsCheck(diseaseId) {
    if (this.selectedChronicDiseases[diseaseId]) {
      if (!this.patient?.chronicDiseasesIds?.find((x) => x == diseaseId)) {
        if (this.patient.chronicDiseasesIds?.length)
          this.patient.chronicDiseasesIds.push(diseaseId);
        else
          this.patient.chronicDiseasesIds = [diseaseId];
      }
    } else {
      this.patient.chronicDiseasesIds = this.patient.chronicDiseasesIds.filter(
        (x) => x != diseaseId
      );
    }
  }

  ngAfterViewInit() {
    let collapse: boolean[] = [];
    $('.closeBtn').click(function () {
      $(this).closest('div').hide();
    });

    $('.Minimize').click(function () {
      let _id = $(this).attr('id');
      $('#chart' + _id).slideToggle(50);
      if (undefined == collapse[_id]) collapse[_id] = true;
      if (collapse[_id]) {
        $(this).closest('div').css('transition-duration', '.2s');
        // .css('height', '0rem');
        collapse[_id] = false;
      } else {
        $(this).closest('div').css('transition-duration', '.2s');
        // .css('height', '20rem');
        collapse[_id] = true;
      }
    });

    let i = 0,
      j = 0,
      k = 0,
      l = 0,
      m = 0,
      n = 0;
    $('.toggelBtn').on('click', function () {
      if (i == 0) {
        $('.toggelBtn .pi-chevron-down').attr('class', 'pi pi-chevron-up');
        i++;
      } else {
        $('.toggelBtn .pi-chevron-up').attr('class', 'pi pi-chevron-down');
        i--;
      }

      $('#craiteria').toggle(600).css('display', 'flex');
    });

    $('.toggelBt').on('click', function () {
      if (j == 0) {
        $('.toggelBt .pi-chevron-down').attr('class', 'pi pi-chevron-up');
        j++;
      } else {
        $('.toggelBt .pi-chevron-up').attr('class', 'pi pi-chevron-down');
        j--;
      }
      $('#craiteri').toggle(600).css('display', 'flex');
    });

    $('.toggelB').on('click', function () {
      if (m == 0) {
        $('.toggelB .pi-chevron-down').attr('class', 'pi pi-chevron-up');
        m++;
      } else {
        $('.toggelB .pi-chevron-up').attr('class', 'pi pi-chevron-down');
        m--;
      }
      $('#craiter').toggle(600).css('display', 'flex');
    });

    $('.toggel').on('click', function () {
      if (m == 0) {
        $('.toggel .pi-chevron-down').attr('class', 'pi pi-chevron-up');
        m++;
      } else {
        $('.toggel .pi-chevron-up').attr('class', 'pi pi-chevron-down');
        m--;
      }
      $('#craite').toggle(600).css('display', 'flex');
    });

    $('.togge').on('click', function () {
      if (m == 0) {
        $('.togge .pi-chevron-down').attr('class', 'pi pi-chevron-up');
        m++;
      } else {
        $('.togge .pi-chevron-up').attr('class', 'pi pi-chevron-down');
        m--;
      }
      $('#crait').toggle(600).css('display', 'flex');
    });

    $('.togg').on('click', function () {
      if (n == 0) {
        $('.togg .pi-chevron-down').attr('class', 'pi pi-chevron-up');
        n++;
      } else {
        $('.togg .pi-chevron-up').attr('class', 'pi pi-chevron-down');
        n--;
      }
      $('#crai').toggle(600).css('display', 'flex');
    });
  }

  onfeverDurationTypeChange() {
    this.isfeverDurationTypeChanged = true;
  }
}
