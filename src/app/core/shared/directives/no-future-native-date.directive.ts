import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[type="date"]:not([allowFutureDate])',
})
export class NoFutureNativeDateDirective implements OnInit {
  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  ngOnInit(): void {
    if (!this.el.nativeElement.getAttribute('max')) {
      this.renderer.setAttribute(this.el.nativeElement, 'max', this.today());
    }
  }

  @HostListener('input')
  @HostListener('change')
  @HostListener('blur')
  onValueChange(): void {
    const value = this.el.nativeElement.value;
    const limit = this.el.nativeElement.max || this.today();
    if (value && value > limit) {
      if (this.ngControl?.control) {
        this.ngControl.control.setValue(null);
      }
      this.el.nativeElement.value = '';
    }
  }

  private today(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
