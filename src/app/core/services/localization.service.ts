import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LayoutService } from './layout.service';
@Injectable({
  providedIn: 'root'
})
export class LocalizationService implements OnDestroy {

  private langChanged = new BehaviorSubject<string>("ar");
  item$ = this.langChanged.asObservable();

  sub: Subscription = new Subscription();

  constructor(
    private translateService: TranslateService,
    private layoutSrvc: LayoutService
  ) {
    this.sub.add(this.translateService.onLangChange.subscribe(lang => {
      this.langChanged.next(lang.toString());
    }))
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  onLanguageChange(lang: string) {
    //event used to notify dropdown with language change
    this.langChanged.next(lang);
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang);
    this.translateService.setDefaultLang(lang);
    localStorage.setItem('ls.currentLang', lang)//JSON.stringify(lang))
    setTimeout(() => {
      this.layoutSrvc.setLayout(lang);
    }, 600);

  }

}


