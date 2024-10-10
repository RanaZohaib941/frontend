// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserResponseVM } from '../../../@theme/components/header/ViewModels/ResponseVM/user-responseVM';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}Account/`; // Use the environment variable


    constructor(private http: HttpClient) { }

    getCurrentUser(): Observable<UserResponseVM> {
        return this.http.get<UserResponseVM>(`${this.apiUrl}get`);
    }

    getUser(id: string): Observable<UserResponseVM> {
        return this.http.get<UserResponseVM>(`${this.apiUrl}get/${id}`);
    }
}
