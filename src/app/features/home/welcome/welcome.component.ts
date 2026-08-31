import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  userName: string = '';
  levelDisplay: string = '';
  profilePic: string = '';
  profile: any = {};
  today: Date = new Date();
  todayFormatted: string = '';
  currentLang: string = 'ar';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.todayFormatted = this.formatToday();

    const authData = this.getAuthData();
    if (authData) {
      this.userName = authData.userName || '';
      const user = authData.user || {};
      this.levelDisplay = user.incidentSourceName || user.levelName || '';
      this.profilePic = user.profilePic || '';
      if (authData.userId) {
        this.loadProfile(authData.userId);
      }
    }
  }

  private formatToday(): string {
    const locale = this.currentLang === 'ar' ? 'ar-EG' : 'en-US';
    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(this.today);
    } catch {
      return this.today.toDateString();
    }
  }

  private getAuthData(): any {
    try {
      const raw = localStorage.getItem('ls.authorizationData');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private loadProfile(userId: any): void {
    this.profileService.getProfileData(userId).subscribe(
      (res: any) => {
        this.profile = res && res.data ? res.data : res || {};
        if (!this.levelDisplay && this.profile.level) {
          this.levelDisplay = this.profile.level;
        }
      },
      () => {
        this.profile = {};
      }
    );
  }
}
