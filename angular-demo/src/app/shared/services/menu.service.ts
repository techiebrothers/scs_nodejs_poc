import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
// var crypto = require("crypto-js");
import { environment } from '../../../environments/environment';
import { constant } from '../../constant';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const base_url = environment.apiUrl;

interface Response {
    data: [{ menuData: any, accessData: any }];
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    menuData: any;
    accessData: any;

    constructor(public http: HttpClient, public router: Router, private Auth: AuthService) {
        if (router.url !== '/login') {
            this.getMenudata().subscribe((res: any) => {
                this.Auth.setUserDetail(res.data.userDetails);
                // this.setMenudata(res.data[0].menuData);
                // this.setAccessdata(res.data[0].accessData);
                // this.router.navigate([this.menuData.split(',')[0]]);
            }, err => {
                // console.log(err);
            });
        }
    }


    getMenudata() {
        return this.http.get<Response>(base_url + constant.GET_MENU_DATA);
    }


    resolveMenu() {
        if (this.menuData && this.menuData.length > 0) {
            return;
        } else {
            return this.http.get<Response>(base_url + constant.GET_MENU_DATA);
        }
    }
    setMenudata(data: any) {
        this.menuData = crypto.AES.decrypt(data, environment.encryptionKey).toString(crypto.enc.Utf8);
        // this.menuData = this.menuData + ',customers';
    }
    setAccessdata(data: any) {
        this.accessData = JSON.parse(crypto.AES.decrypt(data, environment.encryptionKey).toString(crypto.enc.Utf8));
        console.log('this.accessData', this.accessData);
        // this.menuData = this.menuData + ',customers';
    }

    validateMenuItems(menuName: any): Boolean {
        if (this.menuData && this.menuData.length > 0) {
            const mData = this.menuData.split(',');
            return mData.indexOf(menuName) > -1 ? true : false;
            // return this.menuData.includes(<never>menuName);
        }
        return false;
    }

}
