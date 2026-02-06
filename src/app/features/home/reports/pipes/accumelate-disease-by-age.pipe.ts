import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accumelateDiseaseByAge',
})
export class AccumelateDiseaseByAgePipe implements PipeTransform {
  transform(diseasesData: any[], typeId: any): number {
    return diseasesData.reduce((prev, current) => {
      return (current?.ageRangeList?.[typeId] ?? 0) + prev;
    }, 0);
  }
}
