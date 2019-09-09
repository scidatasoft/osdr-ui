import { Pipe, PipeTransform } from '@angular/core';
import { FilterField } from 'app/shared/components/filter-bar/filter-bar.model';

@Pipe({
  name: 'filterBarPipe',
})
export class FilterBarPipePipe implements PipeTransform {

  transform(filteredFileld: FilterField[], args?: any): any {
    return filteredFileld.filter(field => field.name.toLowerCase().indexOf(args.toLowerCase()) !== -1);
  }

}
