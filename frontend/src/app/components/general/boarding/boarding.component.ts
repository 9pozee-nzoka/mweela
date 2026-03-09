// src/app/components/general/boarding/boarding.component.ts
import { Component, OnInit } from '@angular/core';
import { BoardingService } from './boarding.service';
import { ButtonComponent } from '../buttons/buttons.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-boarding',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './boarding.component.html',
  styleUrls: ['./boarding.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BoardingComponent implements OnInit {
  activeView: 'login' | 'register' | 'logout' | 'forgot' | 'reset' = 'login';
  message = '';
  isError = false;

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
    // Check if user is already logged in
    if (this.isLoggedIn) {
      this.activeView = 'logout';
    }

    // Auto-detect reset token from URL
    this.route.params.subscribe(params => {
      if (params['token']) {
        this.resetToken = params['token'];
        this.activeView = 'reset';
        this.message = '';
        this.isError = false;
      }
    });
  }

  setView(view: 'login' | 'register' | 'logout' | 'forgot' | 'reset') {
    this.activeView = view;
    this.message = '';
    this.isError = false;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'User';
  }

  // ---------------- LOGIN ----------------
  login() {
    this.isError = false;
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
        this.isError = false;
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
        this.isError = true;
        this.message = err.error?.error || 'Login failed';
      }
    });
  }

  // ---------------- REGISTER ----------------
  register() {
    this.isError = false;
    
    if (this.form.password !== this.form.confirmPassword) {
      this.isError = true;
      this.message = 'Passwords do not match';
      return;
    }

    this.boardingService.register(this.form).subscribe({
      next: () => {
        this.message = 'Registration successful, please login';
        this.isError = false;
        this.setView('login');
        this.resetInputs();
      },
      error: err => {
        console.error('Register error:', err);
        this.isError = true;
        this.message = err.error?.error || 'Registration failed';
      }
    });
  }

  // ---------------- FORGOT PASSWORD ----------------
  forgotPassword() {
    this.isError = false;
    
    if (!this.form.email) {
      this.isError = true;
      this.message = 'Please enter your email';
      return;
    }

    this.boardingService.forgotPassword(this.form.email).subscribe({
      next: () => {
        this.message = 'Reset email sent, check your inbox';
        this.isError = false;
      },
      error: err => {
        console.error('Forgot password error:', err);
        this.isError = true;
        this.message = err.error?.error || 'Failed to send reset email';
      }
    });
  }

  // ---------------- RESET PASSWORD ----------------
  resetPassword() {
    this.isError = false;

    if (!this.resetToken) {
      this.isError = true;
      this.message = 'Invalid or missing reset token';
      return;
    }

    if (this.resetForm.password !== this.resetForm.confirmPassword) {
      this.isError = true;
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
          this.isError = false;
          this.setView('login');
          this.resetInputs();
        },
        error: err => {
          console.error('Reset password error:', err);
          this.isError = true;
          this.message = err.error?.error || 'Reset failed';
        }
      });
  }

  // ---------------- LOGOUT ----------------
  logout() {
    this.boardingService.logout().subscribe(() => {
      localStorage.clear();
      this.message = 'Logged out successfully';
      this.isError = false;
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