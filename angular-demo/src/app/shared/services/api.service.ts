import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as crypto from 'crypto-js';
// var crypto = require("crypto-js");
import { environment } from '../../../environments/environment';
import { constant } from '../../constant';
import { Router } from '@angular/router';

const base_url = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private httpService: HttpClient, public router: Router) {

    }

    getData(method: any, params: any) {
        return this.httpService.get(base_url + method + params).pipe(map((res: any) => {
            return res;
        }));
    }
    postData(method: any, obj: any) {
        return this.httpService.post(base_url + method, obj).pipe(map((res: any) => {
            return res;
        }));
    }
    postFileData(method: any, obj: any) {
        return this.httpService.post(base_url + method, obj).pipe(map((res: any) => {
            return res;
        }));
    }
    deleteData(method: any, id: any) {
        return this.httpService.delete(base_url + method + '/' + id).pipe(map((res: any) => {
            return res;
        }));
    }
    download(url: string) {
        return this.httpService.get(url, {
            responseType: 'blob'
        })
    }
    getJSON(path: any) {
        return this.httpService.get(path);
    }
}
