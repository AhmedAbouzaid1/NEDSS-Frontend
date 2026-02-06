import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  report = 0 ;
  private rendrer: Renderer2;

  private arabicStyleSheets: { key: string, href: string }[] = [
    {
      key: 'bootstrap-rtl',
      href: './Content/CSSLibraries/bootstrap-rtl/bootstrap-rtl.min.css'
    },
    // {
    //   key: 'main-rtl',
    //   href: './Content/Styles/Sass/main-rtl.scss'
    // },
    {
      key: 'main-rtl',
      href: './Content/Styles/CSS/main-rtl.css'
    },
    // {
    //   key: 'main-layout-rtl',
    //   href: './Content/Styles/CSS/main-layout-rtl.css'
    // },
    {
      key: 'primeng-rtl',
      href: './Content/Styles/CSS/primeng-rtl.css'
    }
  ];

  private englishStyleSheets: { key: string, href: string }[] = [
    {
      key: 'bootstrap',
      href: './Content/CSSLibraries/bootstrap-3.3.7/bootstrap.min.css'
    },
    {
      key: 'main',
      href: './Content/Styles/CSS/main.css'
    },
    {
      key: 'main',
      href: './Content/Styles/CSS/main.css'
    },
    {
      key: 'main-layout',
      href: './Content/Styles/CSS/main-layout.css'
    },
    // {
    //   key: 'primeng',
    //   href: './Content/Styles/CSS/primeng.min.css'
    // }
  ];


  constructor(
    private rendererFactory: RendererFactory2

  ) {
    this.rendrer = this.rendererFactory.createRenderer(null, null);
  }

  setLayout(language: string) {
    if (language == 'ar') {
      this.rendrer.addClass(document.body, 'ar');
      this.rendrer.removeClass(document.body, 'en');
      // this.loadStyles(this.arabicStyleSheets);
      // this.removeStyles(this.englishStyleSheets);
    } else {
      this.rendrer.removeClass(document.body, 'ar');
      this.rendrer.addClass(document.body, 'en');
      // this.loadStyles(this.englishStyleSheets);
      // this.removeStyles(this.arabicStyleSheets);
    }
  }

  private loadStyles(stylesList: { key: string, href: string }[]) {
    for (let i = 0; i < stylesList.length; i++) {
      const element = stylesList[i];
      const head = document.getElementsByTagName('head')[0];
      const style = document.createElement('link');
      style.id = element.key;
      style.rel = 'stylesheet';
      style.href = `${element.href}`;
      head.appendChild(style);
    }
  }
  private removeStyles(stylesList: { key: string, href: string }[]) {
    for (let i = 0; i < stylesList.length; i++) {
      const element = stylesList[i];
      let styleSheet = document.getElementById(element.key);
      if (styleSheet){
        styleSheet.remove();
      }
    }
  }
}
