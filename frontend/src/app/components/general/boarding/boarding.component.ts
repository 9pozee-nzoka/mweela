// src/app/components/general/boarding/boarding.component.ts
import { Component, OnInit } from '@angular/core';
import { BoardingService } from './boarding.service';
import { ButtonComponent } from '../buttons/buttons.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-boarding',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './boarding.component.html',
  styleUrls: ['./boarding.component.css']
})
export class BoardingComponent implements OnInit {
  activeView: 'login' | 'register' | 'logout' | 'forgot' | 'reset' = 'login';
  message = '';

  // Auth forms
  form = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Reset password form (NO token here)
  resetForm = {
    password: '',
    confirmPassword: ''
  };

  // Reset token comes ONLY from URL
  resetToken = '';

  constructor(
    private boardingService: BoardingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Auto-detect reset token from URL
    this.route.params.subscribe(params => {
      if (params['token']) {
        this.resetToken = params['token'];
        this.activeView = 'reset';
        this.message = '';
      }
    });
  }

  setView(view: any) {
    this.activeView = view;
    this.message = '';
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ---------------- LOGIN ----------------
  login() {
    this.boardingService.login({
      email: this.form.email,
      password: this.form.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);

        if (res.user) {
          localStorage.setItem('userId', res.user._id);
          localStorage.setItem('username', res.user.username);
          localStorage.setItem('role', res.user.role || 'customer');
        }

        this.message = 'Login successful';
        this.activeView = 'logout';
        this.resetInputs();

        const role = localStorage.getItem('role');
        if (role === 'admin') {
          window.location.href = 'http://localhost:3000/admin';
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.message = err.error?.error || 'Login failed';
      }
    });
  }

  // ---------------- REGISTER ----------------
  register() {
    if (this.form.password !== this.form.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    this.boardingService.register(this.form).subscribe({
      next: () => {
        this.message = 'Registration successful, please login';
        this.setView('login');
        this.resetInputs();
      },
      error: err => {
        console.error('Register error:', err);
        this.message = err.error?.error || 'Registration failed';
      }
    });
  }

  // ---------------- FORGOT PASSWORD ----------------
  forgotPassword() {
    if (!this.form.email) {
      this.message = 'Please enter your email';
      return;
    }

    this.boardingService.forgotPassword(this.form.email).subscribe({
      next: () => {
        this.message = 'Reset email sent, check your inbox';
      },
      error: err => {
        console.error('Forgot password error:', err);
        this.message = err.error?.error || 'Failed to send reset email';
      }
    });
  }

  // ---------------- RESET PASSWORD ----------------
  resetPassword() {
    if (!this.resetToken) {
      this.message = 'Invalid or missing reset token';
      return;
    }

    if (this.resetForm.password !== this.resetForm.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    this.boardingService
      .resetPassword(this.resetToken, {
        password: this.resetForm.password
      })
      .subscribe({
        next: () => {
          this.message = 'Password reset successful, you can now login';
          this.setView('login');
          this.resetInputs();
        },
        error: err => {
          console.error('Reset password error:', err);
          this.message = err.error?.error || 'Reset failed';
        }
      });
  }

  // ---------------- LOGOUT ----------------
  logout() {
    this.boardingService.logout().subscribe(() => {
      localStorage.clear();
      this.message = 'Logged out';
      this.activeView = 'login';
      this.resetInputs();
      this.router.navigate(['/login']);
    });
  }

  // ---------------- HELPERS ----------------
  private resetInputs() {
    this.form = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    this.resetForm = {
      password: '',
      confirmPassword: ''
    };

    this.resetToken = '';
  }
}
