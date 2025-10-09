// src/app/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductListComponent implements OnInit {
  primaryProducts: any[] = [];
  juniorProducts: any[] = [];
  userId = '64abc1234'; // TODO: replace later with real logged-in user ID

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProductsByCategory('Primary').subscribe({
      next: (res) => (this.primaryProducts = res),
      error: (err) => console.error('Error loading primary products:', err)
    });

    this.productService.getProductsByCategory('Junior').subscribe({
      next: (res) => (this.juniorProducts = res),
      error: (err) => console.error('Error loading junior products:', err)
    });
  }

  addToCart(productId: string): void {
    this.productService.addToCart(this.userId, productId, 1).subscribe({
      next: () => alert('✅ Product added to cart!'),
      error: (err) => console.error('Error adding to cart:', err)
    });
  }
}
