import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateTime12h',
})
export class DateTime12hPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string | Date | null | undefined, lang?: string): string {
    if (!value) return '';
    let text: string;
    try {
      text = formatDate(value, 'dd/MM/yyyy hh:mm a', 'en-US');
    } catch {
      return '';
    }
    const current = lang || this.translate.currentLang || this.translate.defaultLang || 'ar';
    if (current.startsWith('ar')) {
      text = text.replace(/AM$/, 'ص').replace(/PM$/, 'م');
    }
    return text;
  }
}
