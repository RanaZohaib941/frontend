/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: NbAuthService, private router: Router) {}

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot,
  // ): Observable<boolean> | Promise<boolean> | boolean {
  //   return this.authService.isAuthenticated()
  //     .pipe(
  //       tap(authenticated => {
  //         if (!authenticated) {
  //           this.router.navigate(['auth/login']);
  //         }
  //       }),
  //     );

  // }



  // canActivate(): boolean {
  //   const token = localStorage.getItem('jwtToken');
  //   if (token) {
  //     // Optionally, you could add additional token validation here
  //     return true; // User is authenticated
  //   } else {
  //     this.router.navigate(['auth/login']); // Redirect to login if not authenticated
  //     return false;
  //   }
  // }

  canActivate(): boolean {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      // Decode the JWT token
      const decodedToken: any = jwtDecode(token); // Use any type if you don't have an interface

      // Get the current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if the token is expired
      if (decodedToken.exp && decodedToken.exp > currentTime) {
        return true; // User is authenticated and token is valid
      } else {
        // Token is expired, redirect to login
        this.router.navigate(['auth/login']); // Adjust the path if necessary
        return false;
      }
    } else {
      // No token found, redirect to login
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}
