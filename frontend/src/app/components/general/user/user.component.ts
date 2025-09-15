import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isLoggedIn = false;
  username = 'Guest';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('username');

    if (token && userId) {
      this.isLoggedIn = true;
      this.username = storedName || 'Loading...';

      // ✅ Fix: call /api/auth/${userId}/profile
      this.http.get<any>(`http://localhost:3000/api/users/${userId}/profile`)
        .subscribe({
          next: (res) => {
            this.username = res.username;
            localStorage.setItem('username', res.username);
          },
          error: () => {
            this.username = 'Guest';
            this.isLoggedIn = false;
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            this.router.navigate(['/login']);
          }
        });
    }
  }

  goToLogin() {
    if (this.isLoggedIn) {
      // ✅ already logged in → redirect to home
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.username = 'Guest';
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  goToProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate([`/profile/${userId}`]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToCart() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate([`/cart/${userId}`]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
