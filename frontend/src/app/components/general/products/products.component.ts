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

  isLoading = true;
  errorMessage = '';

  userId = '64abc1234'; // TODO: replace with real user ID

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;

    const primary$ = this.productService.getProductsByCategory('primary');
    const junior$ = this.productService.getProductsByCategory('junior');

    primary$.subscribe({
      next: (res) => (this.primaryProducts = res),
      error: (err) => {
        console.error('Primary products error:', err);
        this.errorMessage = 'Failed to load Primary products.';
      },
    });

    junior$.subscribe({
      next: (res) => (this.juniorProducts = res),
      error: (err) => {
        console.error('Junior products error:', err);
        this.errorMessage = 'Failed to load Junior products.';
      },
      complete: () => (this.isLoading = false),
    });
  }

  addToCart(productId: string): void {
    this.productService.addToCart(this.userId, productId, 1).subscribe({
      next: () => alert('✅ Product added to cart!'),
      error: (err) => console.error('Error adding to cart:', err),
    });
  }
}
