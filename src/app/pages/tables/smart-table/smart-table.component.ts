/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/interfaces/common/smart-table';
import { ProductService } from '../products-service';
import { BaseAllRequestVM } from '../ResponseVMs/baseAll-requestVM';
import { Product, ProductAllResponseVM } from '../ResponseVMs/productall-responseVM';
import { NbToastrService } from '@nebular/theme';
import { BaseResponseVM } from '../../../@core/baseModels/baseresponseVM';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})

export class SmartTableComponent implements OnInit {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true, // Enable confirm create event
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      active: {
        title: 'Active',
        type: 'html',
        editor: {
          type: 'checkbox',
          config: {
            true: 'true',
            false: 'false',
          },
        },
        valuePrepareFunction: (value) => {
          return value ? 'Yes' : 'No';
        },
      },
      archived: {
        title: 'Archived',
        type: 'html',
        editor: {
          type: 'checkbox',
          config: {
            true: 'true',
            false: 'false',
          },
        },
        valuePrepareFunction: (value) => {
          return value ? 'Yes' : 'No';
        },
      },
    },
  };

  source: Product[] = [];

  constructor(private service: SmartTableData,
    private productService: ProductService,
    private toastrService: NbToastrService
  ) {
  }
  ngOnInit(): void {
    this.loadData();
  }


  loadData() {
    const request: BaseAllRequestVM = {
      pageNumber: 0,
      pageSize: 10
    };
    this.productService.getAll(request).subscribe({

      next: (result: ProductAllResponseVM) => {
        if (result.success && result.data) {
          this.source = result.data || [];
        } else {
          // this.errors = [result.message];
          this.toastrService.danger(result.message, "FAILED");
        }
      },
      error: (err) => {
        this.toastrService.danger(err.message, "FAILED");
      }
    });
  }

  onDeleteConfirm(event): void {
    console.log('Delete event triggered');
    if (window.confirm('Are you sure you want to delete?')) {
      this.deleteData(event);
    } else {
      event.confirm.reject();
    }
  }

  onAddConfirm(event): void {
    debugger;
    console.log('Add event triggered');
    this.onUpsertConfirm(event);
  }

  onUpdateConfirm(event): void {
    debugger;
    console.log('Update event triggered');  // Check if this logs
    this.onUpsertConfirm(event);
  }


  onUpsertConfirm(event): void {
    this.productService.upsertProduct(event.newData).subscribe({

      next: (result: BaseResponseVM) => {
        if (result.success) {
          this.ngOnInit()
        } else {
          this.toastrService.success('Product added successfully', 'Success');
          this.toastrService.danger(result.message, "FAILED");
        }
      },
      error: (err) => {
        this.toastrService.danger(err.message, "FAILED");
      }
    });
  }

  deleteData(event: any) {
    debugger
    this.productService.deleteProduct(event.data.id).subscribe({

      next: (result: BaseResponseVM) => {
        if (result.success) {
          this.ngOnInit()
        } else {
          this.toastrService.success('Product deleted successfully', 'Success');
          this.toastrService.danger(result.message, "FAILED");
        }
      },
      error: (err) => {
        this.toastrService.danger(err.message, "FAILED");
      }
    });
  }
}
