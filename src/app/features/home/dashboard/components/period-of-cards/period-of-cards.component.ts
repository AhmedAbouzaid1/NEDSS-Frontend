import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { cardPeriodDurationUnits } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { CardsPeriodDurationUnitEnum } from 'src/app/enums/CardsPeriodDurationUnitEnum';
import { CardsPeriodTypeEnum } from 'src/app/enums/CardsPeriodTypeEnum';

@Component({
  selector: 'app-period-of-cards',
  templateUrl: './period-of-cards.component.html',
  styleUrls: ['./period-of-cards.component.css'],
})
export class PeriodOfCardsComponent {
  fromDate: string = '';
  toDate: string = '';
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  periodOfCardsForm!: FormGroup;
  CardsPeriodTypeEnum = CardsPeriodTypeEnum;
  CardsPeriodDurationUnitEnum = CardsPeriodDurationUnitEnum;
  periodOptionsData = cardPeriodDurationUnits;
  currentLang: string;
  constructor(
    private fb: FormBuilder,
    private lookUpTableService: LookupsGetterService,
    private userMsg: UserMessageService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.getSettings();
    this.getLanguage();
    this.initForm();
  }

  initForm() {
    this.periodOfCardsForm = this.fb.group({
      periodType: [
        CardsPeriodTypeEnum.FixedPeriod.toString(),
        Validators.required,
      ],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      durationUnit: [null],
      durationValue: [null],
    });
  }

  getLanguage() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
  }

  getSettings() {
    this.lookUpTableService.getAllAppSettings().subscribe({
      next: (response) => {
        if (response) {
          this.periodOfCardsForm
            .get('periodType')
            ?.setValue(response.CardPeriodType);
          if (response.CardPeriodType == this.CardsPeriodTypeEnum.FixedPeriod) {
            this.periodOfCardsForm
              .get('fromDate')
              ?.setValue(response.CardsPeriodFromDate);
            this.periodOfCardsForm
              .get('toDate')
              ?.setValue(response.CardsPeriodToDate);
          } else {
            this.periodOfCardsForm
              .get('durationUnit')
              ?.setValue(Number(response.CardsPeriodDurationUnit));
            this.periodOfCardsForm
              .get('durationValue')
              ?.setValue(response.CardsPeriodDurationValue);
            this.periodOfCardsForm
              .get('durationUnit')
              ?.setValidators(Validators.required);
            this.periodOfCardsForm
              .get('durationValue')
              ?.setValidators(Validators.required);
            this.periodOfCardsForm.get('fromDate')?.clearValidators();
            this.periodOfCardsForm.get('toDate')?.clearValidators();
            this.periodOfCardsForm.get('fromDate')?.setValue(null);
            this.periodOfCardsForm.get('toDate')?.setValue(null);
            this.periodOfCardsForm.get('fromDate')?.updateValueAndValidity();
            this.periodOfCardsForm.get('toDate')?.updateValueAndValidity();
            this.periodOfCardsForm
              .get('durationUnit')
              ?.updateValueAndValidity();
            this.periodOfCardsForm
              .get('durationValue')
              ?.updateValueAndValidity();
          }
        }
      },
      error: (error) => {
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
    });
  }

  onSubmit() {
    if (this.periodOfCardsForm.valid) {
      if (
        this.periodOfCardsForm.value.periodType ==
        CardsPeriodTypeEnum.FixedPeriod
      ) {
        this.fromDate = this.convertDateToLocal(
          new Date(this.periodOfCardsForm.value.fromDate),
          false
        );
        this.toDate = this.convertDateToLocal(
          new Date(this.periodOfCardsForm.value.toDate),
          true
        );

        this.periodOfCardsForm.get('fromDate')?.setValue(this.fromDate);
        this.periodOfCardsForm.get('toDate')?.setValue(this.toDate);
      }
      if (this.periodOfCardsForm.value.periodType ==
        CardsPeriodTypeEnum.RelativePeriod) {
        const checkMinValue = Number(this.periodOfCardsForm.value.durationValue);
        if (isNaN(checkMinValue)) {
          this.translateService
            .get('NEDSS.COMMON.INVALID_NUMBER_TEXT_ENTERED')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
          return;
        }
        if (checkMinValue < 1) {
          this.translateService
            .get('NEDSS.COMMON.INVALID_NUMBER')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
          return;
        }
      }
      this.periodOfCardsForm
        .get('periodType')
        .setValue(Number(this.periodOfCardsForm.get('periodType')?.value));
      this.lookUpTableService
        .updateDatesForCards(this.periodOfCardsForm.value)
        .subscribe({
          next: (response) => {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
                this.router.navigateByUrl('/home/control-panel');
              });
          },
          error: (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          },
          complete: () => { },
        });
    } else {
      this.translateService
        .get('NEDSS.COMMON.REQUIRED')
        .subscribe((res: string) => {
          this.userMsg.error(res);
        });
    }
  }

  convertDateToLocal(date: Date, toEndOfDay: boolean): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    if (toEndOfDay) return `${yyyy}-${mm}-${dd}T23:59:59`;
    else return `${yyyy}-${mm}-${dd}T00:00:00`;
  }

  onPeriodTypeChange() {
    if (
      this.periodOfCardsForm.value.periodType == CardsPeriodTypeEnum.FixedPeriod
    ) {
      this.periodOfCardsForm
        .get('fromDate')
        ?.setValidators(Validators.required);
      this.periodOfCardsForm.get('toDate')?.setValidators(Validators.required);

      this.periodOfCardsForm.get('durationUnit')?.clearValidators();
      this.periodOfCardsForm.get('durationValue')?.clearValidators();
      this.periodOfCardsForm.get('durationUnit')?.setValue(null);
      this.periodOfCardsForm.get('durationValue')?.setValue(null);
    } else {
      this.periodOfCardsForm
        .get('durationUnit')
        ?.setValidators(Validators.required);
      this.periodOfCardsForm
        .get('durationValue')
        ?.setValidators(Validators.required);
      this.periodOfCardsForm.get('fromDate')?.clearValidators();
      this.periodOfCardsForm.get('toDate')?.clearValidators();
      this.periodOfCardsForm.get('fromDate')?.setValue(null);
      this.periodOfCardsForm.get('toDate')?.setValue(null);
    }
    this.periodOfCardsForm.get('fromDate')?.updateValueAndValidity();
    this.periodOfCardsForm.get('toDate')?.updateValueAndValidity();
    this.periodOfCardsForm.get('durationUnit')?.updateValueAndValidity();
    this.periodOfCardsForm.get('durationValue')?.updateValueAndValidity();

  }

  get periodType() {
    return this.periodOfCardsForm.get('periodType');
  }

  getDurationUnit() {
    if (this.currentLang == 'ar') {
      const durationUnit = '';
      switch (this.periodOfCardsForm.value.durationUnit) {
        case CardsPeriodDurationUnitEnum.Hour:
          return 'ساعات';
        case CardsPeriodDurationUnitEnum.Day:
          return 'ايام';
        case CardsPeriodDurationUnitEnum.Week:
          return 'أسابيع';
        case CardsPeriodDurationUnitEnum.Month:
          return 'شهور';
        case CardsPeriodDurationUnitEnum.Year:
          return 'سنين';
        default:
          return durationUnit;
      }
    } else {
      const durationUnit = '';
      switch (this.periodOfCardsForm.value.durationUnit) {
        case CardsPeriodDurationUnitEnum.Hour:
          return 'Hours';
        case CardsPeriodDurationUnitEnum.Day:
          return 'Days';
        case CardsPeriodDurationUnitEnum.Week:
          return 'Weeks';
        case CardsPeriodDurationUnitEnum.Month:
          return 'Months';
        case CardsPeriodDurationUnitEnum.Year:
          return 'Years';
        default:
          return durationUnit;
      }
    }
  }
}
