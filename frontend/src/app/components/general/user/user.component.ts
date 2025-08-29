import { Component, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @Input()isLoggedIn = true;
  @Input()username = 'paul';

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.isLoggedIn = false;
    this.username = 'Guest';
    // Clear tokens/session storage if needed
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
  goToCart() {
  this.router.navigate(['/cart']);
}
}
