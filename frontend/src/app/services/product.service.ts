import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getProductsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${category}`);
  }

  addToCart(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post('http://localhost:5000/api/cart/add', {
      userId,
      productId,
      quantity
    });
  }
}
