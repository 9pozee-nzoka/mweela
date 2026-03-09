import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../general/search/search.component';
import { NavbarComponent } from '../../general/navbar/navbar.component';
import { ProductListComponent } from '../../general/products/products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,           // Required for *ngFor, *ngIf
    FormsModule,            // Required for ngModel
    NavbarComponent, 
    SearchBarComponent, 
    ProductListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoading = true;
  email = '';
  currentYear = new Date().getFullYear();
  
  stats = [
    { icon: '📚', value: '500+', label: 'Educational Items' },
    { icon: '🚚', value: '24h', label: 'Fast Delivery' },
    { icon: '⭐', value: '4.9', label: 'Customer Rating' },
    { icon: '🎓', value: '10k+', label: 'Happy Students' }
  ];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
    
    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }

  // Scroll to products section
  scrollToProducts(): void {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // View catalog action
  viewCatalog(): void {
    // Navigate to products or open modal
    console.log('View catalog clicked');
    // this.router.navigate(['/product']);
  }

  // Subscribe to newsletter
  subscribe(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      alert('Please enter a valid email address');
      return;
    }
    console.log('Subscribing:', this.email);
    // Call your newsletter service here
    this.email = ''; // Clear after submission
  }

  // Email validation
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Track by function for stats (performance optimization)
  trackByStat(index: number, stat: any): string {
    return stat.label;
  }

  // Set theme
  private setTheme(theme: string): void {
    if (theme === 'dark') {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
    } else {
      this.renderer.removeAttribute(document.documentElement, 'data-theme');
    }
  }
}