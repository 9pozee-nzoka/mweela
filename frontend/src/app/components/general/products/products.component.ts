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
  cartLoading: string | null = null;

  isLoading = true;
  errorMessage = '';

  // Display limits for each category
  primaryDisplayLimit = 5;
  juniorDisplayLimit = 5;
  
  // Available limit options
  limitOptions = [5, 10, 15];

  userId = '64abc1234';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const primary$ = this.productService.getProductsByCategory('primary');
    const junior$ = this.productService.getProductsByCategory('junior');

    primary$.subscribe({
      next: (res) => (this.primaryProducts = res),
      error: (err) => {
        console.error('Primary products error:', err);
        this.errorMessage = 'Failed to load Primary products.';
        this.isLoading = false;
      },
    });

    junior$.subscribe({
      next: (res) => {
        this.juniorProducts = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Junior products error:', err);
        this.errorMessage = 'Failed to load Junior products.';
        this.isLoading = false;
      },
    });
  }

  // Get sliced array based on limit
  getLimitedProducts(products: any[], limit: number): any[] {
    return products.slice(0, limit);
  }

  // Update display limit
  updateLimit(category: 'primary' | 'junior', limit: number): void {
    if (category === 'primary') {
      this.primaryDisplayLimit = limit;
    } else {
      this.juniorDisplayLimit = limit;
    }
  }

  addToCart(productId: string): void {
    this.cartLoading = productId;
    
    this.productService.addToCart(this.userId, productId, 1).subscribe({
      next: () => {
        this.cartLoading = null;
        this.showNotification('Product added to cart!');
      },
      error: (err) => {
        this.cartLoading = null;
        console.error('Error adding to cart:', err);
      },
    });
  }

  private showNotification(message: string): void {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    }, 100);
  }
}