import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search',
    pure: false
})
export class SearchPipe implements PipeTransform {

  transform(value: Array<any>, filterString:any, propertyName:string) {

    if(value.length === 0 || filterString === "")
    {
      return value;
    }

    let resultArray = [];
    let nameLower;

    resultArray = value.filter((item)=>{

      if(propertyName === "")

        nameLower = item?.toLowerCase();

      else

        nameLower = item[propertyName]?.toLowerCase();


      return nameLower?.includes(filterString?.toLowerCase());

    })

    return resultArray;
  }

}
