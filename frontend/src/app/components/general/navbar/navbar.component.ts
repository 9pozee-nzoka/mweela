import { Component, Injectable, Input, OnInit, HostListener, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

@Injectable({
  providedIn: 'root'
})

export class NavbarComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  isDarkMode = false;
  
  @Input() menuItems = [
    { label: 'Home', route: '/home', icon: '🏠' },
    { label: 'Junior Secondary', route: '/product', icon: '📚' },
    { label: 'Primary', route: '/product', icon: '🎒' },
    { label: 'Products', route: '/product', icon: '🛍️' },
    { label: 'About Us', route: '/home', icon: 'ℹ️' },
    { label: 'Contact', route: '/home', icon: '📞' }
  ];

  constructor(private renderer: Renderer2) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit(): void {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
    this.setTheme(savedTheme);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.setTheme(theme);
    localStorage.setItem('theme', theme);
  }

  private setTheme(theme: string): void {
    if (theme === 'dark') {
      this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
    } else {
      this.renderer.removeAttribute(document.documentElement, 'data-theme');
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}