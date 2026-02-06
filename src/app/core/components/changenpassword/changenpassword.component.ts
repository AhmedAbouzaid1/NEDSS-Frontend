import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-changenpassword',
  templateUrl: './changenpassword.component.html',
  styleUrls: ['./changenpassword.component.css']
})
export class ChangenpasswordComponent implements OnInit {

  changePasswordForm: FormGroup
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

}
