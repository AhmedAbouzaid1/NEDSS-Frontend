import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  evaluatePasswordRules,
  passwordRulesMet,
} from 'src/app/core/utils/password-rules';

@Component({
  selector: 'app-changenpassword',
  templateUrl: './changenpassword.component.html',
  styleUrls: ['./changenpassword.component.css']
})
export class ChangenpasswordComponent implements OnInit {

  changePasswordForm: FormGroup
  show = { current: false, next: false, confirm: false };
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initialForm()
  }

  initialForm() {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

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

}
