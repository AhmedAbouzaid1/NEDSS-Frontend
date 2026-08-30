import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDropdownLoading]',
})
export class DropdownLoadingDirective implements OnInit, OnChanges, OnDestroy {
  @Input('appDropdownLoading') loading: boolean | null | undefined = false;

  private wrapper: HTMLElement | null = null;
  private spinner: HTMLElement | null = null;

  private static stylesInjected = false;

  constructor(
    private host: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    DropdownLoadingDirective.injectStyles(this.renderer);
    this.buildOverlay();
    this.applyState();
  }

  ngOnChanges(): void {
    this.applyState();
  }

  ngOnDestroy(): void {
    if (this.wrapper && this.renderer.parentNode(this.wrapper)) {
      try {
        const parent = this.renderer.parentNode(this.wrapper);
        const element = this.host.nativeElement;
        if (parent && element.parentNode === this.wrapper) {
          this.renderer.insertBefore(parent, element, this.wrapper);
        }
        this.renderer.removeChild(parent, this.wrapper);
      } catch {}
    }
  }

  private buildOverlay(): void {
    const element = this.host.nativeElement;
    const parent = this.renderer.parentNode(element);
    if (!parent) {
      return;
    }

    const wrapper = this.renderer.createElement('span');
    this.renderer.addClass(wrapper, 'app-dd-loading-wrap');

    const tag = element.tagName.toLowerCase();
    if (tag === 'p-dropdown' || tag === 'p-multiselect') {
      this.renderer.addClass(wrapper, 'is-pdropdown');
    } else if (tag === 'ng-multiselect-dropdown') {
      this.renderer.addClass(wrapper, 'is-ng-multiselect');
    } else if (tag === 'select') {
      this.renderer.addClass(wrapper, 'is-select');
    }

    this.renderer.insertBefore(parent, wrapper, element);
    this.renderer.appendChild(wrapper, element);

    const spinner = this.renderer.createElement('span');
    this.renderer.addClass(spinner, 'app-dd-loading-spinner');
    this.renderer.setAttribute(spinner, 'aria-hidden', 'true');
    this.renderer.appendChild(wrapper, spinner);

    this.wrapper = wrapper;
    this.spinner = spinner;
  }

  private applyState(): void {
    if (!this.wrapper) {
      return;
    }
    if (this.loading) {
      this.renderer.addClass(this.wrapper, 'is-loading');
      this.renderer.setAttribute(this.host.nativeElement, 'aria-busy', 'true');
    } else {
      this.renderer.removeClass(this.wrapper, 'is-loading');
      this.renderer.removeAttribute(this.host.nativeElement, 'aria-busy');
    }
  }

  private static injectStyles(renderer: Renderer2): void {
    if (DropdownLoadingDirective.stylesInjected) {
      return;
    }
    if (typeof document === 'undefined') {
      return;
    }
    const style = renderer.createElement('style');
    renderer.setAttribute(style, 'id', 'app-dropdown-loading-styles');
    const css = `
.app-dd-loading-wrap { position: relative; display: block; width: 100%; }
.app-dd-loading-wrap .app-dd-loading-spinner {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  inset-inline-end: 2rem;
  border: 2px solid rgba(0, 123, 255, 0.25);
  border-top-color: #007bff;
  border-radius: 50%;
  animation: app-dd-spin 0.6s linear infinite;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 5;
}
.app-dd-loading-wrap.is-loading .app-dd-loading-spinner { opacity: 1; }
.app-dd-loading-wrap.is-pdropdown .app-dd-loading-spinner { inset-inline-end: 0.85rem; }
.app-dd-loading-wrap.is-pdropdown.is-loading .p-dropdown-trigger,
.app-dd-loading-wrap.is-pdropdown.is-loading .p-multiselect-trigger { visibility: hidden; }
.app-dd-loading-wrap.is-ng-multiselect .app-dd-loading-spinner { inset-inline-end: 2.25rem; }
.app-dd-loading-wrap.is-select.is-loading > select { padding-inline-end: 3rem; }
@keyframes app-dd-spin { to { transform: rotate(360deg); } }
`;
    renderer.appendChild(style, renderer.createText(css));
    renderer.appendChild(document.head, style);
    DropdownLoadingDirective.stylesInjected = true;
  }
}
