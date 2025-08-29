import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MatButtonModule} from '@angular/material/button'
import { RouterLink } from '@angular/router';
import { Router } from 'express';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, RouterLink, NgClass, MatIconModule],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css'
})
export class ButtonComponent {
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left'
  @Input() buttonType: 'button' | 'submit' = 'button';
  @Input() buttonText: string = '';
  @Input() buttonLink: string = '';
  @Input() buttonStyleClass: string = '';
}
