import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  carts: any[] = [];  // store all carts
  userId: string | null = null;
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (!this.userId) {
      this.error = "User ID not found in URL";
      this.loading = false;
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/users/${this.userId}/carts`)
      .subscribe({
        next: data => {
          this.carts = data; // store all carts
          this.loading = false;
        },
        error: err => {
          this.error = err.message || 'Failed to fetch carts';
          this.loading = false;
        }
      });
  }
}
