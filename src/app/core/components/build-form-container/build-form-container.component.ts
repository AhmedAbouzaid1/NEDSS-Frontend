
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'build-form-container',
  templateUrl: './build-form-container.component.html',
  styleUrls: ['./build-form-container.component.css']
})
export class BuildFormContainerComponent implements OnInit {
  form?: FormGroup;
  @Input() formTest?: any = {};
  @Input() projectFileds: any = {};
  @Output() OnRegister = new EventEmitter<any>(); // output create  Change
  @Output() OnUpdate = new EventEmitter<any>(); // output create  Change
  @Output() OnSearch = new EventEmitter<any>(); // output create  Change
  @Output() OnReturnForm = new EventEmitter<any>(); // output create  Change
  @Output() OnValidForm = new EventEmitter<any>(); // output create  Change
  @Input() loader: any = false;
  delimiter: any = '-';
  fields: any[] = [];
  editForm: any = {};
  isEdit: any = false;
  constructor() { }

  ngOnInit() {
    this.buildForm();
    this.checkFormValid();
  }

  buildForm() {
    if (this.projectFileds) {
      const formGroupFields = this.getFormControlsFields();
      this.form = new FormGroup(formGroupFields);
    }
  }

  getFormControlsFields() {
    const formGroupFields: any = {};

    this.projectFileds.forEach((field) => {
      const validators = field.isRequired === true ? Validators.required : null;
      let defaultValue: string | boolean = '';
      if (this.isEdit) defaultValue = this.editForm[field.fieldName];
      else {
        if (field.fieldType === 'checkbox' || field.fieldType === 'radio')
          defaultValue = false
        else
          defaultValue = ''
      }
      formGroupFields[field.fieldName] = new FormControl(
        defaultValue,
        validators
      );
      this.fields.push(field);

    });
    return formGroupFields;
  }
  getList(item: string) {
    return item.split(this.delimiter);
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
    this.form!.valueChanges.subscribe(() => {
      if (this.form!.valid) {
        this.OnReturnForm.emit(this.form?.value);
        this.OnValidForm.emit(this.getVaildForm());
      }
    });
  }
  getVaildForm() {
    let Key = Object.keys(this.form!.value);
    let Value = Object.values(this.form!.value);
    let model: any = [];
    for (let index = 0; index < Key.length; index++) {
      model[index] = {
        fieldName: Key[index].toString(),
        fieldValue: Value[index]!.toString()
      }
    }
    return model;
  }
  getMainContainer() {
    return this.projectFileds = this.projectFileds.mainContainers.filter(c => c.containerId == null)
  }
}
