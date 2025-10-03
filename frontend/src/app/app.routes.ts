import { Routes } from '@angular/router';
import { BoardingComponent } from './components/general/boarding/boarding.component';
import { HomeComponent } from './components/general/home/home.component';
import { ProfileComponent } from './components/general/profile/profile.component';
import { OrdersComponent } from './components/general/order/order.component';
import { CartComponent } from './components/general/cart/cart.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';
import { AdminGuard } from './admin.guard';
import { AdminRedirectComponent } from './components/admin-redirect/admin-redirect.component';
import { ProductListComponent } from './components/general/products/products.component';
import { PasswordResetComponent } from './components/general/password-reset/password-reset.component'; // ✅ import

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: BoardingComponent, canActivate: [LoginGuard] },
  { path: 'admin', component: AdminRedirectComponent, canActivate: [AdminGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'orders/:id', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'cart/:id', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductListComponent, canActivate: [AuthGuard] },

  // ✅ Reset password route with token parameter
  { path: 'reset-password/:token', component: PasswordResetComponent },

  { path: '**', redirectTo: 'login' }
];
