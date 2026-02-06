import { Injectable } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from './core/services/user.message.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CloseSeatioService {

  private timeoutId: any;

  constructor(private auth: AuthService, private translate: TranslateService,
     private userMsg: UserMessageService, private router: Router) { }

  // تعيين وقت الإغلاق بعد فترة زمنية محددة
  setLogoutTimeout(minutes: number) {
    const milliseconds = minutes * 60 * 1000;
    this.timeoutId = setTimeout(() => this.logout(), milliseconds);
  }

  // إلغاء تعيين وقت الإغلاق
  clearLogoutTimeout() {
    clearTimeout(this.timeoutId);
  }

  // تسجيل الخروج
  logout() {
    // يمكنك تنفيذ تسجيل الخروج هنا
    this.auth.logout().subscribe(
      (res: any) => {
        this.translate.get('NEDSS.HOME.LOGOUT.SIGNING_OUT').subscribe(msg => {
          this.userMsg.success(msg);
        });
        localStorage.removeItem('ls.authorizationData');
        this.router.navigateByUrl('');
      }
    )
    console.log('تم تسجيل الخروج');
  }
}
