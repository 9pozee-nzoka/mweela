import { Component } from '@angular/core';
import { BoardingService } from './boarding.service';
import { ButtonComponent } from '../buttons/buttons.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boarding',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './boarding.component.html',
  styleUrls: ['./boarding.component.css']
})
export class BoardingComponent {
  activeView: 'login' | 'register' | 'logout' | 'forgot' | 'reset' = 'login';
  message = '';

  form = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  resetForm = {
    token: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private boardingService: BoardingService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  setView(view: 'login' | 'register' | 'logout' | 'forgot' | 'reset') {
    this.activeView = view;
  }

  // 🔹 LOGIN
  login() {
    this.boardingService.login({
      email: this.form.email,
      password: this.form.password
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);

        if (res.user) {
          localStorage.setItem('userId', res.user._id);  // ✅ FIXED
          localStorage.setItem('username', res.user.username || res.user.name);
          localStorage.setItem('role', res.user.role);
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
      error: (err) => this.message = err.error.msg || 'Login failed'
    });
  }

  // 🔹 REGISTER
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
      error: (err) => this.message = err.error.msg || 'Registration failed'
    });
  }

  // 🔹 FORGOT PASSWORD
  forgotPassword() {
    if (!this.form.email) {
      this.message = 'Please enter your email';
      return;
    }

    this.boardingService.forgotPassword(this.form.email).subscribe({
      next: () => this.message = 'Reset email sent, check your inbox',
      error: (err) => this.message = err.error.msg || 'Failed to send reset email'
    });
  }

  // 🔹 RESET PASSWORD
  resetPassword() {
    if (this.resetForm.password !== this.resetForm.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    this.boardingService.resetPassword(this.resetForm.token, {
      password: this.resetForm.password,
      confirmPassword: this.resetForm.confirmPassword
    }).subscribe({
      next: () => {
        this.message = 'Password reset successful, you can now login';
        this.setView('login');
        this.resetInputs();
      },
      error: (err) => this.message = err.error.msg || 'Reset failed'
    });
  }

  // 🔹 LOGOUT
  logout() {
    this.boardingService.logout().subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      this.message = 'Logged out';
      this.activeView = 'login';
      this.resetInputs();
      this.router.navigate(['/login']);
    });
  }

  private resetInputs() {
    this.form = { username: '', email: '', password: '', confirmPassword: '' };
    this.resetForm = { token: '', password: '', confirmPassword: '' };
  }
}
