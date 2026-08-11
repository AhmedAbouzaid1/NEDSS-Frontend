import { Directive, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'input[matDatepicker][min]',
})
export class ClearInvalidMinDateDirective implements OnInit, OnDestroy {
  private sub?: Subscription;

  constructor(@Optional() @Self() private ngControl: NgControl) {}

  ngOnInit(): void {
    const control = this.ngControl?.control;
    if (!control) {
      return;
    }

    let lastValue = control.value;
    this.sub = control.statusChanges.subscribe(() => {
      const valueChanged = control.value !== lastValue;
      lastValue = control.value;

      if (
        !valueChanged &&
        control.value != null &&
        control.hasError('matDatepickerMin')
      ) {
        control.setValue(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
