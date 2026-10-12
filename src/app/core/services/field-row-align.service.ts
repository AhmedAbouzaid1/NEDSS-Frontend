import { Injectable, NgZone } from '@angular/core';

const ALIGN_ATTR = 'data-nd-align';
const LABEL_SELECTOR = [
  ':scope > label',
  ':scope > .form-group > label',
  ':scope > app-date-field > label',
  ':scope > .form-group > app-date-field > label',
  ':scope > .inv-pair > :first-child',
  ':scope > .form-group > .inv-pair > :first-child',
].join(', ');

@Injectable({ providedIn: 'root' })
export class FieldRowAlignService {
  private observer?: MutationObserver;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private zone: NgZone) {}

  init(): void {
    if (this.observer || typeof MutationObserver === 'undefined') {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.observer = new MutationObserver(() => this.schedule());
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['style', 'hidden'],
      });
      window.addEventListener('resize', () => this.schedule());
      (document as any).fonts?.ready?.then(() => this.schedule());
      this.schedule();
    });
  }

  private schedule(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.align(), 120);
  }

  private align(): void {
    document.querySelectorAll<HTMLElement>(`[${ALIGN_ATTR}]`).forEach((label) => {
      label.style.paddingTop = '';
      label.removeAttribute(ALIGN_ATTR);
    });

    const updates: Array<[HTMLElement, number]> = [];
    const rows = document.querySelectorAll<HTMLElement>('.investigation-form .row, form .row');
    if (!rows.length) {
      this.observer?.takeRecords();
      return;
    }

    rows.forEach((row) => {
      if (getComputedStyle(row).display === 'contents') {
        return;
      }
      let line: { bottom: number; labels: Array<[HTMLElement, number]> } | null = null;
      const lines: Array<Array<[HTMLElement, number]>> = [];

      this.cells(row).forEach((child) => {
        const col = child as HTMLElement;
        if (!/(^|\s)col(-|\s|$)/.test(col.className)) {
          return;
        }
        const rect = col.getBoundingClientRect();
        if (rect.height === 0) {
          return;
        }
        if (!line || rect.top >= line.bottom - 1) {
          line = { bottom: rect.bottom, labels: [] };
          lines.push(line.labels);
        } else {
          line.bottom = Math.max(line.bottom, rect.bottom);
        }
        const label = this.fieldLabel(col);
        if (label) {
          line.labels.push([label, label.getBoundingClientRect().height]);
        }
      });

      lines.forEach((labels) => {
        if (labels.length < 2) {
          return;
        }
        const tallest = Math.max(...labels.map(([, h]) => h));
        labels.forEach(([label, h]) => {
          if (tallest - h > 1) {
            updates.push([label, tallest - h]);
          }
        });
      });
    });

    updates.forEach(([label, pad]) => {
      label.setAttribute(ALIGN_ATTR, '');
      label.style.paddingTop = `${pad}px`;
    });

    this.observer?.takeRecords();
  }

  private cells(parent: Element): Element[] {
    return Array.from(parent.children).flatMap((child) =>
      getComputedStyle(child).display === 'contents' ? this.cells(child) : [child]
    );
  }

  private fieldLabel(col: HTMLElement): HTMLElement | null {
    const label = col.querySelector<HTMLElement>(LABEL_SELECTOR);
    if (
      !label ||
      label.parentElement?.firstElementChild !== label ||
      !label.nextElementSibling ||
      label.querySelector('input') ||
      label.getBoundingClientRect().height === 0
    ) {
      return null;
    }
    return label;
  }
}
