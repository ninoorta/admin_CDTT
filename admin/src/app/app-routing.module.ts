import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './components/products/products.component';
import { ReportComponent } from './components/report/report.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { StoresComponent } from './components/stores/stores.component';

const routes: Routes = [
  {
    path: "products",
    component: ProductsComponent
  },
  {
    path: "categories",
    component: CategoriesComponent
  },
  {
    path: "stores",
    component: StoresComponent
  },
  {
    path: "report",
    component: ReportComponent

  },
  {
    path: '**', redirectTo: "/products", pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
