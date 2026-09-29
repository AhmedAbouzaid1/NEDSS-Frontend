import { LoaderComponent } from './../components/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchPipe } from './../Pipes/search.pipe';
import { HighlighterPipe } from './../Pipes/highlighter.pipe';
import { FilterPipe } from './../Pipes/filter.pipe';
import { PartialLoadingComponent } from './../components/partial-loading/partial-loading.component';
import { PageLoadingComponent } from './../components/page-loading/page-loading.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildFormComponent } from '../components/build-form/build-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BuildFormContainerComponent } from '../components/build-form-container/build-form-container.component';
import { SidebarModule } from 'primeng/sidebar';
import { RedirectComponent } from './components/redirect/redirect.component';
import { AttachemntNamePipe } from '../Pipes/attachemnt-name.pipe';
import { NoFutureDateDirective } from './directives/no-future-date.directive';
import { NoFutureNativeDateDirective } from './directives/no-future-native-date.directive';
import { ClearInvalidMinDateDirective } from './directives/clear-invalid-min-date.directive';
import { ScrollIntoViewOnResultsDirective } from './directives/scroll-into-view-on-results.directive';
import { DropdownLoadingDirective } from './directives/dropdown-loading.directive';
import { DropdownNoAutofocusFilterDirective } from './directives/dropdown-no-autofocus-filter.directive';
import { NoNegativeNumberDirective } from './directives/no-negative-number.directive';
import { ShowIfDirective } from './directives/show-if.directive';
import { RecentDaysNoteComponent } from './components/recent-days-note/recent-days-note.component';
import { MaterialModule } from './material-module';
import { DateFieldComponent } from './components/date-field/date-field.component';
@NgModule({
  declarations: [
    RecentDaysNoteComponent,
    PageLoadingComponent,
    PartialLoadingComponent,
    LoaderComponent,
    FilterPipe,
    HighlighterPipe,
    SearchPipe,
    BuildFormComponent,
    BuildFormContainerComponent,
    RedirectComponent,
    AttachemntNamePipe,
    NoFutureDateDirective,
    NoFutureNativeDateDirective,
    ClearInvalidMinDateDirective,
    ScrollIntoViewOnResultsDirective,
    DropdownLoadingDirective,
    DropdownNoAutofocusFilterDirective,
    NoNegativeNumberDirective,
    ShowIfDirective,
    DateFieldComponent,
  ],
  imports: [CommonModule, SidebarModule, TranslateModule, ReactiveFormsModule, FormsModule, MaterialModule],
  exports: [
    RecentDaysNoteComponent,
    PageLoadingComponent,
    PartialLoadingComponent,
    LoaderComponent,
    FilterPipe,
    HighlighterPipe,
    SearchPipe,
    BuildFormContainerComponent,
    BuildFormComponent,
    AttachemntNamePipe,
    NoFutureDateDirective,
    NoFutureNativeDateDirective,
    ClearInvalidMinDateDirective,
    ScrollIntoViewOnResultsDirective,
    DropdownLoadingDirective,
    DropdownNoAutofocusFilterDirective,
    NoNegativeNumberDirective,
    ShowIfDirective,
    DateFieldComponent,
  ],
})
export class SharedModule { }
