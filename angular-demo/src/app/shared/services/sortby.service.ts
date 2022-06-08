import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SortbyService {
    column = 'name';
    direction = 'asc';
    page = 1;
    itemsPerPage = 25;

    constructor() {
    }

    sort(column: any) {
        if (this.column === column) {
            this.direction = this.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.direction = 'asc';
        }
        this.column = column;
    }

}
