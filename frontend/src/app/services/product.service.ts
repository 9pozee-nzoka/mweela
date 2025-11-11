import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:3000/api/products';
  private readonly cartUrl = 'http://localhost:3000/api/cart';

  constructor(private http: HttpClient) {}

  /** 🧾 Get all products */
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** 🏷️ Get products by category (case-insensitive) */
  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${category.toLowerCase()}`);
  }

  /** 🛒 Add product to cart */
  addToCart(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.cartUrl}/add`, { userId, productId, quantity });
  }
}
