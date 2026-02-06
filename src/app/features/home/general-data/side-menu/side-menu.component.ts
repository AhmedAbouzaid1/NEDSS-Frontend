import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { SharedDataService } from '../services/shared-data.service';
import { PatientModel } from '../models/patient-model';
import { GeneralDataEnum } from '../models/general-data.eums';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  @Input() completedTabs: number;
  @Input() currentTab: string;
  @Input() activeAllTabs: boolean;
  @Input() active: number;

  dummy: number = 10;

  patient: PatientModel = new PatientModel;
  lang: string = 'ar';

  @Output() onTabChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(public route: ActivatedRoute, public sharedDataService: SharedDataService, private lookupsService: LookupsGetterService, private translateService: TranslateService, private userMsg: UserMessageService) { }
  ngOnInit() {
    this.sharedDataService.getPatientObject().subscribe((patientObject) => {
      this.patient = patientObject;
    });
    this.lang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
  }


  public get generalDataEnum(): typeof GeneralDataEnum {
    return GeneralDataEnum
  }

  changeTab() {
    this.onTabChange.emit(this.active);
  }

}
