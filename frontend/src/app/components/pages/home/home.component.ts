import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../general/search/search.component';
import { DataCardComponent } from '../../general/datacard/datacard.component';
import { NavbarComponent } from '../../general/navbar/navbar.component';
import { ProductListComponent } from '../../general/products/products.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, SearchBarComponent, CommonModule, ProductListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  products: any[] = []; 

}
