import { Routes } from '@angular/router';
import { BoardingComponent } from './components/general/boarding/boarding.component';
import { HomeComponent } from './components/general/home/home.component';
import { ProfileComponent } from './components/general/profile/profile.component';
import { OrdersComponent } from './components/general/order/order.component';
import { CartComponent } from './components/general/cart/cart.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: BoardingComponent, canActivate: [LoginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'orders/:id', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'cart/:id', component: CartComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
