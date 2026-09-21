import { ChangePasswordComponent } from './change-password/change-password.component';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalizationService } from 'src/app/core/services/localization.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { DiseaseSpecialSymptomsService } from '../home/dashboard/components/disease-special-symptoms/services/disease-special-symptoms.service';
import { ConnectionService } from 'angular-connection-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  hasNetworkConnection: boolean = true;
  hasInternetAccess: boolean = true;
  LoginForm!: FormGroup;
  is_login_in!: boolean;
  appLanguages: any;
  staticLang: any = [
    {
      id: 1,
      code: 'ar',
      name: 'Ar',
      totalCount: null,
    },
    {
      id: 2,
      code: 'en',
      name: 'En',
      totalCount: null,
    },
  ];

  language: any;
  showPassword = false;
  emblemMissing = false;
  loading = false;

  @ViewChild('name') nameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('password') passwordInput!: ElementRef<HTMLInputElement>;

  constructor(
    private auth: AuthService,
    private translate: TranslateService,
    private localizationService: LocalizationService,
    private userMsg: UserMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private lookupService: LookupsGetterService,
    private diseaseSpecialSymptomsService: DiseaseSpecialSymptomsService,
    private connectionService: ConnectionService
  ) {
    this.connectionService.monitor().subscribe((currentState: any) => {
      this.hasNetworkConnection = currentState.hasNetworkConnection;
      this.hasInternetAccess = currentState.hasInternetAccess;
    });

    let userDataObject = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    );
    let userData =
      userDataObject != null || userDataObject != undefined
        ? userDataObject.userName
        : null;

    if (userData != null) {
      this.router.navigateByUrl(this.getReturnUrl() || 'home/welcome');
    }
    // window.location.reload()
  }

  private getReturnUrl(): string {
    const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');
    if (
      returnUrl &&
      returnUrl.startsWith('/') &&
      !returnUrl.startsWith('//') &&
      returnUrl !== '/'
    ) {
      return returnUrl;
    }
    return '';
  }

  ngOnInit(): void {
    localStorage.setItem('theme', 'theme_7');
    this.getAppLanguages();
    this.language =
      localStorage.getItem('ls.currentLang') == undefined ||
        localStorage.getItem('ls.currentLang') == 'undefined'
        ? 'ar'
        : localStorage.getItem('ls.currentLang');

    this.translate.setDefaultLang(this.language);
    this.translate.use(this.language);

    this.LoginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }
  langChanged() {
    this.localizationService.changeLanguage(this.language);
    this.translate.use(this.language);
  }

  getAppLanguages() {
    this.lookupService.getAllAppLanguages().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.appLanguages = result.data;
        }
      },
      (error) => {
        this.appLanguages = this.staticLang;

        return;
        //this.translate
        //  .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
        //  .subscribe((res: string) => {
        //    this.userMsg.error(res);
        //  });
      }
    );
  }

  public isOnline() {
    //return this.hasNetworkConnection && this.hasInternetAccess; //! THIS second condition causing some problems
    return this.hasNetworkConnection;
  }

  private syncAutofilledValues() {
    const domUsername = this.nameInput?.nativeElement?.value ?? '';
    const domPassword = this.passwordInput?.nativeElement?.value ?? '';
    if (domUsername !== this.LoginForm.controls['username'].value) {
      this.LoginForm.controls['username'].setValue(domUsername);
    }
    if (domPassword !== this.LoginForm.controls['password'].value) {
      this.LoginForm.controls['password'].setValue(domPassword);
    }
  }

  login(form: any) {
    this.syncAutofilledValues();
    if (form.value.username.trim() == '') {
      this.translate
        .get('NEDSS.HOME.LOGIN.INVALID_USERNAME')
        .subscribe((msg: string) => {
          this.userMsg.warn(msg);
        });
    } else if (form.value.password.trim() == '') {
      this.translate
        .get('NEDSS.HOME.LOGIN.INVALID_PASSWORD')
        .subscribe((msg: string) => {
          this.userMsg.warn(msg);
        });
    } else {
      this.loading = true;
      if (this.isOnline()) {
        this.authService
          .login(form.value.username, form.value.password)
          .subscribe(
            (res: any) => {
              if (res.messages.length > 0) {
                this.loading = false;
                this.userMsg.warn(res.messages[0]);
                //here
                // this.translate
                //   .get('NEDSS.HOME.LOGIN.WRONG_USERNAME_OR_PASSWORD')
                //   .subscribe((msg: string) => {
                //     this.userMsg.warn(msg);
                //   });

              } else {
                localStorage.setItem(
                  'ls.authorizationData',
                  JSON.stringify(res.data[0])
                );
                const d = res.data[0];
                const mustChange =
                  d.isFirstLogin == true || d.passwordExpired == true;
                if (mustChange && res.statusCode == 200) {
                  this.loading = false;
                  this.localizationService.changeLanguage(this.language);
                  this.translate.use(this.language);
                  this.authService.setUserLoggedIn(true);
                  const target = this.getReturnUrl() || '/home/welcome';
                  this.router.navigateByUrl(target);
                } else {
                  this.localizationService.changeLanguage(this.language);
                  this.translate.use(this.language);
                  this.translate
                    .get('NEDSS.HOME.LOGIN.SUCCESSFUL_LOGIN')
                    .subscribe((msg: string) => {
                      this.userMsg.success(msg);
                    });
                  this.authService.setUserLoggedIn(true);
                  this.lookupService.getAllGovernments();
                  this.lookupService.getAllHealthAdministrations();
                  this.lookupService.getAllCitys();
                  this.lookupService.getAllIncidentSourceHospitals();
                  this.lookupService.getAllPrincipalitys();
                  this.lookupService.getAllNationalitys();
                  this.lookupService.getAllDepartments();
                  this.lookupService.getAllPatientJobCategorys();
                  this.lookupService.getAllPatientJobs();
                  this.diseaseSpecialSymptomsService.getAllDiseaseField();
                  this.lookupService.getAllDiseaseChecks();
                  localStorage.setItem(
                    'lsOffline.authorizationData',
                    JSON.stringify(res.data[0])
                  );
                  localStorage.setItem('username', form.value.username);
                  localStorage.setItem('password', form.value.password);
                  const target = this.getReturnUrl() || '/home/welcome';
                  this.router
                    .navigateByUrl(target)
                    .then(() => window.location.reload());
                  // window.open('/#/home/chart', '_self')
                }
              }
            },
            (error: any) => {
              this.loading = false;
              this.userMsg.error('حدث خطأ ما ');
            }
          );
      } else {
        let username = localStorage.getItem('username');
        let password = localStorage.getItem('password');
        let token = localStorage.getItem('token');
        let pages = localStorage.getItem('pages');
        let lsOffline = JSON.parse(
          localStorage.getItem('lsOffline.authorizationData')
        );
        if (
          username == form.value.username &&
          password == form.value.password
        ) {
          this.localizationService.changeLanguage(this.language);
          this.translate.use(this.language);
          this.translate
            .get('NEDSS.HOME.LOGIN.SUCCESSFUL_LOGIN')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          if (localStorage.getItem('ls.authorizationData') == null)
            localStorage.setItem(
              'ls.authorizationData',
              JSON.stringify(lsOffline)
            );
          const target = this.getReturnUrl() || '/home/general-data';
          this.router
            .navigateByUrl(target)
            .then(() => window.location.reload());
          // window.open('/#/home/general-data/incident-info', '_self')
        } else {
          this.loading = false;
          this.translate
            .get('NEDSS.HOME.LOGIN.WRONG_USERNAME_OR_PASSWORD')
            .subscribe((res: string) => {
              this.userMsg.warn(res);
            });
        }
      }
    }
  }

  private getUserType() {
    return parseInt(
      JSON.parse(localStorage.getItem('ls.authorizationData')).userType
    );
  }

  password: null;
  confirmPassword: null;
  chngPassword() { }
  visible;
  passwordDialogMode: 'first' | 'expired' | 'warning' = 'first';
  passwordDaysLeft: number | null = null;

  onFireModel() {
    this.visible = true;
  }

  @ViewChild(ChangePasswordComponent)
  changePasswordComponent: ChangePasswordComponent;
  onSendForm() {
    if (!this.changePasswordComponent.changePasswordForm.valid) {
      this.translate
        .get('NEDSS.HOME.CHANGE_PASSWORD.CURRENT_PASSWORD_EMPTY')
        .subscribe((res: string) => {
          this.userMsg.warn(res);
        });
    } else if (
      this.changePasswordComponent.changePasswordForm.value.newPassword !=
      this.changePasswordComponent.changePasswordForm.value.confirmPassword
    ) {
      this.translate
        .get('NEDSS.HOME.CHANGE_PASSWORD.INCORRECT_NEW_AND_CONFIRM')
        .subscribe((res: string) => {
          this.userMsg.warn(res);
        });
    } else {
      this.authService
        .changePassword(this.changePasswordComponent.changePasswordForm.value)
        .subscribe(
          (res) => {
            if (res.messages.length > 0) {
              this.userMsg.error(res.messages[0]);
            } else {
              this.translate
                .get('NEDSS.HOME.CHANGE_PASSWORD.SUCCESSFUL_CHANGE_PASSWORD')
                .subscribe((msg: string) => {
                  this.userMsg.success(msg);
                });
              this.visible = false;
              const target = this.getReturnUrl() || '/home/welcome';
              this.router
                .navigateByUrl(target)
                .then(() => window.location.reload());
            }
          },
          (err) => {
            this.userMsg.error(' حدث خطا من فضلك حاول مجددا ');
          }
        );
    }
  }

  forgotPassword() {
    if (!this.LoginForm.controls['username'].valid) {
      this.translate
        .get('NEDSS.HOME.FORGOT_PASSWORD.INVALID_USERNAME')
        .subscribe((res: string) => {
          this.userMsg.warn(res);
        });
    } else {
      this.authService
        .forgotPassword(this.LoginForm.controls['username'])
        .subscribe(
          (result) => {
            if (result.statusCode == 500) {
              this.translate
                .get('NEDSS.HOME.FORGOT_PASSWORD.INVALID_USERNAME')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
            } else {
              this.translate
                .get('NEDSS.HOME.FORGOT_PASSWORD.SUCCESS_EMAIL_SENT')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
            }
          },
          (error) => {
            this.translate
              .get('NEDSS.HOME.FORGOT_PASSWORD.ERROR_RESET_PASSWORD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        );
    }
  }
}
