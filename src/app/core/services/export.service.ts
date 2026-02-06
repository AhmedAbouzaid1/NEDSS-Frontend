import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { ElementRef, Injectable } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: '',
    options: {
      title: '',
      margins: {
        top: '20',
        left: '20',
        right: '20',
        bottom: '20',
      },
    },
  };

  constructor(private exportAsService: ExportAsService) { }

  exportTableAsExcel(tableElement: ElementRef, filename: string) {
    let element = this.getElementToExport(tableElement, filename);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, filename + '.xlsx');
  }

  exportTableAsPdf(tableElement: ElementRef, filename: string) {
    this.exportAsPdfConfig.elementIdOrContent = this.getElementToExport(
      tableElement,
      filename
    );
    this.exportAsPdfConfig.options.title = filename;
    this.exportAsService
      .save(this.exportAsPdfConfig, filename)
      .subscribe((res) => { });
  }

  public getElementToExport(tableElement: ElementRef, title: string) {
    let exportedElement = tableElement.nativeElement.cloneNode(true);

    let titleElement = document.createElement('h2');
    titleElement.textContent = title;
    titleElement.style.textAlign = 'center';

    exportedElement.insertBefore(titleElement, exportedElement.firstChild);

    var currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    exportedElement.style.direction = currentLang == 'ar' ? 'rtl' : 'ltr';

    let excludeElements = exportedElement.querySelectorAll('.exclude-pdf');
    excludeElements.forEach((el) => el.remove());

    return exportedElement;
  }
  // ///////////////////////////////////////// export PDF searsch
  exportTemplateAsPdf(
    el: any,
    filename: string,
    rest: any[] = [{ arabicName: 'كل المحافظات' }],
    dates: string[] = ['', '']
  ) {
    this.exportAsPdfConfig.elementIdOrContent = this.getElementeToExport(
      el,
      filename,
      rest,
      dates
    );
    this.exportAsPdfConfig.options = { title: filename };
    this.exportAsService
      .save(this.exportAsPdfConfig, filename)
      .subscribe((res) => { });
  }

  private getElementeToExport(tableElement: any, title: string, rest, dates) {
    // console.log('REST', rest[0], rest, dates)

    let exportedElement = tableElement?.cloneNode(true);

    var currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    exportedElement.style.direction = currentLang == 'ar' ? 'rtl' : 'ltr';

    let excludeElements = exportedElement.querySelectorAll('.exclude-pdf');
    excludeElements.forEach((el) => el.remove());

    let el = `
<div style="text-align: center; margin: 20px !important;">
    <br>
    <header
        style="display: flex; justify-content: space-between; align-items: center; padding-inline: 24px; padding-block-start: 24px;padding-block-end: 12px;">
        <img src="../../../Content/Images/logo.png" style="width: 90px; aspect-ratio: 1/1; align-self: flex-start">
        <div dir="rtl">
            <br>
            <br>
            <h5>تقرير عن ${title}</h5>
            <br>
            <br>
            
            ${dates[0]
        ? `<div style="display: flex; justify-content: space-between; padding-inline: 12px; gap: 16px;">
                <span>من تاريخ:
                <span id="fromDate" style="font-weight: 700;">${dates[0]}</span>
                </span>
                <span>إلى تاريخ:
                <span id="toDate" style="font-weight: 700;">${dates[1]}</span>
                </span>
                </div>
                <br>
               `
        : ''
      }
            
            <div>
              <div style="font-size: 20px">محافظة: ${rest?.[0]?.[0]?.arabicName
      }</div>
              ${rest?.length > 1 && rest[1]?.length > 0
        ? `<div style="margin-inline: 8px;">إدارات: ${rest[1]?.join(
          ' - '
        )}</div>`
        : ''
      }
              ${rest?.length > 2 && rest[2]?.length > 0
        ? `<div style="margin-inline: 8px;">مصدر ابلاغ: ${rest[2]?.join(
          ' - '
        )}</div>`
        : ''
      }
              ${rest?.length > 3 && rest[3]?.length > 0
        ? `<div style="margin-inline: 8px;">أقسام: ${rest[3]?.join(
          ' - '
        )}</div>`
        : ''
      }
            </div>
        </div>
        <div style="align-self: flex-start">
            <img src="../../../Content/Images/mohp.png" style="width: 60px; aspect-ratio: 1/1;">
            <div style="margin-bottom: 2px; margin-top: 8px; font-weight: 700;">القطاع الوقائي</div>
            <small style="font-weight: 800;">الإدارة العامة للوبائيات والترصد</small>
        </div>
    </header>
    <br>
    <br>
    <main class="table-container" style="padding-inline: 24px; margin-bottom: 24px; background-color: white !important;">
    ${exportedElement.innerHTML}
    </main>
    
</div>
`;
    return el;
  }

  // ///////////////////////////////////////// export PDF seave
  exportTemplateAsPdfSave(
    el: any,
    filename: string,
    rest: any[] = [{ governmentName: 'كل المحافظات' }]
  ) {
    this.exportAsPdfConfig.elementIdOrContent = this.getElementeToExportSave(
      el,
      filename,
      rest
    );
    this.exportAsPdfConfig.options = { title: filename };
    this.exportAsService
      .save(this.exportAsPdfConfig, filename)
      .subscribe((res) => { });
  }

  private getElementeToExportSave(tableElement: any, title: string, rest) {
    let exportedElement = tableElement?.cloneNode(true);

    var currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    exportedElement.style.direction = currentLang == 'ar' ? 'rtl' : 'ltr';

    let excludeElements = exportedElement.querySelectorAll('.exclude-pdf');
    excludeElements.forEach((el) => el.remove());

    let el = `
<div style="text-align: center; margin-bottom: 10px !important;">
    <br>
    <header
        style="display: flex; justify-content: space-between; align-items: center; padding-inline: 24px; padding-block-start: 24px;padding-block-end: 12px;">
        <img src="../../../Content/Images/logo.png" style="width: 90px; aspect-ratio: 1/1; align-self: flex-start">
        <div dir="rtl">
            <br>
            <br>
            <h5>تقرير عن ${title}</h5>
            <br>
            <br>
            
            <div>
              <div style="font-size: 20px">المحافظات: [ ${rest[0]} ]</div>
              ${rest?.length > 1 && rest[1]?.length > 0
        ? `<div style="margin-inline: 8px;">الإدارات: [ ${rest[1]?.join(
          ' - '
        )} ]</div>`
        : ''
      }
              ${rest?.length > 2 && rest[2]?.length > 0
        ? `<div style="margin-inline: 8px;">مصدر ابلاغ: [ ${rest[2]?.join(
          ' - '
        )} ] </div>`
        : ''
      }
              ${rest?.length > 3 && rest[3]?.length > 0
        ? `<div style="margin-inline: 8px;">أقسام: [ ${rest[3]?.join(
          ' - '
        )} ] </div>`
        : ''
      }
            </div>
        </div>
        <div style="align-self: flex-start">
            <img src="../../../Content/Images/mohp.png" style="width: 60px; aspect-ratio: 1/1;">
            <div style="margin-bottom: 2px; margin-top: 8px; font-weight: 700;">القطاع الوقائي</div>
            <small style="font-weight: 800;">الإدارة العامة للوبائيات والترصد</small>
        </div>
    </header>
    <br>
    <br>
    <main class="table-container" style="padding-inline: 24px; margin-bottom: 24px; background-color: white !important;">
    ${exportedElement.innerHTML}
    </main>
</div>
`;
    return el;
  }

  // ///////////////////////////////////////// export PDF LOGO & TITLE

  exportTemplateAsPdfLogoTitle(el: any, filename: string) {
    this.exportAsPdfConfig.elementIdOrContent =
      this.getElementeToExportLogoTitle(el, filename);
    this.exportAsPdfConfig.options = { title: filename };
    this.exportAsService
      .save(this.exportAsPdfConfig, filename)
      .subscribe((res) => { });
  }

  private getElementeToExportLogoTitle(tableElement: any, title: string) {
    // console.log('REST', rest[0], rest, dates)

    let exportedElement = tableElement?.cloneNode(true);

    var currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    exportedElement.style.direction = currentLang == 'ar' ? 'rtl' : 'ltr';

    let excludeElements = exportedElement.querySelectorAll('.exclude-pdf');
    excludeElements.forEach((el) => el.remove());

    let el = `
<div style="text-align: center; margin-bottom: 10px !important;">
    <br>
    <header
        style="display: flex; justify-content: space-between; align-items: center; padding-inline: 24px; padding-block-start: 24px;padding-block-end: 12px;">
        <img src="../../../Content/Images/logo.png" style="width: 90px; aspect-ratio: 1/1; align-self: flex-start">
        <div dir="rtl">
            <br>
            <br>
            <h5>تقرير عن ${title}</h5>
            <br>
            <br> 
        </div>
        <div style="align-self: flex-start">
            <img src="../../../Content/Images/mohp.png" style="width: 60px; aspect-ratio: 1/1;">
            <div style="margin-bottom: 2px; margin-top: 8px; font-weight: 700;">القطاع الوقائي</div>
            <small style="font-weight: 800;">الإدارة العامة للوبائيات والترصد</small>
        </div>
    </header>
    <br>
    <br>
    <main class="table-container" style="padding-inline: 24px; margin-bottom: 24px; background-color: white !important;">
    ${exportedElement.innerHTML}
    </main>
</div>
`;
    return el;
  }
}
