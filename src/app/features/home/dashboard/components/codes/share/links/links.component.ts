import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements AfterViewInit, OnDestroy {
  private routerSub?: Subscription;

  constructor(private host: ElementRef<HTMLElement>, private router: Router) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.revealActiveChip());
    this.routerSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => this.revealActiveChip()));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private revealActiveChip(): void {
    if (!window.matchMedia('(max-width: 767.98px)').matches) {
      return;
    }
    const strip = this.host.nativeElement.querySelector('.larg-screen-nav-codes') as HTMLElement | null;
    const active = strip?.querySelector('.list-group-item.active') as HTMLElement | null;
    if (!strip || !active) {
      return;
    }
    const stripRect = strip.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    strip.scrollLeft += activeRect.left - stripRect.left - (stripRect.width - activeRect.width) / 2;
  }
}
