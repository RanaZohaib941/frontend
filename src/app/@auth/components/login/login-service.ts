// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequestVM } from './ViewModels/RequestVM/login-requestVM';
import { LoginResponseVM } from './ViewModels/ResponseVM/login-responseVM';
import { RegisterReqesrtVM } from '../register/ViewModel/RequestVM/register-requestVM';
import { BaseResponseVM } from '../../../@core/baseModels/baseresponseVM';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private apiUrl = `${environment.apiUrl}Account/`; // Use the environment variable


    constructor(private http: HttpClient) { }

    login(loginRequestVM: LoginRequestVM): Observable<LoginResponseVM> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<LoginResponseVM>(`${this.apiUrl}login`, loginRequestVM, { headers });
    }

    register(registerRequestVM: RegisterReqesrtVM): Observable<BaseResponseVM> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<BaseResponseVM>(`${this.apiUrl}register`, registerRequestVM, { headers });
    }
}
