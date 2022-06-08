import { Injectable, Inject, InjectionToken, FactoryProvider } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import * as crypto from 'crypto-js';
// var crypto = require("crypto-js");
import { environment } from '../../../environments/environment';
import { constant } from '../../constant';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

import * as _moment from 'moment';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

const base_url = environment.apiUrl;
const base_url_path = environment.pathUrl;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userDetail: any = { id: '', name: '', email: '', access: [], access_ids: '', access_role: [], profile_picture: { file_src: '' }, module_columns: [], bannerList: [] };
    generalSettings: any = {
        admin_email: { value: '' },
        noreply_email: { value: '' },
        shuffle_time: 5,
        timezone: '',
        logo_image: {},
        password_for_link: { value: '' },
        password_required: { value: '' },
        instruction_text: { value: '' },
        instruction_text2: { value: '' },
        instruction_text3: { value: '' },
        show_what_is_new: { value: 'no' },
    };
    viewcontentData: any = {};
    sections: any = [];
    whatsNew = false;
    whatsNew_level_id: any = '';
    whatsNew_subject_id: any = '';
    openAdvanceFilter: any = '';
    dynamicMessageList: any = {};

    advanceSearch: any = {
        match: 'exact',
        match_for: [],
        text: '',
        hoveredDate: '',
        created_date_from: '',
        created_date_to: '',
        updated_date_from: '',
        updated_date_to: '',
    };
    copyText: any = 'Copy';
    contentItem: any = {
        id: '',
        level_id: '',
        subject_id: '',
        section_id: '',
        category_id: '',
        subcategory_id: '',
        title_eng: '',
        description: '',
        document_type: 'doc',
        document: '',
        thumbnail: {},
        link: ''
    };
    createContentOpened: any = false;
    public contentChangeTriggerMsg = new BehaviorSubject<string>("");
    changeContentReceive = this.contentChangeTriggerMsg.asObservable();
    createContentOpenFrom: any = '';
    resettingToken: any = false;
    openFrom: any = false;
    domain: any = '';

    constructor(private httpService: HttpClient, public router: Router, public calendar: NgbCalendar, public formatter: NgbDateParserFormatter, public titleService: Title) {
        console.log('window.location', window.location);
        const version = localStorage.getItem('version');
        // console.log('router', window.location.hostname);
        // console.log('location.href', location.href.toString().split('/#/')[0]);
        if (version != '2.0.0' && router.url != '/' && !router.url.match('/shared_link')) {
            localStorage.setItem('version', '2.0.0');
            this.logOut();
        }
        this.titleService.setTitle('Angular Demo');
    }

    logOut() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('viewcontent_filter');
        this.userDetail = { id: '', name: '', email: '', access: [], access_ids: '', access_role: [], profile_picture: { file_src: '' }, module_columns: [], bannerList: [] };
        console.log('this.router.url', this.router.url);
        if (this.router.url != '/signup') {
            this.router.navigate(['/login']);
        }
    }

    isLoggedIn() {
        const localData = localStorage.getItem('authToken');
        if (localData && localData.length > 0) {
            return true;
        }
        return false;
    }
    resetToken() {
        const localData = localStorage.getItem('authToken');
        console.log('localData', localData);
        const data = {
            token: localData
        };
        return this.httpService.post(base_url + constant.RESET_TOKEN, data).subscribe((res: any) => {
            console.log('res', res);
            console.log('res.token', res.token);
            localStorage.setItem("tokenExpired", moment.utc().unix());
            localStorage.setItem('authToken', res.token);
            this.resettingToken = false;
        });
    }

    goBack() {
        window.history.back();
    }

    checkLogin(obj: any) {
        const data = JSON.parse(JSON.stringify(obj));
        data.password = crypto.AES.encrypt(data.password, environment.encryptionKey).toString();
        return this.httpService.post(base_url + constant.LOGIN, data).pipe(map((res: any) => {
            return res;
        }));
    }
    setUserDetail(item: any) {
        this.userDetail = item;
    }
    getUserDetail() {
        return this.httpService.get(base_url + constant.GET_USER_DETAIL).pipe(map((res: any) => {

            var tokenExpiredTime = localStorage.getItem("tokenExpired");
            var loginTime = moment.unix(tokenExpiredTime).format("YYYY-MM-DD H:mm:ss");
            var cTime = moment().format("YYYY-MM-DD H:mm:ss");
            var loginBefore = moment(cTime).diff(moment(loginTime), 'minutes');
            console.log('loginBefore', loginBefore);
            if (loginBefore > 55 && loginBefore < 60 && this.resettingToken == false) {
                this.resettingToken = true;
                this.resetToken();
            }

            this.userDetail = res.data.userDetails;

            return res;
        }));
    }
    changePassword(obj: any) {
        const data = JSON.parse(JSON.stringify(obj));
        delete data.confirmPassword;
        data.password = crypto.AES.encrypt(data.password, environment.encryptionKey).toString();
        data.currentPassword = crypto.AES.encrypt(data.currentPassword, environment.encryptionKey).toString();
        return this.httpService.post(base_url + constant.CHANGE_PASSWORD, data).pipe(map((res: any) => {
            return res;
        }));
    }

    forgotPassword(obj: any) {
        return this.httpService.post(base_url + constant.FORGOTPASSWORD, obj).pipe(map((res: any) => {
            return res;
        }));
    }

    validateResetToken(token: any) {
        return this.httpService.post(base_url + constant.RESETTOKENVALIDATE, {},
            { headers: new HttpHeaders().set('authorization', 'JWT ' + token) }).pipe(map((res: any) => {
                return res;
            }));
    }

    resetPassword(obj: any, token: any) {
        delete obj.confirmPassword;
        obj.password = crypto.AES.encrypt(obj.password, environment.encryptionKey).toString();
        return this.httpService.post(base_url + constant.RESETPASSWORD, obj,
            { headers: new HttpHeaders().set('authorization', 'JWT ' + token) }).pipe(map((res: any) => {
                return res;
            }));
    }

}
