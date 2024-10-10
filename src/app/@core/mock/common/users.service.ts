// /*
//  * Copyright (c) Akveo 2019. All Rights Reserved.
//  * Licensed under the Single Application / Multi Application License.
//  * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
//  */

// import { of as observableOf, Observable } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { User, UserData } from '../../interfaces/common/users';
// import { LocalDataSource } from 'ng2-smart-table';
// import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
// import { environment } from '../../../../environments/environment';
// import { HttpClient } from '@angular/common/http';
// import { UserResponseVM } from '../../../@theme/components/header/ViewModels/ResponseVM/user-responseVM';

// @Injectable()
// export class UsersService extends UserData {

//   getCurrentUser(): Observable<User> {
//     throw new Error('Method not implemented.');
//   }
//   get gridDataSource(): DataSource {
//     throw new Error('Method not implemented.');
//   }


//   private apiUrl = `${environment.apiUrl}Account/`; // Use the environment variable
//   constructor(private http: HttpClient) {
//     super();
//   }

//     // gridDataSource(): DataSource {
//   //   return new LocalDataSource(this.data);
//   // }

//   // getCurrentUser(): Observable<UserResponseVM> {
//   //   return this.http.get<UserResponseVM>(`${this.apiUrl}get`);
//   // }

//   list(pageNumber: number = 1, pageSize: number = 10): Observable<User[]> {
//     return observableOf(this.data);
//   }

//   get(id: number): Observable<User> {
//     return observableOf(this.data.find(x => x.id === id));
//   }

//   updateCurrent(user: User): Observable<User> {
//     this.data[0] = user;

//     return observableOf(user);
//   }

//   update(user: User): Observable<User> {
//     const i = this.data.indexOf(this.data.find(x => x.id === user.id));
//     if (i >= 0) {
//       this.data[i] = user;
//     }
//     return observableOf(user);
//   }

//   create(user: User): Observable<User> {
//     user.id = Math.max(...this.data.map(x => x.id)) + 1;
//     this.data.push(user);
//     return observableOf(user);
//   }

//   delete(id: number): Observable<boolean> {
//     this.data = [...this.data.filter(x => x.id !== id)];
//     return observableOf();
//   }


// }
