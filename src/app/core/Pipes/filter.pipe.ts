import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {

    transform(value: Array<any>, filterValue: any, propertyName: string) {
        if (value.length === 0) {
            return value;
        }
        let resultArray = [];
        resultArray = value.filter((item) => {
            return item[propertyName] === filterValue;
        })

        return resultArray;
    }
}
