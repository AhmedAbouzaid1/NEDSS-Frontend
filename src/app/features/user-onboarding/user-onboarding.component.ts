import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../home/users/Services/user.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';

@Component({
  selector: 'app-user-onboarding',
  templateUrl: './user-onboarding.component.html',
  styleUrls: ['./user-onboarding.component.css'],
})
export class UserOnboardingComponent {
  token: string = '';
  code: string = '';
  step: 'code' | 'form' | 'done' = 'code';
  loading: boolean = false;
  errorMsg: string = '';
  usernameError: string = '';
  emailError: string = '';

  data = {
    fullName: '',
    userName: '',
    email: '',
    phoneNo: '',
    address: '',
    profilePic: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
  }

  validateCode() {
    this.errorMsg = '';
    if (!this.code) return;
    this.loading = true;
    this.userService
      .validateInvitation({ token: this.token, code: this.code.trim() })
      .subscribe(
        (response: any) => {
          this.loading = false;
          const result = response?.data;
          if (result?.valid) {
            this.step = 'form';
          } else {
            this.errorMsg = result?.message ?? '';
          }
        },
        () => {
          this.loading = false;
          this.errorMsg = ' ';
        }
      );
  }

  checkUsername() {
    const userName = (this.data.userName || '').trim();
    if (!userName || !this.userNameValid) {
      this.usernameError = '';
      return;
    }
    this.userService
      .checkInvitationAvailability({ token: this.token, code: this.code.trim(), userName })
      .subscribe((response: any) => {
        if (response?.data?.userNameTaken) {
          this.translateService
            .get('NEDSS.HOME.USERS.INVITE.USERNAME_TAKEN')
            .subscribe((m: string) => (this.usernameError = m));
        } else {
          this.usernameError = '';
        }
      });
  }

  checkEmail() {
    const email = (this.data.email || '').trim();
    if (!email || !this.emailValid) {
      this.emailError = '';
      return;
    }
    this.userService
      .checkInvitationAvailability({ token: this.token, code: this.code.trim(), email })
      .subscribe((response: any) => {
        if (response?.data?.emailTaken) {
          this.translateService
            .get('NEDSS.HOME.USERS.INVITE.EMAIL_TAKEN')
            .subscribe((m: string) => (this.emailError = m));
        } else {
          this.emailError = '';
        }
      });
  }

  private applySubmitError(msg: string) {
    if (/username/i.test(msg)) {
      this.translateService
        .get('NEDSS.HOME.USERS.INVITE.USERNAME_TAKEN')
        .subscribe((m: string) => (this.usernameError = m));
    } else if (/email/i.test(msg)) {
      this.translateService
        .get('NEDSS.HOME.USERS.INVITE.EMAIL_TAKEN')
        .subscribe((m: string) => (this.emailError = m));
    } else {
      this.errorMsg = msg;
    }
  }

  submit() {
    this.errorMsg = '';
    this.usernameError = '';
    this.emailError = '';
    if (!this.formValid()) return;
    this.loading = true;
    this.userService
      .submitInvitation({
        token: this.token,
        code: this.code.trim(),
        fullName: this.data.fullName,
        userName: this.data.userName,
        email: this.data.email,
        phoneNo: this.data.phoneNo,
        address: this.data.address,
        profilePic: this.data.profilePic,
        password: this.data.password,
      })
      .subscribe(
        (response: any) => {
          this.loading = false;
          if (response?.statusCode && response.statusCode >= 400) {
            this.applySubmitError((response.messages && response.messages[0]) || '');
            return;
          }
          this.step = 'done';
        },
        (error) => {
          this.loading = false;
          this.applySubmitError(error?.error?.messages?.[0] || '');
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => this.userMsg.error(res));
        }
      );
  }

  onPhotoSelected(e: any) {
    const file = e?.target?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => (this.data.profilePic = reader.result as string);
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.data.profilePic = '';
  }

  get userNameValid(): boolean {
    return /^[A-Za-z0-9_.-]{3,}$/.test((this.data.userName || '').trim());
  }
  get emailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((this.data.email || '').trim());
  }
  get phoneValid(): boolean {
    return /^01[0125]\d{8}$/.test((this.data.phoneNo || '').trim());
  }
  get pwLengthOk(): boolean {
    return (this.data.password || '').length >= 8;
  }
  get pwLetterOk(): boolean {
    return /[A-Za-z]/.test(this.data.password || '');
  }
  get pwNumberOk(): boolean {
    return /\d/.test(this.data.password || '');
  }
  get passwordValid(): boolean {
    return this.pwLengthOk && this.pwLetterOk && this.pwNumberOk;
  }
  get passwordsMatch(): boolean {
    return this.data.password === this.data.confirmPassword;
  }

  formValid(): boolean {
    return (
      !!this.data.fullName &&
      this.userNameValid &&
      !this.usernameError &&
      this.emailValid &&
      !this.emailError &&
      this.phoneValid &&
      this.passwordValid &&
      this.passwordsMatch
    );
  }
}
