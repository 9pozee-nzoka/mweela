import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-redirect',
  template: `<p>Redirecting to Admin Panel...</p>`
})
export class AdminRedirectComponent implements OnInit {
  ngOnInit() {
    // ✅ Redirect to backend AdminJS
    window.location.href = 'http://localhost:3000/admin';
  }
}
