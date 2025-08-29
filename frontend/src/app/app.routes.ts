import { Routes } from '@angular/router';
import { BoardingComponent } from './components/general/boarding/boarding.component';

export const routes: Routes = [
  { path: '', redirectTo: 'boarding', pathMatch: 'full' },
  { path: 'boarding', component: BoardingComponent }
];
