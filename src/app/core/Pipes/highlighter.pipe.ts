import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlighter'
})
export class HighlighterPipe implements PipeTransform {
  transform(value: string, args: string,type:string): unknown {
    if(!args) return value;
    args = this.wrapSpecialCharsWithBrackets(args);
    if(type==='full'){
      const re = new RegExp("\\b("+args+"\\b)", 'igm');
      value= value.replace(re, '<span class="highlighted-text">$1</span>');
    }
    else{
      const re = new RegExp(args, 'igm');
      value= value.replace(re, '<span class="highlighted-text">$&</span>');
    }

      return value;
  }
  private wrapSpecialCharsWithBrackets(args: string) :string {
    const special_chars = '`~!@#$%^&*()_-=+?';
    let new_args = '';
    for (let i = 0; i < args.length; i++) {
      if (special_chars.includes(args[i]))
        new_args += ('['+args[i]+']');
      else
        new_args += args[i];
    }

    return new_args;
  }

}
