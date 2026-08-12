import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appScrollIntoViewOnResults]',
})
export class ScrollIntoViewOnResultsDirective implements OnChanges {
  @Input('appScrollIntoViewOnResults') results: any;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    const value = changes['results']?.currentValue;
    const hasResults = Array.isArray(value) ? value.length > 0 : !!value;
    if (!hasResults) {
      return;
    }
    setTimeout(() =>
      this.host.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    );
  }
}
