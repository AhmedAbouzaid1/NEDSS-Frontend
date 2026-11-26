import { ChangeDetectorRef, Directive, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReadOnlyContextService } from '../../services/read-only-context.service';

@Directive({
  selector: '[appWriteAction]',
})
export class WriteActionDirective implements OnInit, OnDestroy {
  @Input() appWriteAction: number | string | Array<number | string> | null | undefined;

  private routeReadOnly = false;
  private sub?: Subscription;

  constructor(private readOnlyContext: ReadOnlyContextService, private cdr: ChangeDetectorRef) {}

  @HostBinding('style.display')
  get display(): string | null {
    return this.blocked ? 'none' : null;
  }

  @HostBinding('class.nd-write-hidden')
  get hiddenClass(): boolean {
    return this.blocked;
  }

  @HostBinding('attr.aria-hidden')
  get ariaHidden(): string | null {
    return this.blocked ? 'true' : null;
  }

  private get blocked(): boolean {
    const explicit = this.appWriteAction;
    if (explicit !== '' && explicit != null) {
      return this.readOnlyContext.isPageReadOnly(explicit);
    }
    return this.routeReadOnly;
  }

  ngOnInit(): void {
    this.sub = this.readOnlyContext.readOnly$.subscribe((readOnly) => {
      this.routeReadOnly = readOnly;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
