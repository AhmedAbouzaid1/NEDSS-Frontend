import { NgForm } from '@angular/forms';

export function resetFormState(form: NgForm | null | undefined): void {
  if (!form) {
    return;
  }
  (form as { submitted: boolean }).submitted = false;
  form.control.markAsPristine();
  form.control.markAsUntouched();
}
