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
  activeView: 'login' | 'register' | 'logout' = 'login';
  message = '';

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  form = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private boardingService: BoardingService,
    private router: Router   // ✅ inject Router properly here
  ) {}

  setView(view: 'login' | 'register' | 'logout') {
    this.activeView = view;
  }

  login() {
  this.boardingService.login({
    email: this.form.email,
    password: this.form.password
  }).subscribe({
    next: (res: any) => {
      localStorage.setItem('token', res.token);

      if (res.user) {
        // case: backend sends user object
        localStorage.setItem('userId', res.user.id);
        localStorage.setItem('username', res.user.username);
      } else {
        // case: backend sends flat values
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('username', res.username);
      }

      this.message = 'Login successful';
      this.activeView = 'logout';
      this.resetForm();

      // ✅ redirect to home
      this.router.navigate(['/home']);
    },
    error: (err) => this.message = err.error.msg || 'Login failed'
  });
}


  register() {
    if (this.form.password !== this.form.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    this.boardingService.register(this.form).subscribe({
      next: () => {
        this.message = 'Registration successful, please login';
        this.setView('login');
        this.resetForm();
      },
      error: (err) => this.message = err.error.msg || 'Registration failed'
    });
  }

  logout() {
    this.boardingService.logout().subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      this.message = 'Logged out';
      this.activeView = 'login';
      this.resetForm();
      this.router.navigate(['/login']); // ✅ redirect back to login
    });
  }

  private resetForm() {
    this.form = { username: '', email: '', password: '', confirmPassword: '' };
  }
}
