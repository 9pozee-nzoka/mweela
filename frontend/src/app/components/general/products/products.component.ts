import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports:[CommonModule],
  standalone:true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductListComponent implements OnInit {
  primaryProducts: any[] = [];
  juniorProducts: any[] = [];
  userId = "64abc1234"; // replace with logged-in user id (auth later)

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProductsByCategory("Primary").subscribe(res => {
      this.primaryProducts = res;
    });

    this.productService.getProductsByCategory("Junior Secondary").subscribe(res => {
      this.juniorProducts = res;
    });
  }

  addToCart(productId: string) {
    this.productService.addToCart(this.userId, productId, 1).subscribe(res => {
      alert("Product added to cart!");
    });
  }
}
