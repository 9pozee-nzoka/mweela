import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardingComponent } from "./components/general/boarding/boarding.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,], // 👈 IMPORTANT
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mweela Junior Supplies';
}
