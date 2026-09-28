import { ContentChildren, Directive, HostBinding, Input, OnChanges, QueryList, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appShowIf]',
})
export class ShowIfDirective implements OnChanges {
  @Input() appShowIf: boolean | null | undefined;

  @ContentChildren(NgControl, { descendants: true }) controls?: QueryList<NgControl>;

  @HostBinding('style.display')
  get display(): string | null {
    return this.appShowIf || this.hasValue() ? null : 'none';
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['appShowIf'];
    if (!change || change.firstChange || !change.previousValue || change.currentValue) {
      return;
    }
    queueMicrotask(() => {
      if (this.appShowIf) {
        return;
      }
      this.controls?.forEach((dir) => {
        if (dir.control && !this.isEmpty(dir.control.value)) {
          const value = dir.control.value;
          dir.control.reset(typeof value === 'boolean' ? false : Array.isArray(value) ? [] : null);
        }
      });
    });
  }

  private hasValue(): boolean {
    return !!this.controls?.some((dir) => !this.isEmpty(dir.control?.value));
  }

  private isEmpty(value: any): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === null || value === undefined || value === '' || value === 'null' || value === false;
  }
}
