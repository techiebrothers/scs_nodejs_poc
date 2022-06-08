import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

    transform(array: Array<string>, args?: any): Array<string> {
        if (array !== undefined && array !== null && args.column !== '') {
            console.log('args.column', args.column);
            const direction = args.direction === 'asc' ? 1 : -1;
            array.sort((a: any, b: any) => {
                if (a[args.column] < b[args.column]) {
                    return -1 * direction;
                } else if (a[args.column] > b[args.column]) {
                    return 1 * direction;
                } else {
                    return 0;
                }
            });
        }
        return array;
    }

}
