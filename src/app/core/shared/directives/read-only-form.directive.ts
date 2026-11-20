import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { INVESTIGATION_READ_ONLY_SCOPE, ReadOnlyContextService } from '../../services/read-only-context.service';

const NATIVE_FIELDS = 'input:not([type="search"]):not([data-readonly-ignore]), select:not([data-readonly-ignore]), textarea:not([data-readonly-ignore])';
const FOCUSABLE_WIDGETS = '.p-dropdown [tabindex], .p-multiselect [tabindex], .p-checkbox [tabindex], .p-radiobutton [tabindex]';

@Directive({
  selector: '[appReadOnlyForm]',
})
export class ReadOnlyFormDirective implements AfterContentInit, OnDestroy {
  @Input() appReadOnlyForm: number | string | Array<number | string> | null | undefined;

  @Input() readOnlyHideActions = false;

  @ContentChildren(NgControl, { descendants: true }) controls?: QueryList<NgControl>;

  private routeReadOnly = false;
  private subs: Subscription[] = [];
  private controlSubs: Subscription[] = [];
  private observer?: MutationObserver;

  constructor(
    private readOnlyContext: ReadOnlyContextService,
    private host: ElementRef<HTMLElement>,
    private zone: NgZone
  ) {}

  @HostBinding('class.nd-readonly-form')
  get readOnly(): boolean {
    const explicit = this.appReadOnlyForm;
    if (explicit !== '' && explicit != null && explicit !== INVESTIGATION_READ_ONLY_SCOPE) {
      return this.readOnlyContext.isPageReadOnly(explicit);
    }
    return this.routeReadOnly;
  }

  @HostBinding('class.nd-readonly-actions')
  get hideActions(): boolean {
    return this.readOnlyHideActions && this.readOnly;
  }

  ngAfterContentInit(): void {
    const source$ = this.appReadOnlyForm === INVESTIGATION_READ_ONLY_SCOPE
      ? this.readOnlyContext.investigationReadOnly$
      : this.readOnlyContext.readOnly$;
    this.subs.push(
      source$.subscribe((readOnly) => {
        this.routeReadOnly = readOnly;
        this.apply();
      })
    );
    if (this.controls) {
      this.subs.push(this.controls.changes.subscribe(() => this.apply()));
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.controlSubs.forEach((s) => s.unsubscribe());
    this.observer?.disconnect();
  }

  private apply(): void {
    this.controlSubs.forEach((s) => s.unsubscribe());
    this.controlSubs = [];
    if (!this.readOnly) {
      this.observer?.disconnect();
      this.observer = undefined;
      return;
    }
    queueMicrotask(() => {
      if (!this.readOnly) {
        return;
      }
      this.disableControls();
      this.lockNativeFields();
      this.observe();
    });
  }

  private disableControls(): void {
    this.controls?.forEach((dir) => {
      const control = dir.control;
      if (!control) {
        return;
      }
      if (control.enabled) {
        control.disable({ emitEvent: false });
      }
      this.controlSubs.push(
        control.statusChanges.subscribe(() => {
          if (this.readOnly && control.enabled) {
            control.disable({ emitEvent: false });
          }
        })
      );
    });
  }

  private lockNativeFields(): void {
    const root = this.host.nativeElement;
    root.querySelectorAll<HTMLInputElement>(NATIVE_FIELDS).forEach((el) => {
      if (!el.disabled) {
        el.disabled = true;
      }
    });
    root.querySelectorAll<HTMLElement>(FOCUSABLE_WIDGETS).forEach((el) => {
      if (el.getAttribute('tabindex') !== '-1') {
        el.setAttribute('tabindex', '-1');
      }
    });
  }

  private observe(): void {
    if (this.observer || typeof MutationObserver === 'undefined') {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.observer = new MutationObserver(() => {
        if (this.readOnly) {
          this.lockNativeFields();
        }
      });
      this.observer.observe(this.host.nativeElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'tabindex'],
      });
    });
  }
}
