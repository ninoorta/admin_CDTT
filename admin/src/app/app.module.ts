import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './components/products/products.component';
import { MenuComponent } from './components/menu/menu.component';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { DialogComponent } from './components/dialog/dialog.component';

import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatDialogModule } from '@angular/material/dialog';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ReportComponent } from './components/report/report.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { DialogCategoryComponent } from './components/dialog-category/dialog-category.component';
import { StoresComponent } from './components/stores/stores.component';
import { DialogStoreComponent } from './components/dialog-store/dialog-store.component';
import { OrdersComponent } from './components/orders/orders.component';
import { DialogShowComponent } from './components/dialog-show/dialog-show.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    MenuComponent,
    DialogComponent,
    ConfirmDialogComponent,
    ReportComponent,
    CategoriesComponent,
    DialogCategoryComponent,
    StoresComponent,
    DialogStoreComponent,
    OrdersComponent,
    DialogShowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAz--9MYGqCLLNwNDK-S_xp5NxJL_KwiyU",
      authDomain: "mindx-chat-efd7a.firebaseapp.com",
      databaseURL: "https://mindx-chat-efd7a.firebaseio.com",
      projectId: "mindx-chat-efd7a",
      storageBucket: "mindx-chat-efd7a.appspot.com",
      messagingSenderId: "488630916249",
      appId: "1:488630916249:web:2a017e25bd1abb29b55408",
      measurementId: "G-9P4M4F5VHE"
    }),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
