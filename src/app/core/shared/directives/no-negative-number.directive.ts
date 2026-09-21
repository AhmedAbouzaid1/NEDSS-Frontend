import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[type=number]',
})
export class NoNegativeNumberDirective implements OnInit {
  constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.el.nativeElement.hasAttribute('min')) {
      this.renderer.setAttribute(this.el.nativeElement, 'min', '0');
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'Subtract') {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.includes('-')) {
      input.value = input.value.replace(/-/g, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') ?? '';
    if (text.includes('-')) {
      event.preventDefault();
    }
  }
}
