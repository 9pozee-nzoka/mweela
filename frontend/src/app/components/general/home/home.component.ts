import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SearchBarComponent } from "../search/search.component";
import { CommonModule } from '@angular/common';
import { DataCardComponent } from '../datacard/datacard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, SearchBarComponent, CommonModule, DataCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
