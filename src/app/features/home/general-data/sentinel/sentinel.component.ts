import { Component, OnInit } from '@angular/core';
import { PatientModel, SentinelData } from '../models/patient-model';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { CustomeService } from '../residence-info/custome.service';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-sentinel',
  templateUrl: './sentinel.component.html',
  styleUrls: ['./sentinel.component.css']
})
export class SentinelComponent implements OnInit {
  patient: PatientModel = new PatientModel;
  sentinelData: SentinelData = new SentinelData;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  sariCaseDefinitions: any[] = [
    {
      id: null,
      name: "NEDSS.COMMON.CHOOSE"
    },
    {
      id: 1,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.SARI_CASE_DEFINITION_OPTION_1"
    },
    {
      id: 2,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.SARI_CASE_DEFINITION_OPTION_2"
    },
  ]
  patientMeetSARIs = [
    {
      id: null,
      name: "NEDSS.COMMON.CHOOSE"
    },
    {
      id: 1,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.YES"
    },
    {
      id: 2,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.NO"
    },
  ]

  patientMeetExtendedSARIs = [
    {
      id: null,
      name: "NEDSS.COMMON.CHOOSE"
    },
    {
      id: 1,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.YES"
    },
    {
      id: 2,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.NO"
    },
  ]
  pneumoniaCaseDefinitions = [
    {
      id: null,
      name: "NEDSS.COMMON.CHOOSE"
    },
    {
      id: 1,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.PNEUMONIA_CASE_DEFINITION_OPTION_1"
    },
    {
      id: 2,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.PNEUMONIA_CASE_DEFINITION_OPTION_2"
    },
    {
      id: 3,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.PNEUMONIA_CASE_DEFINITION_OPTION_3"
    },
  ]
  doesCases = [
    {
      id: null,
      name: "NEDSS.COMMON.CHOOSE"
    },
    {
      id: 1,
      name: "CAP"
    },
    {
      id: 2,
      name: "VAP"
    },
    {
      id: 3,
      name: "HAP"
    },
  ]
  wardAdmissions = [
    {
      id: null,
      name: "NEDSS.COMMON.CHOOSE"
    },
    {
      id: 1,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.WARD_ADMISSION_OPTION_1"
    },
    {
      id: 2,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.WARD_ADMISSION_OPTION_2"
    },
    {
      id: 3,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.WARD_ADMISSION_OPTION_3"
    },
    {
      id: 4,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.WARD_ADMISSION_OPTION_4"
    },
    {
      id: 5,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.OTHER"
    },
  ]

  patientReceiveInfluenzaAntivirals = [
    {
      id: null,
      name: "NEDSS.COMMON.CHOOSE"
    },
    {
      id: 1,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.YES"
    },
    {
      id: 2,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.NO"
    },
    {
      id: 3,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.UNKNOWN"
    },
  ]
  antibioticsTakenWithInLastWeeks = [
    {
      id: null,
      name: "NEDSS.COMMON.CHOOSE"
    },
    {
      id: 1,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.YES"
    },
    {
      id: 2,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.NO"
    },
    {
      id: 3,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.UNKNOWN"
    },
  ]
  antibioticsIsTakens = [
    {
      id: null,
      name: "NEDSS.COMMON.CHOOSE"
    },
    {
      id: 1,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.YES"
    },
    {
      id: 2,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.ANTIBIOTICS_IS_TAKEN_OPTION_2"
    },
    {
      id: 3,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.ANTIBIOTICS_IS_TAKEN_OPTION_3"
    },
    {
      id: 4,
      name: "NEDSS.HOME.GENERAL_DATA_SENTINEL.ANTIBIOTICS_IS_TAKEN_OPTION_4"
    },
  ]

  constructor(private sharedDataService: SharedDataService, private lookupsService: LookupsGetterService, private translateService: TranslateService,
    private userMsg: UserMessageService, private customService: CustomeService) { }

  ngOnInit(): void {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
    });

    this.sharedDataService.getSentinelDataObject().subscribe((sentinalObject) => {
      this.sentinelData = sentinalObject;
    });

    this.translateService.use(this.currentLang);
  }
  update(x: any) {
  }
}
