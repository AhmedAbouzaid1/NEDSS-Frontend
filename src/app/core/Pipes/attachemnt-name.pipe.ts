import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attachemntName'
})
export class AttachemntNamePipe implements PipeTransform {

  transform(attachmentName: string): string {
    return attachmentName?.split('--')?.[1];
  }

}
