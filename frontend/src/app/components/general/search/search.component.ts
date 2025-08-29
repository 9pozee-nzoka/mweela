import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserComponent } from '../user/user.component';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, UserComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchBarComponent {

}
