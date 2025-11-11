import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-data-card',
  standalone: true, // 👈 must declare standalone if using `imports`
  imports: [ MatIconModule],
  templateUrl: './datacard.component.html',
  styleUrls: ['./datacard.component.css'] // 👈 should be plural: styleUrls
})
export class DataCardComponent {
  @Input() item: string = '';
  @Input() name: string = '';
  @Input() image: string = '';
  @Input() price: string = '';
  @Input() description: string = '';
}
  