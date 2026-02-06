import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringConverter'
})
export class StringConverterPipe implements PipeTransform {

  transform(query: number, ...args: any[]): any {
    return query.toString();
  }

}
