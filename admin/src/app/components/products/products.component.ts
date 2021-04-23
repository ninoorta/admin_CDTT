import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';

import { NotificationsService } from '../../services/notifications.service';


import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  searchValue = "";

  isLoading = true;
  productData = [];
  categories = [];
  stores = [];

  displayedColumns: string[] = ['index', 'image', 'name', 'code', 'category-name', 'price', 'availability', 'storeName', 'actions'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private db: AngularFirestore,
    private dialog: MatDialog,
    public notiService: NotificationsService,
    private router: Router) { }

  ngOnInit(): void {

    this.db.collection("Categories").get().subscribe(data => {
      // console.log("get data categories", data)

      this.db.collection("Categories").valueChanges().subscribe(list => {

        for (let i = 0; i < list.length; i++) {
          list[i]["id"] = data.docs[i].id;
        }

        // console.log("full data categories", list)
        this.categories = list;

        this.db.collection("Stores").get().subscribe(storeIDs => {
          this.db.collection("Stores").valueChanges().subscribe(storeData => {

            for (let i = 0; i < storeData.length; i++) {
              storeData[i]["id"] = storeIDs.docs[i].id;
            }

            console.log("full data stores", storeData)
            this.stores = storeData;

            this.getProducts();
          })
        })

      })
    })

  }


  onDelete(chosenID: string) {
    console.log('delete', chosenID);
    this.dialog.open(ConfirmDialogComponent, { autoFocus: false }).afterClosed()
      .subscribe(res => {
        console.log(res);
        if (res) {
          this.db.collection("Products").doc(chosenID).delete();
          this.notiService.success("Xóa thành công");
          this.getProducts();
        }
      })
  }

  getProducts() {

    this.db.collection("Products").valueChanges().subscribe(data => {
      this.productData = data;
    })

    this.db.collection("Products").get().subscribe(items => {
      // console.log(items);

      // Append id for products
      for (let i = 0; i < items.docs.length; i++) {
        this.productData[i] = {
          productID: items.docs[i].id,
          ...this.productData[i]
        }

        this.db.collection("Products", ref => ref.where("code", "==", this.productData[i].code)).doc(items.docs[i].id).update({ productID: items.docs[i].id })
      }
      console.log("new products data with id", this.productData)

      // Append name for category
      console.log("full data categories", this.categories)

      for (let i = 0; i < this.productData.length; i++) {
        for (let j = 0; j < this.categories.length; j++) {
          if (this.productData[i].categoryID == this.categories[j].id) {
            this.productData[i].categoryName = this.categories[j].name
          }
        }
      }

      // append name for store
      for (let i = 0; i < this.productData.length; i++) {
        for (let j = 0; j < this.stores.length; j++) {
          if (this.productData[i].storeID == this.stores[j].id) {
            this.productData[i].storeName = this.stores[j].ten
          }
        }
      }

      console.log("full form product data", this.productData)

      // sort products with its name
      this.productData.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))


      this.isLoading = false;
      this.dataSource = new MatTableDataSource(this.productData)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // console.log("final", this.dataSource)

    })



  }

  onEdit(id: string) {
    console.log('edit', id)
    this.dialog.open(DialogComponent, {
      data: id,
      autoFocus: false
    }).afterClosed().subscribe(res => {
      console.log("edit res", res)

      if (res) {
        this.notiService.success("Sửa thành công");
        this.getProducts();
      }

    })
  }

  openAddDialog() {
    console.log("click open dialog")
    this.dialog.open(DialogComponent, {
      data: "add",
      autoFocus: false
    }).afterClosed().subscribe(res => {
      console.log("add res", res)
      if (res) {
        this.notiService.success("Thêm sản phẩm thành công");
        this.getProducts();
      }
    })

  }


  onSearchClear() {
    this.searchValue = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
  }
}
