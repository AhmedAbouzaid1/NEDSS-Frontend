import { Directive, OnInit, Optional } from '@angular/core';
import { MatDatepickerInput } from '@angular/material/datepicker';

@Directive({
  selector: 'input[matDatepicker]:not([max])',
})
export class NoFutureDateDirective implements OnInit {
  constructor(
    @Optional() private datepickerInput: MatDatepickerInput<any>
  ) {}

  ngOnInit(): void {
    if (this.datepickerInput && this.datepickerInput.max == null) {
      this.datepickerInput.max = new Date();
    }
  }
}
