import { Routes } from '@angular/router';
import { BoardingComponent } from './components/general/boarding/boarding.component';
import { HomeComponent } from './components/general/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'boarding', pathMatch: 'full' },
  { path: 'boarding', component: BoardingComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
