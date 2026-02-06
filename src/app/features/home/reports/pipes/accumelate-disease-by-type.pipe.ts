import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accumelateDiseaseByType',
})
export class AccumelateDiseaseByTypePipe implements PipeTransform {
  transform(diseasesData: any[], typeId: any, arrName): number {
    return diseasesData.reduce((prev, current) => {
      return (
        (current?.[arrName]?.find((x) => x.id == typeId)?.count ?? 0) + prev
      );
    }, 0);
  }
}
