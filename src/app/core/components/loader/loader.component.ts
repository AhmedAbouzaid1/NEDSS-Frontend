import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  public containerStyle: { [key: string]: string } = {
    top: '0px',
    left: '0px',
    width: '100vw'
  };

  public get isArabic(): boolean {
    return localStorage.getItem('ls.currentLang') === 'ar';
  }

  private routerEventsSubscription: Subscription;
  private layoutMutationObserver: MutationObserver;
  private mainPageElement: HTMLElement | null = null;
  private readonly resizeListener = () => this.updateLayoutStyle();
  private readonly transitionEndListener = () => this.updateLayoutStyle();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.syncLoaderPosition();
    window.addEventListener('resize', this.resizeListener);

    this.routerEventsSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.syncLoaderPosition());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.disconnectObservers();

    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  private syncLoaderPosition(): void {
    // Wait for the new route DOM to render, then rebind observers.
    setTimeout(() => {
      this.bindLayoutObservers();
      this.updateLayoutStyle();
      // Account for sidebar width transition after collapse/expand.
      setTimeout(() => this.updateLayoutStyle(), 320);
    });
  }

  private bindLayoutObservers(): void {
    this.disconnectObservers();

    const mainContainer = document.querySelector('.main-container');
    this.mainPageElement = document.querySelector('.main-page') as HTMLElement | null;

    if (mainContainer) {
      this.layoutMutationObserver = new MutationObserver(() => this.syncLoaderPosition());
      this.layoutMutationObserver.observe(mainContainer, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    if (this.mainPageElement) {
      this.mainPageElement.addEventListener('transitionend', this.transitionEndListener);
    }
  }

  private disconnectObservers(): void {
    if (this.layoutMutationObserver) {
      this.layoutMutationObserver.disconnect();
      this.layoutMutationObserver = null;
    }

    if (this.mainPageElement) {
      this.mainPageElement.removeEventListener('transitionend', this.transitionEndListener);
      this.mainPageElement = null;
    }
  }

  private updateLayoutStyle(): void {
    const mainPage = document.querySelector('.main-page') as HTMLElement | null;
    const navbar = document.querySelector('.main-page app-navbar nav') as HTMLElement | null;

    if (!mainPage || !navbar) {
      // Login page and screens without navbar.
      this.containerStyle = {
        top: '0px',
        left: '0px',
        width: '100vw'
      };
      return;
    }

    const mainRect = mainPage.getBoundingClientRect();
    const navRect = navbar.getBoundingClientRect();

    this.containerStyle = {
      top: `${Math.max(0, Math.round(navRect.bottom))}px`,
      left: `${Math.max(0, Math.round(mainRect.left))}px`,
      width: `${Math.max(0, Math.round(mainRect.width))}px`
    };
  }

}
