import { Routes } from '@angular/router';

import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { LayoutComponent } from './layout/layout';
import { CartPageComponent } from './pages/cart/cart';
import { CheckoutComponent } from './pages/checkout/checkout';
import { OrderSuccessComponent } from './pages/checkout/order-success';
import { CategoryViewComponent } from './pages/category/category-view';
import { HomeComponent } from './pages/home/home';
import { ProductDetailsComponent } from './pages/product/product-details';
import { ProfileComponent } from './profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'shop', component: CategoryViewComponent },
      { path: 'category/:slug', component: CategoryViewComponent },
      { path: 'product/:id', component: ProductDetailsComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'order/:id', component: OrderSuccessComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
    ],
  },
];
