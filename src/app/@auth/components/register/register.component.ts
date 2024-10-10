/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink, NbAuthService, NbAuthResult } from '@nebular/auth';
import { getDeepFromObject } from '../../helpers';
import { EMAIL_PATTERN, NAME_PATTERN, PAKISTANINUMBER_PATTERN, PASSWORD_PATTERN } from '../constants';
import { BaseResponseVM } from '../../../@core/baseModels/baseresponseVM';
import { LoginService } from '../login/login-service';
import { ToasterService } from 'angular2-toaster';
import { ToastrComponent } from '../../../pages/modal-overlays/toastr/toastr.component';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxRegisterComponent implements OnInit {
  minFullNameLength: number = this.getConfigValue(('forms.validation.fullName.minLength'));
  maxFullNameLength: number = this.getConfigValue(('forms.validation.fullName.maxLength'));
  minLength: number = this.getConfigValue('forms.validation.password.minLength');
  maxLength: number = this.getConfigValue('forms.validation.password.maxLength');
  isFullNameRequired: boolean = this.getConfigValue('forms.validation.fullName.required');
  isEmailRequired: boolean = this.getConfigValue('forms.validation.email.required');
  isPasswordRequired: boolean = this.getConfigValue('forms.validation.password.required');
  redirectDelay: number = this.getConfigValue('forms.register.redirectDelay');
  showMessages: any = this.getConfigValue('forms.register.showMessages');
  strategy: string = this.getConfigValue('forms.register.strategy');
  socialLinks: NbAuthSocialLink[] = this.getConfigValue('forms.login.socialLinks');

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};

  registerForm: FormGroup;
  constructor(protected service: LoginService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    private fb: FormBuilder,
    protected router: Router,
    private toastrService: NbToastrService) {
  }

  get fullName() { return this.registerForm.get('fullName'); }
  get email() { return this.registerForm.get('email'); }
  get phoneNumber() { return this.registerForm.get('phoneNumber'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get terms() { return this.registerForm.get('terms'); }

  ngOnInit(): void {
    const fullNameValidators = [
      Validators.pattern(NAME_PATTERN),
      Validators.minLength(this.minFullNameLength),
      Validators.maxLength(this.maxFullNameLength),
      Validators.required
    ];

    const emailValidators = [
      Validators.pattern(EMAIL_PATTERN),
      Validators.required
    ];

    const phoneNumberValidators = [
      Validators.pattern(PAKISTANINUMBER_PATTERN),
      Validators.required
    ];

    const passwordValidators = [
      Validators.minLength(this.minLength),
      Validators.pattern(PASSWORD_PATTERN),
      Validators.required
    ];

    this.registerForm = this.fb.group({
      fullName: this.fb.control('', [...fullNameValidators]),
      email: this.fb.control('', [...emailValidators]),
      phoneNumber: this.fb.control('', [...phoneNumberValidators]),
      password: this.fb.control('', [...passwordValidators]),
      confirmPassword: this.fb.control('', [...passwordValidators]),
      terms: this.fb.control(''),
    });
  }

  register(): void {
    this.submitted = true;
    const registrationRequestVM = this.registerForm.value;

    this.service.register(registrationRequestVM).subscribe((result: BaseResponseVM) => {
      this.submitted = false;
      debugger;
      if (result.success) {

        this.messages = [result.message];
        this.router.navigate(['auth']); // Adjust the path if necessary
        // this.initUserService.initCurrentUser().subscribe();
      } else {
        // this.errors = [result.message];
        this.toastrService.danger(result.message, "FAILED");
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
