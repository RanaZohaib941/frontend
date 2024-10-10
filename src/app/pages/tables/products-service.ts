// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductAllResponseVM } from './ResponseVMs/productall-responseVM';
import { BaseAllRequestVM } from './ResponseVMs/baseAll-requestVM';
import { BaseResponseVM } from '../../@core/baseModels/baseresponseVM';
import { ProductUpsertRequestVM } from './ResponseVMs/product-upsert-requestVM';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}Product/`; // Use the environment variable


    constructor(private http: HttpClient) { }



    getAll(request: BaseAllRequestVM): Observable<ProductAllResponseVM> {
        return this.http.post<ProductAllResponseVM>(`${this.apiUrl}get-all`, request);
    }

    upsertProduct(request: ProductUpsertRequestVM): Observable<BaseResponseVM> {
        return this.http.post<BaseResponseVM>(`${this.apiUrl}upsert`, request);
    }
    

    deleteProduct(productId: any): Observable<BaseResponseVM> {
        const params = new HttpParams().set('productId', productId);
        return this.http.get<BaseResponseVM>(`${this.apiUrl}delete`, { params });
    }
}
