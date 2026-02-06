import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DiseaseGroupQuestionType } from 'src/app/features/home/dashboard/components/disease-special-symptoms/models/DiseaseGroupQuestionType';
import { SharedDataService } from 'src/app/features/home/general-data/services/shared-data.service';

@Component({
  selector: 'build-form',
  templateUrl: './build-form.component.html',
  styleUrls: ['./build-form.component.css'],
})
export class BuildFormComponent implements OnInit, OnChanges {
  form?: FormGroup;
  @Input() update: number = 0;
  @Input() formTest?: any = {};
  @Input() projectFileds: any[] = [];
  @Output() OnRegister = new EventEmitter<any>(); // output create  Change
  @Output() OnUpdate = new EventEmitter<any>(); // output create  Change
  @Output() OnSearch = new EventEmitter<any>(); // output create  Change
  @Output() OnReturnForm = new EventEmitter<any>(); // output create  Change
  @Output() OnValidForm = new EventEmitter<any>(); // output create  Change
  @Input() loader: any = false;
  @Input() answerDefault: any = {};

  delimiter: any = '-';
  editForm: any = {};
  @Input() isEdit: any = false;
  lang: string = '';
  constructor(
    private sharedDataService: SharedDataService,
    private translateService: TranslateService
  ) { }


  public get diseaseGroupQuestionType(): typeof DiseaseGroupQuestionType {
    return DiseaseGroupQuestionType
  }

  ngOnChanges(): void {
    if (this.projectFileds && this.projectFileds.length > 0) {
      this.getFormControlsFields();
    }
  }

  ngOnInit() {
    this.buildForm();
    this.checkFormValid();
  }


  buildForm() {

    if (this.projectFileds && this.projectFileds.length > 0) {
      const formGroupFields = this.getFormControlsFields();
      this.form = new FormGroup(formGroupFields);
    }
  }

  getFormControlsFields() {
    const formGroupFields: any = {};
    this.projectFileds.forEach((field) => {
      const validators = field.diseaseGroupQuestionIsRequired === true ? Validators.required : null;
      let defaultValue: any = '';

      if (field.diseaseGroupQuestionType === this.diseaseGroupQuestionType.CheckBox) {
        if (!field?.patientAnswers) {
          field.patientAnswers = {};
        }
        else if (field?.patientAnswers instanceof Array) {
          if (!field?.patientAnswers?.length) {
            field.patientAnswers = {};
          } else {
            let result = {};
            field.allAvailableAnswers.forEach(x => {
              result[x.id] = field.patientAnswers.find(y => y == x.id) ? true : false;
            })
            field.patientAnswers = result;
          }
        }
      }
      else if (field?.diseaseGroupQuestionType == this.diseaseGroupQuestionType.RadioButton ||
        field?.diseaseGroupQuestionType == this.diseaseGroupQuestionType.DropDownList) {
        field.patientAnswers = field.patientAnswers?.length && field.patientAnswers instanceof Array ? field.patientAnswers?.[0] + '' : field.patientAnswers;
      }
      if (field.diseaseGroupQuestionType != this.diseaseGroupQuestionType.CheckBox)
        formGroupFields[field.diseaseGroupQuestionName] = new FormControl(
          defaultValue,
          validators
        );
    });


    return formGroupFields;
  }

  getFormFiled(name: string) {
    return this.form?.get(name);
  }
  onReset() {
    this.form?.reset();
    this.isEdit = false;
  }
  getLabel(name: string): string {
    return name.replace('_', ' ');
  }
  onRegister() {
    this.OnRegister.emit(this.form?.value);
  }
  onUpdate() {
    this.OnUpdate.emit(this.form?.value);
  }
  getModel(name: string) {
    return this.form!.get(name);
  }
  checkFormValid() {
    this.form.valueChanges.subscribe(() => {
      //if (this.form!.valid && this.customValidationForCheckbox()) {
      setTimeout(() => {
        this.emitChange()
      });
      //}
    });
  }
  emitChange() {
    this.OnReturnForm.emit(this.form?.value);
    this.OnValidForm.emit(this.getVaildForm());
  }
  customValidationForCheckbox(): boolean {

    for (let index = 0; index < this.projectFileds?.length; index++) {
      const element = this.projectFileds?.[index];
      if (element?.diseaseGroupQuestionType == this.diseaseGroupQuestionType.CheckBox && !this.validateCheckBoxField(element)) {
        return false
      }
    }
    return true;
  }
  validateCheckBoxField(field: any): boolean {

    if (field?.diseaseGroupQuestionIsRequired) {
      if (!field?.patientAnswers) return false;

      let values: any[] = Object.values(field.patientAnswers);

      if (!values?.length || !values.some(x => x)) return false;
    }
    return true;;
  }
  getVaildForm() {
    let model: any = [];

    for (let index = 0; index < this.projectFileds?.length; index++) {
      const element = this.projectFileds?.[index];
      model[index] = {
        id: element?.id,
        answer: element?.diseaseGroupQuestionType == this.diseaseGroupQuestionType.Number && element?.answer ? element?.answer + '' : element?.answer,
        patientId: element?.patientId,
        diseaseGroupId: element?.diseaseGroupId,
        diseaseGroupQuestionId: element?.diseaseGroupQuestionId,
        diseaseGroupQuestionAnswersIds:
          element?.diseaseGroupQuestionType == this.diseaseGroupQuestionType.CheckBox ?
            element?.allAvailableAnswers?.filter(x => element?.patientAnswers[x.id])?.map(x => x.id)
            :
            element?.diseaseGroupQuestionType == this.diseaseGroupQuestionType.RadioButton ||
              element?.diseaseGroupQuestionType == this.diseaseGroupQuestionType.DropDownList ?
              element.patientAnswers ? [+element.patientAnswers] : element.patientAnswers
              : element?.patientAnswers
      }
    }

    return model;
  }

  setLanguage() {
    this.translateService.onLangChange.subscribe((res) => {
      this.lang = res.lang;
    });
  }
}
