import { Injectable, NgZone } from '@angular/core';

const TITLE = ':is(div, h4, h5, h6).title, .titles.fs-6, h6';
const GROUP_HEADING = 'h3.fs-5, h2.main-section-title, .section-bar';
const CARD_HEAD = 'inv-card-head';
const OUT_HEAD = 'inv-out-head';
const SEC_HEAD = 'inv-sec-head';
const ANY_HEAD = `.${CARD_HEAD}, .${OUT_HEAD}, .${SEC_HEAD}`;
const INTERACTIVE = 'a, button, input, select, textarea, label, [contenteditable], .p-dropdown, .p-multiselect';

@Injectable({ providedIn: 'root' })
export class InvSectionCollapseService {
  private observer?: MutationObserver;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private zone: NgZone) {}

  init(): void {
    if (this.observer || typeof MutationObserver === 'undefined') {
      return;
    }
    this.zone.runOutsideAngular(() => {
      document.addEventListener('click', (event) => this.onClick(event));
      document.addEventListener('keydown', (event) => this.onKeydown(event));
      this.observer = new MutationObserver(() => this.schedule());
      this.observer.observe(document.body, { childList: true, subtree: true });
      this.schedule();
    });
  }

  private schedule(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.tagHeads(), 150);
  }

  private tagHeads(): void {
    const forms = document.querySelectorAll<HTMLElement>('.investigation-form');
    if (!forms.length) {
      return;
    }
    forms.forEach((form) => {
      form.querySelectorAll<HTMLElement>('.card-alt').forEach((card) => {
        const first = this.firstRendered(card);
        const candidate = first?.matches('.row') ? this.firstRendered(first) : first;
        if (candidate?.matches(TITLE) && !candidate.classList.contains(CARD_HEAD)) {
          candidate.classList.remove(SEC_HEAD);
          this.makeHead(candidate, CARD_HEAD, !card.classList.contains('inv-collapsed'));
        }
      });

      form.querySelectorAll<HTMLElement>(GROUP_HEADING).forEach((heading) => {
        if (heading.classList.contains(OUT_HEAD)) {
          return;
        }
        const next = heading.nextElementSibling as HTMLElement | null;
        if (!next?.matches('.card-alt') || next.querySelector(`.${CARD_HEAD}`)) {
          return;
        }
        next.classList.add('inv-attached');
        if (heading.getAttribute('role') === 'button') {
          heading.classList.add(OUT_HEAD);
          heading.setAttribute('data-inv-native', '');
        } else {
          this.makeHead(heading, OUT_HEAD, !next.classList.contains('inv-hidden'));
        }
      });

      form.querySelectorAll<HTMLElement>(TITLE).forEach((title) => {
        if (title.matches(ANY_HEAD) || !this.isRendered(title)) {
          return;
        }
        const parent = title.parentElement;
        if (parent && !parent.matches('.row, .card-alt') && getComputedStyle(parent).display === 'flex') {
          return;
        }
        if (!this.sectionBody(title).length) {
          return;
        }
        this.makeHead(title, SEC_HEAD, true);
      });
    });
  }

  private makeHead(head: HTMLElement, kind: string, expanded: boolean): void {
    head.classList.add(kind);
    head.setAttribute('role', 'button');
    head.setAttribute('tabindex', '0');
    head.setAttribute('aria-expanded', String(expanded));
  }

  private isRendered(el: Element): boolean {
    return getComputedStyle(el).display !== 'none';
  }

  private firstRendered(parent: Element): HTMLElement | null {
    for (const child of Array.from(parent.children)) {
      if (child.matches('input[type="hidden"], script, template') || !this.isRendered(child)) {
        continue;
      }
      return child as HTMLElement;
    }
    return null;
  }

  private headFrom(target: EventTarget | null): HTMLElement | null {
    const el = target as HTMLElement | null;
    if (!el?.closest) {
      return null;
    }
    const head = el.closest<HTMLElement>(ANY_HEAD);
    if (!head || head.hasAttribute('data-inv-native')) {
      return null;
    }
    const interactive = el.closest(INTERACTIVE);
    return interactive && head.contains(interactive) ? null : head;
  }

  private onClick(event: MouseEvent): void {
    const head = this.headFrom(event.target);
    if (head) {
      this.toggle(head);
    }
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    const head = event.target as HTMLElement;
    if (head?.matches?.(ANY_HEAD) && !head.hasAttribute('data-inv-native')) {
      event.preventDefault();
      this.toggle(head);
    }
  }

  private toggle(head: HTMLElement): void {
    let collapsed = false;
    if (head.classList.contains(CARD_HEAD)) {
      const card = head.closest<HTMLElement>('.card-alt');
      if (!card) {
        return;
      }
      collapsed = card.classList.toggle('inv-collapsed');
    } else if (head.classList.contains(OUT_HEAD)) {
      const card = head.nextElementSibling as HTMLElement | null;
      if (!card) {
        return;
      }
      collapsed = card.classList.toggle('inv-hidden');
      head.classList.toggle('is-collapsed', collapsed);
    } else {
      collapsed = head.classList.toggle('is-collapsed');
      this.sectionBody(head).forEach((el) => el.classList.toggle('inv-sec-hidden', collapsed));
    }
    head.setAttribute('aria-expanded', String(!collapsed));
  }

  private isBoundary(el: Element): boolean {
    return el.matches(ANY_HEAD) || el.matches(TITLE) || el.matches(GROUP_HEADING);
  }

  private sectionBody(head: HTMLElement): HTMLElement[] {
    const body: HTMLElement[] = [];
    let sibling = head.nextElementSibling as HTMLElement | null;
    while (sibling && !this.isBoundary(sibling)) {
      body.push(sibling);
      sibling = sibling.nextElementSibling as HTMLElement | null;
    }
    const container = head.parentElement;
    if (body.length || !container?.matches('.row')) {
      return body;
    }
    let next = container.nextElementSibling as HTMLElement | null;
    while (next && !this.isBoundary(next) && !next.querySelector(`${TITLE}, ${GROUP_HEADING}`)) {
      body.push(next);
      next = next.nextElementSibling as HTMLElement | null;
    }
    return body;
  }
}
