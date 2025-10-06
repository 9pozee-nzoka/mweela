// src/app/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductListComponent implements OnInit {
  productsByCategory: { [key: string]: any[] } = {};
  isLoading = true;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // ✅ Group products by category
        this.productsByCategory = products.reduce((groups, product) => {
          const category = product.category || 'general';
          if (!groups[category]) groups[category] = [];
          groups[category].push(product);
          return groups;
        }, {} as { [key: string]: any[] });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.errorMessage = 'Failed to load products.';
        this.isLoading = false;
      },
    });
  }

  addToCart(productId: string) {
    console.log('Add to cart:', productId);
    // 🔹 You can integrate this with your cart service here.
  }
}
