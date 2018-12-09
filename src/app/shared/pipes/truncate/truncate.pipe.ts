import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, start: number = 10, end: number = 0): any {
    const trail = value.length > start ? '...' : '';
    const startString = value.substring(0, start);
    const endString = value.substring(value.length - end, value.length)
    return value.length > start + end ? startString + trail + endString : value;
  }

}
