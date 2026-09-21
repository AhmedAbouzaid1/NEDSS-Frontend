import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  evaluatePasswordRules,
  passwordRulesMet,
} from 'src/app/core/utils/password-rules';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @Input() prefillDefaultPassword: boolean = true;
  changePasswordForm:FormGroup
  show = { current: false, next: false, confirm: false };
  constructor(private fb:FormBuilder) { }

  toggle(field: 'current' | 'next' | 'confirm') {
    this.show[field] = !this.show[field];
  }

  get rules() {
    return evaluatePasswordRules(
      this.changePasswordForm?.value.newPassword,
      this.changePasswordForm?.value.currentPassword
    );
  }

  isNewPasswordValid(): boolean {
    return passwordRulesMet(
      this.changePasswordForm?.value.newPassword,
      this.changePasswordForm?.value.currentPassword
    );
  }

  ngOnInit() {
    this.initialForm()
  }

  initialForm(){
    this.changePasswordForm = this.fb.group({
      currentPassword : [this.prefillDefaultPassword ? 'Nedss2023' : '',Validators.required],
      newPassword: ['',Validators.required],
      confirmPassword:['',Validators.required]
    })
  }

}
