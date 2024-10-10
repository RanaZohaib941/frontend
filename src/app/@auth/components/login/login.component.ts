/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NB_AUTH_OPTIONS,
  NbAuthSocialLink,
  NbAuthService,
  NbAuthResult,
} from '@nebular/auth';
import { getDeepFromObject } from '../../helpers';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { EMAIL_PATTERN } from '../constants';
// import { InitUserService } from '../../../@theme/services/init-user.service';
import { ToastrComponent } from '../../../pages/modal-overlays/toastr/toastr.component';
import { LoginRequestVM } from './ViewModels/RequestVM/login-requestVM';
import { LoginService } from './login-service';
import { LoginResponseVM } from './ViewModels/ResponseVM/login-responseVM';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NgxLoginComponent implements OnInit {

  minLength: number = this.getConfigValue('forms.validation.password.minLength');
  maxLength: number = this.getConfigValue('forms.validation.password.maxLength');
  redirectDelay: number = this.getConfigValue('forms.login.redirectDelay');
  showMessages: any = this.getConfigValue('forms.login.showMessages');
  strategy: string = this.getConfigValue('forms.login.strategy');
  // socialLinks: NbAuthSocialLink[] = this.getConfigValue('forms.login.socialLinks');
  // rememberMe = this.getConfigValue('forms.login.rememberMe');
  isEmailRequired: boolean = this.getConfigValue('forms.validation.email.required');
  isPasswordRequired: boolean = this.getConfigValue('forms.validation.password.required');

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  loginForm: FormGroup;
  alive: boolean = true;

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  constructor(protected service: LoginService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected themeService: NbThemeService,
    private fb: FormBuilder,
    private router: Router,
    // protected initUserService: InitUserService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    const emailValidators = [
      Validators.pattern(EMAIL_PATTERN),
      Validators.required
    ];

    const passwordValidators = [
      Validators.minLength(this.minLength),
      // Validators.maxLength(this.maxLength),
      Validators.required
    ];

    this.loginForm = this.fb.group({
      email: this.fb.control('', [...emailValidators]),
      password: this.fb.control('', [...passwordValidators]),
      // rememberMe: this.fb.control(false),
    });
  }

  // login(): void {
  //   this.loginRequestVM = new LoginRequestVM
  //   {
  //     email: this.email;
  //     password: this.password;
  //     timeSlot: new Date().getTimezoneOffset();
  //   };

  //   this.service.login(this.loginRequestVM).subscribe((result: NbAuthResult) => {
  //     this.submitted = false;

  //     if (result.isSuccess()) {
  //       this.messages = result.getMessages();
  //       this.initUserService.initCurrentUser().subscribe();
  //     } else {
  //       this.errors = result.getErrors();
  //     }

  //     const redirect = result.getRedirect();
  //     if (redirect) {
  //       setTimeout(() => {
  //         return this.router.navigateByUrl(redirect);
  //       }, this.redirectDelay);
  //     }
  //     this.cd.detectChanges();
  //   });
  // }



  login(): void {
    this.submitted = true;
    const loginRequestVM: LoginRequestVM = {
      email: this.email.value,
      password: this.password.value,
      timeSlot: new Date().getTimezoneOffset(),
    };

    this.service.login(loginRequestVM).subscribe((result: LoginResponseVM) => {
      this.submitted = false;

      if (result.success) {
        localStorage.setItem('jwtToken', result.data);
        environment.testUser =
        {
          token: {
            access_token: result.data
          },
          email: this.email.value
        };

        this.messages = [result.message];
        this.router.navigate(['/pages']); // Adjust the path if necessary
        // this.initUserService.initCurrentUser().subscribe();
      } else {
        // this.errors = [result.message];
        this.toastrService.danger(result.message,"FAILED");
      }
      // this.cd.detectChanges();
    });
  }










  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
