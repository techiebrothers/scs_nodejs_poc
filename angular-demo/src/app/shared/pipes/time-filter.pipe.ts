import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'time'
})
export class TimeFilterPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let result = ['', ''];

        if (!value) { return result; }
        // if (!args) { return value; }
        const hours = Math.floor(value / 60 / 60);

        if (hours < 24) {
            result = [hours.toString(), 'Hour' + (hours > 1 ? 's' : '')];
        } else {
            const days = Math.floor(hours / 24);
            result = [days.toString(), 'Day' + (days > 1 ? 's' : '')];
        }
        return result;
    }
}
