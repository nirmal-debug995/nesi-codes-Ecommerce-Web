import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Product } from "../common/product";
import { map, Observable } from "rxjs";
import { ProductCategory } from "../common/product-category";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // ✅ Use environment-based API URL (PRODUCTION READY)
  private baseUrl = `${environment.apiUrl}/products`;
  private categoryUrl = `${environment.apiUrl}/product-category`;

  constructor(private httpClient: HttpClient) { }

  // Get products by category
  getProductList(theCategoryId: number): Observable<Product[]> {

    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  // Pagination support
  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<any> {

    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // Get categories
  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(
        map(response => response._embedded.productCategory)
      );
  }

  // Search products
  searchProducts(theKeyword: string): Observable<Product[]> {

    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  // Search with pagination
  searchProductsPaginate(
    thePage: number,
    thePageSize: number,
    theKeyword: string
  ): Observable<any> {

    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  // Core reusable method
  private getProducts(searchUrl: string): Observable<Product[]> {

    return this.httpClient.get<GetResponseProducts>(searchUrl)
      .pipe(
        map(response => response._embedded.products)
      );
  }

  // Get single product
  getProduct(theProductId: number): Observable<Product> {

    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}

// ================= RESPONSE INTERFACES =================

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[]
  }
}
