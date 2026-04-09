import { Component, OnInit } from '@angular/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { InvestigationService } from '../../services/investigation.service';
import { TranslateService } from '@ngx-translate/core';
import { MultipleDropdownSettings } from 'src/app/core/constants';
@Component({
  selector: 'app-severe-food-poisoning',
  templateUrl: './severe-food-poisoning.component.html',
  styleUrls: ['./severe-food-poisoning.component.css']
})
export class SevereFoodPoisoningComponent implements OnInit {
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';

      
  allFilledControlsCount: number = 0;
  allControllesCount: number = 0;
  patientName: string;
  private readonly multiSelectDelimiter = '|';
  multipleDropdownSettings = {};
  samplesDropdownSettings = {};

  exposureLocations = [
    { id: 'HOME', arabicName: 'منزل', englishName: 'Home' },
    { id: 'RESTAURANT', arabicName: 'مطعم', englishName: 'Restaurant' },
    { id: 'SCHOOL', arabicName: 'مدرسة', englishName: 'School' },
    { id: 'HOTEL', arabicName: 'فندق', englishName: 'Hotel' },
    { id: 'MARKET', arabicName: 'سوق', englishName: 'Market' },
    { id: 'SUPERMARKET', arabicName: 'سوبر ماركت', englishName: 'Supermarket' },
    { id: 'PARTIES', arabicName: 'حفلات', englishName: 'Parties' },
    { id: 'OTHER', arabicName: 'أخرى', englishName: 'Other' },
  ];

  foodTypeOptions = [
    { id: 'MEAT', arabicName: 'لحوم', englishName: 'Meat' },
    { id: 'POULTRY', arabicName: 'دواجن', englishName: 'Poultry' },
    { id: 'FISH', arabicName: 'أسماك', englishName: 'Fish' },
    { id: 'DAIRY_PRODUCTS', arabicName: 'منتجات ألبان', englishName: 'Dairy products' },
    { id: 'WATER', arabicName: 'مياه', englishName: 'Water' },
    { id: 'BAKERY', arabicName: 'معجنات', englishName: 'Bakery' },
    { id: 'FRUITS_AND_VEGETABLES', arabicName: 'خضروات وفاكهة', englishName: 'Vegetables and fruits' },
    { id: 'SWEETS_OR_DRINKS', arabicName: 'حلويات أو مشروبات', englishName: 'Sweets or drinks' },
    { id: 'OTHER', arabicName: 'أخرى', englishName: 'Other' },
  ];

  waterSourceOptions = [
    { id: 'NETWORK', arabicName: 'شبكة', englishName: 'Network' },
    { id: 'GROUNDWATER', arabicName: 'مياه جوفية', englishName: 'Groundwater' },
    { id: 'TANK', arabicName: 'خزان', englishName: 'Tank' },
    { id: 'OTHER', arabicName: 'أخرى', englishName: 'Other' },
  ];

  humanSampleOptions = [
    { id: 'VOMIT', arabicName: 'قيء', englishName: 'Vomit' },
    { id: 'URINE', arabicName: 'بول', englishName: 'Urine' },
    { id: 'STOOL', arabicName: 'براز', englishName: 'Stool' },
    { id: 'BLOOD', arabicName: 'دم', englishName: 'Blood' },
    { id: 'OTHER', arabicName: 'أخرى', englishName: 'Other' },
  ];

  environmentalSampleOptions = [
    { id: 'FOOD_REMAINS', arabicName: 'بقايا طعام', englishName: 'Food remains' },
    { id: 'WATER', arabicName: 'مياه', englishName: 'Water' },
    { id: 'OTHER', arabicName: 'أخرى', englishName: 'Other' },
  ];

  selectedFoodTypes: any[] = [];
  selectedExposureLocations: any[] = [];
  selectedWaterSources: any[] = [];
  selectedHumanSamples: any[] = [];
  selectedEnvironmentalSamples: any[] = [];

  constructor(private investigationService: InvestigationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService) {
      if (this.investigationService.patient.firstName != null && this.investigationService.patient.firstName != undefined) {
        this.patientName = this.investigationService.patient.firstName + " " + this.investigationService.patient.secondName + " " + this.investigationService.patient.thirdName;
      }
     }

  SevereFoodPoisoningData = {
    patientID: null,
    id: null,
    caseCount: null,
    exposureLocation: null,
    exposureLocationOther: null,
    foodTypes: null,
    foodTypeOther: null,
    foodIntakeTime: null,
    symptomsOnsetTime: null,
    preparationToIntakeDuration: null,
    foodExposureCount: null,
    generalCaseStatus: null,
    waterSourceType: null,
    waterSourceOther: null,
    humanSamples: null,
    humanSamplesOther: null,
    environmentalSamples: null,
    environmentalSamplesOther: null,
    diseaseGroupId: this.investigationService.diseaseGroupID,
    investigationCompletePercentage:null
  }

  currentId: any;
  ngOnInit(): void {
    this.multipleDropdownSettings = {
      ...MultipleDropdownSettings,
      closeDropDownOnSelection: false,
    };
    this.samplesDropdownSettings = {
      ...MultipleDropdownSettings,
      closeDropDownOnSelection: false,
      maxHeight: 240,
    };

    this.currentId = this.investigationService.currentid
    this.SevereFoodPoisoningData.patientID = this.currentId;
    this.investigationService.getByIdSevereFoodPoisoning(this.currentId).subscribe(
      res => {
        console.log(res);
        var v = res.data;
        if (v != null) {
          this.SevereFoodPoisoningData = v;
          this.selectedFoodTypes = this.deserializeMultiValue(v.foodTypes, this.foodTypeOptions);
          this.selectedExposureLocations = this.deserializeMultiValue(v.exposureLocation, this.exposureLocations);
          this.selectedWaterSources = this.deserializeMultiValue(v.waterSourceType, this.waterSourceOptions);
          this.selectedHumanSamples = this.deserializeMultiValue(v.humanSamples, this.humanSampleOptions);
          this.selectedEnvironmentalSamples = this.deserializeMultiValue(v.environmentalSamples, this.environmentalSampleOptions);
          this.calculateCompletionPercentage();
        }

        //this.rabiesForm.patchValue(v)
      }
      , (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    )
  }

  save() {
    this.normalizeOtherFields();
    this.SevereFoodPoisoningData.diseaseGroupId = this.investigationService.diseaseGroupID;
    this.SevereFoodPoisoningData.exposureLocation = this.serializeMultiValue(this.selectedExposureLocations);
    this.SevereFoodPoisoningData.foodTypes = this.serializeMultiValue(this.selectedFoodTypes);
    this.SevereFoodPoisoningData.waterSourceType = this.serializeMultiValue(this.selectedWaterSources);
    this.SevereFoodPoisoningData.humanSamples = this.serializeMultiValue(this.selectedHumanSamples);
    this.SevereFoodPoisoningData.environmentalSamples = this.serializeMultiValue(this.selectedEnvironmentalSamples);
    this.calculateCompletionPercentage();
    this.SevereFoodPoisoningData.investigationCompletePercentage = parseFloat(((this.allFilledControlsCount / this.allControllesCount) * 100).toFixed(2));
    //console.log(this.rabiesForm.value);
    if (this.SevereFoodPoisoningData != null && this.SevereFoodPoisoningData.id != null) {
      this.investigationService.updateSevereFoodPoisoning(this.SevereFoodPoisoningData).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      )
    } else {
      this.investigationService.addInvestigationSevereFoodPoisoning(this.SevereFoodPoisoningData).subscribe(
        (response: any) => {

          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          }
        }
        , (error) => {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      )
    }
  }

  //BL
  calculateCompletionPercentage() {
    this.normalizeOtherFields();
    this.allFilledControlsCount = 0;
    const data = this.SevereFoodPoisoningData;
    //Exclude fields you don't want to count (like 'id')
    const excludedFields = ['id', 'patientID', 'investigationCompletePercentage', 'diseaseGroupId', 'createdDate'];
    const totalFields = Object.keys(data).filter(key => !excludedFields.includes(key)).length;

    this.allControllesCount = totalFields;

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key) && data[key] !== null && data[key] !== '' && data[key] !== 'null') {
        this.allFilledControlsCount++;
      }
    });
  }

  isChecked(list: any[], value: string): boolean {
    return (list || []).some((item) => item?.id === value);
  }

  private normalizeOtherFields(): void {
    if (!this.isChecked(this.selectedExposureLocations, 'OTHER')) {
      this.SevereFoodPoisoningData.exposureLocationOther = null;
    }
    if (!this.isChecked(this.selectedFoodTypes, 'OTHER')) {
      this.SevereFoodPoisoningData.foodTypeOther = null;
    }
    if (!this.isChecked(this.selectedWaterSources, 'OTHER')) {
      this.SevereFoodPoisoningData.waterSourceOther = null;
    }
    if (!this.isChecked(this.selectedHumanSamples, 'OTHER')) {
      this.SevereFoodPoisoningData.humanSamplesOther = null;
    }
    if (!this.isChecked(this.selectedEnvironmentalSamples, 'OTHER')) {
      this.SevereFoodPoisoningData.environmentalSamplesOther = null;
    }
  }

  private serializeMultiValue(values: any[]): string | null {
    if (!values || values.length === 0) {
      return null;
    }
    return values.map((item) => item.id).join(this.multiSelectDelimiter);
  }

  private deserializeMultiValue(value: string | null, options: any[]): any[] {
    if (!value) {
      return [];
    }
    const selectedIds = value
      .split(this.multiSelectDelimiter)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return (options || []).filter((option) => selectedIds.includes(option.id));
  }
}

