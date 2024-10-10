// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserResponseVM } from './ViewModels/ResponseVM/user-responseVM';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    private apiUrl = `${environment.apiUrl}Account/`; // Use the environment variable


    constructor(private http: HttpClient) { }

    loggedinUser(): Observable<UserResponseVM> {
        return this.http.get<UserResponseVM>(`${this.apiUrl}get`);
    }
}
