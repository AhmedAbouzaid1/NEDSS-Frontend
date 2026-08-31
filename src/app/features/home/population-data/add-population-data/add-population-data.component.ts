import { Idle } from '@ng-idle/core';
import { AddPopulationServiceService } from './addPopulationService.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { SearchPopulationService } from '../search-populationExpectation/Services/searchPopulationService.service';
@Component({
  selector: 'app-add-population-data',
  templateUrl: './add-population-data.component.html',
  styleUrls: ['./add-population-data.component.css'],
})
export class AddPopulationDataComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  levelId: any;
  //public ClientForm: FormGroup;
  governments: any;
  years: any;
  loadingPanel: boolean = false;
  governmentsLoading: boolean = false;
  healthAdministrationLoading: boolean = false;
  incidentSourcesLoading: boolean = false;
  healthAdministration: any;
  incidentSources: any;
  //malec: any;
  //femalec: any;
  total: number = 0;
  addPopulationFormGroup: FormGroup;
  PopulationCount: FormControl;
  //singleDropdownSettings = SingleDropdownSettings;
  selectedhealthAdministrationId: number;
  selectedincidentSourceId: number;
  //selectedYear: any;
  data: any;
  id: any;
  deletedPopulation: any;

  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private addPopulationServiceService: AddPopulationServiceService,
    private searchPopulationService: SearchPopulationService
  ) { }


  ngOnInit() {
    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;

    if (this.total != 0) {
      this.PopulationCount = new FormControl(this.total);
    } else this.PopulationCount = new FormControl();

    this.addPopulationFormGroup = new FormGroup({
      year: new FormControl(),
      governmentID: new FormControl(),
      incidentSourceId: new FormControl(),
      healthAdministrationID: new FormControl(),
      category: new FormControl(),
      ageLowerThanMonth: new FormControl(),
      ageLowerThanYear: new FormControl(),
      ageUpTo5: new FormControl(),
      ageUpTo15: new FormControl(),
      ageUpTo35: new FormControl(),
      ageUpTo65: new FormControl(),
      ageMoreThan65: new FormControl(),
      maleCount: new FormControl(),
      femalCount: new FormControl(),
      PopulationCount: this.PopulationCount,
      id: new FormControl(),
    });

    this.years = [
      { year: '' },
      { year: new Date().getFullYear() },
      { year: new Date().getFullYear() - 1 },
      { year: new Date().getFullYear() - 2 },
      { year: new Date().getFullYear() - 3 },
      { year: new Date().getFullYear() - 4 }
    ];

    this.loadingPanel = true;
    this.getLookups();
    this.loadingPanel = false;
    // this.id = this.route.snapshot.paramMap.get('id');
    // if (this.id != null) {
    //   this.getById(this.id);
    // }
  }

  //this method allows the user to only input number values and can backspace (delete) the numbers.
  // inputKey !== '+' &&
  onNumberKeyPress(event: KeyboardEvent): void {
    let inputKey = event.key;
    if (inputKey !== 'Backspace' && isNaN(Number(inputKey))) {
      event.preventDefault();
    }
  }

  getLookups() {
    this.getGovernments();
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsService.getAllGovernmentsForUser(true).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.governments.push(gov);
          });

          // if (this.levelId != 1) {
          //   this.governmentID.setValue(JSON.parse(
          //     localStorage.getItem('ls.authorizationData')
          //   ).user.govenmentId);
          //   this.onGovernmentChanged();
          // }
        }
        this.governmentsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.governmentsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getHealthAdministrationByGovId(x: any) {
    this.healthAdministration = [];
    this.healthAdministrationLoading = true;
    this.lookupsService
      .getPageHealthAdministrationsForUsers({ governmentID: x, forSystemUser: true })
      .subscribe(
        (result: any) => {
          this.healthAdministrationLoading = false;
          if (result != null && result != undefined) {
            this.healthAdministration = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];

            result.data.forEach((ha) => {
              this.healthAdministration.push(ha);
            });

            this.addPopulationFormGroup.value.healthAdministrationID = this.selectedhealthAdministrationId;

            if (this.levelId != 1 && this.levelId != 2) {
              this.healthAdministrationID.setValue(JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.healthAdministrationId);
              this.onHealthAdministrationChanged();
            }
            else if (this.addPopulationFormGroup.value.healthAdministrationID != null) {
              this.healthAdministrationID.setValue(this.addPopulationFormGroup.value.healthAdministrationID);
              this.getRelatedIncidentSources(this.addPopulationFormGroup.value.healthAdministrationID);
            }
          }
        },
        (error) => {
          this.healthAdministrationLoading = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getRelatedIncidentSources(x: any) {
    this.incidentSources = [];
    this.incidentSourcesLoading = true;

    this.lookupsService
      .getPageIncidentSourceHospitals({ healthAdministrationID: x, forSystemUser: true })
      .subscribe(
        (result: any) => {
          this.incidentSourcesLoading = false;
          if (result != null && result != undefined) {
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((src) => {
              this.incidentSources.push(src);
            });


            this.addPopulationFormGroup.value.incidentSourceId = this.selectedincidentSourceId;
            if (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) {
              //let incidentSourceId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId;
              //this.incidentSourceId.setValue(incidentSourceId);
              this.incidentSourceId.setValue(this.addPopulationFormGroup.value.incidentSourceId);

              //this.selectedincidentSourceId = incidentSourceId;
            }
            else if (
              this.addPopulationFormGroup.value.incidentSourceId != null
            ) {
              this.incidentSourceId.setValue(this.addPopulationFormGroup.value.incidentSourceId);
            }
          }
        },
        (error) => {
          this.incidentSourcesLoading = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getById(id) {
    this.addPopulationServiceService.getById(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.addPopulationFormGroup = new FormGroup({
            year: new FormControl(result.data.year),
            governmentID: new FormControl(result.data.governmentID),
            incidentSourceId: new FormControl(result.data.incidentSourceID),
            healthAdministrationID: new FormControl(result.data.healthAdministrationID),
            // category: new FormControl(result.data.maleCount != null ? 'sex' : 'age'),
            ageLowerThanMonth: new FormControl(result.data.ageLowerThanMonth),
            ageLowerThanYear: new FormControl(result.data.ageLowerThanYear),
            ageUpTo5: new FormControl(result.data.ageUpTo5),
            ageUpTo15: new FormControl(result.data.ageUpTo15),
            ageUpTo35: new FormControl(result.data.ageUpTo35),
            ageUpTo65: new FormControl(result.data.ageUpTo65),
            ageMoreThan65: new FormControl(result.data.ageMoreThan65),
            maleCount: new FormControl(result.data.maleCount),
            femalCount: new FormControl(result.data.femalCount),
            PopulationCount: new FormControl(result.data.populationCount),
            id: new FormControl(result.data.id),
          });

          this.selectedhealthAdministrationId = result.data.healthAdministrationID;
          this.selectedincidentSourceId = result.data.incidentSourceID;

          this.getHealthAdministrationByGovId(
            this.addPopulationFormGroup.value.governmentID
          );

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

  validateForm() {
    if (this.addPopulationFormGroup.value.governmentID == null) {
      this.translateService.get('NEDSS.HOME.POPULATION_DATA.POPULATION_ADD.EMPTY_GOVERNMENT').subscribe((res: string) => {
        this.userMsg.error(res);
      });
      return false;
    }

    if (this.addPopulationFormGroup.value.healthAdministrationID == null) {
      this.translateService.get('NEDSS.HOME.POPULATION_DATA.POPULATION_ADD.EMPTY_ADMINISTRATION').subscribe((res: string) => {
        this.userMsg.error(res);
      });
      return false;
    }
    if (this.addPopulationFormGroup.value.incidentSourceId == null) {
      this.translateService.get('NEDSS.HOME.POPULATION_DATA.POPULATION_ADD.EMPTY_INCIDENT').subscribe((res: string) => {
        this.userMsg.error(res);
      });
      return false;
    }

    if (this.addPopulationFormGroup.value.PopulationCount == null || this.addPopulationFormGroup.value.PopulationCount == '') {
      this.translateService.get('NEDSS.HOME.POPULATION_DATA.POPULATION_ADD.EMPTY_POPULATIONCOUNT').subscribe((res: string) => {
        this.userMsg.error(res);
      });
      return false;
    }

    return true;
  }

  onGovernmentChanged(isFirst?: boolean) {
    this.incidentSources = null;
    if (this.governmentID.value > -1) {
      this.addPopulationFormGroup.value.governmentID = this.governmentID.value;
      this.getHealthAdministrationByGovId(
        this.addPopulationFormGroup.value.governmentID
      );
        this.getTableData();
    } else {
      this.healthAdministrationID.setValue(null);
      this.healthAdministration = null;
      this.deSelectAdministration();
    }
  }

  onHealthAdministrationChanged(isFirst?: boolean) {
    if (this.healthAdministrationID.value > -1) {
      this.addPopulationFormGroup.value.healthAdministrationID =
        this.healthAdministrationID.value;
      this.getRelatedIncidentSources(
        this.addPopulationFormGroup.value.healthAdministrationID
      );
      this.getTableData();
    } else {
      this.deSelectAdministration();
    }

  }

  deSelectAdministration() {
    this.incidentSourceId.setValue(null);
    this.incidentSources = null;
  }

  addPopulation() {
    if (!this.validateMaleAndFemale()) {
      return;
    }

    if (!this.validateAge()) {
      return;
    }

    if (!this.isMaleAndFemaleRequired()) {
      this.maleCount.setValue(null);
      this.femaleCount.setValue(null);
    }

    if (!this.isDetailedAgeRequired()) {
      this.ageLowerThanMonth.setValue(null);
      this.ageLowerThanYear.setValue(null);
      this.ageUpTo5.setValue(null);
      this.ageUpTo15.setValue(null);
      this.ageUpTo35.setValue(null);
      this.ageUpTo65.setValue(null);
      this.ageMoreThan65.setValue(null);
    }


    if (this.governmentID.value != null && this.governmentID.value > 0) {
      this.addPopulationFormGroup.value.governmentID = this.governmentID.value;
    }
    if (
      this.healthAdministrationID.value != null &&
      this.healthAdministrationID.value > 0
    ) {
      this.addPopulationFormGroup.value.healthAdministrationID =
        this.healthAdministrationID.value;
    }
    if (this.incidentSourceId.value != null && this.incidentSourceId.value > 0) {
      this.addPopulationFormGroup.value.incidentSourceId =
        this.incidentSourceId.value;
    }

    if (!this.validateForm()) {
      this.PopulationCount.setErrors({
        ...(this.PopulationCount.errors || {}),
        newError: this.translateService.get(
          'NEDSS.HOME.POPULATION_DATA.POPULATION_ADD.POPULATION_COUNT_ERROR'
        ),
      });
      return;
    }

    if (this.addPopulationFormGroup.value.id == null) {
      let isPopulationExist = this.data.some(item =>
        item.incidentSourceID === this.addPopulationFormGroup.value.incidentSourceId &&
        item.healthAdministrationID === this.addPopulationFormGroup.value.healthAdministrationID &&
        item.governmentID === this.addPopulationFormGroup.value.governmentID &&
        item.year === this.addPopulationFormGroup.value.year
      );

      if (isPopulationExist) {
        this.translateService.get('NEDSS.HOME.POPULATION_DATA.POPULATION_ADD.DUPLICATED_VALUES').subscribe((res: string) => {
          this.userMsg.error(res);
        });
        return;
      }
    }

    if (this.addPopulationFormGroup.value.id == null) {
      this.addPopulationServiceService
        .addPopulation(this.addPopulationFormGroup.value)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService.get('NEDSS.HOME.POPULATION_DATA.POPULATION_ADD.SUCCESS_ADD').subscribe((res: string) => {
                this.userMsg.success(res);
              });
              this.governmentID.setValue(-1);
              this.healthAdministration = null;
              this.incidentSources = null;

              let search = {
                year: response.data.year,
                incidentSourceID: response.data.incidentSourceID,
                healthAdministrationID: response.data.healthAdministrationID,
                governmentID: response.data.governmentID,
              }

              this.addPopulationServiceService.getPagePatients(search).subscribe({
                next: (data) => {
                  this.data = data.data;
                }
              })

              this.addPopulationFormGroup.reset();

              // this.router.navigateByUrl(
              //   'home/population-data/populationExpectation'
              // );
            }

            this.loadingPanel = false;
          },
          (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
            this.loadingPanel = false;
          }
        );
    } else {
      this.addPopulationServiceService
        .updatePopulation(this.addPopulationFormGroup.value)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });


              let search = {
                year: response.data.year,
                incidentSourceID: response.data.incidentSourceID,
                healthAdministrationID: response.data.healthAdministrationID,
                governmentID: response.data.governmentID,
              }

              // this.addPopulationServiceService.getPagePatients(search).subscribe({
              //   next: (data) => {
              //     this.data = data.data;
              //   }
              // })

              this.addPopulationFormGroup.reset();

              // this.router.navigateByUrl(
              //   'home/population-data/populationExpectation'
              // );
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
  }


  isMaleAndFemaleRequired(): boolean {
    return this.maleCount.value
      || this.femaleCount.value
  }

  isDetailedAgeRequired(): boolean {
    return this.ageLowerThanMonth.value
      || this.ageLowerThanYear.value
      || this.ageUpTo5.value
      || this.ageUpTo15.value
      || this.ageUpTo35.value
      || this.ageUpTo65.value
      || this.ageMoreThan65.value;
  }

  validateMaleAndFemale(): boolean {
    if (this.isMaleAndFemaleRequired()) {
      let totalNumber: number = +this.maleCount.value + +this.femaleCount.value;
      if (totalNumber == this.populationCount.value) {
        return true;
      } else {
        this.userMsg.error(
          this.currentLang == 'ar'
            ? 'عدد الحالات الاجمالي يجب ان يساوى عدد الحالات الذكور والاناث معا '
            : 'Total count should be equal to the sum of male and the sum of female count'
        );
        return false;
      }
    } else {
      return true;
    }
  }

  setTotalAges(): number {
    return (+this.ageLowerThanMonth.value) +
      (+this.ageLowerThanYear.value) +
      (+this.ageUpTo5.value) +
      (+this.ageUpTo15.value) +
      (+this.ageUpTo35.value) +
      (+this.ageUpTo65.value) +
      (+this.ageMoreThan65.value);
  }

  validateAge(): boolean {
    if (this.isDetailedAgeRequired()) {
      let totalNumber: number = this.setTotalAges();
      if (totalNumber == this.populationCount.value) {
        return true;
      } else {
        this.userMsg.error(
          this.currentLang == 'ar'
            ? 'عدد الحالات الاجمالي يجب ان يساوى عدد الحالات الموزعه علي السنوات'
            : 'Total count should be equal to the sum of all years count'
        );
        return false;
      }
    } else {
      return true;
    }
  }

  getTableData() {
    if (this.year.value == null || this.year.value == '') {
      this.incidentSources = null;
      this.healthAdministrationID.setValue(-1);
      this.data = null;
      this.userMsg.error('يجب ادخال العام');
      return;
    }

    let search: any = {};
    search.year = this.year.value;
    if (this.incidentSourceId.value && this.incidentSourceId.value != -1) {
      search.incidentSourceID = this.incidentSourceId.value;
    }

    if (this.healthAdministrationID.value && this.healthAdministrationID.value != -1) {
      search.healthAdministrationID = this.healthAdministrationID.value;
    }

    if (this.governmentID.value && this.governmentID.value != -1) {
      search.governmentID = this.governmentID.value;
    }

    this.addPopulationServiceService.getPagePatients(search).subscribe({
      next: (data) => {
        this.data = data.data;
      }
    })
  }

  delete(id: number) {
    this.searchPopulationService.deletePagePatient(id).subscribe(
      (result: any) => {
        this.getTableData();
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

  populationToDelete(population: any) {
    this.deletedPopulation = population;
  }


  get populationCount() {
    return this.addPopulationFormGroup.get('PopulationCount');
  }

  get maleCount() {
    return this.addPopulationFormGroup.get('maleCount');
  }

  get femaleCount() {
    return this.addPopulationFormGroup.get('femalCount');
  }

  get ageLowerThanMonth() {
    return this.addPopulationFormGroup.get('ageLowerThanMonth');

  }

  get ageLowerThanYear() {
    return this.addPopulationFormGroup.get('ageLowerThanYear');

  }

  get ageUpTo5() {
    return this.addPopulationFormGroup.get('ageUpTo5');
  }

  get ageUpTo15() {
    return this.addPopulationFormGroup.get('ageUpTo15');

  }

  get ageUpTo35() {
    return this.addPopulationFormGroup.get('ageUpTo35');

  }

  get ageUpTo65() {
    return this.addPopulationFormGroup.get('ageUpTo65');

  }

  get ageMoreThan65() {
    return this.addPopulationFormGroup.get('ageMoreThan65');

  }

  get year() {
    return this.addPopulationFormGroup.get('year');
  }

  get healthAdministrationID() {
    return this.addPopulationFormGroup.get('healthAdministrationID');
  }

  get incidentSourceId() {
    return this.addPopulationFormGroup.get('incidentSourceId');
  }

  get governmentID() {
    return this.addPopulationFormGroup.get('governmentID');
  }




}
