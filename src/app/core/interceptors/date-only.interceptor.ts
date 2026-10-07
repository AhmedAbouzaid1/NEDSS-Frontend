import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DateOnlyInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isPlainData(req.body)) {
      return next.handle(req);
    }
    return next.handle(req.clone({ body: this.convert(req.body) }));
  }

  private convert(value: any): any {
    if (value instanceof Date) {
      return this.isDateOnly(value) ? this.toDateString(value) : value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.convert(item));
    }
    if (this.isPlainObject(value)) {
      const result: any = {};
      for (const key of Object.keys(value)) {
        result[key] = this.convert(value[key]);
      }
      return result;
    }
    return value;
  }

  private isDateOnly(date: Date): boolean {
    return (
      !isNaN(date.getTime()) &&
      date.getHours() === 0 &&
      date.getMinutes() === 0 &&
      date.getSeconds() === 0 &&
      date.getMilliseconds() === 0
    );
  }

  private toDateString(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private isPlainData(body: any): boolean {
    return Array.isArray(body) || this.isPlainObject(body);
  }

  private isPlainObject(value: any): boolean {
    return (
      value !== null &&
      typeof value === 'object' &&
      !(value instanceof Date) &&
      !(value instanceof Blob) &&
      !(value instanceof FormData) &&
      !(value instanceof URLSearchParams) &&
      !(value instanceof ArrayBuffer) &&
      !ArrayBuffer.isView(value) &&
      typeof value.toJSON !== 'function'
    );
  }
}
