import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})

export class ForgetPasswordComponent {
  changePasswordForm: FormGroup
  email: string;
  token: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private authService: AuthService, private userMsg: UserMessageService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.initialForm();
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    })
  }

  initialForm() {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.changePasswordForm.value.newPassword != this.changePasswordForm.value.confirmPassword) {
      this.translate.get('NEDSS.HOME.CHANGE_PASSWORD.INCORRECT_NEW_AND_CONFIRM').subscribe(res => {
        this.userMsg.warn(res);
      });
    }
    else {
      this.authService.resetPassword(this.email, this.changePasswordForm.controls['newPassword'], this.token).subscribe(
        result => {
          if (result.statusCode == 500) {
            this.translate.get('NEDSS.HOME.CHANGE_PASSWORD.SOMETHING_WENT_WRONG').subscribe(res => {
              this.userMsg.error(res);
            });
          }
          else {
            this.translate.get('NEDSS.HOME.CHANGE_PASSWORD.SUCCESSFUL_CHANGE_PASSWORD').subscribe(res => {
              this.userMsg.success(res);
            });
          }
        }, err => {
          this.translate.get('NEDSS.HOME.CHANGE_PASSWORD.SOMETHING_WENT_WRONG').subscribe(res => {
            this.userMsg.error(res);
          });
        })
    }
  }
}
