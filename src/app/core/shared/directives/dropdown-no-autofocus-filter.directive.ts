import { Directive, OnInit, Optional, Self } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';

@Directive({
  selector: 'p-dropdown',
})
export class DropdownNoAutofocusFilterDirective implements OnInit {
  constructor(@Optional() @Self() private dropdown: Dropdown) {}

  ngOnInit(): void {
    if (this.dropdown) {
      this.dropdown.autofocusFilter = false;
    }
  }
}
