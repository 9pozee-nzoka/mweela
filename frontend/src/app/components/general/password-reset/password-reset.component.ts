import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PasswordResetComponent {
  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // get token from URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  resetPassword() {
    if (this.password !== this.confirmPassword) {
      this.message = '❌ Passwords do not match';
      return;
    }

    this.http.post(`http://localhost:3000/api/auth/reset-password/${this.token}`, {
  password: this.password,
  confirmPassword: this.confirmPassword
}).subscribe({
  next: (res: any) => {
    this.message = '✅ Password reset successful. Redirecting to login...';
    setTimeout(() => this.router.navigate(['/login']), 2000);
  },
  error: (err) => {
    console.error(err);
    this.message = err.error?.msg || err.error?.error || '❌ Reset failed';
  }
});
  }
}
