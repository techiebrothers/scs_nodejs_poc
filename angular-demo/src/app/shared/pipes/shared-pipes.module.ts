import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterPipe } from './data-filter.pipe';
import { TimeFilterPipe } from './time-filter.pipe';
import { SortByPipe } from './sort-by.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [DataFilterPipe, TimeFilterPipe, SortByPipe],
    exports: [DataFilterPipe, TimeFilterPipe, SortByPipe],
    providers: [
    ]
})
export class SharedPipesModule { }
