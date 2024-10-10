/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { NbToastrService } from '@nebular/theme';

import { User } from '../../../@core/interfaces/common/users';
import { EMAIL_PATTERN, NUMBERS_PATTERN, PAKISTANINUMBER_PATTERN } from '../../../@auth/components';
import { NbAuthOAuth2JWTToken, NbTokenService } from '@nebular/auth';
import { UserService } from './user-service';
import { UserResponseVM } from '../../../@theme/components/header/ViewModels/ResponseVM/user-responseVM';
// import {UserStore} from '../../../@core/stores/user.store';

export enum UserFormMode {
  VIEW = 'View',
  EDIT = 'Edit',
  ADD = 'Add',
  EDIT_SELF = 'EditSelf',
}

@Component({
  selector: 'ngx-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  userForm: FormGroup;

  protected readonly unsubscribe$ = new Subject<void>();

  get id() { return this.userForm.get('id'); }
  get roles() { return this.userForm.get('roles').value.join(', '); }
  get fullName() { return this.userForm.get('fullName'); }
  get userName() { return this.userForm.get('userName'); }
  get phoneNumber() { return this.userForm.get('phoneNumber'); }
  get email() { return this.userForm.get('email'); }
  get agreeToTnC() { return this.userForm.get('agreeToTnC'); }
  get active() { return this.userForm.get('active'); }
  get deleted() { return this.userForm.get('deleted'); }

  mode: UserFormMode;
  setViewMode(viewMode: UserFormMode) {
    this.mode = viewMode;
  }

  constructor(
    private usersService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: NbTokenService,
    // private userStore: UserStore,
    private toasterService: NbToastrService,
    private fb: FormBuilder,
    private toastrService: NbToastrService) {
  }

  ngOnInit(): void {
    this.initUserForm();
    this.loadUserData();
  }

  initUserForm() {
    this.userForm = this.fb.group({
      id: this.fb.control(''),
      role: this.fb.control(''),
      fullName: this.fb.control('', [Validators.minLength(3), Validators.maxLength(20)]),
      phoneNumber: this.fb.control('', [Validators.required, Validators.pattern(PAKISTANINUMBER_PATTERN)]),
      email: this.fb.control('', [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN),
      ]),
      agreeToTnC: this.fb.control(''),
      active: this.fb.control('', [Validators.required]),
      deleted: this.fb.control('', [Validators.required]),
      // login: this.fb.control('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    });
  }

  get canEdit(): boolean {
    return this.mode !== UserFormMode.VIEW;
  }


  loadUserData() {
    const id = this.route.snapshot.paramMap.get('id');
    const isProfile = this.route.snapshot.queryParamMap.get('profile');
    if (isProfile) {
      this.setViewMode(UserFormMode.EDIT_SELF);
      this.loadUser();
    } else {
      if (id) {
        var currentUserId;

        this.usersService.getCurrentUser().subscribe({
          
          next:(result: UserResponseVM) =>
          {
            if(result.success && result.data)
            {
              currentUserId = result.data.id;
            }else {
              // this.errors = [result.message];
              this.toastrService.danger(result.message,"FAILED");
            }
          },
          error: (err) => {
            console.error('Error fetching current user:', err);
          }
        });


        this.setViewMode(currentUserId.toString() === id ? UserFormMode.EDIT_SELF : UserFormMode.EDIT);
        this.loadUser(id);
      } else {
        this.setViewMode(UserFormMode.ADD);
      }
    }
  }

  loadUser(id?) {
    const loadUser = this.mode === UserFormMode.EDIT_SELF
      ? this.usersService.getCurrentUser() : this.usersService.getUser(id);
    loadUser
        .subscribe((result) => {
          if(result.success && result.data)
            {
              this.userForm.setValue({
                id: result.data.id ? result.data.id : '',
                role: result.data.roles && result.data.roles.length > 0 ? result.data.roles.join(', ') : '',
                fullName: result.data.fullName ? result.data.fullName : '',
                // login: user.login ? user.login : '',
                email: result.data.email,
                phoneNumber: result.data.phoneNumber,
                active: result.data.active,
                deleted: result.data.deleted,
              });
            }else {
              // this.errors = [result.message];
              this.toastrService.danger(result.message,"FAILED");
            }
        // this is a place for value changes handling
        // this.userForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {   });
      });
  }


  convertToUser(value: any): User {
    const user: User = value;
    return user;
  }

  save() {
    const user: User = this.convertToUser(this.userForm.value);

    // let observable = new Observable<User>();
    // if (this.mode === UserFormMode.EDIT_SELF) {
    //   this.usersService.updateCurrent(user).subscribe((result: any) => {
    //     this.tokenService.set(new NbAuthOAuth2JWTToken(result, 'email', new Date()));
    //     this.handleSuccessResponse();
    //   },
    //     err => {
    //       this.handleWrongResponse();
    //     });
    // } else {
    //   observable = user.id
    //     ? this.usersService.update(user)
    //     : this.usersService.create(user);
    // }

    // observable
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(() => {
    //     this.handleSuccessResponse();
    //   },
    //     err => {
    //       this.handleWrongResponse();
    //     });
  }

  handleSuccessResponse() {
    this.toasterService.success('', `Item ${this.mode === UserFormMode.ADD ? 'created' : 'updated'}!`);
    this.back();
  }

  handleWrongResponse() {
    this.toasterService.danger('', `This email has already taken!`);
  }

  back() {
    this.router.navigate(['/pages']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
