import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm:FormGroup
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.initialForm()
  }

  initialForm(){
    this.changePasswordForm = this.fb.group({
      currentPassword : ['Nedss2023',Validators.required],
      newPassword: ['',Validators.required],
      confirmPassword:['',Validators.required]
    })
  }

}
