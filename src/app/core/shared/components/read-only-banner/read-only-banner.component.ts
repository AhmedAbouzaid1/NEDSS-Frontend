import { Component } from '@angular/core';
import { ReadOnlyContextService } from '../../../services/read-only-context.service';

@Component({
  selector: 'app-read-only-banner',
  template: `
    <div class="nd-readonly-banner" *ngIf="readOnlyContext.readOnly$ | async" role="status">
      <i class="bi bi-eye" aria-hidden="true"></i>
      <span>{{ 'NEDSS.COMMON.READ_ONLY_BANNER' | translate }}</span>
    </div>
  `,
  styles: [
    `
      .nd-readonly-banner {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 0 0.75rem;
        padding: 0.45rem 0.75rem;
        border: 1px solid #fdba74;
        border-radius: 6px;
        background: #fff7ed;
        color: #92400e;
        font-size: var(--nd-control-fs, 0.8125rem);
        font-weight: 600;
      }
    `,
  ],
})
export class ReadOnlyBannerComponent {
  constructor(public readOnlyContext: ReadOnlyContextService) {}
}
