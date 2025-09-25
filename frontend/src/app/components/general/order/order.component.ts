import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-order',
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})

export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    this.http.get<any[]>(`http://localhost:3000/api/orders/${userId}`)
      .subscribe(data => this.orders = data);
  }
}
