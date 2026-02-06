import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArrayReport',
})
export class FilterArrayReportPipe implements PipeTransform {
  transform(array: any[], id): any {
    return array?.find((x) => x.id == id);
  }
}
