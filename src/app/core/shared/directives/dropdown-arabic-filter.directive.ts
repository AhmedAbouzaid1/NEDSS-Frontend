import { Directive, OnInit, Optional, Self } from '@angular/core';
import { FilterService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { MultiSelect } from 'primeng/multiselect';
import { arabicTextMatches } from '../utilis/arabic-text';

export const ARABIC_CONTAINS_FILTER = 'arabicContains';

@Directive({
  selector: 'p-dropdown, p-multiSelect',
})
export class DropdownArabicFilterDirective implements OnInit {
  constructor(
    filterService: FilterService,
    @Optional() @Self() private dropdown: Dropdown,
    @Optional() @Self() private multiSelect: MultiSelect
  ) {
    filterService.register(ARABIC_CONTAINS_FILTER, (value: any, filter: any) => arabicTextMatches(value, filter));
  }

  ngOnInit(): void {
    const component = this.dropdown || this.multiSelect;
    if (component && component.filterMatchMode === 'contains') {
      component.filterMatchMode = ARABIC_CONTAINS_FILTER;
    }
  }
}
